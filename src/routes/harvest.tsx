import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { KsBadge } from "@/components/KsBadge";
import { MetricCard } from "@/components/MetricCard";
import { CROPS } from "@/data/crops";
import { Check } from "lucide-react";

export const Route = createFileRoute("/harvest")({ component: HarvestPage });

const inputCls = "w-full h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function HarvestPage() {
  const { user } = useAuth();

  const [cropId, setCropId] = useState("wheat");
  const [sowing, setSowing] = useState(() => { const d=new Date(); d.setDate(d.getDate()-75); return d.toISOString().slice(0,10); });
  const [show, setShow] = useState(true);
  const crop = CROPS.find((c) => c.id === cropId)!;

  const sowDate = new Date(sowing);
  const today = new Date();
  const daysIn = Math.max(0, Math.round((today.getTime() - sowDate.getTime()) / 86400000));
  const harvestDate = new Date(sowDate); harvestDate.setDate(sowDate.getDate() + crop.durationDays);
  const daysLeft = Math.max(0, Math.round((harvestDate.getTime() - today.getTime()) / 86400000));
  const windowStart = new Date(harvestDate); windowStart.setDate(harvestDate.getDate() - 3);
  const windowEnd = new Date(harvestDate); windowEnd.setDate(harvestDate.getDate() + 3);

  const currentStageIdx = crop.stages.findIndex((s) => daysIn >= s.startDay && daysIn < s.endDay);
  const activeIdx = currentStageIdx === -1 ? crop.stages.length - 1 : currentStageIdx;
  const stage = crop.stages[activeIdx];
  const stageProgress = stage ? Math.round(((daysIn - stage.startDay) / (stage.endDay - stage.startDay)) * 100) : 100;

  const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  if (!user) return <Navigate to="/login" />;

  return (
    <AppShell>
      <PageHeader title="Harvest Timing Predictor" subtitle="Know exactly when to harvest — plan ahead" />
      <KsBadge tone="green" className="mb-4">✨ Powered by crop growth science + live weather</KsBadge>

      <section className="ks-card mb-5">
        <div className="grid md:grid-cols-4 gap-3">
          <Field label="Crop">
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} className={inputCls}>
              {CROPS.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </Field>
          <Field label="Sowing Date">
            <input type="date" value={sowing} onChange={(e) => setSowing(e.target.value)} max={new Date().toISOString().slice(0,10)} className={inputCls} />
          </Field>
          <Field label="District"><input className={inputCls} defaultValue="Vidisha" /></Field>
          <div className="self-end"><Button fullWidth onClick={() => setShow(true)}>Predict Harvest Date</Button></div>
        </div>
      </section>

      {show && (<>
        <section className="ks-card border-l-4 border-l-primary mb-5">
          <div className="grid md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2">
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Predicted Harvest Date</div>
              <div className="text-[24px] font-medium text-primary mt-1">{fmt(harvestDate)}</div>
              <div className="text-[12px] text-muted-foreground mt-1">Window: {fmt(windowStart)} – {fmt(windowEnd)}</div>
            </div>
            <MetricCard label="Days Remaining" value={daysLeft} sub="from today" tone="green" />
            <MetricCard label="Confidence" value="87%" sub="★★★★☆" />
            <MetricCard label="Crop Duration" value={`${crop.durationDays} d`} sub={`Day ${daysIn} today`} />
          </div>
        </section>

        <section className="ks-card mb-5">
          <h2 className="text-[15px] font-medium mb-4">Where is your crop now?</h2>
          <div className="flex md:items-center gap-2 overflow-x-auto md:overflow-visible flex-col md:flex-row">
            {crop.stages.map((s, i) => {
              const done = i < activeIdx;
              const active = i === activeIdx;
              return (
                <div key={s.name} className="flex md:flex-col items-center md:flex-1 gap-2">
                  <div className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${done?"bg-primary text-primary-foreground":active?"bg-primary-light border-2 border-primary text-primary ks-pulse-green":"bg-muted text-muted-foreground"}`}>
                    {done ? <Check size={14} /> : <span className="text-[11px] font-medium">{i+1}</span>}
                  </div>
                  <div className="md:text-center">
                    <div className={`text-[12px] ${active?"font-medium":""}`}>{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">Day {s.startDay}–{s.endDay}</div>
                  </div>
                  {i < crop.stages.length - 1 && <div className={`hidden md:block flex-1 h-px ${done?"bg-primary":"bg-border"}`} />}
                </div>
              );
            })}
          </div>
          {stage && (
            <div className="mt-5 p-4 rounded-lg bg-primary-light">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[16px] font-medium text-primary-deep">{stage.name}</h3>
                <KsBadge tone="green">Current stage</KsBadge>
              </div>
              <p className="text-[13px] text-primary-deep/90">{stage.description}</p>
              <ul className="mt-2 text-[12px] text-primary-deep space-y-0.5">
                {stage.actions.map((a) => <li key={a}>• {a}</li>)}
              </ul>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-primary-deep mb-1"><span>Stage progress</span><span>{stageProgress}%</span></div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, stageProgress))}%` }} /></div>
              </div>
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-2 gap-3 mb-5">
          <MetricCard label="Rain risk in window" value="Medium" sub="68% rain Mar 14-16" tone="amber" />
          <MetricCard label="Temperature stress" value="Optimal" sub="28–32°C ideal" tone="green" />
          <MetricCard label="Wind for harvest" value="Low" sub="8 km/h" tone="green" />
          <MetricCard label="Humidity (drying)" value="62%" sub="Allow 3 days drying" tone="amber" />
        </section>

        <div className="flex flex-wrap gap-2">
          <Button>Add Harvest Reminder</Button>
          <Button variant="secondary">Add to My Crops</Button>
          <Button variant="info">Download PDF</Button>
        </div>
      </>)}
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-[12px] text-muted-foreground mb-1">{label}</span>{children}</label>);
}
