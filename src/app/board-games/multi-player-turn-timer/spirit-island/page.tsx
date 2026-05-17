"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { SPIRIT_ISLAND_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["spirit-island"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Gloomhaven Turn Timer",
    href: "/board-games/multi-player-turn-timer/gloomhaven",
    description: "Cooperative dungeon-crawler — 60-second cap for card planning",
  },
  {
    name: "Mage Knight Turn Timer",
    href: "/board-games/multi-player-turn-timer/mage-knight",
    description: "Combat puzzle solo or in co-op — 3-minute cap, 35-minute bank",
  },
  {
    name: "Analysis Paralysis Timer",
    href: "/board-games/analysis-paralysis-timer",
    description: "Same engine, framed for any AP-prone game",
  },
  {
    name: "Turn Timer (single rotation)",
    href: "/board-games/turn-timer",
    description: "Simple per-player rotation with one shared cap",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Spirit Island</strong>.
        Opens in per-turn mode with a <strong>90-second cap per spirit</strong>
        — purpose-built to stop the alpha-player quarterback problem that
        plagues cooperative games. Customize the spirit names and share the
        URL with your group.
      </p>

      <h2>Why Spirit Island needs a turn timer (the quarterback problem)</h2>
      <p>
        Spirit Island&apos;s biggest social bug isn&apos;t one slow player —
        it&apos;s the experienced player solving everyone&apos;s turn out loud.
        Cooperative games invite open-table optimization, which sounds helpful
        but usually means quieter players become spectators of their own
        spirits. A 90-second cap restructures the table: every spirit plays
        their own turn, the cap chimes if they need a moment, and the rest of
        the table is implicitly told to wait. The result is a game where every
        spirit&apos;s player actually plays their spirit.
      </p>

      <h2>Recommended time settings for Spirit Island</h2>
      <ul>
        <li>
          <strong>Fast and slow powers:</strong> 90 seconds per spirit per
          phase. Enough for power-text reading, energy spending, and target
          selection without table debate.
        </li>
        <li>
          <strong>Complex spirits (Volcano Looming High, Shifting Memory):</strong>
          2 minutes. Their power text is dense; reading it is half the turn.
        </li>
        <li>
          <strong>Invader / Ravage / Build phases:</strong> pause the timer.
          Mechanical and shouldn&apos;t count against any one spirit.
        </li>
        <li>
          <strong>Growth phase:</strong> usually no timer; growth is fast.
        </li>
      </ul>

      <h2>Use this timer with the expansions</h2>
      <p>
        The default 90-second cap is calibrated for base-game spirits. <strong>
        Branch &amp; Claw</strong> and <strong>Jagged Earth</strong> add more
        complex spirits and event cards — for those, bump the cap to 2 minutes
        and consider a hybrid mode (90-second cap + 10-minute personal bank) so
        complex spirits get extra room without slowing everyone else. The <Link href="/board-games/multi-player-turn-timer">multi-player
        hub</Link> documents the hybrid mode in full.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={SPIRIT_ISLAND_FAQ}
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
