"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { FOOD_CHAIN_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["food-chain-magnate"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Through the Ages Turn Timer",
    href: "/board-games/multi-player-turn-timer/through-the-ages",
    description: "Time-bank mode for civilization-arc decisions",
  },
  {
    name: "Twilight Imperium Turn Timer",
    href: "/board-games/multi-player-turn-timer/twilight-imperium",
    description: "90-second tactical cap for the 10-hour space epic",
  },
  {
    name: "Brass: Birmingham Turn Timer",
    href: "/board-games/multi-player-turn-timer/brass-birmingham",
    description: "90-second cap for build-and-flip planning",
  },
  {
    name: "Chess Clock (2 players)",
    href: "/board-games/chess-clock",
    description: "Traditional 2-player chess clock",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Food Chain Magnate</strong>.
        Opens in <strong>time-bank mode</strong> with a <strong>25-minute
        personal budget per player</strong> — the multiplayer chess-clock model
        that FCM&apos;s uneven turn structure actually wants. Supports 2-5
        players; customize names and share the URL.
      </p>

      <h2>Why time-bank is the right model for Food Chain Magnate</h2>
      <p>
        FCM&apos;s turn structure is genuinely uneven: auctions are short for
        most players and brutally long for the winner; hiring is sometimes a
        20-second pick and sometimes a 5-minute optimization; reorganization
        is mostly mechanical; sales resolve almost automatically. A per-turn
        cap would punish the wrong moments — fast hiring becomes pressured,
        long auctions stay long, and the cap creates anxiety without saving
        meaningful time. Time-bank lets each player allocate their 25 minutes
        across the phases that actually matter to their strategy.
      </p>

      <h2>Recommended time settings for Food Chain Magnate</h2>
      <ul>
        <li>
          <strong>Default bank:</strong> 25 minutes per player (~100 minutes for
          a 4-player game). Matches BGG-community recommendations.
        </li>
        <li>
          <strong>New groups:</strong> 30 minutes per player. The first FCM
          game is a learning experience; let the bank reflect that.
        </li>
        <li>
          <strong>Veteran groups:</strong> 20 minutes per player. Experienced
          FCM players know their lines; they don&apos;t need the buffer.
        </li>
        <li>
          <strong>Warning threshold:</strong> 30 seconds. The default 10
          seconds is too late for a chess-clock-style bank; 30 seconds gives
          the player time to actually commit.
        </li>
        <li>
          <strong>Pause during rules disputes.</strong> The bank is for
          decision time, not for arguing about whether Burgers count as Pizza.
        </li>
      </ul>

      <h2>How this differs from a 2-player chess clock</h2>
      <p>
        Functionally identical, scaled to 5 players. The classic <Link href="/board-games/chess-clock">2-player
        chess clock</Link> is the right tool for chess and 2-player abstracts.
        For 3+ player FCM, the multi-player time-bank is the right tool. The
        per-player roster shows each player&apos;s bank-remaining at a glance,
        which is genuinely useful information during FCM&apos;s mid-game when
        you&apos;re deciding whether the auction is worth the time cost.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={FOOD_CHAIN_FAQ}
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
