import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseDiseaseLabel, supportedDiseaseLabels } from './diseaseLabels.js';

const metadataPath = fileURLToPath(new URL('../../ai/models/ood_meta.json', import.meta.url));
const modelLabels = JSON.parse(readFileSync(metadataPath, 'utf8')).labels;

test('backend class allowlist exactly matches the ONNX model label order/set', () => {
  assert.equal(modelLabels.length, 38);
  assert.deepEqual(supportedDiseaseLabels, modelLabels);
});

test('known model labels map to their exact supported crop and disease display names', () => {
  assert.deepEqual(parseDiseaseLabel('Corn_(maize)___Northern_Leaf_Blight'), {
    plant: 'Maize', diseaseName: 'Northern Leaf Blight'
  });
  assert.deepEqual(parseDiseaseLabel('Tomato___healthy'), {
    plant: 'Tomato', diseaseName: 'healthy'
  });
  assert.deepEqual(parseDiseaseLabel('Pepper,_bell___Bacterial_spot'), {
    plant: 'Bell pepper', diseaseName: 'Bacterial spot'
  });
});

test('unknown, malformed, and unsupported crop classes are rejected at the API boundary', () => {
  assert.equal(parseDiseaseLabel('Tomato___Powdery_mildew'), null);
  assert.equal(parseDiseaseLabel('Wheat___healthy'), null);
  assert.equal(parseDiseaseLabel('Tomato___healthy___extra'), null);
  assert.equal(parseDiseaseLabel(null), null);
});
