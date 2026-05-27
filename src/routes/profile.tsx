import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { KsBadge } from "@/components/KsBadge";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { t } = useLang();
  const nav = useNavigate();
  const meta = (user?.user_metadata ?? {}) as Record<string, string>;
  const name = meta.full_name ?? user?.email ?? "Farmer";
  const initials = name.slice(0, 1).toUpperCase();

  if (!user) {
    return (
      <AppShell>
        <PageHeader title="Profile" />
        <div className="ks-card text-center">
          <p className="text-[14px] mb-3">Please log in to view your profile.</p>
          <Button onClick={() => nav({ to: "/login" })}>{t("login")}</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title={t("nav_profile")} />
      <div className="space-y-4">
        <div className="ks-card flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground grid place-items-center text-[24px] font-medium">{initials}</div>
          <div>
            <h2 className="text-[18px] font-medium">{name}</h2>
            <p className="text-[12px] text-muted-foreground">{meta.district ?? "—"}, {meta.state ?? "—"}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="ks-card">
          <h3 className="text-[14px] font-medium mb-3">Farm Details</h3>
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <Row label="Land size" value={`${meta.land_size ?? "—"} acres`} />
            <Row label="Soil type" value={meta.soil_type ?? "—"} />
            <Row label="Phone" value={meta.phone ?? "—"} />
            <Row label="WhatsApp alerts" value={meta.whatsapp_opt_in ? "On" : "Off"} />
          </div>
        </div>

        <div className="ks-card">
          <h3 className="text-[14px] font-medium mb-3">Language & Accessibility</h3>
          <LanguageSwitcher />
        </div>

        <div className="ks-card">
          <h3 className="text-[14px] font-medium mb-3">Alert Preferences</h3>
          <div className="flex flex-wrap gap-2">
            <KsBadge tone="green">Pest warnings</KsBadge>
            <KsBadge tone="green">Mandi prices</KsBadge>
            <KsBadge tone="green">Irrigation reminders</KsBadge>
            <KsBadge tone="green">Harvest countdowns</KsBadge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={async () => { await signOut(); nav({ to: "/login" }); }}>{t("logout")}</Button>
          <Button variant="danger">Delete Account</Button>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div><div className="text-[11px] text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>);
}
