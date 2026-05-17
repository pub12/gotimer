import type { TimerStrategy, TimerDisplay, Warning } from "./types";

/**
 * interval-reminder — fires a short "break" phase on a fixed cadence,
 * indefinitely. Used by the 20-20-20 eye-strain timer (20 min focus →
 * 20 sec look-away → 20 min focus → ...) and similar break-reminder use
 * cases. Unlike `interval`, there is no fixed round count; the timer
 * keeps cycling until the user pauses it.
 */
export interface IntervalReminderState {
  phase: "focus" | "break";
  remaining: number;
  cycles_completed: number;
  focus: number;
  break_seconds: number;
  prev_remaining: number;
}

export interface IntervalReminderConfig {
  /** Length of the focus phase, in seconds. */
  focus: number;
  /** Length of the look-away / break phase, in seconds. */
  break_seconds: number;
}

export const intervalReminderStrategy: TimerStrategy<IntervalReminderState> = {
  type: "interval-reminder",

  initial_state(config: unknown): IntervalReminderState {
    const c = config as IntervalReminderConfig;
    const focus = c.focus > 0 ? c.focus : 1200;
    const break_seconds = c.break_seconds > 0 ? c.break_seconds : 20;
    return {
      phase: "focus",
      remaining: focus,
      cycles_completed: 0,
      focus,
      break_seconds,
      prev_remaining: focus,
    };
  },

  tick(state: IntervalReminderState): IntervalReminderState {
    const next = { ...state, prev_remaining: state.remaining };

    if (state.remaining > 1) {
      next.remaining = state.remaining - 1;
      return next;
    }

    // Transition: focus -> break, or break -> focus (cycle completed)
    if (state.phase === "focus") {
      next.phase = "break";
      next.remaining = state.break_seconds;
      return next;
    }

    next.phase = "focus";
    next.remaining = state.focus;
    next.cycles_completed = state.cycles_completed + 1;
    return next;
  },

  is_complete(): boolean {
    // Never auto-completes — user pauses to stop.
    return false;
  },

  get_display(state: IntervalReminderState): TimerDisplay {
    const phase_duration =
      state.phase === "focus" ? state.focus : state.break_seconds;
    return {
      primary_time: state.remaining,
      progress: phase_duration > 0 ? state.remaining / phase_duration : 0,
      phase_label: state.phase === "focus" ? "Focus" : "Look away",
      ring_color:
        state.phase === "focus" ? "var(--secondary)" : "var(--primary)",
      extra: {
        phase: state.phase,
        cycles_completed: state.cycles_completed,
      },
    };
  },

  get_warnings(state: IntervalReminderState): Warning[] {
    const warnings: Warning[] = [];
    // Fire phase_change warning whenever the timer just rolled over.
    if (state.prev_remaining === 1) {
      warnings.push({
        type: "phase_change",
        key: `phase-${state.phase}-${state.cycles_completed}`,
      });
    }
    return warnings;
  },

  get_status_text(state: IntervalReminderState): string {
    if (state.phase === "focus") {
      return state.cycles_completed === 0
        ? "Focusing — next break in a few minutes"
        : `Focusing — ${state.cycles_completed} break${state.cycles_completed === 1 ? "" : "s"} completed`;
    }
    return "Look 20 feet away";
  },
};
