"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { stopwatchStrategy } from "@/lib/timer-strategies/stopwatch";
import { format_stopwatch_time } from "@/lib/format-stopwatch-time";
import { useStopwatchRenderDriver } from "@/hooks/timer/use-stopwatch-render-driver";

function StopwatchEmbedInner() {
  const { machine } = useTimer();
  const { status, start, pause, resume, reset, action, display } = machine;
  const [, force_render] = useState(0);

  useStopwatchRenderDriver(status === "running", () => force_render((n) => n + 1));

  const elapsed_ms = (display.extra?.elapsed_ms as number) ?? 0;

  const prev_status_ref = useRef(status);
  useEffect(() => {
    if (prev_status_ref.current === "running" && status === "paused") {
      action("pause");
    }
    prev_status_ref.current = status;
  }, [status, action]);

  const handle_primary = () => {
    switch (status) {
      case "idle":
        action("start");
        start();
        break;
      case "running":
        pause();
        break;
      case "paused":
        action("start");
        resume();
        break;
    }
  };

  const primary_label = status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start";

  const btn = "flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl py-2 text-sm font-semibold transition-colors";
  const btn_sm = "flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl py-2 px-4 text-sm font-semibold transition-colors disabled:opacity-40";

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="tabular-nums text-4xl font-bold tracking-tight text-foreground">
        {format_stopwatch_time(elapsed_ms)}
      </div>
      <div className="flex gap-2 w-full max-w-xs">
        <button onClick={handle_primary} className={btn}>
          {primary_label}
        </button>
        {status !== "idle" && (
          <button onClick={reset} className={btn_sm}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function StopwatchEmbedContent() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <TimerProvider strategy={stopwatchStrategy} config={{}}>
        <StopwatchEmbedInner />
      </TimerProvider>
    </div>
  );
}

export default function StopwatchEmbedPage() {
  return (
    <Suspense>
      <StopwatchEmbedContent />
    </Suspense>
  );
}
