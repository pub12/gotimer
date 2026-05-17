"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { MAGE_KNIGHT_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["mage-knight"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Spirit Island Turn Timer",
    href: "/board-games/multi-player-turn-timer/spirit-island",
    description: "Cooperative — 90-second cap stops quarterbacking",
  },
  {
    name: "Gloomhaven Turn Timer",
    href: "/board-games/multi-player-turn-timer/gloomhaven",
    description: "60-second cap for card-and-action planning",
  },
  {
    name: "Twilight Imperium Turn Timer",
    href: "/board-games/multi-player-turn-timer/twilight-imperium",
    description: "90-second tactical cap for the 10-hour space epic",
  },
  {
    name: "Analysis Paralysis Timer",
    href: "/board-games/analysis-paralysis-timer",
    description: "Same engine, framed for any AP-prone game",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Mage Knight: The Board
        Game</strong> (and the Ultimate Edition, the deluxe rebox, and any of
        the expansions). Opens in per-turn mode with a generous <strong>3-
        minute cap</strong> — large by design, because Mage Knight turns are
        combat puzzles you actually want to play. Solo or 2-4 players.
      </p>

      <h2>Why Mage Knight gets a longer cap</h2>
      <p>
        Most board-game timer recommendations are 60-90 seconds. Mage Knight
        is the exception: every turn is a 3-7 card combat puzzle with
        modifiers, mana, wounds, and movement to sequence. A 60-second cap
        kills the game — you cannot play Mage Knight at that pace. A 3-minute
        cap is enough to find a 95%-optimal sequence without sliding into the
        15-minute &quot;perfect line&quot; spiral that makes Mage Knight a
        4-hour solo session. If your group consistently exceeds the cap, the
        problem isn&apos;t the game; it&apos;s scope creep on the optimization.
      </p>

      <h2>Recommended time settings for Mage Knight</h2>
      <ul>
        <li>
          <strong>Default per-turn cap:</strong> 3 minutes. Enough for the
          combat puzzle without a full optimization spiral.
        </li>
        <li>
          <strong>Cooperative play (2-4 players):</strong> 2 minutes per turn,
          to prevent quarterbacking and let quieter players play their own
          puzzles.
        </li>
        <li>
          <strong>Solo competitive (against a target time):</strong> switch to
          time-bank mode with 90 minutes. Self-pace the scenario as a personal
          goal.
        </li>
        <li>
          <strong>Hybrid mode for veterans:</strong> 3-minute cap + 35-minute
          personal bank. Lets you spend 8 minutes on the one critical &quot;break
          the puzzle&quot; turn per scenario.
        </li>
        <li>
          <strong>Level-up / rest / movement-only turns:</strong> pause the
          timer. The cap is for the combat puzzle, not for bookkeeping.
        </li>
      </ul>

      <h2>Solo Mage Knight as a self-paced challenge</h2>
      <p>
        Mage Knight is famously one of the best solo experiences in the hobby,
        but veteran players know it can stretch from a 90-minute Conquest to a
        4-hour Conquest if you over-optimize. The time-bank mode is genuinely
        useful here as a personal challenge: &quot;90-minute Volkare conquest&quot;
        is a constraint that&apos;s fun to design around. Set a 90-minute bank
        and see if you can hit it. The <Link href="/board-games/multi-player-turn-timer">multi-
        player hub</Link> documents the full set of modes.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={MAGE_KNIGHT_FAQ}
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
