import { createFileRoute, Link } from "@tanstack/react-router";
import { Thermometer, CloudRain, Droplet, Wind, Mic, Settings, MapPin, Sprout, CalendarClock, Bug, TrendingUp, Droplets, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { KsBadge } from "@/components/KsBadge";
import { useLang } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { CROPS } from "@/data/crops";
import heroBanner from "@/assets/hero-banner.jpg";

export const Route = createFileRoute("/home")({ component: HomePage });

function WeatherStrip() {
  const { t } = useLang();
  return (
    <section className="ks-weather-section mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-medium">Live Weather</h2>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full" style={{ background: "#ecfdf5", color: "#059669" }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#059669" }} /> Live
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ks-weather-card ks-w-temp">
          <div className="ks-w-label"><Thermometer size={12} /> {t("temp_label") || "Temperature"}</div>
          <div className="ks-w-value">28°C</div>
          <div className="ks-w-sub">Feels like 30°C</div>
        </div>
        <div className="ks-weather-card ks-w-rain">
          <div className="ks-w-label"><CloudRain size={12} /> {t("rain_prob") || "Rain Probability"}</div>
          <div className="ks-w-value">42%</div>
          <div className="ks-w-sub">Next 24 hrs</div>
        </div>
        <div className="ks-weather-card ks-w-hum">
          <div className="ks-w-label"><Droplet size={12} /> {t("humidity") || "Humidity"}</div>
          <div className="ks-w-value">68%</div>
          <div className="ks-w-sub">Fungus risk</div>
        </div>
        <div className="ks-weather-card ks-w-wind">
          <div className="ks-w-label"><Wind size={12} /> {t("wind_speed") || "Wind Speed"}</div>
          <div className="ks-w-value">12<span className="text-[14px] font-medium"> km/h</span></div>
          <div className="ks-w-sub">NE</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <div key={d} className="ks-forecast-cell">
            <div className="text-[10px] text-muted-foreground">{d}</div>
            <div className="emj">{["☀️", "⛅", "🌧️", "⛅", "☀️", "☀️", "🌤️"][i]}</div>
            <div className="text-[10px]">{28 + i % 3}°/{18 + i % 2}°</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const { t } = useLang();
  const { user } = useAuth();
  
  const name = user ? ((user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? user.full_name ?? "Farmer") : "Farmer";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });

  const recs = CROPS.slice(0, 3).map((c, i) => ({
    ...c, confidence: [89, 76, 68][i], profit: [45000, 38000, 31000][i],
    risk: ["Low", "Medium", "Low"][i] as "Low" | "Medium" | "High", best: i === 0,
  }));

  const features = [
    { name: t("feature_crop_title") || "Crop Planning", desc: t("feature_crop_desc") || "AI-driven recommendations based on soil & climate.", img: "/images/crop-planning.jpg", to: "/crop-planning" },
    { name: t("feature_harvest_title") || "Harvest Tracking", desc: t("feature_harvest_desc") || "Predict optimal harvest windows.", img: "/images/harvest.jpg", to: "/harvest" },
    { name: t("feature_pest_title") || "Pest Alerts", desc: t("feature_pest_desc") || "Real-time risk warnings for your region.", img: "/images/pest-alert.jpg", to: "/pest-alert" },
    { name: t("feature_market_title") || "Market Prices", desc: t("feature_market_desc") || "Live Mandi rates and trend forecasting.", img: "/images/market.jpg", to: "/market" },
    { name: t("feature_water_title") || "Water Planner", desc: t("feature_water_desc") || "Smart irrigation schedules to save water.", img: "/images/water-planner.jpg", to: "/water-planner" }
  ];

  return (
    <AppShell>
      {/* Hero banner */}
      <section className="relative -mx-4 md:-mx-6 -mt-5 mb-5 h-[200px] md:h-[280px] overflow-hidden">
        <img src={heroBanner} alt="Indian wheat field at sunrise" width={1920} height={1080}
          className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-end pb-4 md:pb-6">
          <h1 className="text-white text-[22px] md:text-[28px] font-medium leading-tight drop-shadow">
            {t("welcome_msg")}, {name} 🌾
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-white/90 mt-2">
            <span className="inline-flex items-center gap-1"><MapPin size={12} /> Vidisha, MP</span>
            <span>·</span><KsBadge tone="green">Rabi Season</KsBadge>
            <span>·</span><span>{today}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 md:top-4 md:right-6 flex items-center gap-2">
          <button aria-label="Voice" className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-primary-dark shadow-lg">
            <Mic size={18} />
          </button>
          <Link to={user ? "/profile" : "/login"} aria-label="Settings" className="h-10 w-10 rounded-full bg-white/95 text-foreground grid place-items-center hover:bg-white shadow-lg">
            <Settings size={16} />
          </Link>
        </div>
      </section>

      <div className="mb-4">
        <div className="ks-alert-gradient">
          <span className="ks-live-dot" />
          <Bug size={16} className="shrink-0" style={{ color: "#92400e" }} />
          <span className="flex-1">Aphid risk rising in Vidisha — check wheat fields this week.</span>
        </div>
      </div>

      {/* Explore the 5 Cores - Marquee Image Cards */}
      <section className="mb-8 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[16px] font-medium">{t("explore_features") || "Explore Features"}</h2>
        </div>
        <div className="flex w-max animate-marquee gap-6 hover:cursor-pointer pb-2">
          {[...features, ...features].map((f, i) => (
            <Link to={user ? f.to : "/login"} key={i} className="group ks-card overflow-hidden block w-[280px] shrink-0 transition-transform hover:-translate-y-1">
              <div className="h-36 w-full relative overflow-hidden">
                <img src={f.img} alt={f.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-3 left-4 text-white font-semibold text-lg">{f.name}</h3>
              </div>
              <div className="p-3">
                <p className="text-[13px] text-muted-foreground line-clamp-2">{f.desc}</p>
                <div className="mt-2 flex items-center gap-1 text-primary text-[13px] font-medium">
                  {user ? (t("open") || "Open Feature") : (t("login_to_try") || "Login to try")} <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <WeatherStrip />

      {/* Quick metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to={user ? "/water-planner" : "/login"} className="ks-quick ks-quick-irrigation">
          <div className="ks-q-label"><Droplets size={14} className="ks-q-icon" /> {t("todays_irrigation")}</div>
          <div className="ks-q-value">2,400 L</div>
          <div className="ks-q-sub">Wheat · 1.2 acres</div>
        </Link>
        <Link to={user ? "/market" : "/login"} className="ks-quick ks-quick-mandi">
          <div className="ks-q-label"><TrendingUp size={14} className="ks-q-icon" /> {t("top_mandi_price")}</div>
          <div className="ks-q-value">₹2,450<span className="text-[12px] text-muted-foreground font-normal">/q</span></div>
          <div className="ks-q-sub">Wheat · Karnal Mandi</div>
        </Link>
        <Link to={user ? "/pest-alert" : "/login"} className="ks-quick ks-quick-pest-medium">
          <div className="ks-q-label"><Bug size={14} style={{ color: "#f59e0b" }} /> {t("pest_risk_level")}</div>
          <div className="ks-q-value">Medium</div>
          <div className="ks-q-sub">Aphid · Wheat</div>
        </Link>
      </div>

      {/* AI Crop Recommendations */}
      <section className="mb-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-[16px] font-medium">{t("recommended_crops")}</h2>
            <p className="text-[12px] text-muted-foreground">{t("based_on_soil") || "Based on your soil & location"}</p>
          </div>
          <Link to={user ? "/crop-planning" : "/login"} className="text-[12px] text-primary font-medium">{t("see_all") || "See all →"}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recs.map((r, idx) => {
            const cardClass = idx === 0 ? "ks-crop-wheat" : idx === 1 ? "ks-crop-rice" : "ks-crop-soy";
            const barColor = idx === 0 ? "#059669" : idx === 1 ? "#0ea5e9" : "#f59e0b";
            return (
              <div key={r.id} className={`ks-crop-card ${cardClass}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <div className="text-[15px] font-medium">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground">{r.hindi}</div>
                    </div>
                  </div>
                  {r.best && (
                    <span className="ks-badge" style={{ background: "#059669", color: "#fff" }}>Recommended ⭐</span>
                  )}
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1"><span>{t("confidence")}</span><span>{r.confidence}%</span></div>
                  <div className="h-2 bg-border rounded-full overflow-hidden"><div className="h-full" style={{ width: `${r.confidence}%`, background: barColor }} /></div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <KsBadge tone="green">₹{r.profit.toLocaleString("en-IN")}</KsBadge>
                  <KsBadge tone="blue">{r.waterNeed} water</KsBadge>
                  <KsBadge tone={r.risk === "Low" ? "green" : r.risk === "Medium" ? "amber" : "red"}>{r.risk} risk</KsBadge>
                </div>
                <Link
                  to={user ? "/crop-planning" : "/login"}
                  className="w-full h-9 rounded-md text-[13px] font-medium transition-colors flex items-center justify-center mt-3"
                  style={
                    idx === 0
                      ? { background: "#059669", color: "#fff" }
                      : { background: "transparent", color: barColor, border: `1px solid ${barColor}` }
                  }
                >
                  Select this crop
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
