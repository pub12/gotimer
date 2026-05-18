"use client";

import React from "react";
import { useTimer } from "../timer-provider";
import type { SignalColor } from "@/lib/toastmasters-presets";

interface StoplightProps {
  /**
   * Toastmasters mode: signal colour is selected by the active multi-step
   * phase. The component reads display.step_info.current and looks up the
   * matching entry in `signal_colors`.
   *
   * Debate mode: signal colour is selected by time remaining in the current
   * step. Defaults: > 60s → off, 30-60s → yellow, < 30s → red.
   */
  mode: "toastmasters" | "debate";
  /** Toastmasters: array aligned with steps, indicates colour per step */
  signal_colors?: SignalColor[];
  /** Debate: seconds threshold for yellow (default 60) */
  yellow_at?: number;
  /** Debate: seconds threshold for red (default 30) */
  red_at?: number;
  /** Optional label rendered above the bar ("Signal lights") */
  caption?: string;
}

interface LampProps {
  color: "green" | "yellow" | "red";
  active: boolean;
  flashing?: boolean;
  label: string;
  time?: string;
}

const COLOR_CLASSES: Record<
  "green" | "yellow" | "red",
  { active: string; idle: string; ring: string }
> = {
  green: {
    active: "bg-emerald-500 text-white shadow-[0_0_36px_rgba(16,185,129,0.55)]",
    idle: "bg-emerald-950/40 text-emerald-700",
    ring: "ring-emerald-400/40",
  },
  yellow: {
    active: "bg-amber-400 text-amber-950 shadow-[0_0_36px_rgba(251,191,36,0.55)]",
    idle: "bg-amber-950/40 text-amber-800",
    ring: "ring-amber-300/40",
  },
  red: {
    active: "bg-red-500 text-white shadow-[0_0_36px_rgba(239,68,68,0.55)]",
    idle: "bg-red-950/40 text-red-800",
    ring: "ring-red-400/40",
  },
};

function Lamp({ color, active, flashing, label, time }: LampProps) {
  const cls = COLOR_CLASSES[color];
  const base =
    "flex-1 flex flex-col items-center justify-center rounded-xl py-5 px-3 transition-all duration-200";
  const state = active
    ? `${cls.active} ${flashing ? "animate-pulse" : ""}`
    : cls.idle;
  return (
    <div
      className={`${base} ${state} ring-1 ${cls.ring}`}
      aria-label={`${color} light ${active ? "on" : "off"}`}
    >
      <div className="text-xs uppercase tracking-wide font-semibold opacity-80">
        {label}
      </div>
      {time && <div className="text-xs opacity-70 mt-0.5">{time}</div>}
    </div>
  );
}

export function Stoplight({
  mode,
  signal_colors,
  yellow_at = 60,
  red_at = 30,
  caption,
}: StoplightProps) {
  const { machine } = useTimer();
  const { display } = machine;

  let green_active = false;
  let yellow_active = false;
  let red_active = false;
  let flashing = false;

  if (mode === "toastmasters" && signal_colors) {
    const step_idx = display.step_info?.current ?? 0;
    const signal = signal_colors[step_idx] ?? "off";
    green_active = signal === "green";
    yellow_active = signal === "yellow";
    red_active = signal === "red";
    flashing = red_active;
  } else {
    const remaining = display.primary_time;
    if (remaining <= 0) {
      red_active = true;
      flashing = true;
    } else if (remaining <= red_at) {
      red_active = true;
    } else if (remaining <= yellow_at) {
      yellow_active = true;
    } else {
      green_active = true;
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {caption && (
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold text-center mb-2">
          {caption}
        </div>
      )}
      <div className="flex gap-3 bg-surface-container-low rounded-2xl p-3 shadow-[var(--shadow-soft)]">
        <Lamp color="green" active={green_active} label="Green" />
        <Lamp color="yellow" active={yellow_active} label="Yellow" />
        <Lamp color="red" active={red_active} flashing={flashing} label="Red" />
      </div>
    </div>
  );
}
