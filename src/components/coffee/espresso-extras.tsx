"use client";

import React from "react";
import { useTimer } from "@/components/timer/timer-provider";

function format_seconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function EspressoExtras() {
  const { machine } = useTimer();
  const extra = (machine.display.extra ?? {}) as {
    phase?: "pre-infusion" | "extracting" | "complete";
    first_drip_at?: number | null;
    time_since_first_drip?: number | null;
    target_min?: number;
    target_max?: number;
  };

  const phase = extra.phase ?? "pre-infusion";
  const first_drip_at = extra.first_drip_at ?? null;
  const since_drip = extra.time_since_first_drip ?? null;
  const target_min = extra.target_min ?? 25;
  const target_max = extra.target_max ?? 30;

  const elapsed = machine.display.primary_time;

  const band_label =
    elapsed < target_min
      ? `${target_min - elapsed}s to target window`
      : elapsed <= target_max
        ? "In target window"
        : `${elapsed - target_max}s past target`;
  const band_color =
    elapsed < target_min
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
      : elapsed <= target_max
        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
        : "bg-rose-500/15 text-rose-700 dark:text-rose-300";

  return (
    <div className="w-full max-w-md mx-auto mt-2 px-4 space-y-3">
      {/* Target band */}
      <div
        className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium tabular-nums ${band_color}`}
      >
        <span>Target {target_min}-{target_max}s</span>
        <span>{band_label}</span>
      </div>

      {/* First drip button + readouts */}
      <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low px-3 py-2">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            First drip
          </div>
          <div className="font-headline font-bold text-sm tabular-nums">
            {first_drip_at === null ? "—" : `${first_drip_at}s`}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Since first drip
          </div>
          <div className="font-headline font-bold text-sm tabular-nums">
            {since_drip === null ? "—" : `${since_drip}s`}
          </div>
        </div>
        <button
          type="button"
          onClick={() => machine.action("first_drip")}
          disabled={first_drip_at !== null || phase === "complete"}
          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          First Drip
        </button>
      </div>

      <div className="text-center text-xs text-muted-foreground tabular-nums">
        Elapsed: {format_seconds(elapsed)} · Phase:{" "}
        <span className="capitalize">{phase.replace("-", " ")}</span>
      </div>
    </div>
  );
}
