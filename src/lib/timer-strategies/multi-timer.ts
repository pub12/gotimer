import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface SubTimer {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  running: boolean;
  completed: boolean;
}

export interface MultiTimerState {
  timers: SubTimer[];
  prev_timers: SubTimer[];
}

export interface MultiTimerConfig {
  timers: Array<{ id: string; name: string; duration: number }>;
}

export const multiTimerStrategy: TimerStrategy<MultiTimerState> = {
  type: "multi-timer",

  initial_state(config: unknown): MultiTimerState {
    const c = config as MultiTimerConfig;
    const timers = (c.timers || []).map((t) => ({
      ...t,
      remaining: t.duration,
      running: false,
      completed: false,
    }));
    return { timers, prev_timers: timers };
  },

  tick(state: MultiTimerState): MultiTimerState {
    const prev_timers = state.timers;
    const timers = state.timers.map((t) => {
      if (!t.running || t.remaining <= 0) return t;
      const remaining = t.remaining - 1;
      return { ...t, remaining, completed: remaining <= 0 };
    });
    return { timers, prev_timers };
  },

  is_complete(state: MultiTimerState): boolean {
    return state.timers.length > 0 && state.timers.every((t) => t.completed);
  },

  get_display(state: MultiTimerState): TimerDisplay {
    // Show the first active timer as primary, or the first timer
    const active = state.timers.find((t) => t.running && !t.completed) || state.timers[0];
    const total_duration = state.timers.reduce((sum, t) => sum + t.duration, 0);
    const total_remaining = state.timers.reduce((sum, t) => sum + t.remaining, 0);

    return {
      primary_time: active?.remaining || 0,
      progress: total_duration > 0 ? total_remaining / total_duration : 0,
      phase_label: active?.name || "",
      extra: { timers: state.timers },
    };
  },

  get_warnings(state: MultiTimerState): Warning[] {
    const warnings: Warning[] = [];
    for (let i = 0; i < state.timers.length; i++) {
      const t = state.timers[i];
      const prev = state.prev_timers[i];
      if (t && prev && t.completed && !prev.completed) {
        warnings.push({ type: "complete", key: `complete-${t.id}` });
      }
      if (t && prev && t.running && t.remaining > 0 && t.remaining <= 5 && t.remaining !== prev.remaining) {
        warnings.push({ type: "warning", key: `warning-${t.id}-${t.remaining}` });
      }
    }
    return warnings;
  },

  on_action(state: MultiTimerState, action: string, payload?: unknown): MultiTimerState {
    switch (action) {
      case "start_timer": {
        const id = payload as string;
        const timers = state.timers.map((t) => (t.id === id ? { ...t, running: true } : t));
        return { ...state, timers };
      }
      case "pause_timer": {
        const id = payload as string;
        const timers = state.timers.map((t) => (t.id === id ? { ...t, running: false } : t));
        return { ...state, timers };
      }
      case "reset_timer": {
        const id = payload as string;
        const timers = state.timers.map((t) =>
          t.id === id ? { ...t, remaining: t.duration, running: false, completed: false } : t,
        );
        return { ...state, timers };
      }
      case "dismiss_timer": {
        const id = payload as string;
        const timers = state.timers.filter((t) => t.id !== id);
        return { ...state, timers };
      }
      case "add_timer": {
        const p = payload as { id: string; name: string; duration: number };
        const new_timer: SubTimer = { ...p, remaining: p.duration, running: false, completed: false };
        return { ...state, timers: [...state.timers, new_timer] };
      }
      case "start_all": {
        const timers = state.timers.map((t) => (t.completed ? t : { ...t, running: true }));
        return { ...state, timers };
      }
      default:
        return state;
    }
  },

  get_status_text(state: MultiTimerState): string {
    const active = state.timers.filter((t) => t.running && !t.completed).length;
    const done = state.timers.filter((t) => t.completed).length;
    if (done === state.timers.length) return "All timers complete!";
    if (active > 0) return `${active} timer${active !== 1 ? "s" : ""} running`;
    return "Ready";
  },
};
