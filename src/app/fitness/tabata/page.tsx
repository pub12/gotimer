"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { intervalStrategy } from "@/lib/timer-strategies/interval";

const TABATA_FAQ = [
  {
    question: "What is the Tabata protocol and where did it come from?",
    answer:
      "The Tabata protocol was developed by Japanese researcher <strong>Dr. Izumi Tabata</strong> in 1996 at the National Institute of Fitness and Sports in Tokyo. His landmark study compared moderate-intensity endurance training with high-intensity intermittent training (20 seconds all-out, 10 seconds rest, 8 rounds). The high-intensity group improved both aerobic and anaerobic capacity significantly more than the steady-state group, making it one of the most cited interval training studies in exercise science.",
  },
  {
    question: "How long is a full Tabata workout?",
    answer:
      "A single Tabata set lasts exactly <strong>4 minutes</strong> — eight rounds of 20 seconds work and 10 seconds rest. Many athletes perform multiple Tabata sets with 1-2 minutes of rest between them for a 16-20 minute session. Even a single 4-minute set delivers meaningful cardiovascular and metabolic benefits when performed at true maximum effort.",
  },
  {
    question: "What exercises work best for Tabata?",
    answer:
      "The best Tabata exercises are full-body, high-output movements you can perform safely at maximum intensity: burpees, mountain climbers, jump squats, kettlebell swings, battle ropes, cycling sprints, and rowing. Avoid technically complex lifts like snatches or cleans unless you have excellent form — the short rest windows leave little room for setup between reps.",
  },
  {
    question: "Is Tabata safe for beginners?",
    answer:
      "True Tabata-intensity training (170% of VO2max) is extremely demanding and not ideal for untrained individuals. Beginners should start with a modified protocol — try 15 seconds of work at moderate intensity with 15 seconds of rest, or use our <a href='/fitness/rest-timer'>Rest Timer</a> with longer recovery periods. Build a base of fitness over 4-6 weeks before attempting full-intensity Tabata sets.",
  },
  {
    question: "How is Tabata different from regular HIIT?",
    answer:
      "Tabata is a specific subset of HIIT with a fixed 2:1 work-to-rest ratio (20s on, 10s off). Generic HIIT can use any ratio — 30/30, 40/20, or variable intervals. The Tabata protocol also demands near-maximal effort (roughly 170% VO2max), whereas many HIIT workouts operate at 80-90% effort. For a different interval structure, try our <a href='/fitness/emom'>EMOM Timer</a> which gives you a full minute per round.",
  },
];

const RELATED_TIMERS = [
  { name: "EMOM Timer", href: "/fitness/emom", description: "Every Minute On the Minute — perform reps at the top of each minute and rest the remainder" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Quick countdown between sets for strength and hypertrophy training" },
  { name: "Stretching Timer", href: "/fitness/stretching", description: "Hold timer with adjustable durations for post-workout flexibility" },
  { name: "Countdown Timer", href: "/countdown", description: "General-purpose countdown for any timed activity" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Guided breathing exercises for recovery and cool-down" },
];

function Content() {
  const params = useSearchParams();
  const work = Number(params.get("work")) || 20;
  const rest = Number(params.get("rest")) || 10;
  const rounds = Number(params.get("rounds")) || 8;
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
      label="Tabata Timer"
      description="Classic Tabata protocol: 20 seconds all-out effort, 10 seconds rest, 8 rounds. Total workout time: 4 minutes."
      show_skip
      below={
        <div className="w-full max-w-xs mx-auto space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                step={5}
                value={config.work}
                onChange={(e) => set_config((c) => ({ ...c, work: Number(e.target.value) }))}
                className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rest</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={5}
                value={config.rest}
                onChange={(e) => set_config((c) => ({ ...c, rest: Number(e.target.value) }))}
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
              max={20}
              value={config.rounds}
              onChange={(e) => set_config((c) => ({ ...c, rounds: Number(e.target.value) }))}
              className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
            />
          </div>
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Tabata Timer"
          category_name="Fitness"
          category_slug="fitness"
          faq={TABATA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is Tabata Training?</h2>
          <p>
            Tabata is a high-intensity interval protocol created by Dr. Izumi Tabata and his research team
            at the National Institute of Fitness and Sports in Kanoya, Japan. Published in 1996 in the journal
            <em> Medicine &amp; Science in Sports &amp; Exercise</em>, the original study had Olympic speed
            skaters perform 8 rounds of 20-second all-out sprints on a cycle ergometer followed by 10 seconds
            of rest. The results were striking: athletes improved both their aerobic (VO2max) and anaerobic
            capacity in just six weeks — something steady-state cardio alone could not achieve.
          </p>
          <p>
            Today, the Tabata format has been adopted across gyms, boot camps, and home workouts worldwide.
            The 4-minute structure makes it one of the most time-efficient training methods available, though
            the intensity required means it should be approached with respect and proper preparation.
          </p>

          <h2>When to Use This Tabata Timer</h2>
          <ul>
            <li><strong>Standalone cardio sessions</strong> — Perform 3-5 Tabata sets with 1-2 minutes between each for a complete 20-minute cardiovascular workout.</li>
            <li><strong>Finishers after strength work</strong> — Cap off a lifting session with one Tabata set of burpees or kettlebell swings to spike metabolic demand.</li>
            <li><strong>Travel or hotel-room workouts</strong> — No equipment needed. Bodyweight moves like mountain climbers, high knees, and jump squats fit the protocol perfectly.</li>
            <li><strong>Sport-specific conditioning</strong> — Fighters, sprinters, and team-sport athletes use Tabata to build the anaerobic endurance needed for repeated bursts of effort.</li>
            <li><strong>Group fitness classes</strong> — Display the timer on a screen and run the whole class through synchronized intervals. Pair with an <a href="/fitness/emom">EMOM warm-up</a> for a structured session.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Select your intervals</strong> — The default is the classic 20s work / 10s rest. Adjust the work and rest fields if you want a modified protocol (e.g., 30/15 for intermediate athletes).</li>
            <li><strong>Set your rounds</strong> — 8 rounds is standard Tabata. Use fewer rounds (4-6) when learning, or stack multiple sets of 8 for longer sessions.</li>
            <li><strong>Press start and give maximum effort</strong> — The timer signals each transition with an audio cue so you can focus entirely on your movement.</li>
            <li><strong>Rest between sets</strong> — If doing multiple Tabata blocks, use our <a href="/fitness/rest-timer">Rest Timer</a> for a 60-90 second recovery between sets.</li>
          </ol>

          <h2>Best Exercises for Tabata Intervals</h2>
          <ul>
            <li><strong>Bodyweight power</strong> — Burpees, jump squats, tuck jumps, and plyo lunges maximize caloric output in short windows.</li>
            <li><strong>Kettlebell movements</strong> — Swings, snatches, and goblet squats pair well with the 20-second work window because they allow explosive, repeatable reps.</li>
            <li><strong>Cardio machines</strong> — Assault bike, rowing ergometer, and ski erg let you push to true max effort without technique degradation.</li>
            <li><strong>Core-focused</strong> — V-ups, bicycle crunches, and plank jacks work well for a dedicated core Tabata round.</li>
          </ul>

          <h2>Tips for Effective Tabata Training</h2>
          <ul>
            <li><strong>Warm up thoroughly</strong> — Spend at least 5 minutes with dynamic stretches and light movement before going all-out. Cold muscles and maximal sprints are a recipe for injury.</li>
            <li><strong>Track your rep counts</strong> — Count reps in each round. If your output drops by more than 30% from round 1 to round 8, you are pacing correctly. If it barely drops, you started too conservatively.</li>
            <li><strong>Limit frequency</strong> — True Tabata sessions stress the nervous system heavily. Two to three sessions per week is sufficient; pair with lower-intensity work on other days.</li>
            <li><strong>Cool down with mobility</strong> — After your final round, use our <a href="/fitness/stretching">Stretching Timer</a> for 5-10 minutes of static holds to promote recovery.</li>
            <li><strong>Progress gradually</strong> — Start with bodyweight movements, then add load. Increase total sets before increasing individual set difficulty.</li>
          </ul>
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
