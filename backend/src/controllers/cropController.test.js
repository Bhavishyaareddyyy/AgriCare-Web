import test from 'node:test';
import assert from 'node:assert/strict';
import { recommend } from './cropController.js';
import CropRecommendation from '../models/CropRecommendation.js';

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
const input = { temperature: 25, humidity: 65, ph: 6.5, rainfall: 100 };

function makeInferenceResponse(predictions = labels.map((label, index) => ({
  label,
  rank: index + 1,
  modelScore: (labels.length - index) / probabilityTotal,
  matchingFeatures: ['temperature', 'humidity', 'ph', 'rainfall'],
  explanation: `${label} model prediction.`
}))) {
  return {
    model: 'local-logistic-crop-recommendation',
    algorithm: 'scikit-learn StandardScaler + multinomial LogisticRegression',
    modelVersion: '4',
    trainingDataset: 'https://figshare.com/articles/dataset/Crop_Recommendation_dataset/26308696',
    trainingRows: 2200,
    featureNames: ['temperature', 'humidity', 'ph', 'rainfall'],
    classLabels: labels,
    scoreDescription: 'Uncalibrated model probabilities rank the crop classes.',
    input,
    predictions,
    primaryPrediction: { label: labels[0] }
  };
}

function makeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

async function withInferenceResponse(inferenceResponse, action) {
  const previousUrl = process.env.CROP_ML_URL;
  const previousFetch = globalThis.fetch;
  const previousCreate = CropRecommendation.create;
  let savedDocument;
  process.env.CROP_ML_URL = 'http://127.0.0.1:8001';
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/predict')) {
      assert.deepEqual(JSON.parse(options.body), input);
      return { ok: true, json: async () => inferenceResponse };
    }
    throw new Error('Weather is intentionally unavailable in this test.');
  };
  CropRecommendation.create = async document => {
    savedDocument = document;
    return { ...document, _id: 'saved-recommendation-id' };
  };

  try {
    await action(() => savedDocument);
  } finally {
    globalThis.fetch = previousFetch;
    CropRecommendation.create = previousCreate;
    if (previousUrl === undefined) delete process.env.CROP_ML_URL;
    else process.env.CROP_ML_URL = previousUrl;
  }
}

test('returns and saves only five distinct model-ranked recommendations', async () => {
  await withInferenceResponse(makeInferenceResponse(), async getSavedDocument => {
    const res = makeResponse();
    await recommend({
      body: {
        location: 'Guntur',
        soil: 'Red',
        season: 'Kharif',
        area: 2,
        areaUnit: 'acres',
        temperature: input.temperature,
        humidity: input.humidity,
        soilPH: input.ph,
        rainfall: input.rainfall
      },
      user: { _id: 'test-user-id' }
    }, res);

    const saved = getSavedDocument();
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.historyId, 'saved-recommendation-id');
    assert.equal(saved.recommendations.length, 5);
    assert.deepEqual(saved.recommendations.map(crop => crop.rank), [1, 2, 3, 4, 5]);
    assert.equal(new Set(saved.recommendations.map(crop => crop.id)).size, 5);
    assert.deepEqual(
      res.body.data.recommendations.map(crop => crop.id),
      saved.recommendations.map(crop => crop.id)
    );
    assert.deepEqual(saved.inputSnapshot, {
      location: 'Guntur',
      soil: 'Red',
      season: 'Kharif',
      temperature: input.temperature,
      rainfall: input.rainfall,
      rainfallPeriod: 'previous_12_months',
      humidity: input.humidity,
      soilPH: input.ph,
      area: 2,
      areaUnit: 'acres'
    });
  });
});

test('does not save an invalid or incomplete model response', async () => {
  const invalidResponse = makeInferenceResponse().predictions.slice(0, 3);
  await withInferenceResponse(makeInferenceResponse(invalidResponse), async getSavedDocument => {
    const res = makeResponse();
    await recommend({
      body: {
        location: 'Guntur',
        soil: 'Red',
        season: 'Kharif',
        area: 2,
        temperature: input.temperature,
        humidity: input.humidity,
        soilPH: input.ph,
        rainfall: input.rainfall
      },
      user: { _id: 'test-user-id' }
    }, res);

    assert.equal(res.statusCode, 503);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INVALID_MODEL_RESPONSE');
    assert.equal(getSavedDocument(), undefined);
  });
});
