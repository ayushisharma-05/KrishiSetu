import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, Home, Sprout, CalendarClock, Bug, TrendingUp, Droplets, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/home", icon: Home, key: "nav_home" },
  { to: "/crop-planning", icon: Sprout, key: "nav_crop" },
  { to: "/harvest", icon: CalendarClock, key: "nav_harvest" },
  { to: "/pest-alert", icon: Bug, key: "nav_pest" },
  { to: "/market", icon: TrendingUp, key: "nav_market" },
  { to: "/water-planner", icon: Droplets, key: "nav_water" },
] as const;

export function Navbar() {
  const { t } = useLang();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const initials = (user?.email ?? "F").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-14 bg-card border-b border-border">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <Sprout size={16} />
          </div>
          <span className="font-medium text-primary text-[15px]">{t("app_name")}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = loc.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`px-3 h-8 inline-flex items-center text-[13px] rounded-md ks-nav-link ${active ? "ks-nav-link-active" : ""}`}>
                {t(n.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button className="hidden md:inline-grid h-8 w-8 place-items-center rounded-md hover:bg-muted relative" aria-label="Notifications">
            <Bell size={16} />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          {user ? (
            <button onClick={() => nav({ to: "/profile" })} className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-[12px] font-medium">
              {initials}
            </button>
          ) : (
            <Link to="/login" className="hidden md:inline-flex items-center ks-login-btn">{t("login")}</Link>
          )}
          <button className="md:hidden h-8 w-8 grid place-items-center rounded-md hover:bg-muted" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card flex flex-col">
            <div className="h-14 px-4 flex items-center justify-between border-b">
              <span className="font-medium text-primary">{t("app_name")}</span>
              <button onClick={() => setOpen(false)} className="h-8 w-8 grid place-items-center"><X size={18} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 h-11 rounded-md hover:bg-muted text-[14px]">
                  <n.icon size={18} /> {t(n.key)}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 h-11 rounded-md hover:bg-muted text-[14px]">
                <User size={18} /> {t("nav_profile")}
              </Link>
            </nav>
            <div className="p-3 border-t space-y-2">
              <LanguageSwitcher />
              {user ? (
                <button onClick={() => { signOut(); setOpen(false); }} className="w-full h-10 rounded-md border border-border text-[13px]">{t("logout")}</button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="block w-full h-10 leading-10 text-center rounded-md bg-primary text-primary-foreground text-[13px]">{t("login")}</Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

export function BottomTabBar() {
  const { t } = useLang();
  const loc = useLocation();
  const tabs = [
    { to: "/home", icon: Home, key: "nav_home" },
    { to: "/crop-planning", icon: Sprout, key: "nav_crop" },
    { to: "/harvest", icon: CalendarClock, key: "nav_harvest" },
    { to: "/market", icon: TrendingUp, key: "nav_market" },
    { to: "/water-planner", icon: Droplets, key: "nav_water" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-card border-t border-border flex">
      {tabs.map((tab) => {
        const active = loc.pathname.startsWith(tab.to);
        return (
          <Link key={tab.to} to={tab.to} className="flex-1 flex flex-col items-center justify-center gap-0.5">
            <tab.icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
            <span className={`text-[10px] ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>{t(tab.key)}</span>
            {active && <span className="h-1 w-1 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}
