import type { TimerStrategy, TimerDisplay, Warning } from "./types";

/**
 * Espresso-shot timer.
 *
 * Counts up from pump-on with a configurable target range (e.g., 25-30s).
 * Records a first-drip timestamp via the `first_drip` action; the UI shows
 * a secondary "since first drip" readout once captured.
 *
 * Phases:
 *   pre-infusion — pump on, no drip yet (first_drip_at === null)
 *   extracting   — first drip captured, within target window
 *   complete     — manually stopped or elapsed > target_max + 10s grace
 */

export interface EspressoConfig {
  /** Target shot time range in seconds (default: 25-30s) */
  target_min: number;
  target_max: number;
}

export interface EspressoState {
  elapsed: number;
  first_drip_at: number | null;
  target_min: number;
  target_max: number;
  finished: boolean;
}

export const espressoShotStrategy: TimerStrategy<EspressoState> = {
  type: "espresso-shot",

  initial_state(config: unknown): EspressoState {
    const c = (config ?? {}) as Partial<EspressoConfig>;
    return {
      elapsed: 0,
      first_drip_at: null,
      target_min: c.target_min ?? 25,
      target_max: c.target_max ?? 30,
      finished: false,
    };
  },

  tick(state: EspressoState): EspressoState {
    if (state.finished) return state;
    return { ...state, elapsed: state.elapsed + 1 };
  },

  is_complete(state: EspressoState): boolean {
    return state.finished;
  },

  get_display(state: EspressoState): TimerDisplay {
    const phase: "pre-infusion" | "extracting" | "complete" = state.finished
      ? "complete"
      : state.first_drip_at === null
        ? "pre-infusion"
        : "extracting";

    let ring_color: string | undefined;
    if (state.elapsed >= state.target_min && state.elapsed <= state.target_max) {
      ring_color = "var(--color-success, #10b981)";
    } else if (state.elapsed > state.target_max) {
      ring_color = "var(--color-error, #ef4444)";
    } else {
      ring_color = "var(--color-warning, #f59e0b)";
    }

    return {
      primary_time: state.elapsed,
      progress:
        state.target_max > 0
          ? Math.min(1, state.elapsed / state.target_max)
          : 0,
      phase_label:
        phase === "pre-infusion"
          ? "Pre-infusion"
          : phase === "extracting"
            ? "Extracting"
            : "Complete",
      ring_color,
      extra: {
        phase,
        first_drip_at: state.first_drip_at,
        time_since_first_drip:
          state.first_drip_at === null ? null : state.elapsed - state.first_drip_at,
        target_min: state.target_min,
        target_max: state.target_max,
      },
    };
  },

  get_warnings(state: EspressoState): Warning[] {
    const warnings: Warning[] = [];
    if (!state.finished && state.elapsed === state.target_min) {
      warnings.push({ type: "warning", key: `target-min-${state.target_min}` });
    }
    if (!state.finished && state.elapsed === state.target_max) {
      warnings.push({ type: "warning", key: `target-max-${state.target_max}` });
    }
    if (state.finished) {
      warnings.push({ type: "complete", key: `complete-${state.elapsed}` });
    }
    return warnings;
  },

  on_action(state: EspressoState, action: string): EspressoState {
    switch (action) {
      case "first_drip": {
        if (state.first_drip_at !== null) return state;
        return { ...state, first_drip_at: state.elapsed };
      }
      case "stop": {
        return { ...state, finished: true };
      }
      case "reset": {
        return {
          ...state,
          elapsed: 0,
          first_drip_at: null,
          finished: false,
        };
      }
      default:
        return state;
    }
  },

  get_status_text(state: EspressoState): string {
    if (state.finished) return "Shot complete";
    if (state.first_drip_at === null) return "Pre-infusion";
    return `Extracting (first drip at ${state.first_drip_at}s)`;
  },
};
