import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface StepDefinition {
  name: string;
  duration: number;
  /** Agitation config for this step */
  agitation?: {
    initial_seconds: number;
    interval_seconds: number;
    duration_seconds: number;
  };
}

export interface MultiStepState {
  steps: StepDefinition[];
  current_step: number;
  step_remaining: number;
  step_elapsed: number;
  /** Time since last agitation (for agitation reminders) */
  agitation_countdown: number;
  /** Whether user needs to acknowledge agitation */
  agitation_pending: boolean;
  finished: boolean;
  prev_step_remaining: number;
  prev_step: number;
  /** Tracks remaining time when each step was skipped (undefined = completed normally) */
  skipped_times: (number | undefined)[];
}

export interface MultiStepConfig {
  steps: StepDefinition[];
}

export const multiStepStrategy: TimerStrategy<MultiStepState> = {
  type: "multi-step",

  initial_state(config: unknown): MultiStepState {
    const c = config as MultiStepConfig;
    const steps = c.steps || [];
    const first = steps[0];
    return {
      steps,
      current_step: 0,
      step_remaining: first?.duration || 0,
      step_elapsed: 0,
      agitation_countdown: first?.agitation?.initial_seconds || 0,
      agitation_pending: false,
      finished: steps.length === 0,
      prev_step_remaining: first?.duration || 0,
      prev_step: 0,
      skipped_times: new Array(steps.length).fill(undefined),
    };
  },

  tick(state: MultiStepState): MultiStepState {
    if (state.finished || state.agitation_pending) return state;

    const next = {
      ...state,
      prev_step_remaining: state.step_remaining,
      prev_step: state.current_step,
    };

    // Agitation countdown
    const step = state.steps[state.current_step];
    if (step?.agitation && state.step_elapsed >= (step.agitation.initial_seconds || 0)) {
      next.agitation_countdown = state.agitation_countdown - 1;
      if (next.agitation_countdown <= 0) {
        next.agitation_pending = true;
        return next;
      }
    }

    if (state.step_remaining > 1) {
      next.step_remaining = state.step_remaining - 1;
      next.step_elapsed = state.step_elapsed + 1;
      return next;
    }

    // Step complete — advance to next step
    const next_step_idx = state.current_step + 1;
    if (next_step_idx >= state.steps.length) {
      next.finished = true;
      next.step_remaining = 0;
      return next;
    }

    const next_step = state.steps[next_step_idx];
    next.current_step = next_step_idx;
    next.step_remaining = next_step.duration;
    next.step_elapsed = 0;
    next.agitation_countdown = next_step.agitation?.initial_seconds || 0;
    next.agitation_pending = false;
    return next;
  },

  is_complete(state: MultiStepState): boolean {
    return state.finished;
  },

  get_display(state: MultiStepState): TimerDisplay {
    const step = state.steps[state.current_step];
    return {
      primary_time: state.step_remaining,
      progress: step && step.duration > 0 ? state.step_remaining / step.duration : 0,
      phase_label: step?.name || "",
      step_info: {
        current: state.current_step,
        total: state.steps.length,
        name: step?.name || "",
      },
      extra: {
        steps: state.steps,
        agitation_countdown: state.agitation_countdown,
        agitation_pending: state.agitation_pending,
        finished: state.finished,
        skipped_times: state.skipped_times,
      },
    };
  },

  get_warnings(state: MultiStepState): Warning[] {
    const warnings: Warning[] = [];
    if (state.step_remaining > 0 && state.step_remaining <= 5 && state.step_remaining !== state.prev_step_remaining) {
      warnings.push({ type: "tick", key: `tick-${state.current_step}-${state.step_remaining}` });
    }
    if (state.current_step !== state.prev_step && !state.finished) {
      warnings.push({ type: "phase_change", key: `step-${state.current_step}` });
    }
    if (state.finished && state.prev_step_remaining > 0) {
      warnings.push({ type: "complete", key: "complete" });
    }
    if (state.agitation_pending) {
      warnings.push({ type: "warning", key: `agitate-${state.current_step}-${state.step_elapsed}` });
    }
    return warnings;
  },

  on_action(state: MultiStepState, action: string): MultiStepState {
    switch (action) {
      case "acknowledge_agitation": {
        const step = state.steps[state.current_step];
        return {
          ...state,
          agitation_pending: false,
          agitation_countdown: step?.agitation?.interval_seconds || 60,
        };
      }
      case "skip_step": {
        const skipped = [...state.skipped_times];
        skipped[state.current_step] = state.step_remaining;
        const next_idx = state.current_step + 1;
        if (next_idx >= state.steps.length) {
          return { ...state, finished: true, step_remaining: 0, skipped_times: skipped };
        }
        const next_step = state.steps[next_idx];
        return {
          ...state,
          prev_step: state.current_step,
          current_step: next_idx,
          step_remaining: next_step.duration,
          step_elapsed: 0,
          agitation_countdown: next_step.agitation?.initial_seconds || 0,
          agitation_pending: false,
          skipped_times: skipped,
        };
      }
      case "previous_step": {
        // Judges rewind a phase. From finished, restore the final step itself.
        const from_idx = state.finished
          ? state.steps.length
          : state.current_step;
        const prev_idx = Math.max(0, from_idx - 1);
        const prev_step = state.steps[prev_idx];
        if (!prev_step) return state;
        const skipped = [...state.skipped_times];
        skipped[prev_idx] = undefined;
        return {
          ...state,
          prev_step: state.current_step,
          current_step: prev_idx,
          step_remaining: prev_step.duration,
          step_elapsed: 0,
          agitation_countdown: prev_step.agitation?.initial_seconds || 0,
          agitation_pending: false,
          finished: false,
          skipped_times: skipped,
        };
      }
      default:
        return state;
    }
  },

  get_status_text(state: MultiStepState): string {
    if (state.finished) return "All steps complete!";
    if (state.agitation_pending) return "AGITATE NOW";
    const step = state.steps[state.current_step];
    return `${step?.name || "Step"} (${state.current_step + 1}/${state.steps.length})`;
  },
};
