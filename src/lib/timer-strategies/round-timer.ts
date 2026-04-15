import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface RoundTimerState {
  total_time: number;
  round_time: number;
  previous_rounds: number[];
  prev_round_time: number;
}

export const roundTimerStrategy: TimerStrategy<RoundTimerState> = {
  type: "round-timer",

  initial_state(): RoundTimerState {
    return { total_time: 0, round_time: 0, previous_rounds: [], prev_round_time: 0 };
  },

  tick(state: RoundTimerState): RoundTimerState {
    return {
      ...state,
      prev_round_time: state.round_time,
      total_time: state.total_time + 1,
      round_time: state.round_time + 1,
    };
  },

  is_complete(): boolean {
    // Round timer runs indefinitely — user decides when to stop
    return false;
  },

  get_display(state: RoundTimerState): TimerDisplay {
    return {
      primary_time: state.round_time,
      secondary_time: state.total_time,
      // Cycle the ring every 60 seconds
      progress: (state.round_time % 60) / 60,
      phase_label: `Round ${state.previous_rounds.length + 1}`,
      extra: { previous_rounds: state.previous_rounds },
    };
  },

  get_warnings(state: RoundTimerState): Warning[] {
    const warnings: Warning[] = [];
    // Beep every minute boundary
    if (state.round_time > 0 && state.round_time % 60 === 0 && state.prev_round_time !== state.round_time) {
      warnings.push({ type: "phase_change", key: `minute-${state.round_time}` });
    }
    return warnings;
  },

  on_action(state: RoundTimerState, action: string): RoundTimerState {
    switch (action) {
      case "next_round": {
        const new_rounds = state.round_time > 0
          ? [...state.previous_rounds, state.round_time]
          : state.previous_rounds;
        return { ...state, previous_rounds: new_rounds, round_time: 0, prev_round_time: 0 };
      }
      default:
        return state;
    }
  },

  get_status_text(state: RoundTimerState): string {
    if (state.total_time === 0) return "Ready";
    return `Round ${state.previous_rounds.length + 1} in progress`;
  },
};
