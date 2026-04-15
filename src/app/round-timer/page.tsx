"use client";

import React, { Suspense } from "react";
import { RotateCcw, Pause, Play } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { TimerShellV2 } from "@/components/timer/timer-shell-v2";
import { TimerDisplay, format_time } from "@/components/timer/timer-display";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { roundTimerStrategy } from "@/lib/timer-strategies/round-timer";

const ROUND_TIMER_FAQ = [
  {
    question: "What is a round timer used for?",
    answer:
      "A round timer counts up from zero and lets you mark individual rounds (or laps). It tracks <strong>total elapsed time</strong> and the duration of each round separately. Common uses include boxing rounds, MMA training, debate speeches, board game tournament phases, and presentation timeboxing.",
  },
  {
    question: "How is a round timer different from an interval timer?",
    answer:
      "An interval timer (like <a href='/fitness/tabata'>Tabata</a> or <a href='/fitness/emom'>EMOM</a>) automates fixed work/rest periods with automatic transitions. A round timer gives you <strong>manual control</strong> — you decide when each round ends by pressing \"Next Round.\" This makes it ideal for activities with variable-length rounds.",
  },
  {
    question: "Can I use this for boxing or MMA rounds?",
    answer:
      "Yes. Press Start to begin round one, then tap \"Next Round\" when the bell would ring. The timer records each round&apos;s duration so you can review your pacing afterward. Standard boxing rounds are 3 minutes; MMA rounds are 5 minutes. You manage the transitions manually for maximum flexibility.",
  },
  {
    question: "Does the round timer save my round history?",
    answer:
      "Round durations are displayed in a scrollable list below the main timer during your session. The history persists as long as the page is open. Refreshing the page resets the timer and clears round history.",
  },
  {
    question: "What is the difference between a round timer and a chess clock?",
    answer:
      "A <a href='/chess-clock'>chess clock</a> counts <strong>down</strong> from a set duration and tracks two competing players. A round timer counts <strong>up</strong> indefinitely and tracks sequential rounds for a single user or group. Use a chess clock for head-to-head competition and a round timer for tracking phases or laps.",
  },
];

const RELATED_TIMERS = [
  { name: "Chess Clock", href: "/chess-clock", description: "Two-player countdown clock for head-to-head competition" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown with audio alerts for any timed deadline" },
  { name: "Turn Timer", href: "/board-games/turn-timer", description: "Multi-player per-turn countdown for board games (2-8 players)" },
  { name: "Tabata Timer", href: "/fitness/tabata", description: "Classic 20s work / 10s rest interval protocol for HIIT" },
  { name: "EMOM Timer", href: "/fitness/emom", description: "Every Minute On the Minute intervals for CrossFit workouts" },
];

function RoundTimerInner() {
  const { machine, fullscreen } = useTimer();
  const { status, display, start, pause, resume, action } = machine;
  const is_fs = fullscreen.is_fullscreen;

  const previous_rounds = (display.extra?.previous_rounds || []) as number[];

  const btn_cls = `flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl ${
    is_fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"
  } font-semibold transition-colors`;
  const outline_cls = `flex-1 flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl ${
    is_fs ? "py-4 sm:py-5 text-lg" : "py-3 sm:py-4 text-base"
  } font-semibold transition-colors`;

  const handle_toggle = () => {
    switch (status) {
      case "idle": start(); break;
      case "running": pause(); break;
      case "paused": resume(); break;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Round Timer</h1>
        <div className="mt-4 mb-8">
          <TimerShellV2
            label="Round Timer"
            controls={
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <button onClick={handle_toggle} className={btn_cls}>
                  {status === "running" ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> {status !== "idle" ? "Resume" : "Start"}</>}
                </button>
                <button onClick={() => action("next_round")} className={outline_cls}>
                  <RotateCcw className="w-5 h-5" /> Next Round
                </button>
              </div>
            }
            timer_type="round-timer"
            running={status === "running"}
          >
            <>
              {/* Total time */}
              {display.secondary_time !== undefined && display.secondary_time > 0 && (
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                  <span className="text-xs uppercase tracking-wide font-headline font-bold">Total</span>
                  <span className="font-semibold">{format_time(display.secondary_time)}</span>
                </div>
              )}

              <TimerDisplay
                time={display.primary_time}
                progress={display.progress}
                variant="ring"
                color="var(--secondary)"
                sub_label={display.phase_label}
              />

              {/* Round history */}
              {previous_rounds.length > 0 && (
                is_fs ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                    {previous_rounds.map((time, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full text-xs">
                        <span className="font-headline font-bold text-foreground">R{i + 1}</span>
                        <span className="font-mono font-semibold text-foreground">{format_time(time)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full max-h-24 md:max-h-48 overflow-y-auto">
                    <div className="flex flex-col gap-1.5">
                      {previous_rounds.map((time, i) => (
                        <div key={i} className="flex justify-between items-center py-2 px-3 bg-surface-container-low rounded-xl">
                          <span className="text-xs md:text-sm font-headline font-bold text-foreground">Round {i + 1}</span>
                          <span className="text-xs md:text-sm font-mono font-semibold text-foreground">{format_time(time)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </>
          </TimerShellV2>
        </div>

        <section className="w-full max-w-md mx-auto px-1 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Free online turn timer and round tracker. Ideal for board game tournaments, strategy games, and timeboxing sessions.
          </p>
        </section>

        <TimerSeoContent
          timer_name="Round Timer"
          category_name="Board Games"
          category_slug="board-games"
          faq={ROUND_TIMER_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is a Round Timer?</h2>
          <p>
            A round timer is a count-up clock that tracks total elapsed time while letting you
            mark individual rounds or laps. Unlike a <a href="/countdown">countdown timer</a> that
            ticks toward zero, a round timer runs indefinitely — you control when each round ends
            by tapping &quot;Next Round.&quot; The timer records every round&apos;s duration so you can
            review pacing, identify slow phases, and improve consistency over time.
          </p>
          <p>
            This free online round timer works in any browser. Press start, mark rounds as you go,
            and review the full history in the scrollable lap list below the display. No download,
            no account, no ads.
          </p>

          <h2>When to Use a Round Timer</h2>
          <p>
            A round timer excels whenever activity is divided into phases of variable length:
          </p>
          <ul>
            <li><strong>Boxing and MMA training</strong> — Track 3-minute boxing rounds or 5-minute MMA rounds with manual bell control. Review round-by-round duration to monitor fatigue.</li>
            <li><strong>Debate and speech practice</strong> — Time opening statements, rebuttals, and closing arguments separately while tracking the total session length.</li>
            <li><strong>Board game tournaments</strong> — Track how long each phase or game round takes in Twilight Imperium, Root, Gloomhaven, or other round-structured games.</li>
            <li><strong>Presentation rehearsal</strong> — Mark each slide transition as a &quot;round&quot; to identify sections that run long and need trimming.</li>
            <li><strong>Meeting facilitation</strong> — Timebox agenda items and record how long each topic actually took versus the planned allocation.</li>
            <li><strong>Running and swimming laps</strong> — Use as a digital lap timer to track split times during training sessions.</li>
          </ul>

          <h2>How to Use This Round Timer</h2>
          <ol>
            <li><strong>Press Start</strong> — The timer begins counting up from zero. Round 1 is now active.</li>
            <li><strong>Tap &quot;Next Round&quot;</strong> — Ends the current round and starts the next one. The completed round&apos;s time is saved to the history list.</li>
            <li><strong>Pause when needed</strong> — Hit Pause to freeze both the round and total clocks. Resume picks up exactly where you left off.</li>
            <li><strong>Review your rounds</strong> — Scroll through the round history below the timer to compare durations and spot inconsistencies.</li>
          </ol>

          <h2>Round Timer vs. Interval Timer</h2>
          <p>
            The key difference is <strong>control</strong>. An interval timer like{" "}
            <a href="/fitness/tabata">Tabata</a> or <a href="/fitness/emom">EMOM</a> prescribes
            fixed work and rest periods — the timer switches phases automatically. A round timer
            puts you in charge: rounds can be any length, and you decide when to advance. This
            makes it better for activities where round duration varies naturally, like sparring
            sessions, game turns, or free-form practice.
          </p>
          <p>
            If you need fixed intervals with automatic transitions, use our Tabata or EMOM timers.
            If you need flexible round tracking with manual control, this round timer is the right
            choice.
          </p>
        </TimerSeoContent>
      </main>
      <Footer />
    </>
  );
}

function RoundTimerContent() {
  return (
    <TimerProvider strategy={roundTimerStrategy} config={{}}>
      <RoundTimerInner />
    </TimerProvider>
  );
}

export default function RoundTimerPage() {
  return (
    <Suspense>
      <RoundTimerContent />
    </Suspense>
  );
}
