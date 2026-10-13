import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cropVisuals, details, modelCropIds, modelLabelToCropId } from './cropData.js';

test('all 22 trained labels map to a details page, including mungbean alias', () => {
  assert.equal(Object.keys(modelLabelToCropId).length, 22);
  assert.deepEqual(Object.values(modelLabelToCropId).sort(), [...modelCropIds].sort());
  assert.equal(modelLabelToCropId.mungbean, 'green-gram');
  const backend = readFileSync(resolve(process.cwd(), 'backend/src/services/recommendation.js'), 'utf8');
  const mappingBlock = backend.match(/const cropByLabel = \{([\s\S]*?)\n\};/)?.[1];
  assert.ok(mappingBlock, 'backend recommendation mapping was not found');
  const backendMapping = Object.fromEntries([...mappingBlock.matchAll(/^\s*(\w+): '([^']+)'/gm)].map((match) => [match[1], match[2]]));
  assert.deepEqual(modelLabelToCropId, backendMapping, 'details IDs must match live recommendation mappings');
  for (const id of modelCropIds) assert.ok(details[id], `missing details for ${id}`);
});

test('crop pages expose every growing field and state unavailable information explicitly', () => {
  for (const id of modelCropIds) {
    const crop = details[id];
    for (const field of ['overview', 'regions', 'soil', 'temperature', 'rainfall', 'season', 'sowing', 'water', 'duration', 'nutrients', 'pests']) {
      assert.equal(typeof crop[field], 'string', `${id}.${field} should be readable text`);
      assert.ok(crop[field].trim(), `${id}.${field} should not be blank`);
    }
  }
  assert.match(details.apple.soil, /not available/i);
  assert.match(details.banana.soil, /well-drained loamy/i);
  assert.match(details.rice.season, /Tamil Nadu examples/i);
  assert.match(details['green-gram'].duration, /56/);
});

test('every crop source has a named HTTPS URL; local photos exist and missing photos use fallback', () => {
  for (const [id, crop] of Object.entries(details)) {
    assert.ok(crop.sources?.length, `${id} has no source`);
    for (const source of crop.sources) {
      assert.ok(source.name, `${id} source title missing`);
      assert.equal(new URL(source.url).protocol, 'https:');
    }
  }
  for (const [id, visual] of Object.entries(cropVisuals)) {
    if (id === 'default' || !visual.src) continue;
    assert.ok(existsSync(resolve(process.cwd(), 'public', visual.src.slice(1))), `missing image for ${id}`);
  }
  assert.equal(cropVisuals.default.src, null);
  assert.equal(cropVisuals.default.alt, 'Crop photograph unavailable');
});
