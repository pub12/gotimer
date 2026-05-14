import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface StopwatchLap {
  n: number;
  total_ms: number;
  split_ms: number;
}

export interface StopwatchState {
  start_timestamp_ms: number | null;
  accumulated_ms: number;
  laps: StopwatchLap[];
  running: boolean;
}

function elapsed_now(state: StopwatchState): number {
  if (state.running && state.start_timestamp_ms !== null) {
    return Date.now() - state.start_timestamp_ms + state.accumulated_ms;
  }
  return state.accumulated_ms;
}

export const stopwatchStrategy: TimerStrategy<StopwatchState> = {
  type: "stopwatch",

  initial_state(): StopwatchState {
    return { start_timestamp_ms: null, accumulated_ms: 0, laps: [], running: false };
  },

  tick(state: StopwatchState): StopwatchState {
    if (!state.running) return state;
    return { ...state };
  },

  is_complete(): boolean {
    return false;
  },

  get_display(state: StopwatchState): TimerDisplay {
    const elapsed_ms = elapsed_now(state);
    return {
      primary_time: Math.floor(elapsed_ms / 1000),
      progress: 0,
      phase_label: state.running ? "Running" : state.accumulated_ms > 0 ? "Paused" : "Ready",
      extra: { elapsed_ms, laps: state.laps },
    };
  },

  get_warnings(): Warning[] {
    return [];
  },

  get_status_text(state: StopwatchState): string {
    if (state.running) return "Running";
    if (state.accumulated_ms > 0) return "Paused";
    return "Ready";
  },

  on_action(state: StopwatchState, action: string): StopwatchState {
    switch (action) {
      case "start": {
        return { ...state, running: true, start_timestamp_ms: Date.now() };
      }
      case "pause": {
        const ms = elapsed_now(state);
        return { ...state, running: false, start_timestamp_ms: null, accumulated_ms: ms };
      }
      case "lap": {
        const total_ms = elapsed_now(state);
        const prev_total = state.laps.length > 0 ? state.laps[state.laps.length - 1].total_ms : 0;
        const lap: StopwatchLap = { n: state.laps.length + 1, total_ms, split_ms: total_ms - prev_total };
        return { ...state, laps: [...state.laps, lap] };
      }
      case "clear_laps": {
        return { ...state, laps: [] };
      }
      default:
        return state;
    }
  },
};
