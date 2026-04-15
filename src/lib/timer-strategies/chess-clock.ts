import type { TimerStrategy, TimerDisplay, Warning } from "./types";

export interface ChessClockPlayer {
  name: string;
  time: number;
}

export interface ChessClockState {
  players: [ChessClockPlayer, ChessClockPlayer];
  active_player: number;
  duration: number;
  prev_times: [number, number];
}

export interface ChessClockConfig {
  duration: number;
  player_names?: [string, string];
}

export const chessClockStrategy: TimerStrategy<ChessClockState> = {
  type: "chess-clock",

  initial_state(config: unknown): ChessClockState {
    const c = config as ChessClockConfig;
    const duration = c.duration || 300;
    const names = c.player_names || ["Player 1", "Player 2"];
    return {
      players: [
        { name: names[0], time: duration },
        { name: names[1], time: duration },
      ],
      active_player: 0,
      duration,
      prev_times: [duration, duration],
    };
  },

  tick(state: ChessClockState): ChessClockState {
    const active = state.active_player;
    if (state.players[active].time <= 0) return state;

    const new_players = [...state.players] as [ChessClockPlayer, ChessClockPlayer];
    const prev_times = [state.players[0].time, state.players[1].time] as [number, number];
    new_players[active] = { ...new_players[active], time: new_players[active].time - 1 };

    return { ...state, players: new_players, prev_times };
  },

  is_complete(state: ChessClockState): boolean {
    return state.players.some((p) => p.time <= 0);
  },

  get_display(state: ChessClockState): TimerDisplay {
    const active = state.players[state.active_player];
    return {
      primary_time: active.time,
      progress: state.duration > 0 ? active.time / state.duration : 0,
      phase_label: active.name,
      extra: {
        players: state.players,
        active_player: state.active_player,
        duration: state.duration,
      },
    };
  },

  get_warnings(state: ChessClockState): Warning[] {
    const warnings: Warning[] = [];
    const active = state.active_player;
    const time = state.players[active].time;
    const prev = state.prev_times[active];

    if (time > 0 && time <= 10 && time !== prev) {
      warnings.push({ type: "warning", key: `warning-${active}-${time}` });
    }
    if (time === 0 && prev !== 0) {
      warnings.push({ type: "complete", key: `timeout-${active}` });
    }
    return warnings;
  },

  on_action(state: ChessClockState, action: string, payload?: unknown): ChessClockState {
    switch (action) {
      case "switch_player": {
        const next = state.active_player === 0 ? 1 : 0;
        if (state.players[state.active_player].time <= 0) return state;
        return { ...state, active_player: next };
      }
      case "set_player_name": {
        const { player, name } = payload as { player: number; name: string };
        const new_players = [...state.players] as [ChessClockPlayer, ChessClockPlayer];
        new_players[player] = { ...new_players[player], name };
        return { ...state, players: new_players };
      }
      default:
        return state;
    }
  },

  get_status_text(state: ChessClockState): string {
    if (state.players.some((p) => p.time <= 0)) {
      const loser = state.players.findIndex((p) => p.time <= 0);
      return `${state.players[loser].name} ran out of time!`;
    }
    return `${state.players[state.active_player].name}'s turn`;
  },
};
