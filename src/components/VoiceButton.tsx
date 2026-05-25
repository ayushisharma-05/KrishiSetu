import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useLang } from "@/i18n/LanguageContext";

export function VoiceButton({ onText }: { onText: (text: string) => void }) {
  const { lang } = useLang();
  const { listening, transcript, supported, start, stop } = useVoiceInput(lang);

  useEffect(() => { if (transcript) onText(transcript); }, [transcript, onText]);

  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      aria-label={listening ? "Stop listening" : "Start voice input"}
      className={`inline-grid h-10 w-10 place-items-center rounded-full border transition ${listening ? "bg-danger text-white border-danger animate-pulse" : "bg-card border-border text-primary hover:bg-primary/5"}`}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}
