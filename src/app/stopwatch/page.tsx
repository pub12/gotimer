"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { stopwatchStrategy } from "@/lib/timer-strategies/stopwatch";
import type { StopwatchLap, StopwatchState } from "@/lib/timer-strategies/stopwatch";
import { format_stopwatch_time } from "@/lib/format-stopwatch-time";
import { useStopwatchRenderDriver } from "@/hooks/timer/use-stopwatch-render-driver";

const STORAGE_KEY = "gotimer:stopwatch:v1";

const STOPWATCH_FAQ = [
  {
    question: "What is a stopwatch used for?",
    answer:
      "A stopwatch measures elapsed time from a starting point. Common uses include timing running intervals and lap splits, measuring cooking and brewing durations, pacing presentations and speeches, tracking study sessions, timing sports drills, and any situation where you need to know exactly how much time has passed.",
  },
  {
    question: "What is the difference between a stopwatch and a countdown timer?",
    answer:
      "A countdown timer starts at a set duration and counts down to zero, alerting you when time expires — useful when you have a deadline. A stopwatch starts at zero and counts up indefinitely, measuring elapsed time — useful when you want to know how long something took. Use a countdown for a 10-minute cooking task; use a stopwatch to see how long your run actually took.",
  },
  {
    question: "What does the Lap button do?",
    answer:
      "Lap records the current elapsed time as a split. The 'Split' column shows how long that lap took; the 'Total' column shows cumulative time since you started. On the second lap, if your total is 2:30 and your previous lap was 1:10, the split for lap 2 is 1:20.",
  },
  {
    question: "Does this stopwatch work on mobile?",
    answer:
      "Yes. GoTimer's stopwatch runs entirely in your browser with no app install required. It works on iPhones, Android devices, tablets, and desktops. The centisecond display updates 10 times per second using requestAnimationFrame for smooth, accurate readings.",
  },
  {
    question: "Will my stopwatch time survive a page refresh?",
    answer:
      "Yes. Your accumulated time and lap history are saved to localStorage as you run. If you close or refresh the page while paused, the timer resumes from where it left off. Time accumulated while the stopwatch is running is saved on pause — if you close mid-run, you may lose a few seconds since the last save.",
  },
  {
    question: "How accurate is a browser-based stopwatch?",
    answer:
      "Modern browsers use high-resolution timers via the Performance API and requestAnimationFrame, making browser stopwatches accurate to within a few milliseconds for typical sessions. Tab throttling can affect timers in background tabs — for critical timing, keep the stopwatch tab active. GoTimer uses timestamp-based elapsed calculation (not tick counting) to resist drift.",
  },
];

const RELATED_TIMERS = [
  {
    name: "Countdown Timer",
    href: "/countdown",
    description: "Count down from a set duration with audio alerts",
  },
  {
    name: "Round Timer",
    href: "/round-timer",
    description: "Work/rest interval timer for sports and circuit training",
  },
  {
    name: "Chess Clock",
    href: "/chess-clock",
    description: "Two-player clock with individual time banks",
  },
  {
    name: "HIIT Timer",
    href: "/hiit-timer",
    description: "High-intensity interval training with configurable work/rest",
  },
  {
    name: "Workout Timer",
    href: "/workout-timer",
    description: "Interval training with settings cheat-sheet for any fitness level",
  },
];

function StopwatchInner() {
  const { machine } = useTimer();
  const { status, start, pause, resume, reset, action, display } = machine;
  const [, force_render] = useState(0);

  useStopwatchRenderDriver(status === "running", () => force_render((n) => n + 1));

  const elapsed_ms = (display.extra?.elapsed_ms as number) ?? 0;
  const laps = (display.extra?.laps as StopwatchLap[]) ?? [];

  // Notify strategy on pause so it can accumulate elapsed_ms into state
  const prev_status_ref = useRef(status);
  useEffect(() => {
    if (prev_status_ref.current === "running" && status === "paused") {
      action("pause");
    }
    prev_status_ref.current = status;
  }, [status, action]);

  // Persist to localStorage on every render (debounced via status/elapsed boundary)
  useEffect(() => {
    if (status === "idle" && elapsed_ms === 0) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accumulated_ms: elapsed_ms, laps })
      );
    } catch {
      // localStorage unavailable (private browsing or storage quota)
    }
  }, [elapsed_ms, laps, status]);

  // Restore from localStorage on mount
  const restored_ref = useRef(false);
  useEffect(() => {
    if (restored_ref.current) return;
    restored_ref.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { accumulated_ms: number; laps: StopwatchLap[] };
      if (saved.accumulated_ms > 0) {
        action("restore", saved);
      }
    } catch {
      // Corrupt storage — ignore
    }
  }, [action]);

  const handle_primary = () => {
    switch (status) {
      case "idle":
        action("start");
        start();
        break;
      case "running":
        // action("pause") fires via the useEffect above when status changes
        pause();
        break;
      case "paused":
        action("start");
        resume();
        break;
    }
  };

  const handle_reset = () => {
    reset();
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const primary_label = status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start";

  const btn = "flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl py-3 sm:py-4 text-base font-semibold transition-colors";
  const btn_sm = "flex items-center justify-center gap-2 bg-surface-container-low text-foreground hover:bg-surface-container-high rounded-2xl py-3 sm:py-4 px-5 text-base font-semibold transition-colors disabled:opacity-40";

  return (
    <div className="mt-4 mb-8 flex flex-col items-center w-full">
      <div className="w-full max-w-sm rounded-3xl bg-surface-container p-6 flex flex-col items-center gap-5">
        <div className="tabular-nums text-5xl font-bold tracking-tight text-foreground">
          {format_stopwatch_time(elapsed_ms)}
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={handle_primary} className={btn}>
            {primary_label}
          </button>
          <button
            onClick={() => action("lap")}
            className={btn_sm}
            disabled={status !== "running"}
          >
            Lap
          </button>
          {(status !== "idle") && (
            <button onClick={handle_reset} className={btn_sm}>
              Reset
            </button>
          )}
        </div>

        {laps.length > 0 && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-foreground">Laps</span>
              <button
                onClick={() => action("clear_laps")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear laps
              </button>
            </div>
            <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
              {[...laps].reverse().map((lap) => (
                <div
                  key={lap.n}
                  className="flex justify-between text-sm tabular-nums px-1"
                >
                  <span className="text-muted-foreground w-10">#{lap.n}</span>
                  <span className="text-foreground">{format_stopwatch_time(lap.split_ms)}</span>
                  <span className="text-muted-foreground">{format_stopwatch_time(lap.total_ms)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Extend strategy to support "restore" action
const stopwatchStrategyWithRestore = {
  ...stopwatchStrategy,
  on_action(state: StopwatchState, action_name: string, payload?: unknown): StopwatchState {
    if (action_name === "restore") {
      const p = payload as { accumulated_ms: number; laps: StopwatchLap[] };
      return { ...state, accumulated_ms: p.accumulated_ms, laps: p.laps };
    }
    return stopwatchStrategy.on_action!(state, action_name, payload);
  },
};

function StopwatchPageContent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Free Online Stopwatch</h1>
        <Suspense>
          <TimerProvider strategy={stopwatchStrategyWithRestore} config={{}}>
            <StopwatchInner />
          </TimerProvider>
        </Suspense>

        <TimerSeoContent
          timer_name="Stopwatch"
          category_name="Timers"
          category_slug="timers"
          faq={STOPWATCH_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Free Online Stopwatch</h2>
          <p>
            A stopwatch measures elapsed time from the moment you press Start. This free browser stopwatch
            displays centisecond precision (hundredths of a second), records unlimited lap splits, and saves
            your session to localStorage so a page refresh does not lose your time.
          </p>
          <p>
            Unlike a countdown timer — which alerts you when a fixed duration expires — a stopwatch is
            open-ended. You control when it starts and stops, and the display tells you exactly how much time
            has passed. This makes it the right tool whenever the duration is unknown in advance.
          </p>

          <h2>What Is a Stopwatch?</h2>
          <p>
            Stopwatches were originally mechanical instruments with a crown-operated start/stop mechanism
            and a separate lap/split button. The digital era moved this functionality to phones and computers,
            but the core concept remains: press start, do your thing, press stop, read the elapsed time.
          </p>
          <p>
            Modern browser-based stopwatches use high-resolution timestamps rather than counting ticks.
            This means GoTimer&apos;s stopwatch measures actual wall-clock elapsed time, immune to the
            drift that affects tick-counting implementations. The display updates 10 times per second
            using <code>requestAnimationFrame</code> for smooth centisecond readings without burning
            unnecessary CPU.
          </p>

          <h2>Stopwatch vs. Countdown Timer</h2>
          <p>
            Both are timing tools, but they serve different needs:
          </p>
          <ul>
            <li>
              <strong>Countdown timer</strong> — you set a target duration (e.g., 25 minutes). The timer
              counts down and alerts you at zero. Use this when you have a fixed deadline:
              a Pomodoro session, a cooking timer, a presentation time limit.
            </li>
            <li>
              <strong>Stopwatch</strong> — you start it and stop it yourself. It counts up from zero.
              Use this when you want to measure something: how long your morning run took, how long
              the meeting actually lasted, how long a particular code build takes.
            </li>
          </ul>
          <p>
            The rule of thumb: if you know how long you want to spend, use a{" "}
            <a href="/countdown">countdown timer</a>. If you want to discover how long something takes,
            use this stopwatch.
          </p>

          <h2>Common Uses</h2>
          <ul>
            <li>
              <strong>Running and cycling intervals</strong> — Time each lap or segment. Press Lap
              at each kilometre or trail marker to see split times without stopping the clock.
            </li>
            <li>
              <strong>Cooking and brewing</strong> — Know exactly how long your espresso pulled or
              your pasta has been in the water, without being tied to a fixed duration.
            </li>
            <li>
              <strong>Presentations and speeches</strong> — Run through your talk and see the
              actual time. More honest than a countdown when you&apos;re not sure how long it will take.
            </li>
            <li>
              <strong>Sports drills and circuits</strong> — Time individual exercises or rest periods
              in open-ended training sessions where you work until form breaks down, not until a bell rings.
            </li>
            <li>
              <strong>Productivity experiments</strong> — Measure how long tasks actually take
              before committing to Pomodoro blocks. If you don&apos;t know your natural task durations,
              a stopwatch tells you.
            </li>
          </ul>

          <h2>How to Use the Lap Feature</h2>
          <p>
            Press <strong>Lap</strong> while the stopwatch is running to record a split. The lap table shows:
          </p>
          <ul>
            <li><strong>Split (middle column)</strong> — time elapsed since the previous lap.</li>
            <li><strong>Total (right column)</strong> — cumulative time from start.</li>
          </ul>
          <p>
            Laps are listed in reverse order (most recent at top) so you can read the latest split
            without scrolling. Press <strong>Clear laps</strong> to erase the lap history while keeping
            the clock running.
          </p>

          <h2>LocalStorage Persistence</h2>
          <p>
            Your elapsed time and laps are automatically saved to your browser&apos;s localStorage as you
            use the stopwatch (key: <code>gotimer:stopwatch:v1</code>). If you pause and close the tab,
            your session is waiting for you when you return. The saved state includes accumulated time
            and all lap records. Time accumulated while running is saved when you pause — closing the
            browser mid-run may lose a small amount of time since the last pause.
          </p>
        </TimerSeoContent>
      </main>
      <Footer />
    </>
  );
}

export default function StopwatchPage() {
  return (
    <Suspense>
      <StopwatchPageContent />
    </Suspense>
  );
}
