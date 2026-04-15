"use client";

import React from "react";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { TimerShellV2 } from "@/components/timer/timer-shell-v2";
import { TimerDisplay, format_time } from "@/components/timer/timer-display";
import { TimerControls } from "@/components/timer/timer-controls";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { intervalStrategy } from "@/lib/timer-strategies/interval";
import { Play } from "lucide-react";

/**
 * Renders the actual timer components (fullscreen layout) scaled to fit a preview panel.
 * Handles different timer types: standard (ring), multi-timer (card list).
 * Reused by both SaveTimerDialog and EditTimerDialog.
 */
export function TimerPreviewPanel({ timer_type, config, label }: {
  timer_type: string;
  config: unknown;
  label: string;
}) {
  // Multi-timer gets its own preview layout
  if (timer_type === "multi-timer") {
    return <MultiTimerPreview config={config} label={label} />;
  }

  const strategy = timer_type === "interval" ? intervalStrategy : countdownStrategy;

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 origin-center" style={{ transform: "scale(0.48)", width: "208%", height: "208%", left: "-54%", top: "-54%" }}>
        <TimerProvider strategy={strategy} config={config}>
          <TimerPreviewInner label={label} />
        </TimerProvider>
      </div>
    </div>
  );
}

function TimerPreviewInner({ label }: { label: string }) {
  const { machine } = useTimer();
  const { display, status } = machine;

  return (
    <TimerShellV2
      label={label}
      timer_type={label.toLowerCase().replace(/\s+/g, "-")}
      remaining={display.primary_time}
      running={status === "running"}
      force_fullscreen
      controls={<TimerControls />}
    >
      <TimerDisplay
        time={display.primary_time}
        progress={display.progress}
        variant="ring"
        color={display.ring_color}
      />
    </TimerShellV2>
  );
}

/** Multi-timer specific preview — shows the card list layout */
function MultiTimerPreview({ config, label }: { config: unknown; label: string }) {
  const c = config as Record<string, unknown>;
  const timers_str = (c.timers as string) || "";

  // Parse timer config
  const timers = timers_str
    ? timers_str.split("|").map((seg) => {
        const [name, dur] = seg.split(":");
        return { name: decodeURIComponent(name), duration: Number(dur) };
      })
    : [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4" style={{ backgroundColor: "var(--primary)" }}>
      <h3 className="text-white font-headline font-black text-sm mb-3">{label}</h3>

      {timers.length === 0 ? (
        <p className="text-white/40 text-xs">No timers configured</p>
      ) : (
        <div className="w-full max-w-[280px] space-y-2">
          {timers.map((t, i) => {
            const mm = Math.floor(t.duration / 60).toString().padStart(2, "0");
            const ss = (t.duration % 60).toString().padStart(2, "0");
            return (
              <div key={i} className="bg-white/8 rounded-lg p-2.5 border-l-3" style={{ borderLeftColor: "var(--secondary)", borderLeftWidth: 3 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-semibold">{t.name}</span>
                  <span className="text-white font-headline font-black text-base">{mm}:{ss}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-secondary" style={{ width: "100%" }} />
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  <span className="px-2 py-0.5 bg-secondary text-white rounded text-[9px] font-semibold flex items-center gap-0.5">
                    <Play className="w-2 h-2" />Start
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white/60 rounded text-[9px]">Reset</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom status pill */}
      <div className="mt-auto pt-3 flex items-center gap-1.5 text-[9px] font-semibold uppercase rounded-full px-2 py-0.5"
        style={{ backgroundColor: "rgba(171,53,20,0.2)", color: "var(--secondary)" }}>
        <span className="w-1 h-1 rounded-full bg-secondary" />
        Multi-Timer
      </div>
    </div>
  );
}
