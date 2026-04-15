"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { intervalStrategy } from "@/lib/timer-strategies/interval";

const EMOM_FAQ = [
  {
    question: "What does EMOM stand for?",
    answer:
      "EMOM stands for <strong>Every Minute On the Minute</strong>. You perform a set of exercises at the start of each minute and rest for the remainder of that minute before the next round begins.",
  },
  {
    question: "How long should an EMOM workout last?",
    answer:
      "Most EMOM workouts run between 10 and 20 minutes. Beginners should start with 8-10 rounds (minutes) and build up. Advanced athletes often do 20-30 minute EMOMs or alternate between two different movements.",
  },
  {
    question: "What exercises work best for EMOM?",
    answer:
      "Compound movements like kettlebell swings, burpees, thrusters, box jumps, and pull-ups are ideal. Choose exercises you can complete in 30-40 seconds so you get 20-30 seconds of rest each round.",
  },
  {
    question: "Is EMOM better than regular interval training?",
    answer:
      "EMOM provides built-in pacing — as you fatigue, your rest window shrinks naturally. This makes it self-regulating compared to fixed work/rest intervals. For steady-state intervals, try our <a href='/fitness/tabata'>Tabata Timer</a> or <a href='/fitness/rest-timer'>Rest Timer</a> instead.",
  },
  {
    question: "Can I use EMOM for strength training?",
    answer:
      "Yes. EMOM is excellent for strength work — perform 2-3 heavy reps at the top of each minute. It keeps rest consistent and total volume high without requiring a separate <a href='/fitness/rest-timer'>rest timer</a>.",
  },
];

const RELATED_TIMERS = [
  { name: "Tabata Timer", href: "/fitness/tabata", description: "Classic 20-second work / 10-second rest protocol for 8 rounds" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Quick countdown between sets for strength training" },
  { name: "Stretching Timer", href: "/fitness/stretching", description: "Hold timer with customizable durations for flexibility work" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Track rounds and total elapsed time for combat sports" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Box breathing and recovery breathing exercises" },
];

function Content() {
  const params = useSearchParams();
  const work = Number(params.get("work")) || 60;
  const rest = Number(params.get("rest")) || 0;
  const rounds = Number(params.get("rounds")) || 10;
  const [config, set_config] = useState({ work, rest, rounds });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("work", String(config.work));
    params.set("rest", String(config.rest));
    params.set("rounds", String(config.rounds));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [config.work, config.rest, config.rounds]);

  return (
    <TimerPage
      key={`${config.work}-${config.rest}-${config.rounds}`}
      strategy={intervalStrategy}
      config={config}
      label="EMOM Timer"
      description="Every Minute On the Minute. Complete your reps within each minute, then rest until the next minute starts."
      show_skip
      below={
        <div className="w-full max-w-xs mx-auto space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interval</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                step={10}
                value={config.work}
                onChange={(e) => set_config((c) => ({ ...c, work: Number(e.target.value) }))}
                className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rounds</label>
            <input
              type="number"
              min={1}
              max={30}
              value={config.rounds}
              onChange={(e) => set_config((c) => ({ ...c, rounds: Number(e.target.value) }))}
              className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
            />
          </div>
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="EMOM Timer"
          category_name="Fitness"
          category_slug="fitness"
          faq={EMOM_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is an EMOM Workout?</h2>
          <p>
            EMOM — Every Minute On the Minute — is a time-based training format born in CrossFit boxes and now
            used across functional fitness, Olympic lifting, and military PT programs. The concept is simple:
            at the start of each minute, you perform a prescribed number of reps. Whatever time remains in that
            minute is your rest. As fatigue builds, your rest shrinks — making EMOM a self-regulating intensity tool.
          </p>
          <p>
            This free online EMOM timer handles the pacing so you can focus on your movement. Set your interval
            length (default 60 seconds), choose your round count, and press start. Audio cues signal each new
            minute so you never have to watch the clock mid-rep.
          </p>

          <h2>When to Use This EMOM Timer</h2>
          <ul>
            <li><strong>CrossFit WODs</strong> — Program classic EMOMs like 10-minute kettlebell swings or alternating movements every other minute.</li>
            <li><strong>Strength accessory work</strong> — Perform 2-3 heavy deadlifts or squats per minute to accumulate volume with consistent rest.</li>
            <li><strong>Skill practice</strong> — Use shorter intervals (30-45s) for gymnastics movements like muscle-ups or handstand push-ups.</li>
            <li><strong>Conditioning finishers</strong> — End a session with a 5-minute burpee EMOM or box-jump EMOM to spike your heart rate.</li>
            <li><strong>Group classes</strong> — Coaches can display the timer on a screen so everyone starts together. Pair with a <a href="/round-timer">round timer</a> for circuit-style classes.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Set your interval</strong> — Choose 60 seconds for standard EMOMs, or shorten to 30-45 seconds for fast-paced conditioning.</li>
            <li><strong>Choose your rounds</strong> — 10 rounds for a quick burner, 20+ for endurance-focused sessions.</li>
            <li><strong>Press start</strong> — Begin your reps when the timer starts. Rest until the next beep.</li>
            <li><strong>Adjust mid-workout</strong> — Scale reps down if you can&apos;t finish within the minute. The goal is sustainable pacing, not burnout.</li>
          </ol>

          <h2>EMOM Programming Tips</h2>
          <ul>
            <li><strong>Target 30-40 seconds of work</strong> — This gives you 20-30 seconds of rest. If you&apos;re finishing in under 20 seconds, add reps or load.</li>
            <li><strong>Alternate movements</strong> — Even-minute / odd-minute splits (e.g., push-ups on even, rows on odd) let muscle groups recover while keeping intensity high.</li>
            <li><strong>Use for warm-ups</strong> — A 5-minute EMOM with light movements is an effective way to activate muscles before heavier work.</li>
            <li><strong>Track your rest window</strong> — If your rest drops below 15 seconds, reduce the rep count. Quality movement matters more than volume.</li>
            <li><strong>Pair with other formats</strong> — Combine a 10-minute EMOM with a <a href="/fitness/tabata">Tabata finisher</a> for a complete 15-minute session.</li>
          </ul>

          <h2>EMOM vs. Other Interval Formats</h2>
          <p>
            EMOM differs from <a href="/fitness/tabata">Tabata</a> (fixed 20s work / 10s rest) and traditional HIIT
            because rest is earned, not prescribed. The faster you finish your reps, the more rest you get — which
            rewards efficiency and punishes sloppy pacing. For fixed-interval training, try our{" "}
            <a href="/fitness/tabata">Tabata Timer</a>. For simple rest between heavy sets, the{" "}
            <a href="/fitness/rest-timer">Rest Timer</a> is a better fit.
          </p>
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
