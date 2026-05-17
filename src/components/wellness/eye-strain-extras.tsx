"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTimer } from "@/components/timer/timer-provider";
import {
  NotificationOptIn,
  type NotificationPermissionState,
} from "./notification-opt-in";

interface EyeStrainExtrasProps {
  /** Focus phase length, in seconds — used to label the dropdown. */
  focus_minutes: number;
  /** Look-away phase length, in seconds. */
  break_seconds: number;
  /** Callback fired when user changes focus_minutes via the select. */
  on_focus_change: (next_minutes: number) => void;
}

function format_mmss(seconds: number): string {
  const m = Math.max(0, Math.floor(seconds / 60));
  const s = Math.max(0, seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function EyeStrainExtras({
  focus_minutes,
  break_seconds,
  on_focus_change,
}: EyeStrainExtrasProps) {
  const { machine } = useTimer();
  const { display, status } = machine;
  const phase = (display.extra?.phase as "focus" | "break" | undefined) ?? "focus";
  const cycles =
    (display.extra?.cycles_completed as number | undefined) ?? 0;

  const [permission, set_permission] =
    useState<NotificationPermissionState>("default");
  const prev_phase_ref = useRef<string>(phase);
  const original_title_ref = useRef<string | null>(null);

  // Sync the document title with the live countdown so background-tab users
  // can see how long until the next break.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (original_title_ref.current === null) {
      original_title_ref.current = document.title;
    }
    if (status !== "running") {
      if (original_title_ref.current) document.title = original_title_ref.current;
      return;
    }
    const remaining = format_mmss(display.primary_time);
    const label = phase === "focus" ? "20-20-20" : "Look away";
    document.title = `(${remaining}) ${label}`;
    return () => {
      if (original_title_ref.current && status !== "running") {
        document.title = original_title_ref.current;
      }
    };
  }, [display.primary_time, phase, status]);

  // Restore the original title on unmount.
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined" && original_title_ref.current) {
        document.title = original_title_ref.current;
      }
    };
  }, []);

  // Trigger a browser notification when the timer enters the look-away phase.
  useEffect(() => {
    if (prev_phase_ref.current === phase) return;
    const entering_break = prev_phase_ref.current === "focus" && phase === "break";
    const finishing_break = prev_phase_ref.current === "break" && phase === "focus";
    prev_phase_ref.current = phase;

    if (typeof window === "undefined") return;
    if (permission !== "granted") return;
    if (!("Notification" in window)) return;

    try {
      if (entering_break) {
        new Notification("Look 20 feet away", {
          body: `Take a ${break_seconds}-second break to ease eye strain.`,
          tag: "gotimer-eye-strain",
          silent: false,
        });
      } else if (finishing_break) {
        new Notification("Break finished", {
          body: "Back to focus — next reminder in 20 minutes.",
          tag: "gotimer-eye-strain",
          silent: true,
        });
      }
    } catch {
      /* Some browsers throw when notifications are restricted by site settings. */
    }
  }, [phase, permission, break_seconds]);

  const focus_options = [10, 20, 30, 45, 60];

  return (
    <div className="w-full max-w-md mx-auto space-y-4 mt-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="eye-strain-focus"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Remind me every
        </label>
        <select
          id="eye-strain-focus"
          value={focus_minutes}
          onChange={(e) => on_focus_change(Number(e.target.value))}
          className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
        >
          {focus_options.map((m) => (
            <option key={m} value={m}>
              {m} minutes
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center min-h-[2.5rem]">
        <NotificationOptIn on_change={set_permission} />
      </div>

      {cycles > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {cycles} break{cycles === 1 ? "" : "s"} completed in this session.
        </p>
      )}
    </div>
  );
}
