"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTickEngine } from "./use-tick-engine";
import type { TimerStrategy, TimerDisplay, Warning } from "@/lib/timer-strategies/types";

export type TimerStatus = "idle" | "running" | "paused" | "complete";

export interface TimerMachine<TState> {
  status: TimerStatus;
  state: TState;
  display: TimerDisplay;
  warnings: Warning[];
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  action: (name: string, payload?: unknown) => void;
}

export function useTimerStateMachine<TState>(
  strategy: TimerStrategy<TState>,
  config: unknown,
  options?: { initial_elapsed?: number },
): TimerMachine<TState> {
  const [status, set_status] = useState<TimerStatus>("idle");
  const [state, set_state] = useState<TState>(() => strategy.initial_state(config));
  const strategy_ref = useRef(strategy);
  strategy_ref.current = strategy;
  const has_fast_forwarded = useRef(false);

  // Serialize config for comparison — handles objects like { duration: 300 }
  const config_key = JSON.stringify(config);

  // Re-initialize state when config changes and timer is idle or complete
  useEffect(() => {
    set_state(strategy_ref.current.initial_state(config));
    set_status("idle");
    has_fast_forwarded.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config_key]);

  // Fast-forward on mount for shared timer URLs (client-only to avoid hydration mismatch)
  const initial_elapsed = options?.initial_elapsed;
  useEffect(() => {
    if (!initial_elapsed || initial_elapsed <= 0 || has_fast_forwarded.current) return;
    has_fast_forwarded.current = true;
    set_state(() => {
      let s = strategy_ref.current.initial_state(config);
      const ticks = Math.min(initial_elapsed, 86400);
      for (let i = 0; i < ticks; i++) {
        s = strategy_ref.current.tick(s);
        if (strategy_ref.current.is_complete(s)) {
          set_status("complete");
          return s;
        }
      }
      set_status("running");
      return s;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial_elapsed]);

  const tick = useCallback(() => {
    set_state((prev) => {
      const next = strategy_ref.current.tick(prev);
      if (strategy_ref.current.is_complete(next)) {
        set_status("complete");
      }
      return next;
    });
  }, []);

  useTickEngine(status === "running", tick);

  const start = useCallback(() => {
    set_status("running");
  }, []);

  const pause = useCallback(() => {
    set_status("paused");
  }, []);

  const resume = useCallback(() => {
    set_status("running");
  }, []);

  const reset = useCallback(() => {
    set_state(strategy_ref.current.initial_state(config));
    set_status("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config_key]);

  const action = useCallback((name: string, payload?: unknown) => {
    set_state((prev) => {
      if (strategy_ref.current.on_action) {
        return strategy_ref.current.on_action(prev, name, payload);
      }
      return prev;
    });
  }, []);

  const display = strategy_ref.current.get_display(state);
  const warnings = strategy_ref.current.get_warnings(state);

  return { status, state, display, warnings, start, pause, resume, reset, action };
}
