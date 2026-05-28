import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { KsBadge } from "@/components/KsBadge";
import { MetricCard } from "@/components/MetricCard";
import { CROPS } from "@/data/crops";
import { STATES, STATES_DISTRICTS } from "@/data/districts";

export const Route = createFileRoute("/crop-planning")({ component: CropPlanningPage });

const inputCls = "w-full h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function CropPlanningPage() {
  const { user } = useAuth();
  const [state, setState] = useState("Madhya Pradesh");
  const [district, setDistrict] = useState("Vidisha");
  const [season, setSeason] = useState<"Kharif" | "Rabi" | "Zaid">("Rabi");
  const [land, setLand] = useState("1");
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(CROPS[0].id);

  const ranked = CROPS.filter((c) => c.season === season || c.season === "Year-round").slice(0, 3)
    .map((c, i) => ({ ...c, confidence: [89, 76, 68][i] ?? 60, profit: [45000, 38000, 31000][i] ?? 25000, risk: (["Low","Medium","Low"][i] ?? "Medium") as "Low"|"Medium"|"High" }));

  const crop = ranked.find((c) => c.id === selected) ?? ranked[0];
  const [seedCost, setSeedCost] = useState(3500);
  const [fertCost, setFertCost] = useState(2800);
  const [labour, setLabour] = useState(4200);
  const invest = seedCost + fertCost + labour;
  const revenue = Math.round(crop.profit + invest);
  const roi = Math.round(((revenue - invest) / invest) * 100);

  if (!user) return <Navigate to="/login" />;

  return (
    <AppShell>
      <PageHeader title="Crop Planning" subtitle="AI-powered crop recommendations for your farm" />
      <div className="grid lg:grid-cols-2 gap-5">
        <section className="ks-card space-y-3">
          <h2 className="text-[15px] font-medium">Tell us about your farm</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="State"><select value={state} onChange={(e) => { setState(e.target.value); setDistrict(STATES_DISTRICTS[e.target.value][0]); }} className={inputCls}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="District"><select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>{STATES_DISTRICTS[state].map((d) => <option key={d}>{d}</option>)}</select></Field>
          </div>
          <Field label="Land Size (acres)"><input type="number" value={land} onChange={(e) => setLand(e.target.value)} className={inputCls} /></Field>
          <div>
            <span className="block text-[12px] text-muted-foreground mb-1.5">Season</span>
            <div className="grid grid-cols-3 gap-2">
              {(["Kharif","Rabi","Zaid"] as const).map((s) => (
                <button key={s} onClick={() => setSeason(s)} className={`p-3 rounded-md border text-center text-[13px] ${season===s?"border-primary bg-primary-light text-primary-deep":"border-border"}`}>
                  <div className="text-lg">{s==="Kharif"?"☀️":s==="Rabi"?"❄️":"🌸"}</div>
                  <div>{s}</div>
                </button>
              ))}
            </div>
          </div>
          <Field label="Soil Type"><select className={inputCls}><option>Loamy</option><option>Sandy</option><option>Clay</option><option>Black Cotton</option><option>Red Laterite</option></select></Field>
          <Button fullWidth onClick={() => setShowResults(true)}>Get Recommendations</Button>
          <div className="flex gap-1.5 pt-1">
            <KsBadge tone="neutral">ICAR Soil Atlas</KsBadge>
            <KsBadge tone="neutral">Kaggle Dataset</KsBadge>
          </div>
        </section>

        {showResults && (
          <section className="space-y-4">
            <h2 className="text-[15px] font-medium">Top 3 crops for {district}</h2>
            <div className="space-y-3">
              {ranked.map((r, i) => (
                <button key={r.id} onClick={() => setSelected(r.id)}
                  className={`w-full ks-card text-left ${selected===r.id?"border-2 border-primary":""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-md bg-muted grid place-items-center text-[12px] font-medium">#{i+1}</span>
                      <span className="text-2xl">{r.emoji}</span>
                      <div>
                        <div className="text-[15px] font-medium">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground">{r.hindi}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[18px] font-medium text-primary">{r.confidence}%</div>
                      <div className="text-[10px] text-muted-foreground">confidence</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-[12px]">
                    <div><div className="text-muted-foreground">Profit</div><div className="font-medium">₹{r.profit.toLocaleString("en-IN")}</div></div>
                    <div><div className="text-muted-foreground">Water</div><div className="font-medium">{r.waterNeed}</div></div>
                    <div><div className="text-muted-foreground">Risk</div><KsBadge tone={r.risk==="Low"?"green":r.risk==="Medium"?"amber":"red"}>{r.risk}</KsBadge></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="ks-card">
              <h3 className="text-[14px] font-medium mb-3">ROI Calculator — {crop.name}</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <Field label="Seed ₹"><input type="number" value={seedCost} onChange={(e) => setSeedCost(+e.target.value)} className={inputCls} /></Field>
                <Field label="Fertilizer ₹"><input type="number" value={fertCost} onChange={(e) => setFertCost(+e.target.value)} className={inputCls} /></Field>
                <Field label="Labour ₹"><input type="number" value={labour} onChange={(e) => setLabour(+e.target.value)} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <MetricCard label="Investment" value={`₹${invest.toLocaleString("en-IN")}`} tone="amber" />
                <MetricCard label="Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} tone="blue" />
                <MetricCard label="Net Profit" value={`₹${(revenue-invest).toLocaleString("en-IN")}`} tone="green" />
                <MetricCard label="ROI" value={`${roi}%`} tone="green" />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="info">Download PDF</Button>
                <Button size="sm" variant="secondary">Share on WhatsApp</Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-[12px] text-muted-foreground mb-1">{label}</span>{children}</label>);
}
