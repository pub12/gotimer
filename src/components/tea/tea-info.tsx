"use client";

import React from "react";
import type { TeaPreset } from "@/lib/tea-presets";

/**
 * Compact tea info card shown beneath the timer on per-type leaf pages.
 * Mirrors `PourSchedule` from coffee. Lists temp, ratio, steep range, and
 * the sub-variety reference table.
 */
export function TeaInfo({ tea }: { tea: TeaPreset }) {
  const min_min = Math.floor(tea.steep_min / 60);
  const min_sec = tea.steep_min % 60;
  const max_min = Math.floor(tea.steep_max / 60);
  const max_sec = tea.steep_max % 60;
  const range = `${min_min || min_sec + "s"}${min_min ? `:${min_sec.toString().padStart(2, "0")}` : ""}–${max_min || max_sec + "s"}${max_min ? `:${max_sec.toString().padStart(2, "0")}` : ""} min`;

  return (
    <div className="w-full max-w-md mx-auto mt-2 px-4 text-xs space-y-2">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>
          {tea.temp_c}°C ({tea.temp_f}°F) · {range}
        </span>
        <span className="truncate text-right">{tea.ratio}</span>
      </div>
      <div className="border-t border-border/40" />
      <ul className="space-y-1">
        {tea.sub_varieties.map((v) => (
          <li
            key={v.name}
            className="flex items-baseline justify-between gap-3 text-muted-foreground"
          >
            <span className="truncate">
              <span className="font-medium text-foreground">{v.name}</span>
              {v.note ? <span className="text-muted-foreground"> · {v.note}</span> : null}
            </span>
            <span className="tabular-nums whitespace-nowrap">
              {format_seconds(v.steep_seconds)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function format_seconds(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (rem === 0) return `${m}m`;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}
