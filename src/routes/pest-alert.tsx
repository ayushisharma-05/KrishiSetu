import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { KsBadge } from "@/components/KsBadge";
import { MetricCard } from "@/components/MetricCard";
import { PEST_RULES } from "@/data/pestRules";
import { FERTILIZER_PLANS } from "@/data/fertilizer";

export const Route = createFileRoute("/pest-alert")({ component: PestPage });

const inputCls = "w-full h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function PestPage() {
  const { user } = useAuth();

  const [tab, setTab] = useState<"pest" | "fert">("pest");
  if (!user) return <Navigate to="/login" />;
  return (
    <AppShell>
      <PageHeader title="Pest & Fertilizer Advisor" subtitle="Risk check + budget-based fertilizer planning" />
      <div className="flex gap-1 border-b border-border mb-5">
        {[{id:"pest",l:"Pest Risk Check"},{id:"fert",l:"Budget Fertilizer Advisor"}].map((x) => (
          <button key={x.id} onClick={() => setTab(x.id as typeof tab)}
            className={`px-4 h-10 text-[13px] border-b-2 -mb-px ${tab===x.id?"border-primary text-primary font-medium":"border-transparent text-muted-foreground"}`}>{x.l}</button>
        ))}
      </div>
      {tab === "pest" ? <PestTab /> : <FertTab />}
    </AppShell>
  );
}

function PestTab() {
  const [crop, setCrop] = useState("Wheat");
  const [show, setShow] = useState(true);
  const pests = PEST_RULES[crop] ?? [];
  const overall = pests.some((p) => p.riskLevel === "High") ? "High" : pests.some((p) => p.riskLevel === "Medium") ? "Medium" : "Low";

  return (
    <>
      <section className="ks-card mb-5 grid md:grid-cols-4 gap-3">
        <Field label="Crop"><select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputCls}>{Object.keys(PEST_RULES).map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="District"><input className={inputCls} defaultValue="Vidisha" /></Field>
        <Field label="Growth Stage"><select className={inputCls}><option>Vegetative</option><option>Flowering</option><option>Grain Filling</option></select></Field>
        <div className="self-end"><Button fullWidth onClick={() => setShow(true)}>Check Pest Risk</Button></div>
      </section>
      {show && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[14px]">Overall risk for {crop}:</span>
            <KsBadge tone={overall==="High"?"red":overall==="Medium"?"amber":"green"}>{overall}</KsBadge>
          </div>
          <div className="space-y-3">
            {pests.map((p) => (
              <div key={p.pestName} className="ks-card">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div>
                    <div className="text-[15px] font-medium">{p.pestName} <span className="text-muted-foreground text-[12px]">({p.hindi})</span></div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                  <KsBadge tone={p.riskLevel==="High"?"red":p.riskLevel==="Medium"?"amber":"green"}>{p.riskLevel}</KsBadge>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-3 text-[12px]">
                  <div><div className="text-muted-foreground mb-1">Symptoms</div><ul>{p.symptoms.map(s => <li key={s}>• {s}</li>)}</ul></div>
                  <div>
                    <div className="text-muted-foreground">Spray</div><div className="font-medium">{p.spray}</div>
                    <div className="text-muted-foreground mt-2">Organic alt.</div><div>{p.organic}</div>
                    <div className="mt-2 text-muted-foreground">Cost {p.costPerAcre} · {p.timing}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <Button>Share Alert on WhatsApp</Button>
            <Button variant="info">Subscribe to Weekly Alerts</Button>
            <Button variant="danger">Call KVK 1800-180-1551</Button>
          </div>
        </>
      )}
    </>
  );
}

function FertTab() {
  const [budget, setBudget] = useState(3000);
  const [crop, setCrop] = useState("Wheat");
  const [land, setLand] = useState(1.2);
  const plans = FERTILIZER_PLANS[crop] ?? FERTILIZER_PLANS.Wheat;
  const recommended = plans.find((p) => p.tier === "Recommended") ?? plans[0];
  const cost = Math.round(recommended.totalCost * land);
  const revenue = Math.round(crop === "Wheat" ? 38000 * land : 32000 * land);
  const gain = Math.round(revenue * recommended.yieldGainPct / 100);
  const roi = Math.round((gain / cost) * 100);

  return (
    <>
      <div className="ks-card mb-5">
        <KsBadge tone="amber" className="mb-3">💡 Unique Feature — Tell us your budget</KsBadge>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="flex justify-between mb-1"><span className="text-[12px] text-muted-foreground">Total Budget</span><span className="text-[18px] font-medium text-primary">₹{budget.toLocaleString("en-IN")}</span></div>
            <input type="range" min={500} max={25000} step={100} value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full accent-primary" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>₹500</span><span>₹25,000</span></div>
          </div>
          <Field label="Crop"><select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputCls}>{Object.keys(FERTILIZER_PLANS).map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Land (acres)"><input type="number" value={land} onChange={(e) => setLand(+e.target.value)} step="0.1" className={inputCls} /></Field>
        </div>
      </div>

      <div className="ks-card border-2 border-primary mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-medium">Best Value Plan</h3>
          <KsBadge tone="green">Recommended</KsBadge>
        </div>
        <div className="space-y-2">
          {recommended.combo.map((f) => (
            <div key={f.name} className="flex justify-between text-[13px] py-1 border-b border-border last:border-0">
              <div><span className="font-medium">{f.name}</span> <span className="text-muted-foreground">({f.quantity}{f.unit} · {f.role})</span></div>
              <div>₹{(f.quantity * f.pricePerUnit).toLocaleString("en-IN")}</div>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-medium"><span>Total (per acre × {land})</span><span>₹{cost.toLocaleString("en-IN")}</span></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <MetricCard label="Yield gain" value={`+${recommended.yieldGainPct}%`} tone="green" />
          <MetricCard label="Extra income" value={`₹${gain.toLocaleString("en-IN")}`} tone="green" />
          <MetricCard label="ROI on fert." value={`${roi}%`} tone="green" />
          <MetricCard label="Payback" value="Same season" />
        </div>
      </div>

      <div className="ks-card">
        <h4 className="text-[13px] font-medium mb-2">Application Schedule</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="text-left text-muted-foreground"><th className="py-1.5 pr-3">Stage</th><th className="py-1.5 pr-3">Fertilizer</th><th className="py-1.5 pr-3">Dose</th><th className="py-1.5 pr-3">When</th><th className="py-1.5">How</th></tr></thead>
            <tbody>{recommended.schedule.map((r,i) => (<tr key={i} className="border-t border-border"><td className="py-1.5 pr-3">{r.stage}</td><td className="py-1.5 pr-3">{r.fert}</td><td className="py-1.5 pr-3">{r.dose}</td><td className="py-1.5 pr-3">{r.when}</td><td className="py-1.5">{r.how}</td></tr>))}</tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <Button>Save Plan</Button>
        <Button variant="secondary">Share on WhatsApp</Button>
        <Button variant="info">Download PDF</Button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-[12px] text-muted-foreground mb-1">{label}</span>{children}</label>);
}
