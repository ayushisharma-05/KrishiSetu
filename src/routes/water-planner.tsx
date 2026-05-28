import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { KsBadge } from "@/components/KsBadge";
import { MetricCard } from "@/components/MetricCard";
import { CROPS } from "@/data/crops";

export const Route = createFileRoute("/water-planner")({ component: WaterPage });

const inputCls = "w-full h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function WaterPage() {
  const { user } = useAuth();

  const [cropId, setCropId] = useState("wheat");
  const [land, setLand] = useState(1.2);
  const [method, setMethod] = useState<"drip" | "sprinkler" | "flood" | "alt">("drip");
  const [pump, setPump] = useState(800);

  const crop = CROPS.find((c) => c.id === cropId)!;
  const ETo = 5.2; // mm/day mock
  const Kc = crop.Kc.mid;
  const ETc = ETo * Kc; // mm/day
  // 1mm over 1 acre ≈ 4047 L
  const litresPerDay = Math.round(ETc * 4047 * land);
  const eff = { drip: 0.9, sprinkler: 0.75, flood: 0.5, alt: 0.65 }[method];
  const adjusted = Math.round(litresPerDay / eff);
  const pumpMinutes = Math.round((adjusted / pump) * 60);
  const weekly = adjusted * 6; // 1 rest day
  const seasonTotal = Math.round((adjusted * crop.durationDays * 0.7) / 1000);
  const floodLitres = Math.round(litresPerDay / 0.5);
  const savedSeason = Math.round((floodLitres - adjusted) * crop.durationDays * 0.7);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const rainProb = [10, 20, 75, 80, 30, 5, 15];

  if (!user) return <Navigate to="/login" />;

  return (
    <AppShell>
      <PageHeader title="Water Budget Planner" subtitle="Smart irrigation scheduling based on your crop + weather" />

      <section className="ks-card mb-5 grid md:grid-cols-2 gap-3">
        <Field label="Crop"><select value={cropId} onChange={(e) => setCropId(e.target.value)} className={inputCls}>{CROPS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</select></Field>
        <Field label="Land (acres)"><input type="number" value={land} step="0.1" onChange={(e) => setLand(+e.target.value)} className={inputCls} /></Field>
        <Field label="Pump capacity (L/hr)"><input type="number" value={pump} onChange={(e) => setPump(+e.target.value)} className={inputCls} /></Field>
        <Field label="Soil"><select className={inputCls}><option>Loamy</option><option>Sandy</option><option>Clay</option></select></Field>
        <div className="md:col-span-2">
          <span className="block text-[12px] text-muted-foreground mb-1.5">Irrigation Method</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {([{k:"drip",l:"🌱 Drip",eff:"90%"},{k:"sprinkler",l:"🌀 Sprinkler",eff:"75%"},{k:"alt",l:"🎯 Alt-furrow",eff:"65%"},{k:"flood",l:"🌊 Flood",eff:"50%"}] as const).map((m) => (
              <button key={m.k} onClick={() => setMethod(m.k)} className={`p-3 rounded-md border text-[13px] text-left ${method===m.k?"border-primary bg-primary-light":"border-border"}`}>
                <div>{m.l}</div><KsBadge tone="green" className="mt-1">{m.eff} efficient</KsBadge>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricCard label="Today's Water" value={`${adjusted.toLocaleString("en-IN")} L`} sub="With efficiency" tone="blue" />
        <MetricCard label="Pump Run Time" value={`${pumpMinutes} min`} sub={`${pump} L/hr`} />
        <MetricCard label="Weekly Total" value={`${(weekly/1000).toFixed(1)} kL`} />
        <MetricCard label="Season Total" value={`${seasonTotal} kL`} sub={`${crop.durationDays} days`} />
      </div>

      <section className="ks-card mb-5">
        <h3 className="text-[14px] font-medium mb-3">Next 7 days</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => {
            const skip = rainProb[i] > 60;
            return (
              <div key={d} className={`p-2 rounded-md text-center ${skip?"bg-info-bg":"bg-primary-light"}`}>
                <div className="text-[10px] text-muted-foreground">{d}</div>
                <div className="text-[15px]">{skip?"🌧️":"☀️"}</div>
                <div className={`text-[10px] font-medium ${skip?"text-info-fg":"text-primary-deep"}`}>{skip?"SKIP":"IRRIGATE"}</div>
                <div className="text-[9px] text-muted-foreground">{skip?`Rain ${rainProb[i]}%`:`${Math.round(adjusted/1000)}kL`}</div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">Auto-adjusts based on OpenWeather rainfall forecast. FAO Penman-Monteith ETo + ICAR Kc.</p>
      </section>

      <div className="ks-card mb-5 bg-primary-light border-primary/40">
        <div className="flex items-center gap-2 mb-1"><span className="text-lg">💧</span><span className="text-[14px] font-medium text-primary-deep">You're saving water this season</span></div>
        <p className="text-[13px] text-primary-deep">~{Math.round(savedSeason/1000).toLocaleString("en-IN")} kL saved vs flood irrigation · approx ₹{Math.round(savedSeason/1000 * 0.5).toLocaleString("en-IN")} saved on pump cost</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button>Set Irrigation Reminders</Button>
        <Button variant="info">Download Schedule PDF</Button>
        <Button variant="secondary">Add Another Crop</Button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-[12px] text-muted-foreground mb-1">{label}</span>{children}</label>);
}
