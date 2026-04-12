import * as React from "react";
import { ArrowUp, ArrowDown, Minus, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  value,
  label,
  trend,
  icon: Icon,
  accentColor,
  className,
}: {
  value: string | number;
  label: string;
  trend?: { direction: "up" | "down" | "flat"; value: string };
  icon?: LucideIcon;
  accentColor?: string;
  className?: string;
}) {
  const TrendIcon =
    trend?.direction === "up"
      ? ArrowUp
      : trend?.direction === "down"
        ? ArrowDown
        : Minus;

  return (
    <div
      data-slot="stat-card"
      className={cn(
        "bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)]",
        accentColor && "border-b-4",
        className
      )}
      style={accentColor ? { borderBottomColor: accentColor } : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-headline font-black text-3xl text-foreground">
            {value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-[0.75rem] bg-surface-container">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 mt-3 text-xs font-medium",
            trend.direction === "up" && "text-emerald-600",
            trend.direction === "down" && "text-secondary",
            trend.direction === "flat" && "text-muted-foreground"
          )}
        >
          <TrendIcon className="size-3" />
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
