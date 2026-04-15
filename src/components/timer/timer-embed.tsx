"use client";

import React, { Suspense } from "react";
import { TimerProvider } from "./timer-provider";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { useTimer } from "./timer-provider";
import type { TimerStrategy } from "@/lib/timer-strategies/types";
import type { TimerDisplayVariant } from "./timer-display";

interface TimerEmbedProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strategy: TimerStrategy<any>;
  config: unknown;
  label: string;
  display_variant?: TimerDisplayVariant;
  show_skip?: boolean;
  /** Theme: light | dark | darkroom */
  theme?: string;
  /** Custom accent color */
  accent?: string;
  /** Show/hide controls */
  controls?: "full" | "minimal" | "none";
  /** Branding level */
  branding?: "full" | "minimal";
}

function EmbedInner({
  label,
  display_variant = "ring",
  show_skip,
  controls = "full",
  branding = "full",
}: Omit<TimerEmbedProps, "strategy" | "config">) {
  const { machine } = useTimer();
  const { display } = machine;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-surface">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        {/* Timer display */}
        <TimerDisplay
          time={display.primary_time}
          progress={display.progress}
          variant={display_variant}
          color={display.ring_color}
          phase_label={display.phase_label}
        />

        {/* Controls */}
        {controls !== "none" && (
          <TimerControls show_skip={show_skip} />
        )}
      </div>

      {/* Attribution footer */}
      <div className="mt-auto pt-4 text-center">
        {branding === "full" ? (
          <a
            href="https://gotimer.org"
            target="_blank"
            rel="noopener"
            className="text-xs text-muted-foreground hover:text-secondary transition-colors"
          >
            ⏱ Powered by GoTimer — Free online timers
          </a>
        ) : (
          <a
            href="https://gotimer.org"
            target="_blank"
            rel="noopener"
            className="text-[10px] text-muted-foreground/60 hover:text-secondary transition-colors"
          >
            GoTimer.org
          </a>
        )}
      </div>
    </div>
  );
}

export function TimerEmbed({ strategy, config, ...rest }: TimerEmbedProps) {
  return (
    <Suspense>
      <TimerProvider strategy={strategy} config={config}>
        <EmbedInner {...rest} />
      </TimerProvider>
    </Suspense>
  );
}
