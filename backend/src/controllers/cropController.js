import mongoose from 'mongoose';
import { crops } from '../data/crops.js';
import { buildCropModelInputs, CropInferenceError, MODEL_METHOD, recommendCrops } from '../services/recommendation.js';
import { weatherForLocation } from '../services/weather.js';
import CropRecommendation from '../models/CropRecommendation.js';

const soils = ['Red', 'Black', 'Alluvial', 'Sandy', 'Clay', 'Other/unknown'];
const seasons = ['Kharif', 'Rabi', 'Zaid', 'Perennial/Year-round'];
const numericValue = value => (typeof value === 'string' && value.trim() === '') || typeof value === 'boolean' || value == null ? NaN : Number(value);
const validNumber = (value, min, max) => {
  const number = numericValue(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
};

export async function recommend(req, res) {
  const body = req.body || {};
  const {
    location, soil, season, area, areaUnit, requestId
  } = body;
  let measurements = null;
  let measurementError = null;
  try { measurements = buildCropModelInputs(body); }
  catch (error) {
    if (!(error instanceof CropInferenceError) || error.code !== 'INVALID_INPUT') throw error;
    measurementError = error;
  }
  const invalidMeasurements = measurementError?.details?.invalidMeasurements || [];
  const landArea = validNumber(area, Number.MIN_VALUE, 1_000_000);
  if (
    typeof location !== 'string' ||
    !location.trim() ||
    location.length > 120 ||
    !soils.includes(soil) ||
    !seasons.includes(season) ||
    landArea === null ||
    !(areaUnit == null || ['acres', 'hectares'].includes(areaUnit)) ||
    measurementError ||
    !(requestId == null || (typeof requestId === 'string' && requestId.length <= 80))
  ) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: measurementError?.message || 'Provide a location, supported soil type, season, farm area and all four model measurements. Missing values are never replaced with defaults.',
        details: { invalidMeasurements }
      }
    });
  }

  if (requestId) {
    const existing = await CropRecommendation.findOne({ user: req.user._id, requestId }).lean();
    if (existing) {
      return res.json({
        success: true,
        data: {
          historyId: existing._id,
          recommendations: existing.recommendations,
          inputs: existing.inputSnapshot,
          weather: existing.sourceMetadata?.weather,
          weatherError: existing.sourceMetadata?.weatherError,
          limitations: existing.sourceMetadata?.limitations,
          sources: existing.sourceMetadata?.sources,
          scoreMethod: existing.sourceMetadata?.scoreMethod
        }
      });
    }
  }

  let recommendations;
  try {
    recommendations = await recommendCrops(measurements);
  } catch (error) {
    if (!(error instanceof CropInferenceError)) throw error;
    const status = error.code === 'UNSUPPORTED_INPUT' ? 422 : error.code === 'INVALID_INPUT' ? 400 : 503;
    return res.status(status).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
  }

  let weather = null;
  let weatherError = null;
  try { weather = await weatherForLocation(location.trim()); }
  catch { weatherError = 'Weather lookup unavailable. Current weather and forecast conditions were not assessed.'; }

  const limitations = [
    MODEL_METHOD,
    'The Kaggle source attributes the 2,200-row data to Indian datasets augmented by the publisher; it does not provide row-level provenance. There are 100 records per included crop. Treat results as exploratory, not agronomic advice.',
    'The trained model ranks its 22 crop classes. Additional crops in the reference catalogue are not model predictions.',
    'The model uses temperature, humidity, soil pH and rainfall only. Location, selected soil texture, season and farm area are saved or shown as context and do not change the ranking.',
    'The dataset reports rainfall in mm but does not specify its accumulation period. The form asks for the preceding 12 months; this time-window mismatch is unknown and can make rainfall comparisons unreliable.',
    'The dataset has no soil-texture or location feature; soil-type suitability and geographic suitability are not inferred from this ranking.',
    weatherError || 'Weather is Open-Meteo forecast-model data, not an IMD station observation or seasonal climate normal. It is shown separately and is not treated as a crop requirement.',
  ];
  const sources = [...new Map(crops.flatMap(crop => crop.sources || []).map(item => [item.url, item])).values()];
  const inputSnapshot = {
    location: location.trim(),
    soil,
    season,
    temperature: measurements.temperature,
    rainfall: measurements.rainfall,
    rainfallPeriod: 'previous_12_months',
    humidity: measurements.humidity,
    soilPH: measurements.ph,
    area: landArea,
    areaUnit: areaUnit || 'acres'
  };
  let record;
  try {
    record = await CropRecommendation.create({
      user: req.user._id,
      requestId,
      location: location.trim(),
      soilType: soil,
      season,
      temperature: measurements.temperature,
      rainfall: measurements.rainfall,
      landArea,
      areaUnit: areaUnit || 'acres',
      inputSnapshot,
      recommendations,
      sourceMetadata: { weather, weatherError, sources, limitations, scoreMethod: MODEL_METHOD }
    });
  } catch (error) {
    if (error?.code !== 11000 || !requestId) throw error;
    record = await CropRecommendation.findOne({ user: req.user._id, requestId }).lean();
    if (!record) throw error;
    return res.json({ success: true, data: { historyId: record._id, recommendations: record.recommendations, inputs: record.inputSnapshot, weather: record.sourceMetadata?.weather, weatherError: record.sourceMetadata?.weatherError, limitations: record.sourceMetadata?.limitations, sources: record.sourceMetadata?.sources, scoreMethod: record.sourceMetadata?.scoreMethod } });
  }
  const data = {
    historyId: record._id,
    recommendations,
    inputs: inputSnapshot,
    model: { name: recommendations[0]?.model, version: recommendations[0]?.modelVersion, trainingDataset: recommendations[0]?.trainingDataset, heldOutAccuracy: recommendations[0]?.heldOutAccuracy, evaluation: recommendations[0]?.evaluation, featureNames: recommendations[0]?.featureNames },
    weather,
    weatherError,
    limitations,
    sources,
    scoreMethod: MODEL_METHOD,
    dataProvenance: {
      inputs: 'Farmer-entered',
      cropModel: 'Locally trained scikit-learn standardized Logistic Regression classifier',
      trainingDataset: recommendations[0]?.trainingDataset,
      weather: weather ? 'Open-Meteo current model conditions and forecast' : 'Unavailable'
    }
  };
  return res.json({ success: true, data });
}

export async function history(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = { user: req.user._id };
  const [items, total] = await Promise.all([
    CropRecommendation.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    CropRecommendation.countDocuments(filter)
  ]);
  return res.json({ success: true, data: { items, page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getHistoryRecord(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
  const record = await CropRecommendation.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!record) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND' } });
  return res.json({ success: true, data: record });
}

export function catalog(req, res) { res.json({ success: true, data: { crops } }); }
