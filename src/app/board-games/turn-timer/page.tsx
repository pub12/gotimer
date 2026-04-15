"use client";

import React, { Suspense, useState, ChangeEvent } from "react";
import { SkipForward } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { TimerShellV2 } from "@/components/timer/timer-shell-v2";
import { TimerDisplay } from "@/components/timer/timer-display";
import { TimerControls } from "@/components/timer/timer-controls";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { turnTimerStrategy } from "@/lib/timer-strategies/turn-timer";
import type { TurnPlayer } from "@/lib/timer-strategies/turn-timer";
import { DurationInput } from "@/components/shared/timer-shell";
import { format_time } from "@/components/timer/timer-display";

const TURN_TIMER_FAQ = [
  {
    question: "How many players does the turn timer support?",
    answer:
      "The GoTimer turn timer supports <strong>2 to 8 players</strong>. You can add or remove players on the setup screen before starting the game, and each player gets a customizable name so you can tell clocks apart at a glance.",
  },
  {
    question: "What happens when a player's turn time runs out?",
    answer:
      "When the countdown reaches zero, an audio alert sounds and the timer automatically advances to the next player. The expired player's total accumulated time is recorded so the group can review pacing after the game.",
  },
  {
    question: "Which board games benefit most from a turn timer?",
    answer:
      "Any game where analysis paralysis slows things down: <strong>Catan, Ticket to Ride, Terraforming Mars, Wingspan, Azul, and Splendor</strong> all play faster with per-turn limits. Strategy-heavy games like Twilight Imperium and Spirit Island also benefit, though you may want longer turn durations.",
  },
  {
    question: "Can I change the time limit per turn?",
    answer:
      "Yes. On the setup screen you can set any duration from a few seconds to several minutes using the time-per-turn input. Common choices are 30 seconds for party games, 60 seconds for mid-weight euros, and 2-3 minutes for heavier strategy games.",
  },
  {
    question: "How is a turn timer different from a chess clock?",
    answer:
      "A <a href='/chess-clock'>chess clock</a> gives each player a <strong>total time bank</strong> that counts down across all their turns — spend too long on one move and you have less later. A turn timer resets the countdown for every single turn, giving each player the same amount of time regardless of previous turns.",
  },
];

const RELATED_TIMERS = [
  { name: "Chess Clock", href: "/chess-clock", description: "Two-player clock with individual time banks — tap to switch turns" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown with audio alerts for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Track rounds and total elapsed time for tournaments and sessions" },
  { name: "Study Timer", href: "/productivity/study", description: "Pomodoro-style focus timer for deep work and study sessions" },
  { name: "Cooking Timer", href: "/kitchen/cooking", description: "Kitchen countdown with audio alerts for recipes and meal prep" },
];

function SetupScreen({
  num_players,
  set_num_players,
  time_per_turn,
  set_time_per_turn,
  player_names,
  set_player_names,
  on_start,
}: {
  num_players: number;
  set_num_players: (v: number) => void;
  time_per_turn: number;
  set_time_per_turn: (v: number) => void;
  player_names: string[];
  set_player_names: (v: string[]) => void;
  on_start: () => void;
}) {
  const handle_num_change = (n: number) => {
    const clamped = Math.max(2, Math.min(8, n));
    set_num_players(clamped);
    const names = [...player_names];
    while (names.length < clamped) names.push(`Player ${names.length + 1}`);
    set_player_names(names.slice(0, clamped));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Turn Timer</h1>
        <div className="mt-4 mb-8 w-full max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-headline font-bold text-foreground">Turn Timer</h2>
            <p className="text-sm text-muted-foreground mt-1">Per-player turn countdown for board games</p>
          </div>

          <div className="space-y-4 bg-surface-container-low rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Number of Players</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handle_num_change(num_players - 1)}
                  disabled={num_players <= 2}
                  className="w-8 h-8 rounded-lg bg-surface-container-high text-foreground font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-foreground">{num_players}</span>
                <button
                  onClick={() => handle_num_change(num_players + 1)}
                  disabled={num_players >= 8}
                  className="w-8 h-8 rounded-lg bg-surface-container-high text-foreground font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">Time Per Turn</label>
              <DurationInput value={time_per_turn} onChange={set_time_per_turn} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground block">Player Names</label>
              {player_names.slice(0, num_players).map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const next = [...player_names];
                    next[idx] = e.target.value;
                    set_player_names(next);
                  }}
                  className="w-full px-3 py-2 bg-surface-container-high rounded-xl text-foreground text-sm outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={`Player ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={on_start}
            className="w-full py-3 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base hover:bg-secondary/90 transition-colors"
          >
            Start Game
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TurnTimerInner({ on_configure }: { on_configure: () => void }) {
  const { machine, fullscreen } = useTimer();
  const { status, display, action } = machine;
  const is_fs = fullscreen.is_fullscreen;

  const players = (display.extra?.players || []) as TurnPlayer[];
  const active_player = (display.extra?.active_player ?? 0) as number;
  const time_per_turn = (display.extra?.time_per_turn ?? 60) as number;
  const active = players[active_player];

  const next_btn_cls = `flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${
    is_fs ? "py-4 sm:py-5 px-8 text-lg" : "py-3 sm:py-4 px-6 text-base"
  } font-semibold transition-colors`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Turn Timer</h1>
        <div className="mt-4 mb-8">
          <TimerShellV2
            label="Turn Timer"
            timer_type="turn-timer"
            remaining={display.primary_time}
            running={status === "running"}
            on_configure={on_configure}
            controls={
              <TimerControls
                extra_actions={
                  status === "running" ? (
                    <button onClick={() => action("next_player")} className={next_btn_cls}>
                      <SkipForward className="w-5 h-5" /> Next Player
                    </button>
                  ) : undefined
                }
              />
            }
          >
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                Current Turn
              </span>
              <span className={`text-xl md:text-2xl font-headline font-bold ${status === "running" ? "text-secondary" : "text-foreground"}`}>
                {active?.name || "Player"}
              </span>
            </div>
            <TimerDisplay
              time={display.primary_time}
              progress={display.progress}
              variant="ring"
              color={display.ring_color}
              phase_label={display.phase_label}
            />
          </TimerShellV2>
        </div>

        <section className="w-full max-w-md mx-auto px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center">All Players</h3>
          <div className="space-y-2">
            {players.map((player, idx) => {
              const is_active = idx === active_player && status === "running";
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                    is_active
                      ? "bg-secondary/10 ring-1 ring-secondary"
                      : "bg-surface-container-low"
                  }`}
                >
                  <span className={`font-semibold ${is_active ? "text-secondary" : "text-foreground"}`}>
                    {player.name}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Total: {format_time(player.total_time_used)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Per-player turn countdown timer for board games. Supports 2-8 players.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TurnTimerPageContent() {
  const [started, set_started] = useState(false);
  const [num_players, set_num_players] = useState(4);
  const [time_per_turn, set_time_per_turn] = useState(60);
  const [player_names, set_player_names] = useState(() =>
    Array.from({ length: 4 }, (_, i) => `Player ${i + 1}`)
  );

  const seo_block = (
    <TimerSeoContent
      timer_name="Turn Timer"
      category_name="Board Games"
      category_slug="board-games"
      faq={TURN_TIMER_FAQ}
      related_timers={RELATED_TIMERS}
    >
      <h2>What Is a Board Game Turn Timer?</h2>
      <p>
        A turn timer gives every player at the table a fixed countdown for their turn. When the
        clock hits zero, play moves on — no more waiting ten minutes while someone agonises over
        which tile to place. Unlike a <a href="/chess-clock">chess clock</a> that tracks a total
        time bank, a turn timer resets after each move so everyone gets equal thinking time
        regardless of how many turns have passed.
      </p>
      <p>
        This free multi-player turn timer supports 2-8 players with customisable names and
        adjustable time limits. It runs entirely in your browser — no app download, no sign-up,
        no ads interrupting your game night.
      </p>

      <h2>Board Games That Need a Turn Timer</h2>
      <p>
        Any tabletop game where one slow player can stall the table benefits from timed turns.
        Here are the categories where a turn timer makes the biggest difference:
      </p>
      <ul>
        <li><strong>Euro strategy games</strong> — Catan, Terraforming Mars, Wingspan, Agricola, and Brass: Birmingham all involve multi-step planning that can spiral without a time cap.</li>
        <li><strong>Tile-laying and pattern games</strong> — Azul, Cascadia, and Patchwork play faster when placement decisions have a deadline.</li>
        <li><strong>Party and social deduction games</strong> — Codenames, Wavelength, and The Resistance benefit from short 30-second limits that keep energy high.</li>
        <li><strong>Deck-builders</strong> — Dominion, Star Realms, and Clank! can drag when a player over-optimises their buy phase.</li>
        <li><strong>Heavy thematic games</strong> — Twilight Imperium, Gloomhaven, and Spirit Island use longer per-turn limits (2-5 minutes) to keep marathon sessions on track.</li>
      </ul>

      <h2>How to Configure the Turn Timer</h2>
      <ol>
        <li><strong>Choose your player count</strong> — Use the +/- buttons to select between 2 and 8 players.</li>
        <li><strong>Set time per turn</strong> — Pick a duration that suits your game. 30 seconds works for light games, 60 seconds for mid-weight euros, and 2-3 minutes for complex strategy titles.</li>
        <li><strong>Name your players</strong> — Tap each name field to personalise. Names appear on the active-turn display and in the scoreboard.</li>
        <li><strong>Start the game</strong> — Press &quot;Start Game&quot; to begin. The first player&apos;s clock starts immediately.</li>
        <li><strong>Advance turns</strong> — Hit &quot;Next Player&quot; when a player finishes early, or let the clock auto-advance when time expires.</li>
      </ol>

      <h2>Turn Timer vs. Chess Clock vs. Round Timer</h2>
      <p>
        Choosing the right timer depends on your game&apos;s structure. A <strong>turn timer</strong> resets
        every turn — ideal when you want equal per-move time. A <a href="/chess-clock">chess clock</a> gives
        each player a total time budget they manage across all turns — better for competitive play where time
        management is part of the skill. A <a href="/round-timer">round timer</a> tracks total elapsed time
        per round without per-player separation — useful for tournaments and timed phases.
      </p>
      <p>
        For most casual board game nights, the turn timer strikes the best balance: it prevents analysis
        paralysis without punishing players who needed extra time on one critical decision earlier in the game.
      </p>
    </TimerSeoContent>
  );

  if (!started) {
    return (
      <>
        <SetupScreen
          num_players={num_players}
          set_num_players={set_num_players}
          time_per_turn={time_per_turn}
          set_time_per_turn={set_time_per_turn}
          player_names={player_names}
          set_player_names={set_player_names}
          on_start={() => set_started(true)}
        />
        {seo_block}
      </>
    );
  }

  return (
    <>
      <TimerProvider
        strategy={turnTimerStrategy}
        config={{ player_names: player_names.slice(0, num_players), time_per_turn }}
      >
        <TurnTimerInner on_configure={() => set_started(false)} />
      </TimerProvider>
      {seo_block}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <TurnTimerPageContent />
    </Suspense>
  );
}
