"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const REST_FAQ = [
  {
    question: "How long should I rest between sets for muscle growth?",
    answer:
      "For hypertrophy (muscle growth), research supports rest periods of <strong>60-90 seconds</strong> between sets. This duration allows partial recovery of ATP stores while keeping metabolic stress elevated — a key driver of muscle adaptation. A 2016 meta-analysis in <em>Sports Medicine</em> confirmed that moderate rest periods paired with moderate loads (8-12 reps) optimize the hypertrophic response.",
  },
  {
    question: "What is the ideal rest time for strength training?",
    answer:
      "When training for maximal strength (1-5 rep range), rest <strong>2-5 minutes</strong> between sets. Longer rest allows near-complete recovery of the phosphocreatine system, enabling you to maintain high force output across sets. Powerlifters and Olympic lifters commonly rest 3-5 minutes between heavy working sets of squats, deadlifts, and bench press.",
  },
  {
    question: "Does resting too long between sets reduce workout effectiveness?",
    answer:
      "It depends on your goal. For strength, longer rest (3-5 min) is beneficial. For hypertrophy, excessively long rest (beyond 3 minutes) may reduce the metabolic stress that contributes to muscle growth. For muscular endurance, rest should stay under 60 seconds. The key is matching your rest period to your training objective. This timer helps you stay disciplined regardless of your goal.",
  },
  {
    question: "Should I do anything during my rest period?",
    answer:
      "Light activity during rest — such as walking, gentle stretching of non-working muscles, or mobility drills — can maintain blood flow without impairing recovery. Avoid scrolling your phone for extended periods, as it often leads to accidentally doubling your planned rest time. Use our <a href='/fitness/stretching'>Stretching Timer</a> for targeted flexibility work between sets.",
  },
  {
    question: "How does rest time differ for compound vs. isolation exercises?",
    answer:
      "Compound lifts (squats, deadlifts, bench press, rows) demand more systemic recovery and typically need <strong>2-3 minutes</strong> of rest. Isolation exercises (bicep curls, lateral raises, leg extensions) tax smaller muscles and require less recovery — <strong>60-90 seconds</strong> is usually sufficient. Adjust your rest timer accordingly as you move through your workout.",
  },
];

const RELATED_TIMERS = [
  { name: "EMOM Timer", href: "/fitness/emom", description: "Every Minute On the Minute — built-in pacing with earned rest periods" },
  { name: "Tabata Timer", href: "/fitness/tabata", description: "Classic 20s work / 10s rest high-intensity interval protocol" },
  { name: "Stretching Timer", href: "/fitness/stretching", description: "Timed holds for post-workout flexibility and mobility" },
  { name: "Countdown Timer", href: "/countdown", description: "General-purpose countdown for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Track rounds and elapsed time for circuit training" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 90;
  const [duration, set_duration] = useState(initial);

  useEffect(() => {
    const url = `${window.location.pathname}?duration=${duration}`;
    window.history.replaceState(null, "", url);
  }, [duration]);

  return (
    <TimerPage
      key={duration}
      strategy={countdownStrategy}
      config={{ duration }}
      label="Rest Timer"
      description="Rest between sets. Standard rest periods: 30-90s for endurance, 2-3 min for strength, 3-5 min for power."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Rest Timer"
          category_name="Fitness"
          category_slug="fitness"
          faq={REST_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why Timing Your Rest Periods Matters</h2>
          <p>
            Rest between sets is not dead time — it is a programmable training variable that directly
            influences your results. Too little rest and you cannot maintain the load needed for strength
            gains. Too much rest and you lose the metabolic tension that drives hypertrophy. Research
            consistently shows that athletes who time their rest periods make faster progress than those
            who rest by feel, primarily because perceived recovery does not match actual physiological
            readiness.
          </p>
          <p>
            This free rest timer gives you a simple, distraction-free countdown between sets. Set your
            target rest duration, tap start when you rack the bar, and get back under it when the alarm
            sounds. No app to download, no account to create — just a timer that keeps your workout on track.
          </p>

          <h2>Optimal Rest Periods by Training Goal</h2>
          <ul>
            <li><strong>Muscular endurance (15+ reps):</strong> 30-60 seconds. Short rest keeps heart rate elevated and builds the fatigue resistance needed for endurance performance.</li>
            <li><strong>Hypertrophy (8-12 reps):</strong> 60-90 seconds. This range balances sufficient recovery with the metabolic stress that stimulates muscle protein synthesis.</li>
            <li><strong>Strength (3-6 reps):</strong> 2-3 minutes. Heavy compound lifts require near-complete phosphocreatine replenishment to maintain force output across sets.</li>
            <li><strong>Power (1-3 reps, explosive):</strong> 3-5 minutes. Maximal-effort lifts and plyometrics demand full neuromuscular recovery to maintain movement quality and velocity.</li>
          </ul>

          <h2>When to Use This Rest Timer</h2>
          <ul>
            <li><strong>Strength training sessions</strong> — Set 2-3 minutes for heavy squats, bench, and deadlifts. The countdown keeps you honest when the temptation to sit longer kicks in.</li>
            <li><strong>Hypertrophy blocks</strong> — Use 60-90 second rest to maintain the metabolic environment that drives muscle growth. The audio alert tells you when it is time to go again.</li>
            <li><strong>Circuit training recovery</strong> — Between circuits or supersets, use a 90-120 second countdown. For full circuit timing, pair with our <a href="/round-timer">Round Timer</a>.</li>
            <li><strong>Partner workouts</strong> — One partner works while the other rests. The timer ensures both athletes get equal recovery before switching.</li>
            <li><strong>Rehabilitation exercises</strong> — Physical therapists prescribe specific rest intervals for progressive loading. This timer helps patients follow their program precisely.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Set your rest duration</strong> — The default is 90 seconds, suitable for most hypertrophy training. Adjust up for heavy strength work or down for endurance circuits.</li>
            <li><strong>Complete your set</strong> — Finish your working set, rack the weight, and press start immediately.</li>
            <li><strong>Stay active during rest</strong> — Walk around, shake out your limbs, or perform a quick stretch on a non-working muscle group using our <a href="/fitness/stretching">Stretching Timer</a>.</li>
            <li><strong>Start your next set on the beep</strong> — When the alarm sounds, get into position and begin your next set. Consistent timing leads to consistent progress.</li>
          </ol>

          <h2>Common Rest Period Mistakes</h2>
          <ul>
            <li><strong>Resting by feel</strong> — Subjective rest estimates are unreliable. You feel ready after 45 seconds on set 2, but by set 5 you are unconsciously resting 3+ minutes. A timer eliminates the drift.</li>
            <li><strong>Using the same rest for every exercise</strong> — A heavy barbell squat requires more recovery than a dumbbell curl. Adjust your rest duration as you move between compound and isolation work.</li>
            <li><strong>Scrolling your phone</strong> — The most common cause of accidentally doubled rest periods. This full-screen timer keeps your focus in the gym, not on social media.</li>
            <li><strong>Ignoring rest when cutting</strong> — During fat-loss phases, shorter rest periods (45-60s) increase energy expenditure. Timing rest ensures you maintain this stimulus even when fatigue builds.</li>
            <li><strong>Skipping rest entirely</strong> — Rushing through sets with no recovery reduces the load you can handle and increases injury risk. Even 30 seconds makes a meaningful difference for performance. For structured work-rest intervals, try our <a href="/fitness/emom">EMOM Timer</a> or <a href="/fitness/tabata">Tabata Timer</a>.</li>
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
