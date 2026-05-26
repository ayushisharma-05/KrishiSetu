import { useCallback, useEffect, useRef, useState } from "react";

// Web Speech API typings (loose — vendor-prefixed in Safari/Chrome).
type SpeechRecognitionResult = { transcript: string; isFinal: boolean };
interface SR {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<SpeechRecognitionResult>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
}

const LANG_MAP: Record<string, string> = {
  en: "en-IN", hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN",
  mr: "mr-IN", gu: "gu-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN", ur: "ur-IN",
};

export function useVoiceInput(lang: string = "en") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const ref = useRef<SR | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    setSupported(true);
    const r = new Ctor();
    r.continuous = false;
    r.interimResults = true;
    r.lang = LANG_MAP[lang] ?? "en-IN";
    r.onresult = (e) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      setTranscript(txt);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    ref.current = r;
    return () => { try { r.abort(); } catch { /* noop */ } };
  }, [lang]);

  const start = useCallback(() => {
    if (!ref.current) return;
    setTranscript("");
    try { ref.current.start(); setListening(true); } catch { /* already running */ }
  }, []);
  const stop = useCallback(() => { try { ref.current?.stop(); } catch { /* noop */ } setListening(false); }, []);

  return { listening, transcript, supported, start, stop };
}
