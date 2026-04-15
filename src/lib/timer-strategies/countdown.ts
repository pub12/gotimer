import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface CountdownState {
  remaining: number;
  duration: number;
  prev_remaining: number;
}

export interface CountdownConfig {
  duration: number;
}

export const countdownStrategy: TimerStrategy<CountdownState> = {
  type: "countdown",

  initial_state(config: unknown): CountdownState {
    const c = config as CountdownConfig;
    const duration = c.duration || 60;
    return { remaining: duration, duration, prev_remaining: duration };
  },

  tick(state: CountdownState): CountdownState {
    if (state.remaining <= 0) return state;
    return {
      ...state,
      prev_remaining: state.remaining,
      remaining: state.remaining - 1,
    };
  },

  is_complete(state: CountdownState): boolean {
    return state.remaining <= 0;
  },

  get_display(state: CountdownState): TimerDisplay {
    return {
      primary_time: state.remaining,
      progress: state.duration > 0 ? state.remaining / state.duration : 0,
    };
  },

  get_warnings(state: CountdownState): Warning[] {
    const warnings: Warning[] = [];
    if (state.remaining > 0 && state.remaining <= 10 && state.remaining !== state.prev_remaining) {
      warnings.push({ type: "tick", key: `tick-${state.remaining}` });
    }
    if (state.remaining === 0 && state.prev_remaining !== 0) {
      warnings.push({ type: "complete", key: "complete" });
    }
    return warnings;
  },

  get_status_text(state: CountdownState): string {
    if (state.remaining === 0) return "Time's up!";
    if (state.remaining === state.duration) return "Ready";
    return "Counting down...";
  },
};
