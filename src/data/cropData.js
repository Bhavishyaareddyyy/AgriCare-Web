const ref = (name, url, region = 'Tamil Nadu, India', publicationDate = 'Page publication date not stated') => ({ name, url, region, publicationDate });

// Local crop photographs shared by recommendation cards, crop details,
// dashboard activity, and saved recommendation history. Attribution is in
// public/crops/ATTRIBUTION.md.
export const cropVisuals = {
  rice: { src: '/crops/rice.jpg', alt: 'Green rice paddy field', credit: 'Gorle', source: 'https://commons.wikimedia.org/wiki/File:Rice_Paddy.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  tomato: { src: '/crops/tomato.jpg', alt: 'Tomato fruit growing on a tomato plant', credit: 'Nidhin Murali', source: 'https://commons.wikimedia.org/wiki/File:Tomato_Plant.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  groundnut: { src: '/crops/groundnut.jpg', alt: 'Groundnut plants growing in a field', credit: 'Raghbirkhanna', source: 'https://commons.wikimedia.org/wiki/File:Groundnut_plants.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  sorghum: { src: '/crops/sorghum.jpg', alt: 'Sorghum grain head on the plant', credit: 'மாலதி. மு', source: 'https://commons.wikimedia.org/wiki/File:Sorghum_plant.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  'green-gram': { src: '/crops/green-gram.jpg', alt: 'Green gram mung bean plant', credit: 'Nizil Shah', source: 'https://commons.wikimedia.org/wiki/File:Mung_Bean_plant.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  maize: { src: '/crops/maize.jpg', alt: 'Maize plant with a developing cob', credit: 'Suglo20', source: 'https://commons.wikimedia.org/wiki/File:Maize_Cob_Forming.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  cotton: { src: '/crops/cotton.jpg', alt: 'Cotton boll growing on the cotton plant', credit: 'ChriKo', source: 'https://commons.wikimedia.org/wiki/File:Cotton_boll.jpg', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  chickpea: { src: '/crops/chickpea.jpg', alt: 'Chickpea pods and seeds', credit: 'Eitan Ferman', source: 'https://commons.wikimedia.org/wiki/File:Chickpea_pods.jpg', license: 'Public domain dedication', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  wheat: { src: '/crops/wheat.jpg', alt: 'Wheat plants growing in a field', credit: 'Suyash.dwivedi', source: 'https://commons.wikimedia.org/wiki/File:Wheat_plants_in_field_in_CIAE_002.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  default: { src: null, alt: 'Crop photograph unavailable' }
};

const source = (name, url, region, publicationDate) => ref(name, url, region, publicationDate);

export const details = {
  tomato: {
    overview: 'Tomato cultivar traits differ by fresh-market or processing use, season and disease resistance; the linked ICAR-IIHR table is a variety catalogue, not a universal growing prescription.',
    regions: 'ICAR-IIHR lists Arka Samrat for Zone VIII (Karnataka, Tamil Nadu, Andhra Pradesh and Kerala); recommendations for other regions need their state package.',
    soil: 'The cited IIHR variety catalogue does not give a general soil texture or pH range.',
    temperature: 'The cited variety catalogue does not provide a general temperature range.',
    rainfall: 'The cited variety catalogue does not provide a seasonal rainfall range.',
    season: 'Cultivar-specific examples: Arka Abhed is listed for summer, Kharif and Rabi; Arka Vikas is listed for rainfed and irrigated systems. Confirm local release and planting window.',
    duration: 'ICAR-IIHR examples: Arka Abhed about 140–150 days; Arka Meghali about 125 days; these are variety-specific.',
    water: 'No universal irrigation quantity is specified by the cited variety catalogue; use the state package and current soil-moisture conditions.',
    nutrients: 'No general dose is supplied by the cited variety catalogue; use a soil test and the applicable state package.',
    diseases: ['Tomato leaf curl: downward-rolled, crinkled leaves, stunting and shortened internodes; whiteflies transmit the virus. Prevention in TNAU guidance: protected nursery, disease-free seed, remove infected plants and weed hosts, and use yellow sticky traps. These are Tamil Nadu measures, not universal treatment advice.'],
    prevention: 'Use a locally recommended resistant cultivar and clean nursery practices. TNAU tomato leaf-curl guidance is regional; chemical vector control is not prescribed here.',
    sources: [
      source('ICAR-IIHR vegetable crop varieties', 'https://iihr.res.in/vegetable-crops', 'India; cultivar recommendation is variety/zone-specific', 'Page last updated 09 Oct 2026'),
      source('ICAR-IIHR weather-based crop advisory', 'https://iihr.res.in/weather-based-crop-advisory', 'Bengaluru, Karnataka; see current bulletin period', 'Page last updated 09 Oct 2026; displayed weather bulletin 16–30 Sep 2026'),
      source('TNAU tomato leaf-curl disease guide', 'https://agritech.tnau.ac.in/crop_protection/tomato_diseases_6.html', 'Tamil Nadu crop-protection guidance', 'Updated Jun 2023')
    ],
    lastVerified: 'Official ICAR-IIHR pages checked 11 Oct 2026; source page date is shown per link.'
  },
  rice: {
    overview: 'Rice may be transplanted, wet seeded, rainfed or upland; water management and duration change with establishment method and variety.',
    regions: 'Tamil Nadu district and season examples only; the calendar does not establish suitability for other states.',
    soil: 'The cited source is a season/variety calendar and does not specify a general soil pH range.',
    temperature: 'No temperature range is stated in the cited district calendar.',
    rainfall: 'No seasonal rainfall range is stated; do not use the 7-day forecast as a crop-season requirement.',
    season: 'Tamil Nadu examples: Kuruvai Jun–Jul, Samba around Aug, Thaladi Sep–Oct and Navarai Dec–Jan; district and cultivar differ.',
    duration: 'Variety and establishment dependent; select a named cultivar in the linked calendar before using a maturity period.',
    water: 'For TNAU transplanted lowland guidance: shallow 2 cm water at transplanting and for 7 days after; it then describes cyclic 5 cm submergence. Panicle initiation, booting, heading and flowering are critical stages.',
    nutrients: 'TNAU links separate rice nutrient guidance. Apply the local soil-test/package recommendation; no all-India dose is stated here.',
    diseases: ['Rice blast: leaf lesions enlarge into spindle-shaped spots with grey centres and dark margins; severe infection can dry leaves and damage nodes or panicles. TNAU notes blast susceptibility for ASD 19 and White Ponni specifically.'],
    prevention: 'Use the district-listed cultivar and local plant-protection guidance. The variety susceptibility note and crop-protection guidance are Tamil Nadu-specific.',
    sources: [
      source('TNAU rice district seasons and varieties', 'https://agritech.tnau.ac.in/agriculture/agri_cropproduction_cereals_rice_season.html', 'Tamil Nadu districts', 'TNAU portal copyright 2013; page revision date not stated'),
      source('TNAU rice irrigation management', 'https://agritech.tnau.ac.in/agriculture/agri_irrigationmgt_cereals_rice1.html', 'Tamil Nadu irrigated lowland rice', 'TNAU portal copyright 2008–2024; page revision date not stated'),
      source('TNAU rice blast symptoms', 'https://agritech.tnau.ac.in/crop_protection/rice_diseases/rice_1.html', 'Tamil Nadu crop-protection reference', 'Page checked 11 Oct 2026')
    ],
    lastVerified: 'Official TNAU pages checked 11 Oct 2026; the dates above are the source pages’ own date statements.'
  },
  groundnut: {
    overview: 'Groundnut is a pod-forming oilseed. Pegging and pod filling are especially sensitive to soil moisture and disturbance.',
    regions: 'The linked TNAU sowing windows and cultivars apply to Tamil Nadu districts, not all-India calendars.',
    soil: 'TNAU advises a fine tilth and discusses hardpan, crusting and drainage management; it does not give a universal soil-pH range on this page.',
    temperature: 'No temperature range is stated in the cited TNAU production guide.',
    rainfall: 'No seasonal rainfall total is stated in the cited production guide.',
    season: 'Tamil Nadu examples: rainfed Apr–May and Jun–Aug; irrigated Dec–Jan, Feb–Mar in parts of the delta, and Apr–May. Confirm district and cultivar.',
    duration: 'Listed Tamil Nadu cultivars range from about 90 days (VRI 3) to 125–130 days (COGn 5); maturity is cultivar-specific.',
    water: 'TNAU identifies flowering, pegging and pod development as critical irrigation periods; avoid waterlogging and avoid disturbing soil after about 45 days after sowing.',
    nutrients: 'The guide prioritizes soil-test-based NPK. It describes gypsum only where calcium/sulphur are deficient and says to avoid it in calcareous soil; no blanket dose is shown here.',
    diseases: ['Early leaf spot: small brown, near-circular leaf spots often have a yellow halo; later lesions may occur on petioles and stems. Late leaf spot causes dark spots, mainly underneath leaflets, and can lead to premature leaf drop.'],
    prevention: 'TNAU cultural guidance includes tolerant varieties, crop rotation with non-hosts, intercropping, and burying infected residues/removing volunteer groundnut plants. This advice is regional to Tamil Nadu.',
    sources: [
      source('TNAU groundnut seasons, varieties and crop management', 'https://agritech.tnau.ac.in/agriculture/CropProduction/Oilseeds/oilseeds_groundnut01.html', 'Tamil Nadu districts', 'TNAU portal copyright 2013; page revision date not stated'),
      source('TNAU groundnut leaf-spot symptoms and management', 'https://agritech.tnau.ac.in/agriculture/Crop-production-pathology-crp-4.html', 'Tamil Nadu crop-protection reference', 'Page checked 11 Oct 2026')
    ],
    lastVerified: 'Official TNAU pages checked 11 Oct 2026; see each linked page for its stated date.'
  },
  sorghum: {
    overview: 'Sorghum is grown for grain and fodder; the TNAU guide distinguishes irrigated and rainfed systems.',
    regions: 'District calendars, varieties and nutrient examples are for Tamil Nadu.',
    soil: 'The guide covers Alfisols and Vertisols in specific production examples; it does not give a crop-wide pH range.',
    temperature: 'No temperature range is stated in the linked TNAU production guide.',
    rainfall: 'TNAU gives 250–300 mm as optimum, well-distributed rainfall for its rainfed sorghum guidance; this is not a state-wide seasonal forecast.',
    season: 'TNAU examples: rainfed Adi/Puratasi under southwest or northeast monsoon; irrigated Thai/Chithirai. District and variety tables apply.',
    duration: 'Variety-specific TNAU examples include about 90–95 days (Paiyur 2) and 105–110 days (BSR 1/APK 1).',
    water: 'The guide gives stage-based irrigation schedules for light and heavy soils. Adjust to rainfall and soil moisture; its schedule is regional.',
    nutrients: 'TNAU says use soil-test recommendations; its blanket examples differ by rainfed/irrigated system and soil. No fertilizer dose is generalized here.',
    diseases: ['Downy mildew: humid weather can produce white downy growth on the lower leaf surface. TNAU recommends removing infected plants early; cultivar resistance and chemical options are variety- and region-specific.'],
    prevention: 'Use the district/season-listed variety and remove infected plants when identified. The cited TNAU crop-protection guidance is regional.',
    sources: [source('TNAU sorghum seasons, varieties and production', 'https://agritech.tnau.ac.in/agriculture/millets_sorghum.html', 'Tamil Nadu districts and named varieties', 'TNAU copyright 2008–2024'), source('TNAU sorghum downy mildew', 'https://agritech.tnau.ac.in/crop_protection/sorghum_disease/sorghum_d5.html', 'Tamil Nadu crop-protection reference', 'Updated Dec 2022')],
    lastVerified: 'Official TNAU page checked 11 Oct 2026; footer states 2008–2024.'
  },
  'green-gram': {
    overview: 'Green gram (mung bean) is a short-duration pulse; TNAU separates normal, irrigated, summer and rice-fallow systems.',
    regions: 'Sowing windows and cultivars listed here are Tamil Nadu district recommendations.',
    soil: 'TNAU discusses crusting and drainage management but does not state a general pH range in this guide.',
    temperature: 'No temperature range is stated in the linked TNAU guide.',
    rainfall: 'No seasonal rainfall range is stated in the linked guide.',
    season: 'Tamil Nadu examples: Jun–Jul, Sep–Oct, Dec–Jan and Feb–Mar; rice fallow sowing is listed for late Jan–early Feb in delta districts.',
    duration: 'Named TNAU varieties span approximately 56–75 days; rice-fallow ADT 3 is listed at about 66 days.',
    water: 'TNAU advises avoiding water stagnation; flowering and pod formation are critical. Its 7–10 day irrigation interval is specific to the cited Tamil Nadu package.',
    nutrients: 'TNAU distinguishes rainfed and irrigated nutrient recommendations and advises basal application; use soil-test/local package rates.',
    diseases: ['Yellow mosaic: scattered yellow spots expand into yellow-and-green patches; young leaves may turn yellow and plants can be stunted with fewer pods. Whitefly transmits the virus.'],
    prevention: 'TNAU advises removing infected plants early, controlling weed hosts and choosing locally released resistant varieties; vector and cultivar guidance is regional.',
    sources: [source('TNAU greengram seasons, varieties and production', 'https://agritech.tnau.ac.in/agriculture/pulses_greengram.html', 'Tamil Nadu districts and named varieties', 'Updated 04 Jun 2013; TNAU copyright 2013'), source('TNAU pulse disease management', 'https://agritech.tnau.ac.in/org_farm/orgfarm_agridiseases.html', 'Tamil Nadu crop-protection reference', 'Page checked 11 Oct 2026')],
    lastVerified: 'Official TNAU page checked 11 Oct 2026; source states updated 04 Jun 2013.'
  },
  maize: {
    overview: 'Maize guidance differs by grain/fodder purpose, rainfed or irrigated system, and soil group.',
    regions: 'The linked TNAU crop-production and disease references apply to Tamil Nadu; the nutrient example explicitly distinguishes Alfisols and Vertisols.',
    soil: 'TNAU rainfed examples cover Alfisols and Vertisols. A general pH interval is not stated in the linked page.',
    temperature: 'No temperature range is stated in the linked TNAU rainfed package.',
    rainfall: 'The cited rainfed package does not state a seasonal rainfall range.',
    season: 'Use the TNAU district/season table and the matching rainfed or irrigated package; it is not a universal India calendar.',
    duration: 'Depends on the named variety or hybrid; the cited rainfed page does not provide one duration for all maize.',
    water: 'The cited guide gives crop-stage and soil-specific operations, not a national water quantity. Use current local rainfall and irrigation advice.',
    nutrients: 'TNAU examples: soil-test rates preferred; its blanket NPK examples differ between Alfisols and Vertisols. Do not apply those Tamil Nadu doses elsewhere.',
    diseases: ['Downy mildew: leaves may show chlorosis and white downy growth underneath; infected plants can be stunted and fail to set a normal cob. TNAU advises clean seed and rogueing affected plants.'],
    prevention: 'Use clean seed and locally recommended resistant hybrids; rogue affected plants. The TNAU hybrid and crop-protection recommendations are regional.',
    sources: [
      source('TNAU rainfed maize production', 'https://agritech.tnau.ac.in/agriculture/millets_maize_rainfed_maize.html', 'Tamil Nadu rainfed package', 'TNAU copyright 2021'),
      source('TNAU maize downy mildew', 'https://agritech.tnau.ac.in/crop_protection/maize_disease_new/maize_1.html', 'Tamil Nadu crop-protection reference', 'Page checked 11 Oct 2026')
    ],
    lastVerified: 'Official TNAU pages checked 11 Oct 2026; see source footer dates.'
  },
  cotton: {
    overview: 'Cotton seasons and management differ for irrigated, rainfed and rice-fallow systems; cultivar selection is district-specific.',
    regions: 'The linked TNAU calendar and management are specific to Tamil Nadu districts and named varieties/hybrids.',
    soil: 'TNAU describes rainfed black-soil districts and management for light/heavy soils; it does not state a general pH interval.',
    temperature: 'No temperature range is stated in the linked TNAU package.',
    rainfall: 'A TNAU example describes 375 mm seasonal rainfall in named southern Tamil Nadu tracts; this is not a national cotton requirement.',
    season: 'Tamil Nadu examples: irrigated Aug–Sep and Feb–Mar; rainfed Sep–Oct; rice-fallow windows and cultivars differ by district.',
    duration: 'TNAU identifies SVPR 3 at about 135–140 days; other varieties and hybrids differ and may exceed 160 days.',
    water: 'TNAU irrigation schedules are stage-, soil- and cultivar-specific; flowering is a high-demand phase, and irrigation should be tapered near maturity.',
    nutrients: 'TNAU explicitly prefers soil-test rates; its NPK and micronutrient examples are cultivar- and Tamil Nadu-specific.',
    diseases: ['Cotton bacterial blight/black arm: water-soaked angular leaf spots can darken; dark lesions may girdle stems, crack and cause gumming. TNAU also describes Alternaria leaf blight as brown spots with concentric rings and brittle, falling leaves.'],
    prevention: 'TNAU advises removing infected residue, roguing volunteer cotton and weed hosts, and rotating with non-host crops. These measures are regional; use current local advice for treatment.',
    sources: [
      source('TNAU cotton seasons, varieties and management', 'https://agritech.tnau.ac.in/agriculture/CropProduction/Fibre%20crops/fibrecrops_cotton.html', 'Tamil Nadu districts and named varieties', 'TNAU copyright 2013'),
      source('ICAR Central Institute for Cotton Research weekly advisories', 'https://cicr.org.in/weekly-advisory/', 'India; current weekly advisory when published', 'Live advisory index; individual issue date shown on each bulletin'),
      source('TNAU cotton bacterial blight', 'https://agritech.tnau.ac.in/crop_protection/cotton_diseases/cotton_d9.html', 'Tamil Nadu crop-protection reference', 'Updated Apr 2023'),
      source('TNAU cotton Alternaria leaf blight', 'https://agritech.tnau.ac.in/crop_protection/cotton_diseases/cotton_d6.html', 'Tamil Nadu crop-protection reference', 'Updated Apr 2023')
    ],
    lastVerified: 'Official pages checked 11 Oct 2026; TNAU footer states 2013. The CICR advisory index is updated separately.'
  },
  chickpea: {
    overview: 'Chickpea (Bengal gram) is a cool-season pulse; cultivar and sowing window depend on state and production zone.',
    regions: 'The linked ICAR Rabi advisory is national seasonal guidance; the TNAU guide is regional to Tamil Nadu.',
    soil: 'Use local soil-test and drainage guidance; the linked advisory does not establish a universal pH range.',
    temperature: 'No validated temperature interval is stated in the linked advisories.',
    rainfall: 'No crop-season rainfall interval is stated in the linked advisories.',
    season: 'Rabi season; exact sowing window is state-, district- and cultivar-specific.',
    duration: 'Cultivar-specific; the cited national advisory does not give one duration for all chickpea varieties.',
    water: 'Avoid waterlogging; use state package guidance for irrigation timing.',
    nutrients: 'Base nutrient decisions on the soil test and current state package; no general fertilizer dose is inferred here.',
    diseases: ['Fusarium wilt: seedlings may collapse with dull-green leaves and darkened stem tissue; older plants can droop and wilt. TNAU reports patchy dead seedlings/adult plants.'],
    prevention: 'TNAU guidance includes disease-free seed, crop rotation and summer ploughing. This crop-protection guidance is regional to Tamil Nadu.',
    sources: [source('ICAR Rabi agro-advisory 2021–22', 'https://www.icar.gov.in/sites/default/files/2022-09/Rabi-Agro-Advisory-2021-22_0.pdf', 'India; seasonal Rabi advisory', '2021–22'), source('TNAU chickpea Fusarium wilt', 'https://agritech.tnau.ac.in/crop_protection/chickpea_disease/chickpea_6.html', 'Tamil Nadu crop-protection reference', 'Page checked 11 Oct 2026')],
    lastVerified: 'Official ICAR advisory checked 11 Oct 2026; publication is 2021–22 and may be superseded.'
  },
  wheat: {
    overview: 'Wheat is a cool-season cereal; sowing, variety and heat exposure vary by production zone.',
    regions: 'The linked ICAR advisory is national seasonal guidance; use the current state/district package for operational dates.',
    soil: 'The linked advisory does not provide a universal soil-pH range.',
    temperature: 'No temperature interval is stated in the linked advisory.',
    rainfall: 'No seasonal rainfall interval is stated in the linked advisory.',
    season: 'Rabi season; sowing dates and cultivars are zone-specific.',
    duration: 'Cultivar- and region-specific; not one duration for all wheat.',
    water: 'Use state package irrigation timing; do not infer irrigation from current weather alone.',
    nutrients: 'Base fertilizer decisions on a soil test and current state package.',
    diseases: ['Disease symptoms and local thresholds are not detailed in the cited national advisory.'],
    prevention: 'Use current ICAR/state advisories and locally recommended resistant varieties.',
    sources: [source('ICAR Rabi agro-advisory 2021–22', 'https://www.icar.gov.in/sites/default/files/2022-09/Rabi-Agro-Advisory-2021-22_0.pdf', 'India; seasonal Rabi advisory', '2021–22')],
    lastVerified: 'Official ICAR advisory checked 11 Oct 2026; publication is 2021–22 and may be superseded.'
  }
};

// The trained model classes are deliberately explicit here. Catalogue-only
// crops must never be treated as model predictions or get a fabricated page.
export const modelCropIds = [
  'apple', 'banana', 'blackgram', 'chickpea', 'coconut', 'coffee', 'cotton',
  'grapes', 'jute', 'kidneybeans', 'lentil', 'maize', 'mango', 'mothbeans',
  'green-gram', 'muskmelon', 'orange', 'papaya', 'pigeonpeas', 'pomegranate',
  'rice', 'watermelon'
];
export const modelLabelToCropId = {
  apple: 'apple', banana: 'banana', blackgram: 'blackgram', chickpea: 'chickpea',
  coconut: 'coconut', coffee: 'coffee', cotton: 'cotton', grapes: 'grapes', jute: 'jute',
  kidneybeans: 'kidneybeans', lentil: 'lentil', maize: 'maize', mango: 'mango',
  mothbeans: 'mothbeans', mungbean: 'green-gram', muskmelon: 'muskmelon', orange: 'orange',
  papaya: 'papaya', pigeonpeas: 'pigeonpeas', pomegranate: 'pomegranate', rice: 'rice',
  watermelon: 'watermelon'
};

const unavailable = 'Reliable crop-specific information was not available in the checked sources.';
const sourceByCrop = {
  apple: ['TNAU crop production portal (crop index)', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide an apple production package.'],
  banana: ['TNAU banana crop production', 'https://agritech.tnau.ac.in/horticulture/horti_fruits_banana.html', 'Tamil Nadu guidance; operational recommendations are regional.'],
  blackgram: ['TNAU blackgram crop production', 'https://agritech.tnau.ac.in/agriculture/pulses_blackgram.html', 'Tamil Nadu district, season and variety guidance.'],
  coconut: ['TNAU coconut crop production', 'https://agritech.tnau.ac.in/agriculture/CropProduction/Oilseeds/oilseeds_coconut.html', 'Tamil Nadu crop production guidance.'],
  coffee: ['TNAU crop production portal (crop index)', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide a coffee production package.'],
  grapes: ['TNAU grape crop production', 'https://agritech.tnau.ac.in/horticulture/horti_fruits_grapes.html', 'Tamil Nadu guidance; operational recommendations are regional.'],
  jute: ['TNAU jute crop production', 'https://agritech.tnau.ac.in/agriculture/agri_cropproduction_fibre_jute.html', 'Tamil Nadu district guidance.'],
  kidneybeans: ['TNAU crop production portal (crop index)', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide a kidney bean production package.'],
  lentil: ['TNAU crop production portal (crop index)', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide a lentil production package.'],
  mango: ['TNAU mango crop production', 'https://agritech.tnau.ac.in/horticulture/horti_fruits_mango.html', 'Tamil Nadu guidance; operational recommendations are regional.'],
  mothbeans: ['TNAU crop improvement: released moth bean variety', 'https://agritech.tnau.ac.in/crop_improvement/variety_released/TNAU%20vtys_2006.pdf', 'One released variety and adoption area; not a general production package.'],
  muskmelon: ['TNAU crop production portal (crop index)', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide a muskmelon production package.'],
  orange: ['TNAU crop production index', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide an orange production package.'],
  papaya: ['TNAU papaya crop production', 'https://agritech.tnau.ac.in/horticulture/horti_fruits_papaya.html', 'Tamil Nadu guidance; operational recommendations are regional.'],
  pigeonpeas: ['TNAU redgram (pigeonpea) crop production', 'https://agritech.tnau.ac.in/agriculture/pulses_redgram.html', 'Tamil Nadu district and production-system guidance.'],
  pomegranate: ['TNAU pomegranate crop production', 'https://agritech.tnau.ac.in/horticulture/horti_fruits_pomegranate.html', 'Tamil Nadu guidance; operational recommendations are regional.'],
  watermelon: ['TNAU crop production portal (crop index)', 'https://agritech.tnau.ac.in/agriculture/crop_production_varieties.html', 'The checked index does not provide a watermelon production package.']
};

const cropNames = {
  apple: 'Apple', banana: 'Banana', blackgram: 'Black gram', coconut: 'Coconut', coffee: 'Coffee',
  grapes: 'Grapes', jute: 'Jute', kidneybeans: 'Kidney beans', lentil: 'Lentil', mango: 'Mango',
  mothbeans: 'Moth bean', muskmelon: 'Muskmelon', orange: 'Orange', papaya: 'Papaya',
  pigeonpeas: 'Pigeon pea', pomegranate: 'Pomegranate', watermelon: 'Watermelon'
};

// Fill absent model-crop pages with explicit unavailable values, never guessed
// agronomy. Where a source page is a crop index, its limited scope is stated.
for (const id of modelCropIds) {
  if (details[id]) continue;
  const [name, url, scope] = sourceByCrop[id];
  const cropName = cropNames[id];
  details[id] = {
    overview: `${cropName} reference information. The available sources do not support a complete general growing prescription here.`,
    regions: unavailable, soil: unavailable, temperature: unavailable, rainfall: unavailable,
    season: unavailable, sowing: unavailable, duration: unavailable, water: unavailable,
    nutrients: unavailable, pests: unavailable, diseases: [], prevention: unavailable,
    sources: [source(name, url, scope, 'Page checked 13 Oct 2026; publication date not stated')],
    lastVerified: 'Source page opened and scope checked 13 Oct 2026.'
  };
}

// Crop-specific facts transcribed from opened TNAU production pages. These
// remain explicitly scoped to Tamil Nadu and named varieties/systems.
Object.assign(details.banana, {
  overview: 'Banana is a herbaceous Musa crop grown for dessert and cooking fruit; cultivars and management differ by production system.',
  regions: 'TNAU lists distinct varieties for hill areas and other Tamil Nadu systems; this does not establish suitability outside those areas.',
  soil: 'TNAU describes well-drained loamy soil as suitable and advises avoiding alkaline and saline soils. This is Tamil Nadu guidance.',
  season: 'TNAU planting windows vary by land type and cultivar: examples include February–April for several cultivars and April–May for Nendran and Robusta.',
  sowing: 'Planting material and season vary by cultivar and Tamil Nadu production system; consult the cited guide before applying locally.',
  water: 'TNAU describes irrigation immediately after planting, followed by system-specific schedules; its schedule is regional and not a universal water prescription.',
  duration: 'The TNAU guide states bunches are generally ready 12–15 months after planting; timing varies with variety, soil, weather and elevation.',
  nutrients: 'TNAU fertilizer schedules differ for garden land, wetland and hill banana and by cultivar. Use the matching local package and soil test; no dose is generalized here.'
});
Object.assign(details.coconut, {
  overview: 'Coconut is a perennial palm grown for nuts and copra; variety and management depend on growing system.',
  regions: 'TNAU describes western and eastern Tamil Nadu management regions; this is not a national suitability assessment.',
  soil: 'TNAU lists red sandy loam, laterite and alluvial soils; heavy, poorly drained soil is described as unsuitable.',
  season: 'TNAU planting examples are June–July and December–January; other planting times are noted where irrigation and drainage are available.',
  sowing: 'Planting windows above are from TNAU Tamil Nadu guidance; verify the local state package.',
  water: 'TNAU gives separate irrigation schedules by region and palm age. No single quantity is suitable for every farm.',
  duration: 'Perennial crop. TNAU lists variety-specific time to first flowering, from 43 to 63 months in named examples; this is not a universal bearing period.',
  nutrients: 'TNAU schedules vary by palm age and region. Use a soil test and applicable state recommendation rather than transferring its regional rates.'
});
Object.assign(details.blackgram, {
  overview: 'Black gram (urdbean) is a pulse crop. TNAU distinguishes rainfed, irrigated, summer and rice-fallow production systems.',
  regions: 'TNAU sowing calendars and varieties are district-specific to Tamil Nadu.',
  season: 'TNAU examples include June–August, September–November, January rice fallows, and February–March summer irrigated crops, in named districts.',
  sowing: 'Use the cited district and system-specific calendar; those windows are not an all-India recommendation.',
  duration: 'TNAU variety examples include maturity periods around 60–80 days; the cultivar determines duration.',
  water: 'TNAU identifies flowering and pod formation as critical irrigation stages and advises avoiding water stagnation; the schedule is regional.',
  nutrients: 'TNAU gives separate rainfed and irrigated nutrient examples. Apply local soil-test recommendations; do not transfer regional rates.'
});
Object.assign(details.mothbeans, {
  overview: 'Moth bean is a pulse. The cited TNAU release document describes one named variety, TMV (Mb) 1, rather than a general crop package.',
  regions: 'The cited variety is listed for adoption in Villupuram district, Tamil Nadu; this does not establish broader local suitability.',
  season: 'The cited TNAU variety example lists Rabi (November–December) for TMV (Mb) 1 in its stated adoption area.',
  sowing: 'Variety-specific TNAU information only; use current local guidance for other areas and varieties.',
  duration: 'The cited TNAU TMV (Mb) 1 release entry lists 65–70 days; other varieties may differ.'
});

// Normalize legacy keys consumed by the detail view and validate page coverage.
for (const info of Object.values(details)) {
  info.sowing ||= info.season || unavailable;
  info.pests ||= info.diseases?.join(' ') || unavailable;
  info.verified ||= info.lastVerified?.match(/\d{1,2} [A-Z][a-z]{2} \d{4}/)?.[0] || '13 Oct 2026';
}
