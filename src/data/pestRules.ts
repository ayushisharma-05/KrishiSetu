export interface PestEntry {
  pestName: string;
  hindi: string;
  riskLevel: "Low" | "Medium" | "High";
  symptoms: string[];
  spray: string;
  organic: string;
  timing: string;
  costPerAcre: string;
  description: string;
}

export const PEST_RULES: Record<string, PestEntry[]> = {
  Wheat: [
    { pestName: "Aphid", hindi: "माहू", riskLevel: "High",
      symptoms: ["Sticky residue", "Yellow leaves", "Stunted growth"],
      spray: "Imidacloprid 17.8% SL — 0.5 ml/litre",
      organic: "Neem oil 5 ml/litre — every 7 days",
      timing: "Early morning or evening; avoid flowering peak",
      costPerAcre: "₹80–120",
      description: "Tiny sap-sucking insects clustering on leaves and grains." },
    { pestName: "Rust", hindi: "रतुआ", riskLevel: "Medium",
      symptoms: ["Brown spots", "Orange pustules", "Leaf drying"],
      spray: "Propiconazole 25% EC — 1 ml/litre",
      organic: "Sulphur 80% WP — 2 g/litre",
      timing: "On first appearance of pustules",
      costPerAcre: "₹150–220",
      description: "Fungal disease that forms rusty patches on leaves." },
    { pestName: "Termite", hindi: "दीमक", riskLevel: "Low",
      symptoms: ["Wilting/drooping", "Hollow stems"],
      spray: "Chlorpyriphos 20% EC — 2.5 litres/acre",
      organic: "Beauveria bassiana drench",
      timing: "Pre-sowing soil treatment",
      costPerAcre: "₹250–350",
      description: "Soil-dwelling pest damaging roots and stems." },
  ],
  "Rice (Paddy)": [
    { pestName: "Stem Borer", hindi: "तना छेदक", riskLevel: "High",
      symptoms: ["Dead heart", "White ears", "Holes in stem"],
      spray: "Cartap Hydrochloride 4G — 10 kg/acre",
      organic: "Trichogramma egg cards (3 releases)",
      timing: "Vegetative + panicle initiation stage",
      costPerAcre: "₹250–400",
      description: "Larvae bore into stem causing dead heart symptoms." },
    { pestName: "Brown Plant Hopper", hindi: "भूरा फुदका", riskLevel: "Medium",
      symptoms: ["Hopper burn", "Yellowing patches"],
      spray: "Pymetrozine 50% WG — 60 g/acre",
      organic: "Neem seed kernel extract 5%",
      timing: "Tillering to flowering",
      costPerAcre: "₹300–450",
      description: "Sucks plant sap leading to drying patches in field." },
  ],
  Cotton: [
    { pestName: "Pink Bollworm", hindi: "गुलाबी सूंडी", riskLevel: "High",
      symptoms: ["Holes in bolls", "Damaged seeds"],
      spray: "Profenofos 50% EC — 2 ml/litre",
      organic: "Pheromone traps (8/acre) + NPV spray",
      timing: "Square + boll formation",
      costPerAcre: "₹350–500",
      description: "Major boll pest reducing lint quality and yield." },
  ],
  Tomato: [
    { pestName: "Fruit Borer", hindi: "फल छेदक", riskLevel: "High",
      symptoms: ["Holes in fruit", "Larva inside"],
      spray: "Chlorantraniliprole 18.5% SC — 0.3 ml/litre",
      organic: "Bt spray (Dipel) 1 g/litre",
      timing: "From first fruit set onward",
      costPerAcre: "₹400–550",
      description: "Larvae bore into fruits making them unmarketable." },
    { pestName: "Early Blight", hindi: "अगेती झुलसा", riskLevel: "Medium",
      symptoms: ["Brown spots", "Concentric rings on leaves"],
      spray: "Mancozeb 75% WP — 2 g/litre",
      organic: "Trichoderma viride 5 g/litre",
      timing: "On first symptoms",
      costPerAcre: "₹150–220",
      description: "Fungal disease causing leaf and fruit spots." },
  ],
  Soybean: [
    { pestName: "Girdle Beetle", hindi: "तना मक्खी", riskLevel: "Medium",
      symptoms: ["Stem girdling", "Wilting/drooping"],
      spray: "Thiamethoxam 25% WG — 100 g/acre",
      organic: "Neem oil 5 ml/litre",
      timing: "20-40 DAS",
      costPerAcre: "₹220–350",
      description: "Beetle that girdles stems causing breakage." },
  ],
};
