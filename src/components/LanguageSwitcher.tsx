import { Languages } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { LANGUAGES, type LangCode } from "@/i18n/translations";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const current = LANGUAGES.find((l) => l.code === lang);
  return (
    <label className="relative inline-flex items-center gap-2">
      <Languages size={16} className="text-muted-foreground" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        aria-label="Language"
        className="appearance-none bg-transparent border border-border rounded-md pl-2 pr-7 h-8 text-[13px] font-medium cursor-pointer hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {compact ? l.native : `${l.native}`}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-muted-foreground text-[10px]">▾</span>
      <span className="sr-only">Current: {current?.english}</span>
    </label>
  );
}
