"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";
import { decode_live_timer } from "@/lib/timer-url-encoder";

const COUNTDOWN_FAQ = [
  {
    question: "How do I set a custom duration on the countdown timer?",
    answer:
      "Use the duration input below the timer display. You can type a number of seconds directly or use the preset buttons. The timer accepts any value from 1 second up to 60 minutes (3,600 seconds).",
  },
  {
    question: "Does the countdown timer work on mobile phones?",
    answer:
      "Yes. GoTimer&apos;s countdown runs entirely in your browser and is fully responsive. It works on iPhones, Android devices, tablets, and desktops — no app install required. Audio alerts play through your device speaker.",
  },
  {
    question: "Will the timer alert me when it reaches zero?",
    answer:
      "The countdown plays <strong>audio beeps during the final 10 seconds</strong> and a distinct completion tone at zero. Make sure your device volume is turned up and your browser allows audio playback.",
  },
  {
    question: "Can I use this as a Pomodoro timer?",
    answer:
      "Absolutely. Set the countdown to 25 minutes (1,500 seconds) for a standard Pomodoro work session, then reset to 5 minutes for the break. For a dedicated focus tool, try our <a href='/productivity/study'>Study Timer</a> which automates work/break cycles.",
  },
  {
    question: "What is the difference between a countdown timer and a stopwatch?",
    answer:
      "A countdown timer starts at a set duration and counts <strong>down to zero</strong>, alerting you when time expires. A stopwatch counts <strong>up from zero</strong> indefinitely. Use a countdown when you need a deadline (cooking, board games, presentations) and a stopwatch when you want to measure elapsed time. Try our <a href='/stopwatch'>Stopwatch</a> for centisecond precision with lap recording.",
  },
];

const RELATED_TIMERS = [
  { name: "Chess Clock", href: "/chess-clock", description: "Two-player clock with individual time banks for competitive play" },
  { name: "Round Timer", href: "/round-timer", description: "Work/rest interval timer with configurable round lengths for sports and training" },
  { name: "Turn Timer", href: "/board-games/turn-timer", description: "Multi-player countdown for board game turns (2-8 players)" },
  { name: "Cooking Timer", href: "/kitchen/cooking", description: "Kitchen countdown with audio alerts for recipes and meal prep" },
  { name: "Study Timer", href: "/productivity/study", description: "Pomodoro-style focus timer for deep work and study sessions" },
  { name: "Tabata Timer", href: "/fitness/tabata", description: "Classic 20s work / 10s rest high-intensity interval protocol" },
  { name: "Stopwatch", href: "/stopwatch", description: "Count-up timer with centisecond precision and lap recording" },
];

function CountdownPageContent() {
  const search_params = useSearchParams();

  // Detect shared timer URL (has "started" param)
  const shared = search_params.get("started")
    ? decode_live_timer(new URLSearchParams(search_params.toString()))
    : null;

  const initial_time = shared
    ? Math.max(0, (Number(shared.config.duration) || 60) - shared.elapsed_seconds)
    : Number(search_params.get("time")) || Number(search_params.get("duration")) || 60;

  const shared_label = shared?.label || undefined;

  const [user_duration, set_user_duration] = useState(initial_time);

  return (
    <TimerPage
      key={user_duration}
      strategy={countdownStrategy}
      config={{ duration: user_duration }}
      label="Countdown Timer"
      initial_title={shared_label}
      description="Free online countdown timer with audio alerts. Great for board game turns, trivia rounds, and focus sessions."
      below={
        <DurationInput value={user_duration} onChange={set_user_duration} />
      }
      seo_content={
        <TimerSeoContent
          timer_name="Countdown Timer"
          category_name="Board Games"
          category_slug="board-games"
          faq={COUNTDOWN_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is a Countdown Timer?</h2>
          <p>
            A countdown timer starts at a duration you choose and ticks down to zero, then
            alerts you with an audio signal. It is the most versatile timer format — useful
            anywhere you need a fixed deadline: board game turns, cooking, presentations,
            classroom activities, meditation, or focused work sessions.
          </p>
          <p>
            This free online countdown timer runs in any modern browser. Set your duration,
            press start, and the timer handles the rest — including audible beeps during the
            final ten seconds so you can stay focused on the task at hand.
          </p>

          <h2>Popular Use Cases for a Countdown Timer</h2>
          <ul>
            <li><strong>Board game turns</strong> — Set 30-60 seconds per turn to prevent analysis paralysis in games like Catan, Ticket to Ride, or Codenames. For multi-player rotation, try our dedicated <a href="/board-games/turn-timer">Turn Timer</a>.</li>
            <li><strong>Cooking and baking</strong> — Time pasta, steep tea, or track oven roasts without fumbling with a phone app. Need multiple timers? Check out the <a href="/kitchen/cooking">Cooking Timer</a>.</li>
            <li><strong>Study and focus sessions</strong> — Use 25-minute countdowns for Pomodoro technique. Our <a href="/productivity/study">Study Timer</a> automates the full work/break cycle.</li>
            <li><strong>Presentations and public speaking</strong> — Keep talks on schedule with a visible countdown on your laptop or second screen.</li>
            <li><strong>Fitness rest periods</strong> — Count down 60-90 seconds between sets. For structured intervals, explore our <a href="/fitness/tabata">Tabata Timer</a> or <a href="/fitness/emom">EMOM Timer</a>.</li>
            <li><strong>Classroom and meeting timeboxing</strong> — Give groups fixed brainstorming or discussion windows to keep sessions productive.</li>
          </ul>

          <h2>How to Use This Countdown Timer</h2>
          <ol>
            <li><strong>Set your duration</strong> — Use the input below the display to enter seconds, or pick a common preset.</li>
            <li><strong>Press Start</strong> — The countdown begins immediately. The ring display shows remaining time at a glance.</li>
            <li><strong>Listen for alerts</strong> — Audio beeps play during the last 10 seconds, with a distinct tone at zero.</li>
            <li><strong>Pause or reset</strong> — Tap Pause to freeze the clock, or Reset to return to your original duration.</li>
          </ol>

          <h2>Countdown Timer vs. Other Timer Types</h2>
          <p>
            A simple countdown is perfect when you need one fixed deadline. If your situation is
            more specific, a specialised timer may serve you better. A{" "}
            <a href="/chess-clock">chess clock</a> manages two competing time banks for head-to-head
            games. A <a href="/round-timer">round timer</a> counts up and tracks multiple rounds
            with lap history. An interval timer like <a href="/fitness/tabata">Tabata</a> alternates
            between work and rest phases automatically.
          </p>
          <p>
            For most one-off timing needs — a quick egg timer, a board game turn limit, a
            presentation countdown — this simple countdown timer is the fastest way to get started.
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export default function CountdownPageWrapper() {
  return (
    <Suspense>
      <CountdownPageContent />
    </Suspense>
  );
}
