import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const vehicleModelsData = [
  {
    baseModel: "Toyota Vitz",
    alsoKnownAs: "Toyota Yaris",
    reliabilityScore: 8,
    commonProblems: [
      { issue: "CVT Transmission Issues", severity: "Medium", description: "CVT can experience slipping, juddering during acceleration, especially in older models" },
      { issue: "Engine Vibration on Idle", severity: "Low", description: "Known fault in 1000cc second and third generation models" },
      { issue: "Rust Issues", severity: "Medium", description: "Body rust can develop in older models, especially in humid climates" },
      { issue: "Engine Mount Wear", severity: "Low", description: "Damaged engine mounts can cause vibration" },
      { issue: "Suspension Noise", severity: "Low", description: "Worn suspension components may cause noise over bumps" }
    ],
    fuelEfficiency: { city_kmpl: "14-16", highway_kmpl: "17-20", hybrid_kmpl: "20-25" },
    safetyRating: { euro_ncap: "5 stars (2020 model)", jncap: "5 stars", notes: "Good crash test performance, multiple airbags in newer models" },
    maintenanceTips: ["Regular CVT fluid changes every 40,000 km", "Check engine mounts periodically", "Inspect suspension components annually"],
    yearsToAvoid: ["2009"],
    bestYears: ["2015", "2016", "2017", "2018", "2019"]
  },
  {
    baseModel: "Suzuki Wagon R",
    alsoKnownAs: "Suzuki WagonR Stingray, WagonR FZ, WagonR FX",
    reliabilityScore: 7,
    commonProblems: [
      { issue: "AGS Transmission Issues", severity: "Medium", description: "AGS (Auto Gear Shift) can have jerky shifts, warning lights, and overheating issues" },
      { issue: "Clutch Wear", severity: "Medium", description: "Clutch wear causes hard shifting or slipping, especially in traffic" },
      { issue: "Suspension Noise", severity: "Low", description: "Suspension can cause noise over bumps and rough roads" },
      { issue: "Reverse Gear Engagement", severity: "Medium", description: "Some models have issues with reverse gear not engaging properly" },
      { issue: "CVT Overheating", severity: "Medium", description: "CVT models can overheat in heavy traffic conditions" }
    ],
    fuelEfficiency: { city_kmpl: "16-18", highway_kmpl: "20-24", hybrid_kmpl: "25-30" },
    safetyRating: { global_ncap: "1 star (adult), 0 stars (child) - Indian model", jncap: "4 stars (Japanese model)", notes: "Japanese domestic models have better safety features than Indian variants" },
    maintenanceTips: ["Regular AGS/CVT fluid service", "Check clutch adjustment periodically", "Inspect suspension bushings"],
    yearsToAvoid: ["2014-2015 AGS models with early software"],
    bestYears: ["2017", "2018", "2019", "2023", "2024"]
  },
  {
    baseModel: "Honda Vezel",
    alsoKnownAs: "Honda HR-V",
    reliabilityScore: 6,
    commonProblems: [
      { issue: "DCT Dual Clutch Transmission Overheating", severity: "High", description: "Major issue in 2014-2016 models. DCT overheats after 30-40km in traffic, causing car to halt or jerky gear changes" },
      { issue: "Sluggish Acceleration and Jerking", severity: "High", description: "First gear shifting becomes rough, especially after running through heavy traffic" },
      { issue: "Hybrid Battery Degradation", severity: "Medium", description: "Hybrid battery can degrade over time, affecting fuel efficiency and performance" },
      { issue: "Actuator Fluid Issues", severity: "Medium", description: "Requires actuator fluid change every 6 months for smooth operation" },
      { issue: "Paint Defects", severity: "Low", description: "Some models reported paint peeling or defects" }
    ],
    fuelEfficiency: { city_kmpl: "12-15", highway_kmpl: "16-18", hybrid_kmpl: "20-24" },
    safetyRating: { euro_ncap: "5 stars (2022 model)", jncap: "5 stars", asean_ncap: "5 stars", notes: "Excellent crash test performance with Honda Sensing safety features" },
    maintenanceTips: ["Change DCT gear oil at 60,000 km", "Change actuator fluid every 6 months", "Monitor hybrid battery health", "Avoid prolonged heavy traffic driving in hot weather"],
    yearsToAvoid: ["2014", "2015"],
    bestYears: ["2018", "2019", "2022", "2023", "2024", "2025"],
    recallInfo: "2013-2014 models were recalled by Honda for faulty transmission"
  },
  {
    baseModel: "Toyota Axio",
    alsoKnownAs: "Toyota Corolla Axio",
    reliabilityScore: 8,
    commonProblems: [
      { issue: "CVT Transmission Sensitivity", severity: "Medium", description: "CVT is sensitive to fluid type and level, incorrect fluid can cause overheating and pump failure" },
      { issue: "Hybrid ABS Issues", severity: "Medium", description: "Hybrid models may experience ABS sensor issues and warning lights" },
      { issue: "Excessive Oil Consumption", severity: "Low", description: "Some engines may consume more oil than expected" },
      { issue: "Blow-by from Engine", severity: "Low", description: "Some models show blow-by from dipstick and oil filler cap" },
      { issue: "Water Pump Failure", severity: "Low", description: "Water pump may need replacement around 100,000 km" }
    ],
    fuelEfficiency: { city_kmpl: "14-16", highway_kmpl: "18-22", hybrid_kmpl: "25-30" },
    safetyRating: { jncap: "5 stars", notes: "Excellent safety record as part of Corolla family" },
    maintenanceTips: ["Use only Toyota genuine CVT fluid", "Regular oil changes every 5,000 km", "Check ABS sensors on hybrid models", "Water pump inspection at 80,000 km"],
    yearsToAvoid: [],
    bestYears: ["2015", "2016", "2017", "2018", "WXB models"]
  }
];

const vehicleListingsData = [
  // Toyota Vitz from Riyasewana
  { model: "Toyota Vitz", baseModel: "Toyota Vitz", year: 2018, price: 6150000, mileage: 48000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz Safety", baseModel: "Toyota Vitz", year: 2018, price: 6350000, mileage: 52000, location: "Gampaha", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz F Grade", baseModel: "Toyota Vitz", year: 2017, price: 5850000, mileage: 65000, location: "Kandy", source: "riyasewana", priceEvaluation: "good_deal" },
  { model: "Toyota Vitz Jewela", baseModel: "Toyota Vitz", year: 2019, price: 6750000, mileage: 35000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz Hybrid", baseModel: "Toyota Vitz", year: 2017, price: 6450000, mileage: 58000, location: "Galle", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz", baseModel: "Toyota Vitz", year: 2016, price: 5250000, mileage: 78000, location: "Kurunegala", source: "riyasewana", priceEvaluation: "good_deal" },
  { model: "Toyota Vitz F Safety", baseModel: "Toyota Vitz", year: 2020, price: 7250000, mileage: 28000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz", baseModel: "Toyota Vitz", year: 2015, price: 4950000, mileage: 92000, location: "Matara", source: "riyasewana", priceEvaluation: "fair_price" },
  
  // Toyota Vitz from Ikman
  { model: "Toyota Vitz F Safety", baseModel: "Toyota Vitz", year: 2018, price: 6250000, mileage: 45000, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz Jewela Smart Stop", baseModel: "Toyota Vitz", year: 2019, price: 6850000, mileage: 32000, location: "Gampaha", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz", baseModel: "Toyota Vitz", year: 2017, price: 5650000, mileage: 68000, location: "Kandy", source: "ikman", priceEvaluation: "good_deal" },
  { model: "Toyota Vitz Hybrid F", baseModel: "Toyota Vitz", year: 2018, price: 6550000, mileage: 42000, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz", baseModel: "Toyota Vitz", year: 2016, price: 5450000, mileage: 75000, location: "Negombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Vitz Safety Edition", baseModel: "Toyota Vitz", year: 2020, price: 7450000, mileage: 25000, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  
  // Suzuki Wagon R from Riyasewana
  { model: "Suzuki Wagon R FX", baseModel: "Suzuki Wagon R", year: 2023, price: 7175000, mileage: 9000, location: "Galle", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R FX Safety", baseModel: "Suzuki Wagon R", year: 2023, price: 7000000, mileage: 19000, location: "Colombo", source: "riyasewana", priceEvaluation: "good_deal" },
  { model: "Suzuki Wagon R Custom ZX", baseModel: "Suzuki Wagon R", year: 2023, price: 8325000, mileage: 19000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R Stingray", baseModel: "Suzuki Wagon R", year: 2017, price: 6850000, mileage: 96000, location: "Kalutara", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R FZ", baseModel: "Suzuki Wagon R", year: 2016, price: 5690000, mileage: 98000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R Stingray J Style", baseModel: "Suzuki Wagon R", year: 2014, price: 5500000, mileage: 135000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  
  // Suzuki Wagon R from Ikman
  { model: "Suzuki Wagon R Custom Z Hybrid", baseModel: "Suzuki Wagon R", year: 2025, price: 8800000, mileage: 8, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R FX", baseModel: "Suzuki Wagon R", year: 2025, price: 7375000, mileage: 2615, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R FX Safety Hybrid", baseModel: "Suzuki Wagon R", year: 2023, price: 7475000, mileage: 14300, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Suzuki Wagon R ZX Custom", baseModel: "Suzuki Wagon R", year: 2025, price: 9290000, mileage: 0, location: "Kalutara", source: "ikman", priceEvaluation: "overpriced" },
  { model: "Suzuki Wagon R Stingray Hybrid", baseModel: "Suzuki Wagon R", year: 2018, price: 7060000, mileage: 62900, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  
  // Honda Vezel from Riyasewana
  { model: "Honda Vezel Z Grade", baseModel: "Honda Vezel", year: 2023, price: 16990000, mileage: 25000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Honda Vezel RS Sensing", baseModel: "Honda Vezel", year: 2018, price: 13000000, mileage: 64700, location: "Colombo", source: "riyasewana", priceEvaluation: "good_deal" },
  { model: "Honda Vezel", baseModel: "Honda Vezel", year: 2018, price: 14300000, mileage: 50400, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Honda Vezel Z Premium", baseModel: "Honda Vezel", year: 2024, price: 19900000, mileage: 12000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Honda Vezel Z Play Moonroof", baseModel: "Honda Vezel", year: 2025, price: 20000000, mileage: 0, location: "Kurunegala", source: "riyasewana", priceEvaluation: "fair_price" },
  
  // Honda Vezel from Ikman
  { model: "Honda Vezel Z", baseModel: "Honda Vezel", year: 2025, price: 18245000, mileage: 100, location: "Gampaha", source: "ikman", priceEvaluation: "good_deal" },
  { model: "Honda Vezel Z Premium", baseModel: "Honda Vezel", year: 2025, price: 18890000, mileage: 0, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Honda Vezel Z Play", baseModel: "Honda Vezel", year: 2025, price: 20700000, mileage: 400, location: "Monaragala", source: "ikman", priceEvaluation: "overpriced" },
  { model: "Honda Vezel", baseModel: "Honda Vezel", year: 2024, price: 17800000, mileage: 250, location: "Gampaha", source: "ikman", priceEvaluation: "good_deal" },
  { model: "Honda Vezel Z Play Moonroof", baseModel: "Honda Vezel", year: 2024, price: 19450000, mileage: 6000, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  
  // Toyota Axio from Riyasewana
  { model: "Toyota Axio Brand New", baseModel: "Toyota Axio", year: 2025, price: 15900000, mileage: 0, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Axio G Grade", baseModel: "Toyota Axio", year: 2015, price: 8200000, mileage: 92000, location: "Kurunegala", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Axio WXB Anniversary", baseModel: "Toyota Axio", year: 2016, price: 12500000, mileage: 180000, location: "Colombo", source: "riyasewana", priceEvaluation: "overpriced" },
  { model: "Toyota Axio G Grade Hybrid", baseModel: "Toyota Axio", year: 2013, price: 9400000, mileage: 119000, location: "Colombo", source: "riyasewana", priceEvaluation: "fair_price" },
  { model: "Toyota Axio", baseModel: "Toyota Axio", year: 2017, price: 13250000, mileage: 70000, location: "Gampaha", source: "riyasewana", priceEvaluation: "fair_price" },
  
  // Toyota Axio from Ikman
  { model: "Toyota Axio X Grade", baseModel: "Toyota Axio", year: 2008, price: 7800000, mileage: 152000, location: "Kandy", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio Premium G Grade", baseModel: "Toyota Axio", year: 2016, price: 11750000, mileage: 149850, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio", baseModel: "Toyota Axio", year: 2007, price: 6825000, mileage: 214000, location: "Matale", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio G Grade", baseModel: "Toyota Axio", year: 2014, price: 9200000, mileage: 117000, location: "Gampaha", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio X Grade", baseModel: "Toyota Axio", year: 2015, price: 9300000, mileage: 155000, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio NONE HYBRID", baseModel: "Toyota Axio", year: 2013, price: 8650000, mileage: 89000, location: "Colombo", source: "ikman", priceEvaluation: "good_deal" },
  { model: "Toyota Axio G Grade", baseModel: "Toyota Axio", year: 2016, price: 10525000, mileage: 140000, location: "Galle", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio WXB", baseModel: "Toyota Axio", year: 2017, price: 11550000, mileage: 121000, location: "Colombo", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio", baseModel: "Toyota Axio", year: 2018, price: 13500000, mileage: 54000, location: "Jaffna", source: "ikman", priceEvaluation: "fair_price" },
  { model: "Toyota Axio Hybrid", baseModel: "Toyota Axio", year: 2014, price: 8350000, mileage: 147000, location: "Kegalle", source: "ikman", priceEvaluation: "good_deal" }
];

const marketPricesData = [
  { baseModel: "Toyota Vitz", year: 2015, averagePrice: 5100000, medianPrice: 4950000, minPrice: 4500000, maxPrice: 5500000, sampleSize: 8 },
  { baseModel: "Toyota Vitz", year: 2016, averagePrice: 5350000, medianPrice: 5350000, minPrice: 5000000, maxPrice: 5700000, sampleSize: 12 },
  { baseModel: "Toyota Vitz", year: 2017, averagePrice: 5850000, medianPrice: 5750000, minPrice: 5400000, maxPrice: 6300000, sampleSize: 15 },
  { baseModel: "Toyota Vitz", year: 2018, averagePrice: 6250000, medianPrice: 6200000, minPrice: 5800000, maxPrice: 6700000, sampleSize: 18 },
  { baseModel: "Toyota Vitz", year: 2019, averagePrice: 6800000, medianPrice: 6750000, minPrice: 6400000, maxPrice: 7200000, sampleSize: 10 },
  { baseModel: "Toyota Vitz", year: 2020, averagePrice: 7350000, medianPrice: 7300000, minPrice: 6900000, maxPrice: 7800000, sampleSize: 8 },
  { baseModel: "Suzuki Wagon R", year: 2014, averagePrice: 5600000, medianPrice: 5500000, minPrice: 5000000, maxPrice: 6200000, sampleSize: 6 },
  { baseModel: "Suzuki Wagon R", year: 2016, averagePrice: 5800000, medianPrice: 5690000, minPrice: 5400000, maxPrice: 6200000, sampleSize: 8 },
  { baseModel: "Suzuki Wagon R", year: 2017, averagePrice: 6750000, medianPrice: 6850000, minPrice: 6200000, maxPrice: 7200000, sampleSize: 10 },
  { baseModel: "Suzuki Wagon R", year: 2018, averagePrice: 7100000, medianPrice: 7060000, minPrice: 6600000, maxPrice: 7600000, sampleSize: 8 },
  { baseModel: "Suzuki Wagon R", year: 2023, averagePrice: 7500000, medianPrice: 7400000, minPrice: 7000000, maxPrice: 8400000, sampleSize: 15 },
  { baseModel: "Suzuki Wagon R", year: 2025, averagePrice: 8500000, medianPrice: 8600000, minPrice: 7375000, maxPrice: 9290000, sampleSize: 6 },
  { baseModel: "Honda Vezel", year: 2018, averagePrice: 13650000, medianPrice: 13500000, minPrice: 12500000, maxPrice: 14800000, sampleSize: 10 },
  { baseModel: "Honda Vezel", year: 2023, averagePrice: 17000000, medianPrice: 16990000, minPrice: 15500000, maxPrice: 18500000, sampleSize: 8 },
  { baseModel: "Honda Vezel", year: 2024, averagePrice: 18700000, medianPrice: 18500000, minPrice: 17500000, maxPrice: 20000000, sampleSize: 12 },
  { baseModel: "Honda Vezel", year: 2025, averagePrice: 19500000, medianPrice: 19400000, minPrice: 18000000, maxPrice: 21500000, sampleSize: 20 },
  { baseModel: "Toyota Axio", year: 2007, averagePrice: 6900000, medianPrice: 6825000, minPrice: 6200000, maxPrice: 7600000, sampleSize: 5 },
  { baseModel: "Toyota Axio", year: 2008, averagePrice: 7800000, medianPrice: 7800000, minPrice: 7200000, maxPrice: 8400000, sampleSize: 6 },
  { baseModel: "Toyota Axio", year: 2013, averagePrice: 8800000, medianPrice: 8650000, minPrice: 8200000, maxPrice: 9500000, sampleSize: 8 },
  { baseModel: "Toyota Axio", year: 2014, averagePrice: 8900000, medianPrice: 8800000, minPrice: 8200000, maxPrice: 9600000, sampleSize: 12 },
  { baseModel: "Toyota Axio", year: 2015, averagePrice: 8800000, medianPrice: 8500000, minPrice: 8000000, maxPrice: 9800000, sampleSize: 10 },
  { baseModel: "Toyota Axio", year: 2016, averagePrice: 11500000, medianPrice: 11200000, minPrice: 10200000, maxPrice: 12800000, sampleSize: 8 },
  { baseModel: "Toyota Axio", year: 2017, averagePrice: 12400000, medianPrice: 12200000, minPrice: 11200000, maxPrice: 13600000, sampleSize: 6 },
  { baseModel: "Toyota Axio", year: 2018, averagePrice: 13500000, medianPrice: 13500000, minPrice: 12500000, maxPrice: 14500000, sampleSize: 4 },
  { baseModel: "Toyota Axio", year: 2025, averagePrice: 15900000, medianPrice: 15900000, minPrice: 15500000, maxPrice: 16300000, sampleSize: 3 }
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  console.log('Seeding vehicle models...');
  for (const model of vehicleModelsData) {
    await connection.execute(
      `INSERT INTO vehicle_models (baseModel, alsoKnownAs, reliabilityScore, commonProblems, fuelEfficiency, safetyRating, maintenanceTips, yearsToAvoid, bestYears, recallInfo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       alsoKnownAs = VALUES(alsoKnownAs),
       reliabilityScore = VALUES(reliabilityScore),
       commonProblems = VALUES(commonProblems),
       fuelEfficiency = VALUES(fuelEfficiency),
       safetyRating = VALUES(safetyRating),
       maintenanceTips = VALUES(maintenanceTips),
       yearsToAvoid = VALUES(yearsToAvoid),
       bestYears = VALUES(bestYears),
       recallInfo = VALUES(recallInfo)`,
      [
        model.baseModel,
        model.alsoKnownAs,
        model.reliabilityScore,
        JSON.stringify(model.commonProblems),
        JSON.stringify(model.fuelEfficiency),
        JSON.stringify(model.safetyRating),
        JSON.stringify(model.maintenanceTips),
        JSON.stringify(model.yearsToAvoid),
        JSON.stringify(model.bestYears),
        model.recallInfo || null
      ]
    );
  }
  console.log(`Seeded ${vehicleModelsData.length} vehicle models`);
  
  console.log('Seeding vehicle listings...');
  for (const listing of vehicleListingsData) {
    await connection.execute(
      `INSERT INTO vehicle_listings (model, baseModel, year, price, mileage, location, source, priceEvaluation) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listing.model,
        listing.baseModel,
        listing.year,
        listing.price,
        listing.mileage,
        listing.location,
        listing.source,
        listing.priceEvaluation
      ]
    );
  }
  console.log(`Seeded ${vehicleListingsData.length} vehicle listings`);
  
  console.log('Seeding market prices...');
  for (const price of marketPricesData) {
    await connection.execute(
      `INSERT INTO market_prices (baseModel, year, averagePrice, medianPrice, minPrice, maxPrice, sampleSize) 
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       averagePrice = VALUES(averagePrice),
       medianPrice = VALUES(medianPrice),
       minPrice = VALUES(minPrice),
       maxPrice = VALUES(maxPrice),
       sampleSize = VALUES(sampleSize)`,
      [
        price.baseModel,
        price.year,
        price.averagePrice,
        price.medianPrice,
        price.minPrice,
        price.maxPrice,
        price.sampleSize
      ]
    );
  }
  console.log(`Seeded ${marketPricesData.length} market prices`);
  
  await connection.end();
  console.log('Seeding complete!');
}

seed().catch(console.error);
