export interface CropInfo {
  id: string;
  name: string;
  hindi: string;
  emoji: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Year-round";
  durationDays: number;
  waterNeed: "Low" | "Medium" | "High";
  msp?: number; // ₹ per quintal
  Kc: { initial: number; mid: number; late: number };
  stages: { name: string; startDay: number; endDay: number; description: string; actions: string[] }[];
}

export const CROPS: CropInfo[] = [
  { id: "wheat", name: "Wheat", hindi: "गेहूँ", emoji: "🌾", season: "Rabi", durationDays: 120, waterNeed: "Medium", msp: 2425,
    Kc: { initial: 0.7, mid: 1.15, late: 0.4 },
    stages: [
      { name: "Germination", startDay: 0, endDay: 10, description: "Seedling emerges; keep soil moist.", actions: ["Light irrigation", "Check for birds", "Monitor germination %"] },
      { name: "Tillering", startDay: 10, endDay: 40, description: "Side shoots form. Apply 1st N split.", actions: ["1st urea top-dressing", "Weed control", "Light irrigation"] },
      { name: "Jointing", startDay: 40, endDay: 65, description: "Stem elongation begins.", actions: ["2nd N split", "Watch for rust", "Adequate water"] },
      { name: "Heading", startDay: 65, endDay: 85, description: "Heads emerge from boot.", actions: ["Critical irrigation", "Aphid scouting", "Avoid stress"] },
      { name: "Grain Filling", startDay: 85, endDay: 110, description: "Grains develop; avoid moisture stress.", actions: ["Maintain irrigation", "Aphid spray if needed", "Monitor weather"] },
      { name: "Harvest", startDay: 110, endDay: 120, description: "Grains hard, golden. Cut at 20-25% moisture.", actions: ["Stop irrigation", "Arrange labour/machine", "Plan storage"] },
    ],
  },
  { id: "rice", name: "Rice (Paddy)", hindi: "धान", emoji: "🌾", season: "Kharif", durationDays: 130, waterNeed: "High", msp: 2300,
    Kc: { initial: 1.1, mid: 1.2, late: 0.9 },
    stages: [
      { name: "Nursery", startDay: 0, endDay: 25, description: "Seedlings raised in nursery.", actions: ["Daily watering", "Disease monitoring"] },
      { name: "Transplanting", startDay: 25, endDay: 35, description: "Transplant to puddled field.", actions: ["Maintain 2-3cm water", "Healthy seedling selection"] },
      { name: "Tillering", startDay: 35, endDay: 65, description: "Tillers multiply.", actions: ["Urea top dress", "Weed control"] },
      { name: "Panicle Initiation", startDay: 65, endDay: 90, description: "Panicle forms.", actions: ["2nd N split", "Maintain water"] },
      { name: "Flowering", startDay: 90, endDay: 110, description: "Flowering & grain set.", actions: ["Critical water", "Pest watch"] },
      { name: "Harvest", startDay: 110, endDay: 130, description: "Grains mature.", actions: ["Drain field", "Arrange harvesting"] },
    ],
  },
  { id: "soybean", name: "Soybean", hindi: "सोयाबीन", emoji: "🫘", season: "Kharif", durationDays: 95, waterNeed: "Medium", msp: 4892,
    Kc: { initial: 0.5, mid: 1.15, late: 0.5 },
    stages: [
      { name: "Germination", startDay: 0, endDay: 12, description: "Emergence", actions: ["Light irrigation"] },
      { name: "Vegetative", startDay: 12, endDay: 35, description: "Leaf growth", actions: ["Weed control"] },
      { name: "Flowering", startDay: 35, endDay: 55, description: "Pod set", actions: ["Critical water"] },
      { name: "Pod Filling", startDay: 55, endDay: 80, description: "Pods fill", actions: ["Pest scouting"] },
      { name: "Maturity", startDay: 80, endDay: 90, description: "Pods dry", actions: ["Stop irrigation"] },
      { name: "Harvest", startDay: 90, endDay: 95, description: "Cut & thresh", actions: ["Arrange harvest"] },
    ],
  },
  { id: "maize", name: "Maize", hindi: "मक्का", emoji: "🌽", season: "Kharif", durationDays: 100, waterNeed: "Medium", msp: 2225,
    Kc: { initial: 0.7, mid: 1.2, late: 0.6 },
    stages: [
      { name: "Germination", startDay: 0, endDay: 10, description: "Sprouting", actions: ["Moisture check"] },
      { name: "Vegetative", startDay: 10, endDay: 45, description: "Leaf & stem", actions: ["Urea top-dress"] },
      { name: "Tasseling", startDay: 45, endDay: 65, description: "Tassel emergence", actions: ["Critical irrigation"] },
      { name: "Silking", startDay: 65, endDay: 80, description: "Silk emergence", actions: ["Pollination support"] },
      { name: "Grain Filling", startDay: 80, endDay: 95, description: "Kernel fill", actions: ["Adequate water"] },
      { name: "Harvest", startDay: 95, endDay: 100, description: "Cobs mature", actions: ["Harvest cobs"] },
    ],
  },
  { id: "cotton", name: "Cotton", hindi: "कपास", emoji: "🌿", season: "Kharif", durationDays: 180, waterNeed: "Medium", msp: 7710,
    Kc: { initial: 0.4, mid: 1.15, late: 0.7 },
    stages: [
      { name: "Germination", startDay: 0, endDay: 15, description: "Emergence", actions: ["Light watering"] },
      { name: "Vegetative", startDay: 15, endDay: 60, description: "Plant growth", actions: ["Weeding", "N application"] },
      { name: "Square Formation", startDay: 60, endDay: 90, description: "Squares form", actions: ["Pink bollworm watch"] },
      { name: "Flowering", startDay: 90, endDay: 130, description: "Boll formation", actions: ["Critical water"] },
      { name: "Boll Development", startDay: 130, endDay: 165, description: "Bolls fill", actions: ["IPM"] },
      { name: "Harvest", startDay: 165, endDay: 180, description: "Picking begins", actions: ["Multiple picks"] },
    ],
  },
  { id: "mustard", name: "Mustard", hindi: "सरसों", emoji: "🌻", season: "Rabi", durationDays: 130, waterNeed: "Low", msp: 5950,
    Kc: { initial: 0.4, mid: 1.1, late: 0.35 },
    stages: [
      { name: "Germination", startDay: 0, endDay: 10, description: "Emergence", actions: ["Light irrigation"] },
      { name: "Rosette", startDay: 10, endDay: 35, description: "Leaf rosette", actions: ["Thinning"] },
      { name: "Flowering", startDay: 35, endDay: 70, description: "Yellow flowers", actions: ["Aphid watch"] },
      { name: "Pod Formation", startDay: 70, endDay: 100, description: "Siliquae form", actions: ["Critical water"] },
      { name: "Maturity", startDay: 100, endDay: 125, description: "Pods turn yellow", actions: ["Stop irrigation"] },
      { name: "Harvest", startDay: 125, endDay: 130, description: "Cut & dry", actions: ["Threshing"] },
    ],
  },
  { id: "chana", name: "Gram (Chana)", hindi: "चना", emoji: "🟤", season: "Rabi", durationDays: 110, waterNeed: "Low", msp: 5650,
    Kc: { initial: 0.4, mid: 1.0, late: 0.35 },
    stages: [
      { name: "Germination", startDay: 0, endDay: 12, description: "Emergence", actions: ["Light watering"] },
      { name: "Vegetative", startDay: 12, endDay: 40, description: "Branching", actions: ["Weed control"] },
      { name: "Flowering", startDay: 40, endDay: 65, description: "Flowers appear", actions: ["Pest scouting"] },
      { name: "Pod Filling", startDay: 65, endDay: 95, description: "Pods develop", actions: ["Pod borer watch"] },
      { name: "Maturity", startDay: 95, endDay: 110, description: "Pods dry", actions: ["Harvest prep"] },
      { name: "Harvest", startDay: 105, endDay: 110, description: "Cut crop", actions: ["Threshing"] },
    ],
  },
  { id: "tomato", name: "Tomato", hindi: "टमाटर", emoji: "🍅", season: "Year-round", durationDays: 110, waterNeed: "High",
    Kc: { initial: 0.6, mid: 1.15, late: 0.8 },
    stages: [
      { name: "Nursery", startDay: 0, endDay: 25, description: "Seedling raising", actions: ["Damping-off watch"] },
      { name: "Transplanting", startDay: 25, endDay: 35, description: "Plant out", actions: ["Stake young plants"] },
      { name: "Vegetative", startDay: 35, endDay: 55, description: "Growth", actions: ["Mulching"] },
      { name: "Flowering", startDay: 55, endDay: 75, description: "Bloom", actions: ["Pollinator-safe sprays"] },
      { name: "Fruiting", startDay: 75, endDay: 100, description: "Fruit set", actions: ["Calcium spray", "Fruit borer watch"] },
      { name: "Harvest", startDay: 80, endDay: 110, description: "Pick ripe", actions: ["Multiple pickings"] },
    ],
  },
  { id: "onion", name: "Onion", hindi: "प्याज़", emoji: "🧅", season: "Rabi", durationDays: 140, waterNeed: "Medium",
    Kc: { initial: 0.7, mid: 1.05, late: 0.75 },
    stages: [
      { name: "Nursery", startDay: 0, endDay: 45, description: "Raise seedlings", actions: ["Light irrigation"] },
      { name: "Transplanting", startDay: 45, endDay: 60, description: "Field planting", actions: ["Spacing 10cm"] },
      { name: "Vegetative", startDay: 60, endDay: 90, description: "Leaf growth", actions: ["Weed control"] },
      { name: "Bulb Initiation", startDay: 90, endDay: 115, description: "Bulb forms", actions: ["Reduce N"] },
      { name: "Bulb Development", startDay: 115, endDay: 135, description: "Bulb sizing", actions: ["Maintain water"] },
      { name: "Harvest", startDay: 135, endDay: 140, description: "Tops fall over", actions: ["Cure bulbs"] },
    ],
  },
  { id: "potato", name: "Potato", hindi: "आलू", emoji: "🥔", season: "Rabi", durationDays: 100, waterNeed: "Medium",
    Kc: { initial: 0.5, mid: 1.15, late: 0.75 },
    stages: [
      { name: "Sprouting", startDay: 0, endDay: 15, description: "Sprout emergence", actions: ["Soil moisture"] },
      { name: "Vegetative", startDay: 15, endDay: 35, description: "Foliage growth", actions: ["Earthing-up"] },
      { name: "Tuber Initiation", startDay: 35, endDay: 55, description: "Tubers form", actions: ["Critical water"] },
      { name: "Tuber Bulking", startDay: 55, endDay: 85, description: "Tubers grow", actions: ["Late blight watch"] },
      { name: "Maturity", startDay: 85, endDay: 95, description: "Foliage yellows", actions: ["Stop irrigation"] },
      { name: "Harvest", startDay: 95, endDay: 100, description: "Dig tubers", actions: ["Sun-cure 2-3 days"] },
    ],
  },
];

export const CROP_NAMES = CROPS.map((c) => ({ id: c.id, name: c.name, hindi: c.hindi, emoji: c.emoji }));
