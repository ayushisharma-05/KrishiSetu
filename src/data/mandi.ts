// Deterministic mock mandi prices for last 30 days + 30-day forecast.
export interface PricePoint { date: string; price: number }
export interface MandiSeries {
  crop: string;
  mandi: string;
  district: string;
  state: string;
  unit: string;
  history: PricePoint[];
  forecast: PricePoint[];
}

function seedRand(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function buildSeries(crop: string, base: number, mandi: string, district: string, state: string, seed: number): MandiSeries {
  const rng = seedRand(seed);
  const today = new Date();
  const history: PricePoint[] = [];
  let p = base;
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    p = Math.max(base * 0.7, p + (rng() - 0.45) * base * 0.04);
    history.push({ date: d.toISOString().slice(0, 10), price: Math.round(p) });
  }
  const forecast: PricePoint[] = [];
  let f = p;
  const trend = (rng() - 0.3) * 0.008; // mostly upward
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i);
    f = f * (1 + trend + (rng() - 0.5) * 0.01);
    forecast.push({ date: d.toISOString().slice(0, 10), price: Math.round(f) });
  }
  return { crop, mandi, district, state, unit: "₹/quintal", history, forecast };
}

export const MANDI_DATA: MandiSeries[] = [
  buildSeries("Wheat", 2380, "Vidisha Mandi", "Vidisha", "Madhya Pradesh", 11),
  buildSeries("Wheat", 2450, "Karnal Mandi", "Karnal", "Haryana", 12),
  buildSeries("Wheat", 2410, "Ludhiana Mandi", "Ludhiana", "Punjab", 13),
  buildSeries("Rice (Paddy)", 2240, "Burdwan Mandi", "Burdwan", "West Bengal", 21),
  buildSeries("Rice (Paddy)", 2310, "Guntur Mandi", "Guntur", "Andhra Pradesh", 22),
  buildSeries("Soybean", 4750, "Indore Mandi", "Indore", "Madhya Pradesh", 31),
  buildSeries("Cotton", 7820, "Aurangabad Mandi", "Aurangabad", "Maharashtra", 41),
  buildSeries("Mustard", 5780, "Jaipur Mandi", "Jaipur", "Rajasthan", 51),
  buildSeries("Onion", 1680, "Nashik Mandi", "Nashik", "Maharashtra", 61),
  buildSeries("Tomato", 2240, "Kolar Mandi", "Bengaluru Rural", "Karnataka", 71),
];
