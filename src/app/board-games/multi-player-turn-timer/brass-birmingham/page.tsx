"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { BRASS_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["brass-birmingham"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Terra Mystica Turn Timer",
    href: "/board-games/multi-player-turn-timer/terra-mystica",
    description: "Two-minute cap for long, multi-step euro turns",
  },
  {
    name: "Food Chain Magnate Turn Timer",
    href: "/board-games/multi-player-turn-timer/food-chain-magnate",
    description: "Time-bank mode for the punishing auction-and-hire phases",
  },
  {
    name: "Twilight Imperium Turn Timer",
    href: "/board-games/multi-player-turn-timer/twilight-imperium",
    description: "90-second tactical cap for the 10-hour space epic",
  },
  {
    name: "Analysis Paralysis Timer",
    href: "/board-games/analysis-paralysis-timer",
    description: "Same engine, framed for any game that drags on AP",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Brass: Birmingham</strong>
        (also works for <strong>Brass: Lancashire</strong>). Opens in per-turn
        mode with a <strong>90-second cap</strong> — the BoardGameGeek-community
        sweet spot for build-and-flip decisions. Supports 2-4 players;
        customize names and share the URL with your group.
      </p>

      <h2>Why Brass needs a turn timer</h2>
      <p>
        Brass is a planning game disguised as an action game. Turns themselves
        are short — pick an action, pay costs, place a tile — but the planning
        for those turns can stretch indefinitely as players walk through every
        permutation of develop, build, scout, and loan. The late game is
        particularly bad: every build creates a downstream flip, every flip
        sets up the next link, and the optimal sequencing is often a 4-step
        chain. A visible cap forces commitment to a plan that&apos;s formed
        during other people&apos;s turns — which is how Brass is supposed to be
        played anyway.
      </p>

      <h2>Recommended time settings for Brass</h2>
      <ul>
        <li>
          <strong>4-player Brass: Birmingham:</strong> 90 seconds per turn
          (default). 75 if your group is paralysis-prone.
        </li>
        <li>
          <strong>3-player Brass:</strong> 90 seconds is fine — the table
          rhythm benefits more than the absolute cap.
        </li>
        <li>
          <strong>Brass: Lancashire:</strong> 75 seconds. Lancashire turns are
          slightly simpler since the rail era is less branchy.
        </li>
        <li>
          <strong>Era transitions:</strong> pause the timer. Transitions are
          mechanical and take 2-3 minutes that shouldn&apos;t count against any
          one player.
        </li>
      </ul>

      <h2>How this differs from a chess clock</h2>
      <p>
        A <Link href="/board-games/chess-clock">2-player chess clock</Link>
        works fine for tournament Brass at 2 players. For 3-4 player groups,
        per-turn mode is usually better because the slow player will eat their
        bank in the first two turns and then play the rest of the game at
        zero, which defeats the purpose. The <Link href="/board-games/multi-player-turn-timer">multi-player
        hub</Link> exposes the time-bank and hybrid modes if your group wants
        that flavor.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={BRASS_FAQ}
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
