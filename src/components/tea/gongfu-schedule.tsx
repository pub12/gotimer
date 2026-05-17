"use client";

import React from "react";
import type { GongfuConfig } from "@/lib/tea-presets";

/**
 * Gongfu infusion ladder shown beneath the multi-step timer.
 * Highlights the current infusion using the `current_index` prop.
 */
export function GongfuSchedule({
  config,
  current_index,
}: {
  config: GongfuConfig;
  current_index?: number;
}) {
  const steps = config.rinse_seconds > 0
    ? [{ label: "Rinse", duration: config.rinse_seconds }]
    : [];
  config.infusions.forEach((d, i) =>
    steps.push({ label: `Infusion ${i + 1}`, duration: d }),
  );

  return (
    <div className="w-full max-w-md mx-auto mt-2 px-4 text-xs space-y-1.5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>5-8g leaf · 100-150ml gaiwan · 95-100°C</span>
        <span>{config.infusions.length} infusions</span>
      </div>
      <div className="border-t border-border/40" />
      <ul className="space-y-1">
        {steps.map((s, idx) => {
          const is_current = current_index === idx;
          return (
            <li
              key={`${s.label}-${idx}`}
              className={`flex items-center justify-between gap-3 ${
                is_current
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <span className="truncate">{s.label}</span>
              <span className="tabular-nums">{s.duration}s</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
