"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { TWILIGHT_IMPERIUM_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["twilight-imperium"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Build your own configuration — any game, 3-8 players",
  },
  {
    name: "Gloomhaven Turn Timer",
    href: "/board-games/multi-player-turn-timer/gloomhaven",
    description: "60-second per-turn cap pre-set for monster activations",
  },
  {
    name: "Mage Knight Turn Timer",
    href: "/board-games/multi-player-turn-timer/mage-knight",
    description: "Heavy combat puzzle — 3-minute cap, 35-minute personal bank",
  },
  {
    name: "Chess Clock",
    href: "/board-games/chess-clock",
    description: "Traditional 2-player chess clock",
  },
  {
    name: "Analysis Paralysis Timer",
    href: "/board-games/analysis-paralysis-timer",
    description: "Same engine, framed for groups that just want decisions to happen",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Twilight Imperium: Fourth
        Edition</strong>. Opens in per-turn mode with a <strong>90-second cap on
        tactical actions</strong> — the most common BoardGameGeek community
        recommendation for keeping a 4-player TI4 game under 8 hours. Add up to
        6 players (or 8 with Prophecy of Kings), customize names, and share the
        URL with your group.
      </p>

      <h2>Why Twilight Imperium needs a turn timer</h2>
      <p>
        TI4 is famously a 10-hour game that becomes a 14-hour game when one
        player is slow on the strategy phase or analysis-paralyzed during a
        tactical action. The agenda phase compounds the problem — politicking
        is core to the experience, but unbounded politicking is how 11 PM
        becomes 3 AM. A visible per-turn cap solves three problems at once: it
        gives slow players permission to commit, it gives the table permission
        to nudge, and it externalizes the time-pressure conversation so nobody
        has to call out a specific player. Most groups find the table-talk
        actually improves because slow players negotiate on other people&apos;s
        turns instead of theirs.
      </p>

      <h2>Recommended time settings for Twilight Imperium</h2>
      <p>
        Community wisdom from BoardGameGeek and the official Reddit converges
        on a small set of numbers:
      </p>
      <ul>
        <li>
          <strong>Tactical actions:</strong> 90 seconds (default on this page).
          60 seconds for 6-player games where round-trips are long.
        </li>
        <li>
          <strong>Strategy phase:</strong> 5 minutes per player — enough to
          read the card text, decide initiative, and consider trades.
        </li>
        <li>
          <strong>Agenda phase:</strong> 3 minutes per player per ride. Politics
          is the point but unbounded politics is the trap.
        </li>
        <li>
          <strong>Hybrid mode option:</strong> 90-second cap + 60-minute personal
          bank. Slow players spend their bank strategically on one big strategy
          decision rather than uniformly slowing every turn.
        </li>
      </ul>

      <h2>How this differs from a generic turn timer</h2>
      <p>
        The single-rotation <Link href="/board-games/turn-timer">turn timer</Link> is
        fine for Catan, but TI4 needs more — different turn structures per
        phase, varying player counts (3 to 8), and an answer for the one slow
        player who needs a bigger budget than everyone else. This page&apos;s
        configurator exposes per-turn, time-bank, and hybrid modes for exactly
        that reason. The <Link href="/board-games/multi-player-turn-timer">multi-player
        hub</Link> documents all three modes in detail.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={TWILIGHT_IMPERIUM_FAQ}
      related={RELATED}
      body={<Body />}
    />
  );
}

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
