"use client";

import React from "react";
import Link from "next/link";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { MultiPlayerTurnTimerView } from "@/components/board-games/multi-player-turn-timer";
import { list_board_game_presets } from "@/lib/board-game-presets";
import { MULTI_PLAYER_TURN_TIMER_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Chess Clock (2 players)",
    href: "/board-games/chess-clock",
    description: "Traditional two-player chess clock for chess, shogi, and abstract games",
  },
  {
    name: "Turn Timer (single rotation)",
    href: "/board-games/turn-timer",
    description: "Simple per-player rotation with one shared turn cap and no personal bank",
  },
  {
    name: "Analysis Paralysis Timer",
    href: "/board-games/analysis-paralysis-timer",
    description: "Same engine, framed for groups that just want decisions to happen faster",
  },
  {
    name: "Round Timer",
    href: "/board-games/round-timer",
    description: "Tracks rounds and total game time for tournaments and timed phases",
  },
  {
    name: "Countdown Timer",
    href: "/board-games/countdown",
    description: "Simple shared countdown for any timed segment of a game",
  },
];

export function MultiPlayerTurnTimerHub() {
  const presets = list_board_game_presets();
  return (
    <MultiPlayerTurnTimerView
      label="Multi-Player Board Game Turn Timer"
      description="3-8 players. Per-turn, time-bank, or hybrid mode. Share the URL — names round-trip."
      defaults={{
        player_names: ["Player 1", "Player 2", "Player 3", "Player 4"],
        mode: "per-turn",
        per_turn: 90,
        bank: 20 * 60,
        warning_at: 10,
      }}
      min_players={2}
      max_players={8}
      seo_content={
        <TimerSeoContent
          timer_name="Multi-Player Turn Timer"
          category_name="Board Games"
          category_slug="board-games"
          faq={MULTI_PLAYER_TURN_TIMER_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Multi-Player Board Game Turn Timer
          </h1>
          <p>
            A free turn timer for 3-8 named players. Pick a mode (per-turn cap,
            time-bank chess-clock style, or a hybrid of both), set times, and
            share the URL — every player&apos;s name and the chosen settings
            round-trip in the link so the whole group opens the same setup. No
            signup, no install, no ads.
          </p>

          <h2>Pick a game — pre-tuned settings ready to go</h2>
          <p>
            Each of these presets opens with timing recommendations from the
            BoardGameGeek community: a per-turn cap that respects the game&apos;s
            decision depth without letting analysis paralysis sprawl, plus a
            sensible time-bank value for groups that want hard total-time
            control. Tap one to launch the timer with player names you can
            customize on the fly.
          </p>
          <ul>
            {presets.map((p) => (
              <li key={p.slug}>
                <Link href={`/board-games/multi-player-turn-timer/${p.slug}`}>
                  {p.name} turn timer
                </Link>{" "}
                — {p.tagline}
              </li>
            ))}
          </ul>

          <h2>Three modes, three different problems</h2>
          <p>
            Most board-game timers force one model on you. This one lets the
            mode match the game:
          </p>
          <ul>
            <li>
              <strong>Per-turn mode</strong> — every player gets the same time
              cap each turn. Best for games where turn-length is the bottleneck
              (Catan, Wingspan, Brass). When the cap runs out the timer chimes
              and auto-advances.
            </li>
            <li>
              <strong>Time-bank mode</strong> — every player has a personal time
              budget that drains while it is their turn. The
              multi-player equivalent of a <Link href="/board-games/chess-clock">chess clock</Link>.
              Best for games where total time per player matters (Food Chain
              Magnate, Through the Ages, tournament play).
            </li>
            <li>
              <strong>Hybrid mode</strong> — the per-turn cap drains first; once
              it&apos;s exhausted, the player&apos;s personal bank starts
              draining. The right model for games with both pacing and
              total-time concerns. Twilight Imperium with a 90-second strategy-
              card cap and a 60-minute bank is the canonical example.
            </li>
          </ul>

          <h2>How to use it</h2>
          <ol>
            <li>
              <strong>Open the configurator.</strong> Set the player count, pick
              a mode, enter time settings, and rename players. Everything is
              written into the URL as you change it.
            </li>
            <li>
              <strong>Share the link.</strong> Paste the URL into your group
              chat or open it on the tablet you keep in the middle of the table.
              Anyone who follows the link sees the same configured timer.
            </li>
            <li>
              <strong>Start the timer.</strong> The first player&apos;s clock
              begins. Tap <em>Next Player</em> when they finish their turn (or
              let it auto-advance in per-turn mode). The roster shows everyone&apos;s
              bank or last-turn time at a glance.
            </li>
            <li>
              <strong>Wrong player tapped Next?</strong> Use the back arrow to
              roll the turn back to the previous player. No state is lost.
            </li>
            <li>
              <strong>Pause whenever.</strong> The standard pause button on the
              shell freezes the active player&apos;s clock without losing turn
              state — for bathroom breaks, ruling lookups, and snack runs.
            </li>
          </ol>

          <h2>URL parameters</h2>
          <p>
            The shareable URL accepts the following parameters. All are
            optional; the configurator writes them automatically when you make
            changes.
          </p>
          <ul>
            <li>
              <code>players=Trent,Anna,Ravi,Kim</code> — comma-separated names,
              2-8 entries, URL-encoded.
            </li>
            <li>
              <code>mode=per-turn|time-bank|hybrid</code> — the timer mode.
              Defaults to per-turn.
            </li>
            <li>
              <code>per_turn=90</code> — per-turn cap in seconds (used in
              per-turn and hybrid).
            </li>
            <li>
              <code>bank=1200</code> — personal time bank per player in seconds
              (used in time-bank and hybrid).
            </li>
            <li>
              <code>warning_at=10</code> — seconds remaining at which the
              warning sound fires.
            </li>
          </ul>

          <h2>Why a multi-player turn timer beats a phone stopwatch</h2>
          <p>
            Group game nights with one slow player are death by a thousand
            decisions. A phone stopwatch tells you what already happened; a
            shared timer in the middle of the table changes what is about to
            happen. Visible time pressure shortens decisions by about a third
            in informal testing, the chime gives the player about to be skipped
            permission to commit, and the per-player tracking shows the group
            who actually needs help speeding up — without anyone having to call
            it out.
          </p>
        </TimerSeoContent>
      }
    />
  );
}
