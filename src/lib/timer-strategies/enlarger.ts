import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export type EnlargerMode = "simple" | "fstop" | "test_strip" | "split_grade";

export interface EnlargerState {
  mode: EnlargerMode;
  /** Current exposure time remaining */
  remaining: number;
  /** Current exposure duration */
  duration: number;
  prev_remaining: number;
  /** For test strip: which strip we're on */
  current_strip: number;
  total_strips: number;
  /** For split-grade: which grade ("soft" | "hard") */
  grade: "soft" | "hard";
  /** Dry-down compensation enabled */
  dry_down: boolean;
  dry_down_percent: number;
  finished: boolean;
  /** Calculated exposure table for display */
  exposure_table: Array<{ strip: number; interval: number; cumulative: number }>;
}

export interface EnlargerConfig {
  mode: EnlargerMode;
  base_time: number;
  /** f-stop increment: 0.333 (1/3), 0.5 (1/2), 1 (full) */
  fstop_increment?: number;
  strips?: number;
  /** Split-grade: soft and hard times */
  soft_time?: number;
  hard_time?: number;
  dry_down?: boolean;
  dry_down_percent?: number;
}

function calculate_test_strip_table(base: number, strips: number, increment: number): Array<{ strip: number; interval: number; cumulative: number }> {
  const table: Array<{ strip: number; interval: number; cumulative: number }> = [];
  let cumulative = 0;
  for (let i = 0; i < strips; i++) {
    const exposure = base * Math.pow(2, i * increment);
    const interval = i === 0 ? exposure : exposure - cumulative;
    cumulative = exposure;
    table.push({ strip: i + 1, interval: Math.round(interval * 10) / 10, cumulative: Math.round(cumulative * 10) / 10 });
  }
  return table;
}

export const enlargerStrategy: TimerStrategy<EnlargerState> = {
  type: "enlarger",

  initial_state(config: unknown): EnlargerState {
    const c = config as EnlargerConfig;
    const mode = c.mode || "simple";
    const base = c.base_time || 10;
    const dry_down = c.dry_down ?? false;
    const dry_down_percent = c.dry_down_percent ?? 8;
    const adjusted_base = dry_down ? base * (1 - dry_down_percent / 100) : base;

    let duration: number;
    let exposure_table: Array<{ strip: number; interval: number; cumulative: number }> = [];
    const strips = c.strips || 5;
    const increment = c.fstop_increment || 0.333;

    switch (mode) {
      case "test_strip":
        exposure_table = calculate_test_strip_table(adjusted_base, strips, increment);
        duration = exposure_table[0]?.interval || adjusted_base;
        break;
      case "split_grade":
        duration = dry_down ? (c.soft_time || 10) * (1 - dry_down_percent / 100) : (c.soft_time || 10);
        break;
      default:
        duration = Math.round(adjusted_base * 10) / 10;
    }

    return {
      mode,
      remaining: Math.round(duration * 10) / 10,
      duration: Math.round(duration * 10) / 10,
      prev_remaining: Math.round(duration * 10) / 10,
      current_strip: mode === "test_strip" ? 1 : 0,
      total_strips: strips,
      grade: "soft",
      dry_down,
      dry_down_percent,
      finished: false,
      exposure_table,
    };
  },

  tick(state: EnlargerState): EnlargerState {
    if (state.finished || state.remaining <= 0) {
      // For test strip: advance to next strip
      if (state.mode === "test_strip" && state.remaining <= 0 && !state.finished) {
        if (state.current_strip < state.total_strips) {
          const next_strip = state.current_strip + 1;
          const entry = state.exposure_table[next_strip - 1];
          const duration = entry?.interval || 0;
          return {
            ...state,
            current_strip: next_strip,
            remaining: duration,
            duration,
            prev_remaining: 0,
          };
        }
        return { ...state, finished: true };
      }
      return state;
    }

    return {
      ...state,
      prev_remaining: state.remaining,
      remaining: Math.round((state.remaining - 1) * 10) / 10,
    };
  },

  is_complete(state: EnlargerState): boolean {
    return state.finished;
  },

  get_display(state: EnlargerState): TimerDisplay {
    let label = "";
    switch (state.mode) {
      case "test_strip":
        label = `Strip ${state.current_strip}/${state.total_strips}`;
        break;
      case "split_grade":
        label = state.grade === "soft" ? "Soft (Grade 0)" : "Hard (Grade 5)";
        break;
      default:
        label = "Exposing";
    }

    return {
      primary_time: Math.ceil(state.remaining),
      progress: state.duration > 0 ? state.remaining / state.duration : 0,
      phase_label: label,
      extra: {
        mode: state.mode,
        exposure_table: state.exposure_table,
        current_strip: state.current_strip,
        total_strips: state.total_strips,
        grade: state.grade,
        dry_down: state.dry_down,
      },
    };
  },

  get_warnings(state: EnlargerState): Warning[] {
    const warnings: Warning[] = [];
    if (state.remaining <= 0 && state.prev_remaining > 0) {
      if (state.mode === "test_strip" && state.current_strip < state.total_strips) {
        warnings.push({ type: "phase_change", key: `strip-${state.current_strip}` });
      } else {
        warnings.push({ type: "complete", key: "complete" });
      }
    }
    return warnings;
  },

  on_action(state: EnlargerState, action: string): EnlargerState {
    if (action === "switch_grade" && state.mode === "split_grade") {
      return { ...state, grade: state.grade === "soft" ? "hard" : "soft" };
    }
    return state;
  },

  get_status_text(state: EnlargerState): string {
    if (state.finished) return "Exposure complete";
    if (state.mode === "test_strip") return `Strip ${state.current_strip} of ${state.total_strips}`;
    return "Exposing...";
  },
};
