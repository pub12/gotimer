"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { MultiPlayerTurnTimerView } from "@/components/board-games/multi-player-turn-timer";
import { ANALYSIS_PARALYSIS_FAQ } from "./faq";

const RELATED = [
  {
    name: "Multi-Player Turn Timer hub",
    href: "/board-games/multi-player-turn-timer",
    description: "Same engine — game-specific presets and full URL parameter documentation",
  },
  {
    name: "Twilight Imperium Turn Timer",
    href: "/board-games/multi-player-turn-timer/twilight-imperium",
    description: "90-second tactical cap for AP-prone TI4 groups",
  },
  {
    name: "Gloomhaven Turn Timer",
    href: "/board-games/multi-player-turn-timer/gloomhaven",
    description: "60-second cap for card-and-action planning",
  },
  {
    name: "Spirit Island Turn Timer",
    href: "/board-games/multi-player-turn-timer/spirit-island",
    description: "Cooperative — stops quarterbacking in 90 seconds",
  },
  {
    name: "Chess Clock (2 players)",
    href: "/board-games/chess-clock",
    description: "Traditional 2-player chess clock for tournament play",
  },
  {
    name: "Turn Timer (single rotation)",
    href: "/board-games/turn-timer",
    description: "Simple per-player rotation with one shared cap",
  },
];

function Content() {
  return (
    <MultiPlayerTurnTimerView
      label="Analysis Paralysis Timer"
      description="Per-turn cap that chimes when a player overruns. 2-8 players, hybrid mode for mixed-pace groups."
      defaults={{
        player_names: ["Player 1", "Player 2", "Player 3", "Player 4"],
        mode: "per-turn",
        per_turn: 90,
        bank: 15 * 60,
        warning_at: 10,
      }}
      seo_content={
        <TimerSeoContent
          timer_name="Analysis Paralysis Timer"
          category_name="Board Games"
          category_slug="board-games"
          faq={ANALYSIS_PARALYSIS_FAQ}
          related_timers={RELATED}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Analysis Paralysis Timer
          </h1>
          <p>
            A free turn timer designed to cure analysis paralysis in board game
            groups. Sets a 90-second per-turn cap by default; switch to hybrid
            mode for mixed-pace groups (cap + personal bank), or time-bank mode
            for tournament-style budgeting. No signup, no ads, share the URL
            with your group.
          </p>

          <h2>What is analysis paralysis?</h2>
          <p>
            <strong>Analysis paralysis</strong> (AP) is the state where a
            player freezes mid-turn, weighing every possible move while the
            table waits. It&apos;s a structural problem — a function of
            decision-space depth combined with the social pressure of being
            watched — not a personality trait. Almost every gaming group has
            at least one AP-prone player, and almost every AP-prone player is
            painfully aware of it. The right fix isn&apos;t to nudge or shame
            them; it&apos;s to externalize the time-pressure conversation so
            nobody has to call anyone out.
          </p>

          <h2>How a turn timer fixes AP</h2>
          <p>
            A visible cap changes the social dynamic. Without a timer, the
            slow player feels watched and the rest of the table either suffers
            silently or has to call them out (terrible options). With a cap,
            the timer chimes for everyone equally, and the AP player gets
            permission to commit to a 90-second decision rather than the
            5-minute optimal one. Most groups find AP players are noticeably
            more relaxed at the table once a timer is present because they
            no longer feel personally responsible for the table&apos;s pace —
            the cap is.
          </p>

          <h2>Time settings by game weight</h2>
          <ul>
            <li>
              <strong>Light euros</strong> (Catan, Ticket to Ride, Splendor,
              Azul): 60 seconds.
            </li>
            <li>
              <strong>Mid-weight strategy</strong> (Wingspan, Everdell,
              Cascadia): 90 seconds.
            </li>
            <li>
              <strong>Heavy strategy</strong> (<Link href="/board-games/multi-player-turn-timer/brass-birmingham">
              Brass</Link>, <Link href="/board-games/multi-player-turn-timer/terra-mystica">
              Terra Mystica</Link>, Agricola, Power Grid): 90-120 seconds.
            </li>
            <li>
              <strong>Heavy combat puzzles</strong> (<Link href="/board-games/multi-player-turn-timer/gloomhaven">
              Gloomhaven</Link>, <Link href="/board-games/multi-player-turn-timer/mage-knight">
              Mage Knight</Link>): 60-180 seconds depending on the game.
            </li>
            <li>
              <strong>Epic strategy</strong> (<Link href="/board-games/multi-player-turn-timer/twilight-imperium">
              Twilight Imperium</Link>): 90 seconds tactical + 5-minute strategy
              cap.
            </li>
          </ul>

          <h2>Hybrid mode is the answer for mixed-pace groups</h2>
          <p>
            If your group has both fast and AP-prone players, use the
            configurator&apos;s <strong>hybrid mode</strong>: a 90-second per-
            turn cap plus a 10-15 minute personal bank. The cap forces everyone
            to commit to a 90-second plan, but the personal bank gives AP
            players room to spend extra time on the one critical decision of
            the game without slowing every turn. Fast players never touch
            their bank; AP players use theirs strategically. This is the
            single most effective setting we&apos;ve found for mixed-pace
            groups.
          </p>

          <h2>How to introduce the timer to a resistant group</h2>
          <ol>
            <li>
              Frame it as a group experiment, not a fix for one person.
              &quot;Let&apos;s try a 90-second cap for the next round and see
              how it feels.&quot;
            </li>
            <li>
              Start with a generous cap (90-120 seconds for the first session).
              Tighten only if the group wants to.
            </li>
            <li>
              Use hybrid mode so AP-prone players have a bank to lean on. The
              bank is the social cushion.
            </li>
            <li>
              Pause for rules disputes, snack runs, and bathroom breaks. The
              cap is for decisions, not for everything.
            </li>
            <li>
              After 2-3 sessions, ask the group whether to keep the cap. Most
              groups vote to keep it, including the AP players.
            </li>
          </ol>
        </TimerSeoContent>
      }
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
