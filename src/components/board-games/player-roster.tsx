"use client";

import React from "react";
import { format_time } from "@/components/timer/timer-display";
import { useTimer } from "@/components/timer/timer-provider";
import type { MPMode, MPPlayer } from "@/lib/timer-strategies/multi-player-turn-timer";

const CHIP_COLORS = [
  "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
];

export function PlayerRoster() {
  const { machine } = useTimer();
  const display = machine.display;
  const players = (display.extra?.players || []) as MPPlayer[];
  const active = (display.extra?.active_player ?? 0) as number;
  const mode = (display.extra?.mode || "per-turn") as MPMode;

  if (players.length === 0) return null;

  return (
    <section className="w-full max-w-md mx-auto px-1">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center">
        Players
      </h3>
      <ol className="space-y-2">
        {players.map((p, idx) => {
          const is_active = idx === active && machine.status === "running";
          const initial = (p.name?.[0] || "?").toUpperCase();
          const color = CHIP_COLORS[idx % CHIP_COLORS.length];
          const detail =
            mode === "time-bank" || mode === "hybrid"
              ? `Bank ${format_time(Math.max(0, p.bank_remaining))}`
              : p.turns_taken > 0
                ? `Last turn ${format_time(p.last_turn_seconds)}`
                : "Yet to play";
          return (
            <li
              key={idx}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                is_active
                  ? "bg-secondary/10 ring-1 ring-secondary"
                  : "bg-surface-container-low"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-7 h-7 shrink-0 rounded-full font-bold text-xs flex items-center justify-center ${color}`}
                  aria-hidden="true"
                >
                  {initial}
                </span>
                <span
                  className={`text-sm font-semibold truncate ${
                    is_active ? "text-secondary" : "text-foreground"
                  }`}
                >
                  {p.name}
                </span>
              </div>
              <div className="text-right pl-2 shrink-0">
                <div className="font-mono text-xs text-muted-foreground">{detail}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                  {p.turns_taken} turn{p.turns_taken === 1 ? "" : "s"} · total{" "}
                  {format_time(p.total_time_used)}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
