/** Core types for the timer strategy system */

export interface TimerDisplay {
  /** Primary time to display (seconds) */
  primary_time: number;
  /** Optional secondary time (e.g., total time in round timer) */
  secondary_time?: number;
  /** Progress 0-1 for ring/bar visualization */
  progress: number;
  /** Current phase label (e.g., "Work", "Rest", "Developer") */
  phase_label?: string;
  /** Step info for multi-step timers */
  step_info?: { current: number; total: number; name: string };
  /** Suggested ring/accent color */
  ring_color?: string;
  /** Extra display data (strategy-specific) */
  extra?: Record<string, unknown>;
}

export interface Warning {
  type: "tick" | "warning" | "complete" | "phase_change";
  /** Unique key to prevent duplicate alerts for the same event */
  key: string;
}

/**
 * A TimerStrategy defines how a specific timer type behaves.
 * Strategies are pure objects/functions — no React.
 */
export interface TimerStrategy<TState> {
  /** Unique type identifier */
  type: string;

  /** Create the initial state from config */
  initial_state: (config: unknown) => TState;

  /** Advance state by one tick (1 second) */
  tick: (state: TState) => TState;

  /** Check if the timer has completed */
  is_complete: (state: TState) => boolean;

  /** Get the display data from current state */
  get_display: (state: TState) => TimerDisplay;

  /** Get any warnings that should fire audio/visual alerts */
  get_warnings: (state: TState) => Warning[];

  /** Handle a custom action (e.g., "switch_player", "next_step", "acknowledge_agitation") */
  on_action?: (state: TState, action: string, payload?: unknown) => TState;

  /** Get a human-readable status text */
  get_status_text: (state: TState) => string;
}
