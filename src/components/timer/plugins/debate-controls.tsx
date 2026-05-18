"use client";

import React from "react";
import { SkipBack } from "lucide-react";
import { useTimer } from "../timer-provider";

/**
 * Judge-control button: fires the multi-step `previous_step` action so a
 * misclicked phase advance, or a speech the judge needs to replay, can be
 * rewound. Slotted into TimerPage via the `control_extra` prop alongside the
 * existing Skip/Next button. The Skip button is already wired by passing
 * `show_skip` to TimerPage.
 */
export function DebatePreviousButton() {
  const { machine } = useTimer();
  const { status, action } = machine;

  if (status !== "running" && status !== "paused") return null;

  return (
    <button
      onClick={() => action("previous_step")}
      className="flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl py-3 sm:py-4 px-5 text-base font-semibold transition-colors"
      aria-label="Previous phase"
      title="Rewind to the previous phase"
    >
      <SkipBack className="w-5 h-5" /> Previous
    </button>
  );
}
