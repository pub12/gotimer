import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface AmbientState {
  remaining: number;
  duration: number;
  midpoint_agitation: boolean;
  midpoint_triggered: boolean;
  midpoint_pending: boolean;
  prev_remaining: number;
  notes: string;
}

export interface AmbientConfig {
  duration: number;
  midpoint_agitation?: boolean;
  notes?: string;
}

export const ambientStrategy: TimerStrategy<AmbientState> = {
  type: "ambient",

  initial_state(config: unknown): AmbientState {
    const c = config as AmbientConfig;
    const duration = c.duration || 3600;
    return {
      remaining: duration,
      duration,
      midpoint_agitation: c.midpoint_agitation ?? true,
      midpoint_triggered: false,
      midpoint_pending: false,
      prev_remaining: duration,
      notes: c.notes || "",
    };
  },

  tick(state: AmbientState): AmbientState {
    if (state.remaining <= 0 || state.midpoint_pending) return state;

    const next = { ...state, prev_remaining: state.remaining, remaining: state.remaining - 1 };

    // Check midpoint
    if (
      state.midpoint_agitation &&
      !state.midpoint_triggered &&
      next.remaining <= Math.floor(state.duration / 2)
    ) {
      next.midpoint_triggered = true;
      next.midpoint_pending = true;
    }

    return next;
  },

  is_complete(state: AmbientState): boolean {
    return state.remaining <= 0;
  },

  get_display(state: AmbientState): TimerDisplay {
    return {
      primary_time: state.remaining,
      progress: state.duration > 0 ? state.remaining / state.duration : 0,
      phase_label: state.midpoint_pending ? "AGITATE GENTLY" : "Development",
      extra: {
        midpoint_pending: state.midpoint_pending,
        notes: state.notes,
      },
    };
  },

  get_warnings(state: AmbientState): Warning[] {
    const warnings: Warning[] = [];
    if (state.midpoint_pending && !state.midpoint_triggered) {
      warnings.push({ type: "warning", key: "midpoint" });
    }
    if (state.remaining === 0 && state.prev_remaining !== 0) {
      warnings.push({ type: "complete", key: "complete" });
    }
    return warnings;
  },

  on_action(state: AmbientState, action: string): AmbientState {
    if (action === "acknowledge_agitation") {
      return { ...state, midpoint_pending: false };
    }
    return state;
  },

  get_status_text(state: AmbientState): string {
    if (state.remaining === 0) return "Development complete — pour out developer";
    if (state.midpoint_pending) return "AGITATE GENTLY";
    return "Stand development in progress";
  },
};
