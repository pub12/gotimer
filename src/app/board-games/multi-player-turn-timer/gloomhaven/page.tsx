"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PerGamePresetPage } from "@/components/board-games/per-game-preset";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { GLOOMHAVEN_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["gloomhaven"];

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Configure your own — any game, 3-8 players",
  },
  {
    name: "Spirit Island Turn Timer",
    href: "/board-games/multi-player-turn-timer/spirit-island",
    description: "Cooperative game timer — 90-second cap stops quarterbacking",
  },
  {
    name: "Mage Knight Turn Timer",
    href: "/board-games/multi-player-turn-timer/mage-knight",
    description: "Heavy combat puzzle — 3-minute cap, 35-minute personal bank",
  },
  {
    name: "Twilight Imperium Turn Timer",
    href: "/board-games/multi-player-turn-timer/twilight-imperium",
    description: "90-second tactical cap for the 10-hour space epic",
  },
  {
    name: "Turn Timer (single rotation)",
    href: "/board-games/turn-timer",
    description: "Simple per-player rotation with one shared turn cap",
  },
];

function Body() {
  return (
    <>
      <p>
        A free, pre-configured turn timer for <strong>Gloomhaven</strong>,
        <strong> Frosthaven</strong>, and <strong>Jaws of the Lion</strong>.
        Opens in per-turn mode with a <strong>60-second cap</strong>, the
        community-standard pace for card-and-action planning. Customize player
        names and share the URL — the link round-trips your whole party.
      </p>

      <h2>Why Gloomhaven needs a turn timer</h2>
      <p>
        Gloomhaven&apos;s turn structure invites paralysis: choose two cards
        from your hand, pick a top action from one and a bottom action from the
        other, decide initiative, and weigh enhancements, items, and conditions.
        A motivated player can spend 5 minutes per turn looking for the optimal
        line. With a 4-player party, that&apos;s 20 minutes per round of combat
        — and combats are 8-12 rounds. A visible 60-second cap forces the 90%
        play and recovers 30+ minutes per scenario. Across a 95-scenario
        campaign, that&apos;s an extra 25 sessions of content saved.
      </p>

      <h2>Recommended time settings for Gloomhaven</h2>
      <ul>
        <li>
          <strong>Default per-turn cap:</strong> 60 seconds. Enough to pick
          cards, top/bottom actions, and items without paralysis.
        </li>
        <li>
          <strong>New scenarios:</strong> 90 seconds while you learn the room
          layout and monster cards.
        </li>
        <li>
          <strong>Perfectionist groups:</strong> 90-120 seconds. You lose some
          session throughput but keep the optimization puzzle intact.
        </li>
        <li>
          <strong>Outpost / crafting (Frosthaven):</strong> usually no timer.
          Outpost is a planning conversation, not a turn.
        </li>
      </ul>

      <h2>How this differs from a generic turn timer</h2>
      <p>
        The single-rotation <Link href="/board-games/turn-timer">turn timer</Link>
        works fine, but Gloomhaven&apos;s long campaigns benefit from per-player
        tracking. The roster shows you who is consistently slow vs. who
        occasionally takes a longer turn — useful when you&apos;re deciding
        whether to extend the cap or move on. The <Link href="/board-games/multi-player-turn-timer">multi-player
        hub</Link> documents per-turn, time-bank, and hybrid modes if your
        group wants something more bespoke.
      </p>
    </>
  );
}

function Content() {
  return (
    <PerGamePresetPage
      preset={preset}
      faq={GLOOMHAVEN_FAQ}
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
