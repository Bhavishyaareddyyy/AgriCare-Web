
import { crops } from '../data/crops.js';

export const CROP_MODEL_NAME = 'local-logistic-crop-recommendation';

export const MODEL_METHOD =
  'Local scikit-learn standardized multinomial Logistic Regression model trained on the documented ICFA Crop Recommendation dataset. Scores are uncalibrated model probabilities ranking the supported crop classes, not probabilities of crop suitability or farm success.';

const inferenceBase = () =>
  (process.env.CROP_ML_URL ||
    process.env.INFERENCE_URL ||
    'http://127.0.0.1:8001').replace(/\/+$/, '');

const cropByLabel = {
  apple: 'apple',
  banana: 'banana',
  blackgram: 'blackgram',
  chickpea: 'chickpea',
  coconut: 'coconut',
  coffee: 'coffee',
  cotton: 'cotton',
  grapes: 'grapes',
  jute: 'jute',
  kidneybeans: 'kidneybeans',
  lentil: 'lentil',
  maize: 'maize',
  mango: 'mango',
  mothbeans: 'mothbeans',
  mungbean: 'green-gram',
  muskmelon: 'muskmelon',
  orange: 'orange',
  papaya: 'papaya',
  pigeonpeas: 'pigeonpeas',
  pomegranate: 'pomegranate',
  rice: 'rice',
  watermelon: 'watermelon'
};

const supportedModelLabels = Object.keys(cropByLabel).sort();
const cropById = new Map(crops.map(crop => [crop.id, crop]));

export class CropInferenceError extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function buildCropModelInputs(body) {
  const fields = {
    temperature: { name: 'temperature', min: 0, max: 55 },
    humidity: { name: 'humidity', min: 0, max: 100 },
    ph: { name: 'soilPH', min: 0, max: 14 },
    rainfall: { name: 'rainfall', min: 0, max: 10000 }
  };

  const values = {};
  const invalidMeasurements = [];

  for (const [feature, { name, min, max }] of Object.entries(fields)) {
    const rawValue = body?.[name];
    const value =
      (typeof rawValue === 'string' && rawValue.trim() === '') ||
      typeof rawValue === 'boolean' ||
      rawValue == null
        ? NaN
        : Number(rawValue);

    if (!Number.isFinite(value) || value < min || value > max) {
      invalidMeasurements.push(name);
    } else {
      values[feature] = value;
    }
  }

  if (invalidMeasurements.length) {
    throw new CropInferenceError(
      'INVALID_INPUT',
      'Provide all four measured crop-model values as finite numbers. No missing value is filled in automatically.',
      { invalidMeasurements }
    );
  }

  return values;
}

export function mapCropPredictions(result) {
  if (
    !result ||
    result.model !== CROP_MODEL_NAME ||
    result.algorithm !==
      'scikit-learn StandardScaler + multinomial LogisticRegression' ||
    !Array.isArray(result.featureNames) ||
    result.featureNames.join(',') !==
      'temperature,humidity,ph,rainfall' ||
    typeof result.trainingDataset !== 'string' ||
    typeof result.modelVersion !== 'string' ||
    !Array.isArray(result.classLabels) ||
    result.classLabels.length !== supportedModelLabels.length ||
    result.classLabels.some((label, index) => label !== supportedModelLabels[index]) ||
    !Array.isArray(result.predictions) ||
    result.predictions.length !== supportedModelLabels.length ||
    result.primaryPrediction?.label !== result.predictions[0]?.label ||
    typeof result.scoreDescription !== 'string'
  ) {
    throw new CropInferenceError(
      'INVALID_MODEL_RESPONSE',
      'The local crop model returned an invalid response.'
    );
  }

  const seen = new Set();

  const mappedPredictions = result.predictions.map((prediction, index) => {
    const cropId = cropByLabel[prediction?.label];
    const crop = cropById.get(cropId);

    if (
      !crop ||
      seen.has(cropId) ||
      prediction.rank !== index + 1 ||
      !Number.isFinite(prediction.modelScore) ||
      prediction.modelScore < 0 ||
      prediction.modelScore > 1 ||
      (index > 0 &&
        prediction.modelScore > result.predictions[index - 1].modelScore) ||
      !Array.isArray(prediction.matchingFeatures) ||
      prediction.matchingFeatures.some(
        name => !result.featureNames.includes(name)
      ) ||
      typeof prediction.explanation !== 'string'
    ) {
      throw new CropInferenceError(
        'INVALID_MODEL_RESPONSE',
        `The local crop model returned an invalid prediction at rank ${index + 1}.`
      );
    }

    seen.add(cropId);

    return {
      ...crop,
      rank: prediction.rank,
      modelScore: prediction.modelScore,
      matchingFeatures: prediction.matchingFeatures,
      explanation: prediction.explanation,
      suitabilityCategory: `AI model rank ${prediction.rank} of ${result.predictions.length}`,
      comparisonStatus: 'model-ranked',
      model: result.model,
      modelVersion: result.modelVersion,
      trainingDataset: result.trainingDataset,
      heldOutAccuracy: result.heldOutAccuracy,
      evaluation: result.evaluation,
      featureNames: result.featureNames,
      scoreDescription: result.scoreDescription,
      featureImportances: result.featureImportances,
      scoreMethod: MODEL_METHOD
    };
  });

  const probabilityTotal = result.predictions.reduce(
    (total, prediction) => total + prediction.modelScore,
    0
  );
  if (Math.abs(probabilityTotal - 1) > 1e-6) {
    throw new CropInferenceError(
      'INVALID_MODEL_RESPONSE',
      'The local crop model returned invalid prediction probabilities.'
    );
  }

  return mappedPredictions.slice(0, 5);
}

export async function recommendCrops(modelInputs) {
  let response;

  try {
    response = await fetch(`${inferenceBase()}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modelInputs),
      signal: AbortSignal.timeout(25000)
    });
  } catch {
    throw new CropInferenceError(
      'MODEL_UNAVAILABLE',
      'The local crop model is unavailable.'
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new CropInferenceError(
      'INVALID_MODEL_RESPONSE',
      'The local crop model returned an invalid response.'
    );
  }

  if (!response.ok) {
    const error = result?.error;

    if (response.status === 422 && error?.code === 'UNSUPPORTED_INPUT') {
      throw new CropInferenceError(
        error.code,
        error.message || 'The model cannot assess these measurements.',
        error.details
      );
    }

    if (response.status === 400 && error?.code === 'INVALID_INPUT') {
      throw new CropInferenceError(
        error.code,
        error.message || 'The local crop model rejected invalid input.',
        error.details
      );
    }

    if (response.status >= 500) {
      throw new CropInferenceError(
        'MODEL_UNAVAILABLE',
        'The local crop model could not complete inference.'
      );
    }

    throw new CropInferenceError(
      'INVALID_MODEL_RESPONSE',
      'The local crop model rejected the request.'
    );
  }

  if (
    !result.input ||
    Object.entries(modelInputs).some(
      ([name, value]) => result.input[name] !== value
    )
  ) {
    throw new CropInferenceError(
      'INVALID_MODEL_RESPONSE',
      'The local crop model did not return the submitted measurements.'
    );
  }

  return mapCropPredictions(result);
}
