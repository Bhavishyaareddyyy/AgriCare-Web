// Keep this allowlist in parity with backend/ai/models/ood_meta.json. The
// inference boundary must never turn an unknown or malformed class into a
// diagnosis for a crop merely because the crop prefix looks familiar.
export const supportedDiseaseLabels = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy'
];

const cropNames = {
  Apple: 'Apple',
  Blueberry: 'Blueberry',
  'Cherry_(including_sour)': 'Cherry',
  'Corn_(maize)': 'Maize',
  Grape: 'Grape',
  Orange: 'Orange',
  Peach: 'Peach',
  'Pepper,_bell': 'Bell pepper',
  Potato: 'Potato',
  Raspberry: 'Raspberry',
  Soybean: 'Soybean',
  Squash: 'Squash',
  Strawberry: 'Strawberry',
  Tomato: 'Tomato'
};

export function parseDiseaseLabel(label) {
  if (typeof label !== 'string' || !supportedDiseaseLabels.includes(label)) return null;
  const [rawPlant, rawDisease, ...unexpected] = label.split('___');
  if (!rawPlant || !rawDisease || unexpected.length || !cropNames[rawPlant]) return null;
  const diseaseName = rawDisease
    .replaceAll('_', ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { plant: cropNames[rawPlant], diseaseName };
}
