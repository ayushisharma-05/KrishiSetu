import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon, label, value, sub, tone = "neutral", className,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const toneMap = {
    neutral: "bg-muted text-foreground",
    green: "bg-primary-light text-primary-deep",
    amber: "bg-amber-bg text-amber-fg",
    red: "bg-danger-bg text-danger-fg",
    blue: "bg-info-bg text-info-fg",
  };
  return (
    <div className={cn("ks-metric flex flex-col gap-1", toneMap[tone], className)}>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div className="text-[22px] font-medium leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
