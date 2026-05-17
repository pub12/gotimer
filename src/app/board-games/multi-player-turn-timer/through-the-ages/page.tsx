"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { THROUGH_THE_AGES_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["through-the-ages"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Food Chain Magnate Turn Timer",
    href: "/board-games/multi-player-turn-timer/food-chain-magnate",
    description: "Time-bank mode for the auction-and-hire phases",
  },
  {
    name: "Brass: Birmingham Turn Timer",
    href: "/board-games/multi-player-turn-timer/brass-birmingham",
    description: "90-second cap for build-and-flip planning",
  },
  {
    name: "Terra Mystica Turn Timer",
    href: "/board-games/multi-player-turn-timer/terra-mystica",
    description: "2-minute cap for multi-step euro turns",
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
        A free, pre-configured turn timer for <strong>Through the Ages: A New
        Story of Civilization</strong>. Opens in <strong>time-bank mode</strong>
        with a <strong>30-minute personal budget per player</strong> — the
        multiplayer chess-clock model that TtA&apos;s uneven civilization-arc
        turn structure actually wants.
      </p>

      <h2>Why time-bank works for Through the Ages</h2>
      <p>
        TtA turns vary enormously in length and importance: a setup-age turn
        might be 30 seconds of routine card pickup; a mid-age tech-adoption
        turn might be 8 minutes of agonized planning; a late-age culture-card
        chain might be 15 minutes of squeezing the last 20 points out of a
        Wonder. A per-turn cap forces the same shape on all of them, which
        loses the game&apos;s actual structure. Time-bank mode lets each
        player allocate their budget across the moments that matter to their
        civilization arc.
      </p>

      <h2>Recommended time settings for Through the Ages</h2>
      <ul>
        <li>
          <strong>Default bank:</strong> 30 minutes per player. Matches the
          ~2-hour playtime of a 4-player TtA game plus setup and events.
        </li>
        <li>
          <strong>New groups:</strong> 35 minutes. First-time TtA players are
          learning the card economy; give them buffer.
        </li>
        <li>
          <strong>Veteran groups:</strong> 25 minutes. Experienced TtA players
          know their lines and don&apos;t need the buffer.
        </li>
        <li>
          <strong>Warning at 30 seconds remaining.</strong> The default 10
          seconds is too late for chess-clock-style bank management.
        </li>
        <li>
          <strong>Events / military / aggressions:</strong> pause the timer.
          Mechanical resolution that shouldn&apos;t count against any one
          player.
        </li>
      </ul>

      <h2>How this compares to other modes</h2>
      <p>
        <strong>Per-turn mode</strong> would force a 2-minute cap on every TtA
        turn, which is too long for setup turns and too short for tech-adoption
        turns. <strong>Hybrid mode</strong> (90-second cap + 20-minute bank) is
        a middle ground but adds complexity without much benefit — the cap
        rarely matters because TtA decisions are either fast or slow with no
        in-between. The <Link href="/board-games/multi-player-turn-timer">multi-
        player hub</Link> documents all three modes if you want to experiment.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={THROUGH_THE_AGES_FAQ}
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
