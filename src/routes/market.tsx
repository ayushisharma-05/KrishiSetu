import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { KsBadge } from "@/components/KsBadge";
import { MetricCard } from "@/components/MetricCard";
import { MANDI_DATA } from "@/data/mandi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/market")({ component: MarketPage });

const inputCls = "h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function MarketPage() {
  const { user } = useAuth();

  const crops = Array.from(new Set(MANDI_DATA.map((m) => m.crop)));
  const [crop, setCrop] = useState("Wheat");

  const series = MANDI_DATA.filter((m) => m.crop === crop);
  const main = series[0];
  const today = main.history[main.history.length - 1].price;
  const yesterday = main.history[main.history.length - 2].price;
  const forecast30 = main.forecast[main.forecast.length - 1].price;
  const change30Pct = Math.round(((forecast30 - today) / today) * 100);

  const chartData = useMemo(() => {
    const h = main.history.map((p) => ({ date: p.date.slice(5), historical: p.price, forecast: null as number | null }));
    const lastDate = main.history[main.history.length - 1].date.slice(5);
    const f = main.forecast.map((p) => ({ date: p.date.slice(5), historical: null as number | null, forecast: p.price }));
    return { combined: [...h, ...f], pivot: lastDate };
  }, [main]);

  if (!user) return <Navigate to="/login" />;

  return (
    <AppShell>
      <PageHeader title="Mandi Price Tracker" subtitle="Today's prices + 30-day AI forecast" />

      <div className="ks-card mb-5 flex flex-wrap gap-3 items-end">
        <Field label="Crop"><select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputCls + " w-44"}>{crops.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Range"><select className={inputCls + " w-32"}><option>30 days</option><option>90 days</option></select></Field>
        <Button>Search</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-5">
        <MetricCard label="Today's Price" value={`₹${today.toLocaleString("en-IN")}/q`} sub={`${today > yesterday ? "+":""}₹${(today-yesterday).toLocaleString("en-IN")} from yesterday`} tone={today>=yesterday?"green":"red"} />
        <MetricCard label="30-Day Forecast" value={`₹${forecast30.toLocaleString("en-IN")}/q`} sub={`${change30Pct>=0?"+":""}${change30Pct}% expected`} tone={change30Pct>=0?"green":"red"} />
        <MetricCard label="Forecast Confidence" value="83%" sub="High accuracy" tone="blue" />
      </div>

      <div className="ks-card mb-5">
        <div className="flex items-center justify-between mb-3"><h3 className="text-[14px] font-medium">Price Trend — {crop}</h3><div className="flex gap-3 text-[11px]"><span className="inline-flex items-center gap-1"><span className="h-2 w-3 bg-primary rounded-sm" />Historical</span><span className="inline-flex items-center gap-1"><span className="h-2 w-3 border border-primary border-dashed" />Forecast</span></div></div>
        <div className="h-[260px]">
          <ResponsiveContainer>
            <LineChart data={chartData.combined} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={5} />
              <YAxis tick={{ fontSize: 10 }} width={50} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <ReferenceLine x={chartData.pivot} stroke="var(--muted-foreground)" strokeDasharray="2 2" label={{ value: "Today", fontSize: 10, position: "top" }} />
              <Line type="monotone" dataKey="historical" stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="forecast" stroke="var(--primary)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Powered by Agmarknet data + Prophet model</p>
      </div>

      <div className="ks-card mb-5">
        <h3 className="text-[14px] font-medium mb-3">Nearby Mandis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] text-muted-foreground"><th className="py-2">Mandi</th><th>District</th><th>State</th><th className="text-right">Today</th></tr></thead>
            <tbody>{series.map((m, i) => { const p = m.history[m.history.length-1].price; const best = p === Math.max(...series.map(s=>s.history[s.history.length-1].price)); return (<tr key={i} className={`border-t border-border ${best?"border-l-2 border-l-primary":""}`}><td className="py-2">{m.mandi}</td><td>{m.district}</td><td>{m.state}</td><td className="text-right font-medium">₹{p.toLocaleString("en-IN")}</td></tr>); })}</tbody>
          </table>
        </div>
      </div>

      <div className="ks-card mb-5 bg-primary-light border-primary/40">
        <div className="flex items-center gap-2 mb-2"><KsBadge tone="green">HOLD</KsBadge><span className="text-[13px] font-medium text-primary-deep">Market Advisory</span></div>
        <p className="text-[13px] text-primary-deep">Price expected to rise {change30Pct}% in next 30 days. Best selling window opens around mid-month. Current price is well above MSP — warehouse storage recommended.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="info">Export to Excel</Button>
        <Button variant="secondary">Share Price Report</Button>
        <Button>Subscribe to Alerts</Button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-[11px] text-muted-foreground mb-1">{label}</span>{children}</label>);
}
