"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { TERRA_MYSTICA_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["terra-mystica"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Brass: Birmingham Turn Timer",
    href: "/board-games/multi-player-turn-timer/brass-birmingham",
    description: "90-second cap for build-and-flip planning",
  },
  {
    name: "Through the Ages Turn Timer",
    href: "/board-games/multi-player-turn-timer/through-the-ages",
    description: "Time-bank mode for civilization-arc decisions",
  },
  {
    name: "Food Chain Magnate Turn Timer",
    href: "/board-games/multi-player-turn-timer/food-chain-magnate",
    description: "Time-bank mode for punishing auction-and-hire phases",
  },
  {
    name: "Chess Clock",
    href: "/board-games/chess-clock",
    description: "Traditional 2-player chess clock",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Terra Mystica</strong>
        (and equally suitable for <strong>Gaia Project</strong>). Opens in per-
        turn mode with a <strong>2-minute cap</strong> — calibrated for the
        multi-step decisions that make Terra Mystica turns longer than a
        typical euro. Supports 2-5 players; rename them and share the URL.
      </p>

      <h2>Why Terra Mystica needs a longer per-turn cap</h2>
      <p>
        Most euros work fine with a 90-second cap, but Terra Mystica turns are
        denser: terraform, build, dwelling-to-stronghold upgrade, scoring tile
        alignment, faction-power triggers, cult-track tracking. A 90-second cap
        forces players to skip steps; a 2-minute cap fits the actual decision
        without inviting paralysis. Once players know their factions, you can
        drop to 90 seconds — but the default 2 minutes is the safe starting
        point.
      </p>

      <h2>Recommended time settings for Terra Mystica</h2>
      <ul>
        <li>
          <strong>New / unfamiliar factions:</strong> 2 minutes (default).
          Players need time to scan their faction power tile and current
          options.
        </li>
        <li>
          <strong>Experienced groups:</strong> 90 seconds. Once you know your
          faction, decisions are faster.
        </li>
        <li>
          <strong>Pass action:</strong> use the same cap, or 60 seconds if your
          group passes slowly. The pass decision is fast once you stop
          optimizing the scoring tile.
        </li>
        <li>
          <strong>5-player Terra Mystica:</strong> default 2 minutes is right;
          5-player games already run long, the cap just keeps them
          predictable.
        </li>
        <li>
          <strong>Income / cult-track end-of-round:</strong> pause the timer.
          Mechanical bookkeeping.
        </li>
      </ul>

      <h2>How this differs from a generic turn timer</h2>
      <p>
        Terra Mystica&apos;s 6-round structure makes per-turn mode the right
        default — turn count per player is fairly even, so a uniform cap works
        for everyone. If your group has one player who is consistently 50%
        slower than the rest, switch the configurator to <strong>time-bank
        mode</strong> with a 30-minute personal budget and let them allocate it
        as they like. The <Link href="/board-games/multi-player-turn-timer">multi-player
        hub</Link> documents all three modes (per-turn, time-bank, hybrid).
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={TERRA_MYSTICA_FAQ}
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
