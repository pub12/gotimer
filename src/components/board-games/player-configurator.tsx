"use client";

import React, { ChangeEvent } from "react";
import { DurationInput } from "@/components/shared/timer-shell";
import type { MPMode } from "@/lib/timer-strategies/multi-player-turn-timer";

export interface MultiPlayerConfig {
  player_names: string[];
  mode: MPMode;
  per_turn: number;
  bank: number;
}

interface PlayerConfiguratorProps {
  config: MultiPlayerConfig;
  on_change: (next: MultiPlayerConfig) => void;
  on_start: () => void;
  start_label?: string;
  min_players?: number;
  max_players?: number;
  show_mode_selector?: boolean;
}

export function PlayerConfigurator({
  config,
  on_change,
  on_start,
  start_label = "Start Game",
  min_players = 2,
  max_players = 8,
  show_mode_selector = true,
}: PlayerConfiguratorProps) {
  const { player_names, mode, per_turn, bank } = config;
  const count = player_names.length;

  const change_count = (n: number) => {
    const clamped = Math.max(min_players, Math.min(max_players, n));
    const names = [...player_names];
    while (names.length < clamped) names.push(`Player ${names.length + 1}`);
    on_change({ ...config, player_names: names.slice(0, clamped) });
  };

  const change_name = (idx: number, value: string) => {
    const names = [...player_names];
    names[idx] = value;
    on_change({ ...config, player_names: names });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      <div className="space-y-4 bg-surface-container-low rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Number of Players</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => change_count(count - 1)}
              disabled={count <= min_players}
              className="w-8 h-8 rounded-lg bg-surface-container-high text-foreground font-bold disabled:opacity-40"
              aria-label="Remove player"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-foreground">{count}</span>
            <button
              type="button"
              onClick={() => change_count(count + 1)}
              disabled={count >= max_players}
              className="w-8 h-8 rounded-lg bg-surface-container-high text-foreground font-bold disabled:opacity-40"
              aria-label="Add player"
            >
              +
            </button>
          </div>
        </div>

        {show_mode_selector && (
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["per-turn", "time-bank", "hybrid"] as MPMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => on_change({ ...config, mode: m })}
                  className={`px-2 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    mode === m
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-surface-container-high text-foreground hover:bg-surface-container-highest"
                  }`}
                >
                  {m === "per-turn" ? "Per-turn" : m === "time-bank" ? "Time bank" : "Hybrid"}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
              {mode === "per-turn" &&
                "Each turn has the same time cap. Auto-advances when the cap runs out."}
              {mode === "time-bank" &&
                "Each player has a personal budget that drains while it is their turn (multiplayer chess clock)."}
              {mode === "hybrid" &&
                "Per-turn cap drains first; once the cap is exhausted, the player's personal bank drains."}
            </p>
          </div>
        )}

        {(mode === "per-turn" || mode === "hybrid") && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Time per turn</label>
            <DurationInput
              value={per_turn}
              onChange={(v) => on_change({ ...config, per_turn: v })}
            />
          </div>
        )}

        {(mode === "time-bank" || mode === "hybrid") && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Bank per player</label>
            <DurationInput value={bank} onChange={(v) => on_change({ ...config, bank: v })} />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground block">Player Names</label>
          {player_names.map((name, idx) => (
            <input
              key={idx}
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => change_name(idx, e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-high rounded-xl text-foreground text-sm outline-none focus:ring-2 focus:ring-secondary"
              placeholder={`Player ${idx + 1}`}
              maxLength={32}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={on_start}
        className="w-full py-3 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base hover:bg-secondary/90 transition-colors"
      >
        {start_label}
      </button>
    </div>
  );
}
