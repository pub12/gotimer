import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface IntervalState {
  phase: "work" | "rest";
  current_round: number;
  remaining: number;
  work: number;
  rest: number;
  rounds: number;
  finished: boolean;
  prev_remaining: number;
}

export interface IntervalConfig {
  work: number;
  rest: number;
  rounds: number;
}

export const intervalStrategy: TimerStrategy<IntervalState> = {
  type: "interval",

  initial_state(config: unknown): IntervalState {
    const c = config as IntervalConfig;
    return {
      phase: "work",
      current_round: 1,
      remaining: c.work || 30,
      work: c.work || 30,
      rest: c.rest || 10,
      rounds: c.rounds || 8,
      finished: false,
      prev_remaining: c.work || 30,
    };
  },

  tick(state: IntervalState): IntervalState {
    if (state.finished) return state;

    const next = { ...state, prev_remaining: state.remaining };

    if (state.remaining > 1) {
      next.remaining = state.remaining - 1;
      return next;
    }

    // Remaining reached 0 — transition
    if (state.phase === "work") {
      if (state.rest > 0) {
        next.phase = "rest";
        next.remaining = state.rest;
        return next;
      }
      // No rest — go to next round or finish
      if (state.current_round < state.rounds) {
        next.current_round = state.current_round + 1;
        next.remaining = state.work;
        return next;
      }
      next.finished = true;
      next.remaining = 0;
      return next;
    }

    // End of rest phase
    if (state.current_round < state.rounds) {
      next.phase = "work";
      next.current_round = state.current_round + 1;
      next.remaining = state.work;
      return next;
    }

    next.finished = true;
    next.remaining = 0;
    return next;
  },

  is_complete(state: IntervalState): boolean {
    return state.finished;
  },

  get_display(state: IntervalState): TimerDisplay {
    const phase_duration = state.phase === "work" ? state.work : state.rest;
    return {
      primary_time: state.remaining,
      progress: phase_duration > 0 ? state.remaining / phase_duration : 0,
      phase_label: state.finished ? "Done!" : state.phase === "work" ? "Work" : "Rest",
      ring_color: state.phase === "work" ? "var(--secondary)" : "var(--primary)",
      extra: {
        current_round: state.current_round,
        rounds: state.rounds,
        phase: state.phase,
        finished: state.finished,
      },
    };
  },

  get_warnings(state: IntervalState): Warning[] {
    const warnings: Warning[] = [];
    if (state.remaining > 0 && state.remaining <= 3 && state.remaining !== state.prev_remaining) {
      warnings.push({ type: "tick", key: `tick-${state.phase}-${state.current_round}-${state.remaining}` });
    }
    // Phase change warnings (when remaining just hit 0 and we transitioned)
    if (state.prev_remaining === 1 && state.remaining !== 0 && !state.finished) {
      warnings.push({ type: "phase_change", key: `phase-${state.phase}-${state.current_round}` });
    }
    if (state.finished && state.prev_remaining > 0) {
      warnings.push({ type: "complete", key: "complete" });
    }
    return warnings;
  },

  get_status_text(state: IntervalState): string {
    if (state.finished) return "Workout complete!";
    return `${state.phase === "work" ? "Working" : "Resting"} — Round ${state.current_round}/${state.rounds}`;
  },
};
