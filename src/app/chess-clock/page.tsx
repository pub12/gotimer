"use client";

import React, { Suspense, useState, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Pause, Play, Pencil } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { TimerShellV2 } from "@/components/timer/timer-shell-v2";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { chessClockStrategy } from "@/lib/timer-strategies/chess-clock";
import type { ChessClockPlayer } from "@/lib/timer-strategies/chess-clock";
import { DurationInput } from "@/components/shared/timer-shell";
import { format_time } from "@/components/timer/timer-display";

const CHESS_CLOCK_FAQ = [
  {
    question: "What are the standard chess time controls?",
    answer:
      "Chess time controls are grouped into four categories: <strong>Bullet</strong> (1-2 minutes per player), <strong>Blitz</strong> (3-5 minutes), <strong>Rapid</strong> (10-30 minutes), and <strong>Classical</strong> (60+ minutes). Online platforms like Chess.com and Lichess commonly offer 1+0, 3+0, 3+2, 5+0, 10+0, and 15+10 formats.",
  },
  {
    question: "How does a chess clock work?",
    answer:
      "Each player has an independent countdown. When it is your turn, your clock ticks down. After making your move, you tap the clock (or tap your side of the screen) to stop your timer and start your opponent&apos;s. If your time reaches zero, you lose on time — unless your opponent has insufficient material to checkmate.",
  },
  {
    question: "Can I use this chess clock for games other than chess?",
    answer:
      "Yes. A two-player clock works for any head-to-head game with alternating turns: <strong>Scrabble, Go (Baduk/Weiqi), Backgammon, Othello/Reversi, Hive, and Onitama</strong>. Set the duration to match your game — 10 minutes for Scrabble, 30-60 minutes for Go.",
  },
  {
    question: "What is the difference between a chess clock and a turn timer?",
    answer:
      "A chess clock gives each player a <strong>total time bank</strong> that depletes across all their turns — spend too long on one move and you have less later. A <a href='/board-games/turn-timer'>turn timer</a> resets every turn, giving equal time per move. Chess clocks reward time management; turn timers enforce equal pacing.",
  },
  {
    question: "Is a digital chess clock better than a physical one?",
    answer:
      "Digital clocks (like this one) are free, always available on your phone, and require zero setup. Physical clocks offer tactile satisfaction and are required at official FIDE tournaments. For casual games, online play, and game nights, a browser-based clock is more practical and just as accurate.",
  },
];

const RELATED_TIMERS = [
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown with audio alerts for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Track rounds and total elapsed time for tournaments" },
  { name: "Turn Timer", href: "/board-games/turn-timer", description: "Multi-player per-turn countdown for 2-8 board game players" },
  { name: "Study Timer", href: "/productivity/study", description: "Pomodoro-style focus timer for deep work and study sessions" },
];

function ChessClockInner({ user_duration, set_user_duration }: { user_duration: number; set_user_duration: (v: number) => void }) {
  const { machine, fullscreen } = useTimer();
  const { status, display, start, pause, resume, action } = machine;
  const is_fs = fullscreen.is_fullscreen;

  const players = (display.extra?.players || []) as ChessClockPlayer[];
  const active_player = (display.extra?.active_player ?? 0) as number;
  const duration = (display.extra?.duration ?? user_duration) as number;

  const handle_player_press = (clicked_player: number) => {
    if (status !== "running") return;
    if (clicked_player !== active_player) return;
    // Clicking active player switches to other
    action("switch_player");
  };

  const btn_cls = `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${
    is_fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"
  } font-semibold transition-colors`;

  const handle_primary = () => {
    switch (status) {
      case "idle": start(); break;
      case "running": pause(); break;
      case "paused": resume(); break;
      case "complete": machine.reset(); break;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Chess Clock</h1>
        <div className="mt-4 mb-8">
          <TimerShellV2
            label="Chess Clock"
            controls={
              <div className={`flex gap-3 ${is_fs ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
                <button onClick={handle_primary} className={btn_cls}>
                  {status === "running" ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {status === "paused" ? "Resume" : "Start"}</>}
                </button>
              </div>
            }
            timer_type="chess-clock"
            remaining={players[active_player]?.time}
            running={status === "running"}
            below={
              <DurationInput value={user_duration} onChange={set_user_duration} />
            }
          >
            <div className={`flex flex-col gap-3 md:gap-4 w-full ${is_fs ? "max-w-xl" : ""}`}>
              {players.map((player, idx) => {
                const is_active = active_player === idx && status === "running";
                const progress = duration > 0 ? player.time / duration : 0;

                return (
                  <button
                    key={idx}
                    onClick={() => handle_player_press(idx)}
                    disabled={player.time === 0}
                    className={`w-full flex flex-col gap-3 rounded-2xl p-4 md:p-5 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                      is_active ? "ring-2 ring-secondary bg-secondary/5 shadow-lg" : "bg-surface-container-low hover:bg-surface-container-high hover:shadow-md"
                    } ${player.time === 0 ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            e.stopPropagation();
                            action("set_player_name", { player: idx, name: e.target.value });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-sm md:text-base font-headline font-bold bg-transparent outline-none max-w-[8rem] transition-colors duration-200 border-b border-dashed border-transparent hover:border-surface-container-highest focus:border-secondary ${
                            is_active ? "text-secondary" : "text-foreground"
                          }`}
                          aria-label={`Edit name for Player ${idx + 1}`}
                        />
                        <Pencil className={`w-3 h-3 opacity-40 ${is_active ? "text-secondary" : "text-muted-foreground"}`} />
                      </span>
                      <span className={`text-xs font-headline font-bold uppercase tracking-wider transition-colors duration-300 ${
                        is_active ? "text-secondary" : "text-muted-foreground"
                      }`}>
                        {is_active ? "Your Move" : "Waiting"}
                      </span>
                    </div>
                    <div className={`${is_fs ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"} font-headline font-black text-foreground text-center`}>
                      {format_time(player.time)}
                    </div>
                    <div className="w-full h-3 md:h-4 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bar-progress-transition ${
                          is_active
                            ? "bg-gradient-to-r from-secondary to-secondary/70"
                            : "bg-gradient-to-r from-surface-container-highest to-surface-container-high"
                        }`}
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    {is_active && (
                      <span className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold animate-pulse">
                        Tap to switch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </TimerShellV2>
        </div>

        <section className="w-full max-w-md mx-auto px-1 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Free online chess clock for two players. Perfect for chess, Scrabble, Go, and turn-based board games.
          </p>
        </section>

        <TimerSeoContent
          timer_name="Chess Clock"
          category_name="Board Games"
          category_slug="board-games"
          faq={CHESS_CLOCK_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is a Chess Clock?</h2>
          <p>
            A chess clock is a dual-timer device that tracks each player&apos;s remaining time
            independently. When you finish your move, you press the clock to pause your countdown
            and start your opponent&apos;s. The game ends when a player runs out of time — or
            delivers checkmate first. Originally mechanical, modern chess clocks are digital and
            this browser-based version gives you the same functionality for free on any device.
          </p>
          <p>
            This free online chess clock features two independent countdowns, tap-to-switch
            controls, editable player names, and configurable duration. It works on phones,
            tablets, and desktops with no download or account required.
          </p>

          <h2>Chess Time Controls Explained</h2>
          <p>
            Time controls define the pace and style of a chess game. The four main categories are:
          </p>
          <ul>
            <li><strong>Bullet (1-2 min)</strong> — Pure speed. Premoves and pattern recognition dominate. Set this clock to 60 or 120 seconds.</li>
            <li><strong>Blitz (3-5 min)</strong> — The most popular format online. Fast enough to be exciting, slow enough for tactics. Use 180-300 seconds.</li>
            <li><strong>Rapid (10-30 min)</strong> — Allows deeper calculation and strategic planning. Tournament rapid is typically 15+10 (15 minutes with 10-second increment).</li>
            <li><strong>Classical (60+ min)</strong> — Serious tournament play. FIDE standard is 90 minutes for 40 moves, then 30 minutes for the rest of the game.</li>
          </ul>
          <p>
            For casual play and game nights, 5-minute blitz or 10-minute rapid are the most popular
            starting points. Adjust the duration input to match your preferred control.
          </p>

          <h2>Using a Chess Clock for Other Board Games</h2>
          <p>
            Any two-player game with alternating turns benefits from a chess clock. Here are
            popular pairings:
          </p>
          <ul>
            <li><strong>Scrabble</strong> — Tournament Scrabble uses 25 minutes per player. A clock prevents one player from stalling while the other waits.</li>
            <li><strong>Go (Baduk/Weiqi)</strong> — Professional Go uses clocks with byo-yomi periods. For casual play, set 30-60 minutes per side.</li>
            <li><strong>Backgammon</strong> — Speed backgammon with 5-minute clocks adds urgency to doubling decisions.</li>
            <li><strong>Othello/Reversi</strong> — Competitive Othello typically uses 30 minutes per player.</li>
            <li><strong>Abstract strategy games</strong> — Hive, Onitama, Santorini, and Quoridor all play well with timed turns.</li>
          </ul>
          <p>
            For games with more than two players, switch to our <a href="/board-games/turn-timer">Turn Timer</a> which
            supports up to 8 players with per-turn countdowns.
          </p>

          <h2 id="go-clock">Using GoTimer as a Go Clock (Byoyomi)</h2>
          <p>
            Go (Baduk/Weiqi) uses a timing system called <strong>byoyomi</strong> — Japanese for
            &ldquo;second reading time.&rdquo; After a player exhausts their main time bank, they
            enter byoyomi: a series of short overtime periods (typically 30 or 60 seconds each)
            where they must complete every move within the period or lose on time. Miss the period
            and one of your byoyomi periods is consumed. Run out of all periods and the game ends.
          </p>
          <p>
            GoTimer&apos;s chess clock approximates byoyomi for casual and club-level play. Here is
            how to set it up:
          </p>
          <ul>
            <li>
              <strong>Main time</strong> — Set the duration to your main time budget per player.
              Beginners typically use 10–20 minutes; stronger club players use 30–60 minutes.
              Professional games at the highest level use 3–9 hours, but casual games work well at
              20 minutes.
            </li>
            <li>
              <strong>Byoyomi period length</strong> — The most common period lengths are
              <strong> 30 seconds</strong> (fast, online-style play) and <strong>60 seconds</strong>
              (relaxed club play). When main time expires, agree with your opponent to switch to
              per-move 30s or 60s countdowns by resetting the clock for each move.
            </li>
            <li>
              <strong>Periods remaining</strong> — Typically 3–5 byoyomi periods are allocated.
              Track consumed periods with a simple tally. A common setup for club games is
              20 minutes main time + 5 × 30-second byoyomi.
            </li>
          </ul>
          <p>
            For the full main time phase, start the chess clock at your agreed duration and play
            normally. When a player&apos;s time runs out, switch to manual byoyomi tracking with
            the 30s or 60s countdown. This gives you a free, accurate Go clock for any casual or
            study game. For more board game timer options, see our{" "}
            <a href="/game-timer">game timer guide</a>.
          </p>

          <h2>Digital vs. Physical Chess Clocks</h2>
          <p>
            Physical chess clocks — like the DGT 3000 or Chronos GX — are required at official FIDE
            and USCF tournaments. They provide tactile feedback and are visible to tournament
            directors at a distance. However, for casual games, club play, online coaching, and
            game nights, a browser-based clock is more practical: it is free, always available on
            your phone, and requires zero setup. This timer uses precise JavaScript intervals to
            deliver accurate timing within milliseconds.
          </p>
        </TimerSeoContent>
      </main>
      <Footer />
    </>
  );
}

function ChessClockPageContent() {
  const search_params = useSearchParams();
  const initial_time = Number(search_params.get("time")) || Number(search_params.get("duration")) || 300;
  const [user_duration, set_user_duration] = useState(initial_time);

  return (
    <TimerProvider strategy={chessClockStrategy} config={{ duration: user_duration }}>
      <ChessClockInner user_duration={user_duration} set_user_duration={set_user_duration} />
    </TimerProvider>
  );
}

export default function ChessClockPage() {
  return (
    <Suspense>
      <ChessClockPageContent />
    </Suspense>
  );
}
