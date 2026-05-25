import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "green" | "amber" | "red" | "blue" | "purple" | "neutral";

const tones: Record<BadgeTone, string> = {
  green: "bg-primary-light text-primary-deep",
  amber: "bg-amber-bg text-amber-fg",
  red: "bg-danger-bg text-danger-fg",
  blue: "bg-info-bg text-info-fg",
  purple: "bg-purple-bg text-purple-fg",
  neutral: "bg-muted text-muted-foreground",
};

export function KsBadge({ tone = "green", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return <span className={cn("ks-badge", tones[tone], className)}>{children}</span>;
}
