import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGES, translate, type LangCode } from "./translations";

interface LangCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("ks_lang")) as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    const meta = LANGUAGES.find((l) => l.code === lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = meta?.rtl ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("ks_lang", l);
  };

  const isRTL = !!LANGUAGES.find((l) => l.code === lang)?.rtl;

  return (
    <Ctx.Provider value={{ lang, setLang, t: (k) => translate(lang, k), isRTL }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be inside LanguageProvider");
  return c;
}
