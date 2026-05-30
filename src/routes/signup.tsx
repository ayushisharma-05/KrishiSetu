import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Eye, EyeOff } from "lucide-react";

import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { STATES, STATES_DISTRICTS } from "@/data/districts";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: SignupPage });

const SOILS = ["Sandy", "Loamy", "Clay", "Black Cotton", "Red Laterite"];

function SignupPage() {
  const { t } = useLang();
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirm: "",
    state: "", district: "", landSize: "1", soil: "Loamy", whatsapp: true,
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const update = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (form.password !== form.confirm) { setErr("Passwords do not match"); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { setErr("Enter a valid 10-digit Indian phone"); return; }
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
          email: form.email || undefined,
          full_name: form.name,
          state: form.state,
          district: form.district
        })
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (!res.ok) {
        setErr(data.message || "Signup failed");
        return;
      }
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      signIn(data);
      toast.success("Account created successfully!");
      nav({ to: "/home" });
    } catch (error) {
      setLoading(false);
      setErr("Failed to connect to server");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/home" className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t("back") || "Back"}
        </Link>
        <LanguageSwitcher compact />
      </div>
      <div className="flex-1 grid place-items-center px-4 pb-12">
        <div className="w-full max-w-[480px] ks-card">
          <h1 className="text-[20px] font-medium mb-1">{t("signup")}</h1>
          <p className="text-[13px] text-muted-foreground mb-4">{t("tagline")}</p>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label={t("farmer_name")}>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("phone")}>
                <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="98XXXXXXXX" className={inputCls} />
              </Field>
              <Field label={t("email") + " (optional)"}>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("password")}>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} required value={form.password} onChange={(e) => update("password", e.target.value)} className={inputCls + " pr-10"} minLength={6} />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground h-7 w-7 grid place-items-center">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm">
                <input type={showPwd ? "text" : "password"} required value={form.confirm} onChange={(e) => update("confirm", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="State">
                <select required value={form.state} onChange={(e) => { update("state", e.target.value); update("district", ""); }} className={inputCls}>
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="District">
                <select required value={form.district} onChange={(e) => update("district", e.target.value)} className={inputCls} disabled={!form.state}>
                  <option value="">Select district</option>
                  {(STATES_DISTRICTS[form.state] ?? []).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Land Size (acres)">
                <input type="number" min="0.1" step="0.1" required value={form.landSize} onChange={(e) => update("landSize", e.target.value)} className={inputCls} />
              </Field>
              <Field label={t("input_soil_type")}>
                <select value={form.soil} onChange={(e) => update("soil", e.target.value)} className={inputCls}>
                  {SOILS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <input type="checkbox" checked={form.whatsapp} onChange={(e) => update("whatsapp", e.target.checked)} />
              Receive alerts on WhatsApp?
            </label>
            <Button type="submit" fullWidth loading={loading}>Create Account</Button>
            {err && <p className="text-[12px] text-danger-fg">{err}</p>}
            <p className="text-center text-[13px] text-muted-foreground">
              Already have account? <Link to="/login" className="text-primary font-medium">{t("login")}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-[12px] text-muted-foreground mb-1">{label}</span>{children}</label>);
}
