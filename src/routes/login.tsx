import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Eye, EyeOff } from "lucide-react";

import { useLang } from "@/i18n/LanguageContext";
import { Button } from "@/components/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { t } = useLang();
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password: pwd })
      });
      
      const data = await res.json();
      
      setLoading(false);
      if (!res.ok) {
        setErr(data.message || "Login failed");
        return;
      }
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      signIn(data);
      toast.success(t("success_saved") || "Logged in successfully!");
      nav({ to: "/home" });
    } catch (error) {
      setLoading(false);
      setErr("Failed to connect to server");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Link to="/home" className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t("back") || "Back"}
        </Link>
        <LanguageSwitcher compact />
      </div>
      <div className="flex-1 grid place-items-center px-4 pb-12">
        <div className="w-full max-w-[400px] ks-card">
          <div className="text-center mb-5">
            <div className="h-12 w-12 mx-auto rounded-xl bg-primary text-primary-foreground grid place-items-center mb-3">
              <Sprout size={22} />
            </div>
            <h1 className="text-[20px] font-medium">{t("app_name")}</h1>
            <p className="text-[13px] text-muted-foreground">{t("tagline")}</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label={t("phone") || "Phone Number"}>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX" className={inputCls} />
            </Field>
            <Field label={t("password")}>
              <div className="relative">
                <input type={show ? "text" : "password"} required value={pwd} onChange={(e) => setPwd(e.target.value)}
                  className={inputCls + " pr-10"} />
                <button type="button" onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground h-7 w-7 grid place-items-center">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Button type="submit" fullWidth loading={loading}>{t("login")}</Button>
            {err && <p className="text-[12px] text-danger-fg">{err}</p>}
            <div className="text-center text-[12px] text-muted-foreground">
              <button type="button" className="hover:text-primary">Forgot password?</button>
            </div>
          </form>
          <div className="flex items-center gap-3 my-5 text-[11px] text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-center text-[13px]">
            New farmer? <Link to="/signup" className="text-primary font-medium">{t("signup")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full h-10 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
