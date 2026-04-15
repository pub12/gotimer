import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface TurnPlayer {
  name: string;
  time_remaining: number;
  total_time_used: number;
}

export interface TurnTimerState {
  players: TurnPlayer[];
  active_player: number;
  time_per_turn: number;
  turn_remaining: number;
  prev_turn_remaining: number;
  finished: boolean;
}

export interface TurnTimerConfig {
  player_names: string[];
  time_per_turn: number;
}

export const turnTimerStrategy: TimerStrategy<TurnTimerState> = {
  type: "turn-timer",

  initial_state(config: unknown): TurnTimerState {
    const c = config as TurnTimerConfig;
    const time = c.time_per_turn || 60;
    const players = (c.player_names || ["Player 1", "Player 2"]).map((name) => ({
      name,
      time_remaining: time,
      total_time_used: 0,
    }));
    return {
      players,
      active_player: 0,
      time_per_turn: time,
      turn_remaining: time,
      prev_turn_remaining: time,
      finished: false,
    };
  },

  tick(state: TurnTimerState): TurnTimerState {
    if (state.finished || state.turn_remaining <= 0) return state;

    const next = { ...state, prev_turn_remaining: state.turn_remaining };
    next.turn_remaining = state.turn_remaining - 1;

    // Update active player's total time
    const players = [...state.players];
    const active = { ...players[state.active_player] };
    active.total_time_used += 1;
    players[state.active_player] = active;
    next.players = players;

    // Auto-advance if time ran out
    if (next.turn_remaining <= 0) {
      const next_player = (state.active_player + 1) % state.players.length;
      next.active_player = next_player;
      next.turn_remaining = state.time_per_turn;
    }

    return next;
  },

  is_complete(): boolean {
    // Turn timer runs until manually stopped
    return false;
  },

  get_display(state: TurnTimerState): TimerDisplay {
    const active = state.players[state.active_player];
    return {
      primary_time: state.turn_remaining,
      progress: state.time_per_turn > 0 ? state.turn_remaining / state.time_per_turn : 0,
      phase_label: active?.name || "",
      extra: {
        players: state.players,
        active_player: state.active_player,
        time_per_turn: state.time_per_turn,
      },
    };
  },

  get_warnings(state: TurnTimerState): Warning[] {
    const warnings: Warning[] = [];
    if (state.turn_remaining > 0 && state.turn_remaining <= 5 && state.turn_remaining !== state.prev_turn_remaining) {
      warnings.push({ type: "warning", key: `warning-${state.active_player}-${state.turn_remaining}` });
    }
    if (state.turn_remaining === 0 && state.prev_turn_remaining > 0) {
      warnings.push({ type: "phase_change", key: `turn-end-${state.active_player}` });
    }
    return warnings;
  },

  on_action(state: TurnTimerState, action: string, payload?: unknown): TurnTimerState {
    switch (action) {
      case "next_player": {
        const next_player = (state.active_player + 1) % state.players.length;
        return { ...state, active_player: next_player, turn_remaining: state.time_per_turn, prev_turn_remaining: state.time_per_turn };
      }
      case "set_player_name": {
        const { index, name } = payload as { index: number; name: string };
        const players = [...state.players];
        players[index] = { ...players[index], name };
        return { ...state, players };
      }
      default:
        return state;
    }
  },

  get_status_text(state: TurnTimerState): string {
    const active = state.players[state.active_player];
    return `${active?.name || "Player"}'s turn`;
  },
};
