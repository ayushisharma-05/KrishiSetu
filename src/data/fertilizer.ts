export interface FertItem { name: string; quantity: number; unit: string; pricePerUnit: number; role: string }
export interface FertPlan {
  tier: "Budget" | "Recommended" | "Premium";
  combo: FertItem[];
  totalCost: number;
  yieldGainPct: number;
  schedule: { stage: string; fert: string; dose: string; when: string; how: string }[];
}

// Per-acre baseline plans
export const FERTILIZER_PLANS: Record<string, FertPlan[]> = {
  Wheat: [
    { tier: "Budget", combo: [
        { name: "Urea", quantity: 30, unit: "kg", pricePerUnit: 24, role: "Nitrogen" },
      ], totalCost: 720, yieldGainPct: 12, schedule: [
        { stage: "Sowing", fert: "Urea", dose: "10 kg", when: "At planting", how: "Broadcast" },
        { stage: "30 DAS", fert: "Urea", dose: "20 kg", when: "Top dress", how: "After irrigation" },
      ] },
    { tier: "Recommended", combo: [
        { name: "Urea", quantity: 45, unit: "kg", pricePerUnit: 24, role: "Nitrogen" },
        { name: "DAP", quantity: 20, unit: "kg", pricePerUnit: 58, role: "N + P" },
        { name: "MOP", quantity: 10, unit: "kg", pricePerUnit: 56, role: "Potassium" },
      ], totalCost: 2800, yieldGainPct: 22, schedule: [
        { stage: "Sowing", fert: "DAP + MOP", dose: "20 kg + 10 kg", when: "At planting", how: "Mix in soil" },
        { stage: "30 DAS", fert: "Urea", dose: "20 kg", when: "Top dress", how: "Broadcast after rain" },
        { stage: "60 DAS", fert: "Urea", dose: "25 kg", when: "Second split", how: "Irrigate after" },
      ] },
    { tier: "Premium", combo: [
        { name: "Urea", quantity: 50, unit: "kg", pricePerUnit: 24, role: "Nitrogen" },
        { name: "DAP", quantity: 25, unit: "kg", pricePerUnit: 58, role: "N + P" },
        { name: "MOP", quantity: 15, unit: "kg", pricePerUnit: 56, role: "Potassium" },
        { name: "Zinc Sulphate", quantity: 10, unit: "kg", pricePerUnit: 80, role: "Micronutrient" },
      ], totalCost: 4290, yieldGainPct: 28, schedule: [
        { stage: "Sowing", fert: "DAP + MOP + Zn", dose: "Full doses", when: "At planting", how: "Mix in soil" },
        { stage: "30 DAS", fert: "Urea", dose: "25 kg", when: "First split", how: "Broadcast" },
        { stage: "60 DAS", fert: "Urea", dose: "25 kg", when: "Second split", how: "Irrigate after" },
      ] },
  ],
  "Rice (Paddy)": [
    { tier: "Recommended", combo: [
        { name: "Urea", quantity: 50, unit: "kg", pricePerUnit: 24, role: "Nitrogen" },
        { name: "DAP", quantity: 25, unit: "kg", pricePerUnit: 58, role: "N + P" },
        { name: "MOP", quantity: 12, unit: "kg", pricePerUnit: 56, role: "Potassium" },
      ], totalCost: 3322, yieldGainPct: 24, schedule: [
        { stage: "Transplant", fert: "DAP + MOP", dose: "Full P+K", when: "Puddling", how: "Basal" },
        { stage: "Tillering", fert: "Urea", dose: "25 kg", when: "20 DAT", how: "Broadcast in standing water" },
        { stage: "Panicle Init.", fert: "Urea", dose: "25 kg", when: "45 DAT", how: "Broadcast" },
      ] },
  ],
};
