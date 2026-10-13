import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCropModelInputs,
  MODEL_METHOD,
  mapCropPredictions,
  recommendCrops
} from './recommendation.js';

const labels = [
  'apple',
  'banana',
  'blackgram',
  'chickpea',
  'coconut',
  'coffee',
  'cotton',
  'grapes',
  'jute',
  'kidneybeans',
  'lentil',
  'maize',
  'mango',
  'mothbeans',
  'mungbean',
  'muskmelon',
  'orange',
  'papaya',
  'pigeonpeas',
  'pomegranate',
  'rice',
  'watermelon'
];
const probabilityTotal = labels.length * (labels.length + 1) / 2;

function makeResponse(input = { temperature: 25, humidity: 65, ph: 6, rainfall: 100 }) {
  const featureNames = ['temperature', 'humidity', 'ph', 'rainfall'];
  return {
    model: 'local-logistic-crop-recommendation',
    algorithm: 'scikit-learn StandardScaler + multinomial LogisticRegression',
    modelVersion: '4',
    trainingDataset: 'https://figshare.com/articles/dataset/Crop_Recommendation_dataset/26308696',
    trainingRows: 2200,
    featureNames,
    classLabels: labels,
    scoreDescription: 'Uncalibrated model probabilities rank the crop classes.',
    input,
    predictions: labels.map((label, index) => ({
      label,
      rank: index + 1,
      modelScore: (labels.length - index) / probabilityTotal,
      matchingFeatures: ['temperature', 'humidity', 'ph', 'rainfall'],
      explanation: `${label} model ranking.`
    })),
    primaryPrediction: { label: labels[0] }
  };
}

test('maps the complete 22-class model output to five distinct top-ranked crops', () => {
  const recommendations = mapCropPredictions(makeResponse());

  assert.deepEqual(recommendations.map(crop => [crop.id, crop.rank]), [
    ['apple', 1],
    ['banana', 2],
    ['blackgram', 3],
    ['chickpea', 4],
    ['coconut', 5]
  ]);
  assert.equal(recommendations.length, 5);
  assert.equal(recommendations[0].modelScore, 22 / probabilityTotal);
  assert.equal(recommendations[0].comparisonStatus, 'model-ranked');
  assert.match(recommendations[0].scoreMethod, /uncalibrated model probabilities/);
  assert.match(MODEL_METHOD, /Logistic Regression/);
});

test('rejects incomplete classes, unknown labels, duplicates and malformed rankings', () => {
  const valid = makeResponse();
  const malformed = [
    { ...valid, predictions: valid.predictions.slice(0, 3) },
    { ...valid, classLabels: valid.classLabels.slice(0, 5) },
    {
      ...valid,
      predictions: valid.predictions.map((prediction, index) =>
        index === 0 ? { ...prediction, label: 'tomato' } : prediction
      )
    },
    {
      ...valid,
      predictions: valid.predictions.map((prediction, index) =>
        index === 1 ? { ...prediction, label: 'apple' } : prediction
      )
    },
    {
      ...valid,
      predictions: valid.predictions.map((prediction, index) =>
        index === 1 ? { ...prediction, rank: 3 } : prediction
      )
    },
    {
      ...valid,
      predictions: valid.predictions.map((prediction, index) =>
        index === 1 ? { ...prediction, modelScore: 1.2 } : prediction
      )
    },
    {
      ...valid,
      predictions: valid.predictions.map((prediction, index) =>
        index === 1 ? { ...prediction, modelScore: 0.5 } : prediction
      )
    },
    { ...valid, primaryPrediction: { label: 'rice' } }
  ];

  for (const result of malformed) {
    assert.throws(() => mapCropPredictions(result), {
      code: 'INVALID_MODEL_RESPONSE'
    });
  }
});

test('uses CROP_ML_URL, posts model features, and returns the model top five', async () => {
  const previousUrl = process.env.CROP_ML_URL;
  const previousFetch = globalThis.fetch;
  let request;
  process.env.CROP_ML_URL = 'http://127.0.0.1:8001/';
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      json: async () => makeResponse(JSON.parse(options.body))
    };
  };
  try {
    const input = { temperature: 25, humidity: 65, ph: 6, rainfall: 100 };
    const result = await recommendCrops(input);
    assert.equal(request.url, 'http://127.0.0.1:8001/predict');
    assert.deepEqual(JSON.parse(request.options.body), input);
    assert.deepEqual(result.map(crop => crop.name), [
      'Apple',
      'Banana',
      'Black gram',
      'Chickpea',
      'Coconut'
    ]);
    assert.equal(new Set(result.map(crop => crop.id)).size, 5);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.CROP_ML_URL;
    else process.env.CROP_ML_URL = previousUrl;
  }
});

test('does not fabricate recommendations when the local crop service is unavailable', async () => {
  const previousUrl = process.env.CROP_ML_URL;
  const previousFetch = globalThis.fetch;
  process.env.CROP_ML_URL = 'http://127.0.0.1:8001';
  globalThis.fetch = async () => { throw new Error('connection refused'); };
  try {
    await assert.rejects(
      recommendCrops({ temperature: 25, humidity: 65, ph: 6, rainfall: 100 }),
      { code: 'MODEL_UNAVAILABLE' }
    );
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.CROP_ML_URL;
    else process.env.CROP_ML_URL = previousUrl;
  }
});

test('passes only the four supported model measurements without defaults', () => {
  assert.deepEqual(buildCropModelInputs({
    temperature: '25',
    humidity: '65',
    soilPH: '6',
    rainfall: '100'
  }), {
    temperature: 25,
    humidity: 65,
    ph: 6,
    rainfall: 100
  });
});

test('rejects missing, non-finite, and physically invalid measurements', () => {
  for (const input of [
    {},
    { temperature: '1', humidity: '', soilPH: '1', rainfall: '1' },
    { temperature: 'NaN', humidity: '1', soilPH: '1', rainfall: '1' },
    { temperature: '-1', humidity: '101', soilPH: '1', rainfall: '1' }
  ]) {
    assert.throws(() => buildCropModelInputs(input), { code: 'INVALID_INPUT' });
  }
});
