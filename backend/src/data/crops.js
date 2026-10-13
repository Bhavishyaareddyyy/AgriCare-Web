
const reference = (
  name,
  url,
  region,
  publicationDate = 'Publication/update date not stated'
) => ({ name, url, region, publicationDate });

const crop = (
  id,
  name,
  description,
  soil,
  seasons,
  climate,
  rainfall,
  water,
  duration,
  nutrients,
  extra = {}
) => ({
  id,
  name,
  description,
  soil,
  seasons,
  climate,
  rainfall,
  water,
  duration,
  nutrients,
  sources: [],
  ...extra,
  referenceType: extra.sources?.length
    ? 'Agricultural references listed; check source scope and dates.'
    : 'General agricultural guidance; verify local suitability with an agricultural expert.',
  lastVerified: 'General crop information; individual details have not all been independently verified.'
});

export const crops = [
  {
    ...crop(
      'rice',
      'Rice',
      'A cereal crop cultivated for its edible grains and used as a staple food in many regions.',
      ['Clay', 'Clay loam', 'Loamy'],
      ['Kharif (monsoon)', 'Rabi or summer where suitable'],
      'Warm conditions are generally suitable; temperature needs vary by growth stage and variety.',
      'Rainfall needs depend on variety, season, soil and whether cultivation is rainfed or irrigated.',
      'Water requirements vary by production system. Rice does not always need continuously flooded fields.',
      'Variety and growing conditions dependent.',
      'Nitrogen, phosphorus and potassium are important. Fertilizer rates should follow soil testing and local recommendations.',
      {
        sources: [
          reference(
            'ICAR Kharif Agro-Advisories 2025',
            'https://www.icar.gov.in/sites/default/files/Circulars/ICAR%20En-Kharif%20Agro-Advisories%20for%20Farmers%202025.pdf',
            'India',
            '2025'
          ),
          reference(
            'TNAU Rice crop production',
            'https://agritech.tnau.ac.in/agriculture/agri_cropproduction_cereals_rice_season.html',
            'Tamil Nadu'
          )
        ]
      }
    )
  },

  crop(
    'apple', 'Apple',
    'A fruit tree grown for its edible fruits; many varieties require suitable winter chilling.',
    ['Well-drained loamy soil', 'Sandy loam'],
    ['Planting season depends on region and planting material'],
    'Temperate conditions suit many varieties; chilling needs differ among cultivars.',
    'Rainfall requirements depend on local climate and irrigation availability.',
    'Regular moisture is useful during active growth and fruit development; avoid waterlogging.',
    'Perennial tree; first harvest often takes several years.',
    'Nitrogen, phosphorus, potassium and micronutrients may be needed according to soil and leaf tests.'
  ),

  crop(
    'banana', 'Banana',
    'A tropical fruit crop that produces bunches of bananas and grows best under warm conditions.',
    ['Deep, fertile loamy soil', 'Well-drained soil rich in organic matter'],
    ['Year-round in suitable climates'],
    'Warm, humid conditions are generally suitable; frost and strong winds can damage plants.',
    'Requires adequate rainfall or irrigation; needs vary by climate and soil.',
    'Needs regular moisture and good drainage, particularly during active growth and bunch development.',
    'Harvest commonly occurs within about 9–18 months, depending on cultivar and conditions.',
    'Requires substantial potassium and nitrogen; use soil testing and locally recommended fertilizer schedules.'
  ),

  crop(
    'blackgram', 'Black gram',
    'A short-duration pulse crop grown for its protein-rich seeds.',
    ['Loamy', 'Sandy loam', 'Well-drained soil'],
    ['Kharif', 'Rabi or summer where locally recommended'],
    'Warm conditions are generally suitable; prolonged waterlogging is harmful.',
    'Rainfall needs depend on season, variety and soil moisture.',
    'Avoid standing water; adequate moisture is important during flowering and pod development.',
    'Often around 70–100 days, depending on variety and season.',
    'Phosphorus and balanced nutrients support growth; nitrogen management and seed treatment should follow local pulse recommendations.'
  ),

  {
    ...crop(
      'chickpea', 'Chickpea',
      'A cool-season pulse crop grown for its edible, protein-rich seeds.',
      ['Sandy loam', 'Loamy', 'Well-drained black soil'],
      ['Rabi (winter)'],
      'Cool, relatively dry conditions generally suit the crop; excessive moisture can increase disease risk.',
      'Often grown on residual soil moisture or with limited irrigation, depending on region.',
      'Avoid waterlogging; irrigation should follow local recommendations and crop growth stage.',
      'Commonly around 90–150 days, depending on variety.',
      'Phosphorus and sulfur may be important depending on soil. Apply nutrients according to soil tests.',
      {
        sources: [
          reference(
            'ICAR Rabi Agro-Advisory 2021-22',
            'https://www.icar.gov.in/sites/default/files/2022-09/Rabi-Agro-Advisory-2021-22_0.pdf',
            'India',
            '2021–22'
          ),
          reference(
            'TNAU Bengalgram production guide',
            'https://agritech.tnau.ac.in/ta/pdf/AGRICULTURE.pdf',
            'Tamil Nadu'
          )
        ]
      }
    )
  },

  crop(
    'coconut', 'Coconut',
    'A tropical perennial palm cultivated for coconuts, oil, food and other useful products.',
    ['Deep, well-drained sandy loam', 'Loamy soil'],
    ['Perennial'],
    'Warm, humid tropical conditions generally suit coconut palms.',
    'Rainfall needs depend on distribution throughout the year and soil water retention.',
    'Young palms need reliable moisture; mature palms may need supplemental irrigation in dry periods.',
    'Perennial; first bearing commonly takes several years.',
    'Nitrogen, potassium, magnesium and other nutrients may be needed; follow palm-specific soil testing and extension guidance.'
  ),

  crop(
    'coffee', 'Coffee',
    'A perennial crop cultivated for its beans, which are processed into coffee.',
    ['Fertile, well-drained soil', 'Loamy soil rich in organic matter'],
    ['Perennial; planting season depends on region'],
    'Warm, humid conditions and suitable shade are important; requirements vary between Arabica and Robusta.',
    'Needs vary with species, elevation and seasonal rainfall.',
    'Requires adequate moisture and drainage; avoid waterlogging and manage shade appropriately.',
    'First harvest typically takes several years; timing varies by species and growing conditions.',
    'Nitrogen, potassium, phosphorus and micronutrients may be needed; rates depend on soil tests, plant age and species.'
  ),

  {
    ...crop(
      'cotton', 'Cotton',
      'A fibre crop grown for the lint surrounding its seeds; cottonseed also has commercial uses.',
      ['Black soil', 'Clay loam', 'Well-drained loamy soil'],
      ['Kharif (monsoon) in many Indian regions'],
      'Warm, frost-free conditions generally suit cotton; requirements depend on variety and region.',
      'Rainfall needs depend on the variety and whether production is rainfed or irrigated.',
      'Avoid waterlogging; irrigation needs depend on rainfall, soil and growth stage.',
      'Often around 150–180 days, but variety and region can change the duration.',
      'Nitrogen, phosphorus and potassium are important; excessive nitrogen can delay maturity. Follow local recommendations.',
      {
        sources: [
          reference(
            'TNAU Cotton production',
            'https://agritech.tnau.ac.in/agriculture/CropProduction/Fibre%20crops/fibrecrops_cotton.html',
            'Tamil Nadu'
          ),
          reference(
            'ICAR Central Institute for Cotton Research weekly advisories',
            'https://cicr.org.in/weekly-advisory/',
            'India'
          )
        ]
      }
    )
  },

  crop(
    'grapes', 'Grapes',
    'A fruit vine cultivated for fresh table grapes, raisins and juice or wine production.',
    ['Well-drained loamy soil', 'Sandy loam'],
    ['Planting and pruning seasons depend on region'],
    'Sunny conditions and good airflow help fruit development and reduce some disease risks.',
    'Rainfall requirements depend on variety and production system; excessive rain can affect fruit quality.',
    'Irrigation should be managed according to growth stage and soil moisture.',
    'Perennial vine; production begins after establishment and varies by variety.',
    'Nitrogen, phosphorus, potassium and micronutrients should be managed through soil and leaf analysis.'
  ),

  crop(
    'jute', 'Jute',
    'A fibre crop grown for stems that provide natural plant fibres used in sacks, ropes and textiles.',
    ['Alluvial soil', 'Fertile loamy soil'],
    ['Kharif (monsoon) in suitable regions'],
    'Warm, humid conditions generally favour growth.',
    'Requires adequate rainfall and moisture during active growth.',
    'Moisture is important during establishment and stem growth; avoid unsuitable prolonged waterlogging.',
    'Often around 100–150 days, depending on species and variety.',
    'Nitrogen, phosphorus and potassium needs depend on soil fertility and local production recommendations.'
  ),

  crop(
    'kidneybeans', 'Kidney beans',
    'A pulse crop grown for its edible beans, which are commonly used in cooked dishes.',
    ['Well-drained loamy soil', 'Sandy loam'],
    ['Season varies by elevation and region'],
    'Moderate conditions suit many varieties; extreme heat during flowering may reduce pod set.',
    'Needs depend on climate, variety and season.',
    'Maintain even moisture during flowering and pod development; avoid waterlogging.',
    'Often around 90–120 days, depending on variety.',
    'Phosphorus and potassium may be important; use locally recommended nutrient and inoculation practices.'
  ),

  crop(
    'lentil', 'Lentil',
    'A cool-season pulse crop grown for small edible seeds rich in protein.',
    ['Sandy loam', 'Loamy', 'Well-drained soil'],
    ['Rabi (winter)'],
    'Cool conditions generally suit lentil; hot weather near maturity can shorten the growing period.',
    'Often grown with limited irrigation or residual moisture, depending on region.',
    'Avoid waterlogging; irrigation depends on rainfall, soil and crop stage.',
    'Often around 100–140 days, depending on variety.',
    'Phosphorus and sulfur can be important depending on soil; use soil testing and local pulse recommendations.'
  ),

  crop(
    'mango', 'Mango',
    'A tropical and subtropical fruit tree cultivated for its sweet, fleshy fruits.',
    ['Well-drained loamy soil', 'Sandy loam'],
    ['Perennial; planting time depends on local rainfall and irrigation'],
    'Warm conditions suit mango; prolonged frost and unsuitable moisture conditions can harm trees.',
    'Rainfall requirements vary with location, cultivar and tree age.',
    'Young trees need regular establishment watering; mature trees require irrigation according to conditions.',
    'Perennial; trees usually take several years to begin bearing.',
    'Nitrogen, phosphorus, potassium and micronutrients may be needed according to tree age and soil analysis.'
  ),

  {
    ...crop(
      'maize', 'Maize',
      'A cereal crop grown for grain, animal feed and several food and industrial uses.',
      ['Sandy loam', 'Loamy', 'Clay loam with good drainage'],
      ['Kharif', 'Rabi', 'Summer where suitable'],
      'Warm conditions are generally suitable; extreme heat around flowering can reduce grain formation.',
      'Rainfall needs depend on season, soil and variety.',
      'Avoid water stress during flowering and grain filling; avoid waterlogging.',
      'Often around 80–120 days, depending on hybrid and season.',
      'Nitrogen is particularly important, alongside phosphorus, potassium and locally needed micronutrients.',
      {
        sources: [
          reference(
            'ICAR Kharif Agro-Advisories 2025',
            'https://www.icar.gov.in/sites/default/files/Circulars/ICAR%20En-Kharif%20Agro-Advisories%20for%20Farmers%202025.pdf',
            'India',
            '2025'
          ),
          reference(
            'TNAU Rainfed maize production',
            'https://agritech.tnau.ac.in/agriculture/millets_maize_rainfed_maize.html',
            'Tamil Nadu'
          )
        ]
      }
    )
  },

  crop(
    'mothbeans', 'Moth bean',
    'A drought-tolerant pulse crop commonly cultivated in dry and semi-arid regions.',
    ['Sandy soil', 'Sandy loam'],
    ['Kharif (monsoon) in suitable dry regions'],
    'Warm, dry conditions generally suit moth bean.',
    'Adapted to relatively low rainfall, but establishment and yield still depend on moisture.',
    'Usually grown with rainfall; avoid waterlogging.',
    'Often around 60–90 days, depending on variety.',
    'Nutrient needs depend on soil fertility; use locally recommended pulse-crop practices.'
  ),

  crop(
    'muskmelon', 'Muskmelon',
    'A warm-season fruit crop producing sweet, aromatic melons.',
    ['Sandy loam', 'Fertile, well-drained soil'],
    ['Warm season; timing depends on region'],
    'Warm, sunny conditions favour growth and fruit development.',
    'Rainfall needs vary; excessive rain and humidity may increase disease risk.',
    'Provide adequate moisture during establishment and fruit development; avoid waterlogging.',
    'Often around 70–100 days, depending on variety.',
    'Balanced nitrogen, phosphorus and potassium support growth; excessive nitrogen can favour foliage over fruit.'
  ),

  crop(
    'orange', 'Orange',
    'A citrus fruit tree grown for its juicy fruits, which provide vitamin C and other nutrients.',
    ['Well-drained loamy soil', 'Sandy loam'],
    ['Perennial; planting season depends on local conditions'],
    'Warm subtropical or tropical conditions suit different citrus varieties.',
    'Needs depend on climate, variety and rainfall distribution.',
    'Consistent moisture is useful during growth and fruit development; avoid waterlogging.',
    'Perennial tree; time to bearing varies by rootstock and variety.',
    'Nitrogen, potassium, magnesium and micronutrients may be needed; follow soil and leaf testing.'
  ),

  crop(
    'papaya', 'Papaya',
    'A fast-growing tropical fruit plant that produces soft, sweet fruits.',
    ['Fertile, well-drained loamy soil', 'Sandy loam'],
    ['Warm season; planting time depends on region'],
    'Warm, frost-free conditions are generally suitable.',
    'Requires adequate moisture, but heavy rain and waterlogging can damage roots.',
    'Water regularly during dry periods and ensure good drainage.',
    'First harvest may begin within about 8–12 months under suitable conditions.',
    'Nitrogen and potassium are important; use crop-stage and soil-based fertilizer guidance.'
  ),

  crop(
    'pigeonpeas', 'Pigeon pea',
    'A pulse crop grown for protein-rich seeds and commonly used in dal.',
    ['Loamy', 'Sandy loam', 'Well-drained soil'],
    ['Kharif (monsoon) in many Indian regions'],
    'Warm conditions are generally suitable; prolonged waterlogging is harmful.',
    'Rainfall needs depend on duration type, soil and local climate.',
    'Often rainfed; avoid standing water and prolonged moisture stress.',
    'Short-duration types may mature in about 120 days; longer-duration types take longer.',
    'Phosphorus and sulfur may be important depending on soil; follow local pulse recommendations.'
  ),

  crop(
    'pomegranate', 'Pomegranate',
    'A fruit-bearing shrub or small tree cultivated for its edible, seed-filled fruits.',
    ['Well-drained loamy soil', 'Sandy loam'],
    ['Perennial; planting and flowering cycles depend on region'],
    'Warm, relatively dry conditions can suit many varieties; humidity influences disease risk.',
    'Rainfall requirements vary by climate and production system.',
    'Irrigate according to tree age and growth stage; avoid waterlogging and irregular moisture where possible.',
    'Perennial; time to bearing varies by variety and management.',
    'Balanced nitrogen, phosphorus, potassium and micronutrients may be required according to soil tests.'
  ),

  {
    ...crop(
      'groundnut', 'Groundnut',
      'An oilseed and pulse crop grown for its edible kernels and oil; pods develop underground.',
      ['Sandy soil', 'Sandy loam', 'Loose, well-drained soil'],
      ['Kharif', 'Rabi or summer where locally suitable'],
      'Warm, sunny conditions generally suit groundnut.',
      'Rainfall requirements depend on season and soil; drought at flowering and pod development can reduce yield.',
      'Adequate moisture is important during flowering, pegging and pod filling. Avoid waterlogging.',
      'Often around 90–130 days, depending on variety and season.',
      'Calcium is important for pod development; phosphorus, potassium and sulfur may also be needed.',
      {
        sources: [
          reference(
            'ICAR Kharif Agro-Advisories 2025',
            'https://www.icar.gov.in/sites/default/files/Circulars/ICAR%20En-Kharif%20Agro-Advisories%20for%20Farmers%202025.pdf',
            'India',
            '2025'
          ),
          reference(
            'TNAU Groundnut crop management',
            'https://www.agritech.tnau.ac.in/agriculture/CropProduction/Oilseeds/oilseeds_groundnut01.html',
            'Tamil Nadu'
          )
        ]
      }
    )
  },

  {
    ...crop(
      'sorghum', 'Sorghum',
      'A cereal crop valued for its grain, fodder and ability to tolerate dry conditions.',
      ['Sandy loam', 'Loamy', 'Black soil', 'Well-drained clay loam'],
      ['Kharif', 'Rabi in suitable regions'],
      'Warm conditions suit sorghum; it is generally more drought-tolerant than many cereals.',
      'Rainfall needs depend on variety and season; establishment still requires sufficient moisture.',
      'Rainfed cultivation is common in suitable regions; irrigation needs depend on climate and soil.',
      'Often around 90–120 days, depending on variety and season.',
      'Nitrogen and phosphorus needs depend on soil fertility, intended grain or fodder use, and local recommendations.',
      {
        sources: [
          reference(
            'TNAU Sorghum production',
            'https://agritech.tnau.ac.in/agriculture/millets_sorghum.html',
            'Tamil Nadu'
          )
        ]
      }
    )
  },

  {
    ...crop(
      'green-gram', 'Green gram (mung bean)',
      'A short-duration pulse crop grown for its green seeds, which are rich in protein.',
      ['Sandy loam', 'Loamy', 'Well-drained soil'],
      ['Kharif', 'Rabi or summer where suitable'],
      'Warm conditions generally favour growth; high humidity and waterlogging can increase disease risk.',
      'Rainfall requirements vary with season and soil moisture.',
      'Avoid water stagnation; adequate moisture is useful during flowering and pod formation.',
      'Often around 60–90 days, depending on variety.',
      'Phosphorus and balanced nutrition may be important; use locally recommended seed inoculation and fertilizer practices.',
      {
        sources: [
          reference(
            'TNAU Greengram production',
            'https://agritech.tnau.ac.in/agriculture/pulses_greengram.html',
            'Tamil Nadu'
          ),
          reference(
            'ICAR Kharif Agro-Advisories 2025',
            'https://www.icar.gov.in/sites/default/files/Circulars/ICAR%20En-Kharif%20Agro-Advisories%20for%20Farmers%202025.pdf',
            'India',
            '2025'
          )
        ]
      }
    )
  },

  crop(
    'watermelon', 'Watermelon',
    'A warm-season vine crop cultivated for its water-rich, sweet fruits.',
    ['Sandy loam', 'Fertile, well-drained soil'],
    ['Warm season; planting time varies by region'],
    'Warm, sunny weather is generally favourable for growth and fruit development.',
    'Rainfall needs depend on soil and climate; excessive rain can affect fruit quality and disease pressure.',
    'Maintain suitable moisture during establishment and fruit development; avoid waterlogging.',
    'Often around 70–100 days, depending on variety and conditions.',
    'Balanced nitrogen, phosphorus and potassium are important; excessive nitrogen can promote foliage over fruit development.'
  ),

  {
    ...crop(
      'wheat', 'Wheat',
      'A cereal crop grown for grain used in flour, bread, chapati and other foods.',
      ['Loamy', 'Clay loam', 'Sandy loam'],
      ['Rabi (winter) in many Indian regions'],
      'Cool conditions during early growth and relatively dry weather near maturity suit many varieties.',
      'Rainfall requirements depend on region and whether the crop is irrigated.',
      'Irrigation timing is important at critical growth stages; follow regional agricultural guidance.',
      'Often around 110–150 days, depending on variety and climate.',
      'Nitrogen is important, with phosphorus, potassium and other nutrients based on soil testing.',
      {
        sources: [
          reference(
            'ICAR Rabi Agro-Advisory 2021-22',
            'https://www.icar.gov.in/sites/default/files/2022-09/Rabi-Agro-Advisory-2021-22_0.pdf',
            'India',
            '2021–22'
          )
        ]
      }
    )
  }
].map(item => ({
  ...item,
  referenceType: item.sources.length
    ? 'Agricultural references listed; check source scope and dates.'
    : 'General agricultural guidance; verify local suitability with an agricultural expert.'
}));
