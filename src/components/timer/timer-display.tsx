"use client";

import React from "react";

/** Format seconds to MM:SS or HH:MM:SS */
export function format_time(total_seconds: number): string {
  const h = Math.floor(total_seconds / 3600);
  const m = Math.floor((total_seconds % 3600) / 60);
  const s = total_seconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  if (h > 0) return `${h.toString().padStart(2, "0")}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

interface TimeDigitsProps {
  seconds: number;
  /** Size variant for responsive scaling */
  size?: "sm" | "md" | "lg";
}

/** Time display with separate digit groups and labels */
export function TimeDigits({ seconds, size = "md" }: TimeDigitsProps) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: Array<{ value: string; label: string }> = [];
  if (h > 0) parts.push({ value: h.toString().padStart(2, "0"), label: "Hours" });
  parts.push({ value: m.toString().padStart(2, "0"), label: "Minutes" });
  parts.push({ value: s.toString().padStart(2, "0"), label: "Seconds" });

  const has_hours = h > 0;

  // Size-appropriate typography classes
  const sizes = {
    sm: {
      digit: has_hours ? "text-2xl font-headline font-black text-foreground" : "text-3xl sm:text-4xl font-headline font-black text-foreground",
      colon: has_hours ? "text-2xl font-headline font-black text-foreground mb-2" : "text-3xl sm:text-4xl font-headline font-black text-foreground mb-3",
      label: "text-[8px] sm:text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5",
      gap: "gap-1",
    },
    md: {
      digit: has_hours ? "text-3xl sm:text-4xl font-headline font-black text-foreground" : "text-5xl sm:text-6xl font-headline font-black text-foreground",
      colon: has_hours ? "text-3xl sm:text-4xl font-headline font-black text-foreground mb-3" : "text-5xl sm:text-6xl font-headline font-black text-foreground mb-4",
      label: "text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1",
      gap: has_hours ? "gap-1" : "gap-1.5 sm:gap-2",
    },
    lg: {
      digit: has_hours ? "text-5xl sm:text-6xl font-headline font-black text-foreground" : "text-7xl sm:text-8xl md:text-9xl font-headline font-black text-foreground",
      colon: has_hours ? "text-5xl sm:text-6xl font-headline font-black text-foreground mb-4" : "text-7xl sm:text-8xl md:text-9xl font-headline font-black text-foreground mb-6",
      label: "text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1",
      gap: has_hours ? "gap-1 sm:gap-1.5" : "gap-2 sm:gap-3",
    },
  };

  const s_config = sizes[size];

  return (
    <div className={`flex items-baseline ${s_config.gap}`}>
      {parts.map((part, i) => (
        <React.Fragment key={part.label}>
          {i > 0 && <span className={s_config.colon}>:</span>}
          <div className="flex flex-col items-center">
            <span className={s_config.digit}>{part.value}</span>
            <span className={s_config.label}>{part.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export type TimerDisplayVariant = "ring" | "digits-only" | "bar";

interface TimerDisplayProps {
  time: number;
  progress: number;
  variant?: TimerDisplayVariant;
  color?: string;
  large?: boolean;
  phase_label?: string;
  sub_label?: string;
  children?: React.ReactNode;
}

// SVG ring constants — matched to the original timer-shell dimensions
const RING_CONFIG = {
  normal: { size: 280, strokeWidth: 12, radius: 120, containerCls: "w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80" },
  large: { size: 400, strokeWidth: 14, radius: 175, containerCls: "w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem]" },
};

function SVGRing({ progress, color, cfg }: { progress: number; color: string; cfg: typeof RING_CONFIG.normal }) {
  const circumference = 2 * Math.PI * cfg.radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));
  const center = cfg.size / 2;

  return (
    <svg viewBox={`0 0 ${cfg.size} ${cfg.size}`} className="absolute inset-0 w-full h-full -rotate-90">
      {/* Track */}
      <circle
        cx={center} cy={center} r={cfg.radius}
        fill="none"
        stroke="var(--surface-container-high, #e5e7f0)"
        strokeWidth={cfg.strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={center} cy={center} r={cfg.radius}
        fill="none"
        stroke={color}
        strokeWidth={cfg.strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="ring-progress-transition"
      />
    </svg>
  );
}

export function TimerDisplay({
  time,
  progress,
  variant = "ring",
  color = "var(--secondary)",
  large = false,
  phase_label,
  sub_label,
  children,
}: TimerDisplayProps) {
  if (variant === "digits-only") {
    return (
      <div className="flex flex-col items-center gap-2">
        {phase_label && (
          <span className="text-xs sm:text-sm font-headline font-black uppercase tracking-widest text-secondary">
            {phase_label}
          </span>
        )}
        <TimeDigits seconds={time} size={large ? "lg" : "md"} />
        {sub_label && (
          <span className="text-xs mt-1 text-muted-foreground">{sub_label}</span>
        )}
        {children}
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        {phase_label && (
          <span className="text-xs sm:text-sm font-headline font-black uppercase tracking-widest text-secondary">
            {phase_label}
          </span>
        )}
        <TimeDigits seconds={time} size={large ? "lg" : "md"} />
        <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bar-progress-transition"
            style={{ width: `${progress * 100}%`, backgroundColor: color }}
          />
        </div>
        {sub_label && (
          <span className="text-xs text-muted-foreground">{sub_label}</span>
        )}
        {children}
      </div>
    );
  }

  // Ring variant — uses inline SVG for precise sizing control
  const cfg = large ? RING_CONFIG.large : RING_CONFIG.normal;

  return (
    <div className={`relative flex items-center justify-center ${cfg.containerCls}`}>
      <SVGRing progress={progress} color={color} cfg={cfg} />
      {/* Content centered inside the ring */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {phase_label && (
          <span className="text-[10px] sm:text-xs font-headline font-black uppercase tracking-widest mb-1 text-secondary">
            {phase_label}
          </span>
        )}
        <TimeDigits seconds={time} size={large ? "lg" : "sm"} />
        {sub_label && (
          <span className="text-[10px] sm:text-xs mt-1.5 text-muted-foreground">{sub_label}</span>
        )}
      </div>
      {children}
    </div>
  );
}
