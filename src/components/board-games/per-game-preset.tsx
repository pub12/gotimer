"use client";

import React from "react";
import Link from "next/link";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { MultiPlayerTurnTimerView } from "@/components/board-games/multi-player-turn-timer";
import type { BoardGamePreset } from "@/lib/board-game-presets";

interface RelatedTimer {
  name: string;
  href: string;
  description: string;
}

interface PerGamePresetPageProps {
  preset: BoardGamePreset;
  faq: Array<{ question: string; answer: string }>;
  related: RelatedTimer[];
  /** Game-specific SEO body rendered above the FAQ. */
  body: React.ReactNode;
}

function default_names(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
}

export function PerGamePresetPage({
  preset,
  faq,
  related,
  body,
}: PerGamePresetPageProps) {
  const label = `${preset.name} Turn Timer`;
  return (
    <MultiPlayerTurnTimerView
      label={label}
      description={preset.tagline}
      defaults={{
        player_names: default_names(preset.default_players),
        mode: preset.default_mode,
        per_turn: preset.default_per_turn,
        bank: preset.default_bank,
        warning_at: preset.warning_at,
      }}
      min_players={preset.min_players}
      max_players={preset.max_players}
      seo_content={
        <TimerSeoContent
          timer_name={label}
          category_name="Board Games"
          category_slug="board-games"
          faq={faq}
          related_timers={related}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            {label}
          </h1>
          {body}
          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Rename the players.</strong> Tap each placeholder name in
              the configurator. Names are URL-encoded so the link you share
              with the group already has everyone in it.
            </li>
            <li>
              <strong>Confirm the mode and times.</strong> This page opens with
              recommended settings for {preset.name}; tweak as needed.
            </li>
            <li>
              <strong>Tap Start.</strong> The first player&apos;s clock begins.
              Use <em>Next Player</em> when they finish their turn, or let the
              cap auto-advance in per-turn mode.
            </li>
            <li>
              <strong>Pause for breaks.</strong> The shell pause button freezes
              the active player&apos;s clock without losing turn state.
            </li>
          </ol>

          <h2>Modes explained</h2>
          <p>
            The <Link href="/board-games/multi-player-turn-timer">multi-player
            hub</Link> offers three modes — each suits a different problem. The
            preset opens in <strong>{preset.default_mode}</strong> mode, but you
            can switch on the configurator screen at any time.
          </p>
          <ul>
            <li>
              <strong>Per-turn</strong> — fixed cap per turn, auto-advance when
              the cap runs out.
            </li>
            <li>
              <strong>Time-bank</strong> — chess-clock-style personal budget per
              player, drains while it is their turn.
            </li>
            <li>
              <strong>Hybrid</strong> — per-turn cap first, then the personal
              bank starts draining. Best for games with both pacing and total-
              time concerns.
            </li>
          </ul>
        </TimerSeoContent>
      }
    />
  );
}
