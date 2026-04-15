import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface CalculatorTimerState {
  /** Mode: "calculating" before start, "counting" when timer runs */
  mode: "calculating" | "counting";
  /** Calculated duration in seconds */
  calculated_duration: number;
  remaining: number;
  prev_remaining: number;
  /** Input values stored for display */
  metered_seconds: number;
  corrected_seconds: number;
  correction_stops: number;
  film_name: string;
}

export interface CalculatorTimerConfig {
  metered_seconds: number;
  corrected_seconds: number;
  correction_stops: number;
  film_name: string;
}

export const calculatorTimerStrategy: TimerStrategy<CalculatorTimerState> = {
  type: "calculator-timer",

  initial_state(config: unknown): CalculatorTimerState {
    const c = config as CalculatorTimerConfig;
    return {
      mode: "calculating",
      calculated_duration: Math.round(c.corrected_seconds || 0),
      remaining: Math.round(c.corrected_seconds || 0),
      prev_remaining: Math.round(c.corrected_seconds || 0),
      metered_seconds: c.metered_seconds || 0,
      corrected_seconds: c.corrected_seconds || 0,
      correction_stops: c.correction_stops || 0,
      film_name: c.film_name || "",
    };
  },

  tick(state: CalculatorTimerState): CalculatorTimerState {
    if (state.mode === "calculating" || state.remaining <= 0) return state;
    return {
      ...state,
      prev_remaining: state.remaining,
      remaining: state.remaining - 1,
    };
  },

  is_complete(state: CalculatorTimerState): boolean {
    return state.mode === "counting" && state.remaining <= 0;
  },

  get_display(state: CalculatorTimerState): TimerDisplay {
    return {
      primary_time: state.remaining,
      progress: state.calculated_duration > 0 ? state.remaining / state.calculated_duration : 0,
      phase_label: state.mode === "calculating" ? "Corrected Exposure" : "Exposing",
      extra: {
        mode: state.mode,
        metered_seconds: state.metered_seconds,
        corrected_seconds: state.corrected_seconds,
        correction_stops: state.correction_stops,
        film_name: state.film_name,
      },
    };
  },

  get_warnings(state: CalculatorTimerState): Warning[] {
    const warnings: Warning[] = [];
    if (state.mode === "counting" && state.remaining > 0 && state.remaining <= 5 && state.remaining !== state.prev_remaining) {
      warnings.push({ type: "tick", key: `tick-${state.remaining}` });
    }
    if (state.mode === "counting" && state.remaining === 0 && state.prev_remaining !== 0) {
      warnings.push({ type: "complete", key: "complete" });
    }
    return warnings;
  },

  on_action(state: CalculatorTimerState, action: string, payload?: unknown): CalculatorTimerState {
    if (action === "start_timer") {
      return { ...state, mode: "counting" };
    }
    if (action === "update_calculation") {
      const p = payload as CalculatorTimerConfig;
      const duration = Math.round(p.corrected_seconds);
      return {
        ...state,
        mode: "calculating",
        calculated_duration: duration,
        remaining: duration,
        prev_remaining: duration,
        metered_seconds: p.metered_seconds,
        corrected_seconds: p.corrected_seconds,
        correction_stops: p.correction_stops,
        film_name: p.film_name,
      };
    }
    return state;
  },

  get_status_text(state: CalculatorTimerState): string {
    if (state.mode === "calculating") return "Configure and start";
    if (state.remaining === 0) return "Exposure complete!";
    return "Exposing...";
  },
};
