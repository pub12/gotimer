import type { TimerStrategy, TimerDisplay, Warning } from "./types";

/**
 * Multi-player turn timer for 3-8 named players. Three modes:
 *
 *   per-turn   — every player gets the same fixed cap each turn. Auto-advances
 *                when the cap runs out.
 *   time-bank  — each player has a personal time budget that drains while it
 *                is their turn (multiplayer chess clock). No per-turn cap;
 *                player switching is manual.
 *   hybrid     — per-turn cap drains first; once the cap is exhausted, the
 *                player's personal bank starts draining. Manual advance.
 */

export type MPMode = "per-turn" | "time-bank" | "hybrid";

export interface MPPlayer {
  name: string;
  /** Personal time bank (seconds). Only meaningful in time-bank/hybrid. */
  bank_remaining: number;
  /** Total seconds this player has used across all turns. */
  total_time_used: number;
  /** Number of completed turns. */
  turns_taken: number;
  /** Seconds spent on the last completed turn (per-turn display). */
  last_turn_seconds: number;
}

export interface MPState {
  players: MPPlayer[];
  active_player: number;
  mode: MPMode;
  /** Seconds remaining in the current turn (per-turn / hybrid). */
  turn_remaining: number;
  /** Configured per-turn cap. */
  per_turn: number;
  /** Configured starting bank per player. */
  bank: number;
  /** Threshold (seconds remaining) at which to emit a warning. */
  warning_at: number;
  prev_turn_remaining: number;
  prev_bank_remaining: number;
}

export interface MPConfig {
  player_names: string[];
  mode: MPMode;
  /** Per-turn cap in seconds. */
  per_turn: number;
  /** Per-player bank in seconds (used in time-bank / hybrid). */
  bank: number;
  /** Seconds-remaining threshold for warning audio. */
  warning_at: number;
}

function default_names(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
}

function clone_players(players: MPPlayer[]): MPPlayer[] {
  return players.map((p) => ({ ...p }));
}

export const multiPlayerTurnTimerStrategy: TimerStrategy<MPState> = {
  type: "multi-player-turn-timer",

  initial_state(config: unknown): MPState {
    const c = (config || {}) as Partial<MPConfig>;
    const mode: MPMode = c.mode === "time-bank" || c.mode === "hybrid" ? c.mode : "per-turn";
    const per_turn = c.per_turn && c.per_turn > 0 ? c.per_turn : 60;
    const bank = c.bank && c.bank > 0 ? c.bank : 600;
    const warning_at = c.warning_at && c.warning_at > 0 ? c.warning_at : 10;
    const names = c.player_names && c.player_names.length >= 2 ? c.player_names : default_names(4);

    const players: MPPlayer[] = names.map((name) => ({
      name,
      bank_remaining: bank,
      total_time_used: 0,
      turns_taken: 0,
      last_turn_seconds: 0,
    }));

    return {
      players,
      active_player: 0,
      mode,
      turn_remaining: mode === "time-bank" ? 0 : per_turn,
      per_turn,
      bank,
      warning_at,
      prev_turn_remaining: mode === "time-bank" ? 0 : per_turn,
      prev_bank_remaining: bank,
    };
  },

  tick(state: MPState): MPState {
    const active_idx = state.active_player;
    const active = state.players[active_idx];
    if (!active) return state;

    const players = clone_players(state.players);
    const next: MPState = {
      ...state,
      players,
      prev_turn_remaining: state.turn_remaining,
      prev_bank_remaining: active.bank_remaining,
    };

    // Always accrue total time used while the active player's clock runs.
    players[active_idx].total_time_used += 1;

    if (state.mode === "per-turn") {
      if (state.turn_remaining > 1) {
        next.turn_remaining = state.turn_remaining - 1;
        return next;
      }
      // Turn elapsed — auto-advance to the next player.
      players[active_idx].turns_taken += 1;
      players[active_idx].last_turn_seconds = state.per_turn;
      next.active_player = (active_idx + 1) % state.players.length;
      next.turn_remaining = state.per_turn;
      return next;
    }

    if (state.mode === "time-bank") {
      // Bank drains; no auto-advance. Floor at zero.
      players[active_idx].bank_remaining = Math.max(0, active.bank_remaining - 1);
      return next;
    }

    // hybrid — drain the per-turn cap first, then the bank.
    if (state.turn_remaining > 0) {
      next.turn_remaining = state.turn_remaining - 1;
      return next;
    }
    players[active_idx].bank_remaining = Math.max(0, active.bank_remaining - 1);
    return next;
  },

  is_complete(): boolean {
    // Multi-player sessions run until manually stopped or reset.
    return false;
  },

  get_display(state: MPState): TimerDisplay {
    const active = state.players[state.active_player];
    let primary_time: number;
    let progress: number;

    if (state.mode === "time-bank") {
      primary_time = active?.bank_remaining ?? 0;
      progress = state.bank > 0 ? primary_time / state.bank : 0;
    } else if (state.mode === "hybrid" && state.turn_remaining <= 0) {
      primary_time = active?.bank_remaining ?? 0;
      progress = state.bank > 0 ? primary_time / state.bank : 0;
    } else {
      primary_time = state.turn_remaining;
      progress = state.per_turn > 0 ? primary_time / state.per_turn : 0;
    }

    return {
      primary_time,
      progress,
      phase_label: active?.name || "",
      extra: {
        players: state.players,
        active_player: state.active_player,
        mode: state.mode,
        per_turn: state.per_turn,
        bank: state.bank,
        turn_remaining: state.turn_remaining,
      },
    };
  },

  get_warnings(state: MPState): Warning[] {
    const warnings: Warning[] = [];
    const active = state.players[state.active_player];
    if (!active) return warnings;

    // Per-turn / hybrid: warning fires when the turn cap counts toward zero.
    if ((state.mode === "per-turn" || state.mode === "hybrid") && state.turn_remaining > 0) {
      if (
        state.turn_remaining <= state.warning_at &&
        state.turn_remaining !== state.prev_turn_remaining
      ) {
        warnings.push({
          type: "warning",
          key: `warning-${state.active_player}-${active.turns_taken}-${state.turn_remaining}`,
        });
      }
    }

    // Per-turn auto-advance fires a phase change.
    if (
      state.mode === "per-turn" &&
      state.turn_remaining === state.per_turn &&
      state.prev_turn_remaining === 1
    ) {
      warnings.push({
        type: "phase_change",
        key: `auto-advance-${state.active_player}`,
      });
    }

    // Bank warnings (time-bank / hybrid) — same threshold against the bank.
    if (state.mode === "time-bank" || (state.mode === "hybrid" && state.turn_remaining === 0)) {
      const bank_now = active.bank_remaining;
      if (
        bank_now > 0 &&
        bank_now <= state.warning_at &&
        bank_now !== state.prev_bank_remaining
      ) {
        warnings.push({
          type: "warning",
          key: `bank-warning-${state.active_player}-${bank_now}`,
        });
      }
      if (bank_now === 0 && state.prev_bank_remaining > 0) {
        warnings.push({
          type: "complete",
          key: `bank-out-${state.active_player}`,
        });
      }
    }
    return warnings;
  },

  on_action(state: MPState, action: string, payload?: unknown): MPState {
    switch (action) {
      case "next_player": {
        const players = clone_players(state.players);
        const current = state.active_player;
        const elapsed =
          state.mode === "time-bank"
            ? state.bank - state.players[current].bank_remaining
            : state.mode === "hybrid"
              ? state.per_turn - state.turn_remaining +
                Math.max(0, state.bank - state.players[current].bank_remaining)
              : state.per_turn - state.turn_remaining;
        players[current].turns_taken += 1;
        players[current].last_turn_seconds = Math.max(0, elapsed);

        const next_idx = (current + 1) % state.players.length;
        return {
          ...state,
          players,
          active_player: next_idx,
          turn_remaining: state.mode === "time-bank" ? 0 : state.per_turn,
          prev_turn_remaining: state.mode === "time-bank" ? 0 : state.per_turn,
          prev_bank_remaining: players[next_idx].bank_remaining,
        };
      }
      case "previous_player": {
        const prev_idx = (state.active_player - 1 + state.players.length) % state.players.length;
        return {
          ...state,
          active_player: prev_idx,
          turn_remaining: state.mode === "time-bank" ? 0 : state.per_turn,
          prev_turn_remaining: state.mode === "time-bank" ? 0 : state.per_turn,
          prev_bank_remaining: state.players[prev_idx].bank_remaining,
        };
      }
      case "set_player_name": {
        const { index, name } = payload as { index: number; name: string };
        if (index < 0 || index >= state.players.length) return state;
        const players = clone_players(state.players);
        players[index].name = name;
        return { ...state, players };
      }
      default:
        return state;
    }
  },

  get_status_text(state: MPState): string {
    const active = state.players[state.active_player];
    if (!active) return "Player";
    if (state.mode === "time-bank") {
      return `${active.name}'s turn — bank running`;
    }
    if (state.mode === "hybrid" && state.turn_remaining === 0) {
      return `${active.name} — over cap, eating bank`;
    }
    return `${active.name}'s turn`;
  },
};
