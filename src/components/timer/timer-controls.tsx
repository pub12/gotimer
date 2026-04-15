"use client";

import React from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useTimer } from "./timer-provider";

interface TimerControlsProps {
  /** Whether to use fullscreen sizing */
  large?: boolean;
  /** Show skip button (for multi-step timers) */
  show_skip?: boolean;
  /** Custom label for primary button */
  start_label?: string;
  /** Extra action buttons rendered alongside standard controls */
  extra_actions?: React.ReactNode;
}

export function TimerControls({
  large = false,
  show_skip = false,
  start_label,
  extra_actions,
}: TimerControlsProps) {
  const { machine } = useTimer();
  const { status, start, pause, resume, reset, action } = machine;

  const btn_cls = `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${
    large ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"
  } font-semibold transition-colors`;

  const reset_cls = `flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl ${
    large ? "py-4 sm:py-5 px-6 text-lg" : "py-3 sm:py-4 px-5 text-base"
  } font-semibold transition-colors disabled:opacity-40`;

  const handle_primary = () => {
    switch (status) {
      case "idle":
        start();
        break;
      case "running":
        pause();
        break;
      case "paused":
        resume();
        break;
      case "complete":
        reset();
        break;
    }
  };

  const primary_label = (() => {
    switch (status) {
      case "idle":
        return start_label || "Start";
      case "running":
        return "Pause";
      case "paused":
        return "Resume";
      case "complete":
        return "Restart";
    }
  })();

  const primary_icon = (() => {
    switch (status) {
      case "running":
        return <Pause className="w-5 h-5" />;
      case "complete":
        return <RotateCcw className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  })();

  return (
    <div className={`flex gap-3 ${large ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
      <button onClick={handle_primary} className={btn_cls}>
        {primary_icon} {primary_label}
      </button>
      {show_skip && status === "running" && (
        <button
          onClick={() => action("skip_step")}
          className={reset_cls}
        >
          <SkipForward className="w-5 h-5" /> Skip
        </button>
      )}
      {status !== "idle" && status !== "complete" && (
        <button
          onClick={reset}
          className={reset_cls}
        >
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
      )}
      {extra_actions}
    </div>
  );
}
