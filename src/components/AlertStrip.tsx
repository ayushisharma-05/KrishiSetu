import { Bell, X } from "lucide-react";
import { useState, type ReactNode } from "react";

export function AlertStrip({
  children, tone = "amber", onClose,
}: { children: ReactNode; tone?: "amber" | "red" | "blue" | "green"; onClose?: () => void }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const styles =
    tone === "red" ? "bg-danger-bg text-danger-fg border-danger" :
    tone === "blue" ? "bg-info-bg text-info-fg border-info" :
    tone === "green" ? "bg-primary-light text-primary-deep border-primary" :
    "bg-amber-bg text-amber-fg border-amber";
  return (
    <div className={`flex items-center gap-3 border-l-[3px] rounded-r-md px-3.5 py-2.5 text-[13px] ${styles}`}>
      <Bell size={16} className="shrink-0" />
      <div className="flex-1 min-w-0 truncate">{children}</div>
      <button onClick={() => { setOpen(false); onClose?.(); }} className="shrink-0 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
