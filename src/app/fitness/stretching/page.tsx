"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const STRETCHING_FAQ = [
  {
    question: "How long should I hold a static stretch?",
    answer:
      "Research from the American College of Sports Medicine recommends holding static stretches for <strong>15-60 seconds</strong> per position. For general flexibility maintenance, 30 seconds is the most commonly cited duration. Stretches held beyond 60 seconds show diminishing returns for most people, though athletes targeting specific tight areas may benefit from holds up to 2 minutes.",
  },
  {
    question: "Should I stretch before or after a workout?",
    answer:
      "Static stretching is most effective <strong>after exercise</strong> when muscles are warm and pliable. Pre-workout, dynamic stretches (leg swings, arm circles, walking lunges) are preferred because they prepare muscles for movement without reducing force output. Save your timed static holds for your cool-down or a dedicated flexibility session.",
  },
  {
    question: "Can stretching help prevent injuries?",
    answer:
      "Regular flexibility training reduces the risk of muscle strains and joint injuries by maintaining healthy range of motion. However, static stretching immediately before explosive activity can temporarily reduce power output. The best approach is consistent flexibility work as a standalone practice or post-workout routine, combined with dynamic warm-ups before training. Pair stretching with a <a href='/wellness/breathing'>breathing timer</a> for deeper relaxation.",
  },
  {
    question: "How often should I stretch for flexibility gains?",
    answer:
      "To see measurable improvements in range of motion, stretch <strong>at least 3-5 times per week</strong>. Daily stretching produces the fastest results. Each session should include 2-4 sets per muscle group, with each hold lasting 30-60 seconds. Consistency matters more than duration — a short daily session outperforms a long weekly one.",
  },
  {
    question: "What is the difference between static and dynamic stretching?",
    answer:
      "Static stretching involves holding a position at the end range of motion for a set time (which is what this timer is designed for). Dynamic stretching uses controlled movement through a range of motion — think leg swings or walking lunges. Both have their place: dynamic for warm-ups, static for cool-downs and dedicated flexibility sessions. For interval-based warm-ups, try our <a href='/fitness/tabata'>Tabata Timer</a> with bodyweight movements.",
  },
];

const RELATED_TIMERS = [
  { name: "Tabata Timer", href: "/fitness/tabata", description: "High-intensity 20/10 intervals for cardiovascular and metabolic conditioning" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Countdown between sets for strength and hypertrophy training" },
  { name: "EMOM Timer", href: "/fitness/emom", description: "Every Minute On the Minute format for CrossFit and functional fitness" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Guided breathing exercises for recovery and stress relief" },
  { name: "Countdown Timer", href: "/countdown", description: "General-purpose countdown for any timed activity" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 30;
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
      label="Stretching Timer"
      description="Hold timer for stretching. Set your desired hold duration and breathe through each stretch."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Stretching Timer"
          category_name="Fitness"
          category_slug="fitness"
          faq={STRETCHING_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why Timed Stretching Matters</h2>
          <p>
            Holding a stretch for a precise duration is one of the simplest ways to ensure you are giving
            your muscles enough stimulus to actually improve flexibility. Without a timer, most people
            cut their holds short — studies show the average person holds a stretch for only 10-15 seconds
            when they believe they are holding for 30. This timer removes the guesswork so you can commit
            fully to each position and track your progress over time.
          </p>
          <p>
            Timed stretching is backed by decades of sports science research. The tissue adaptation that
            increases range of motion — known as stress relaxation and creep — requires sustained tension
            over a minimum threshold of time. A reliable timer is the difference between going through
            the motions and making measurable flexibility gains.
          </p>

          <h2>When to Use This Stretching Timer</h2>
          <ul>
            <li><strong>Post-workout cool-down</strong> — After lifting, running, or any intense session, spend 10-15 minutes working through major muscle groups with 30-60 second holds.</li>
            <li><strong>Morning mobility routine</strong> — Start the day with gentle holds targeting hips, hamstrings, and thoracic spine. Use shorter durations (15-20 seconds) when muscles are cold.</li>
            <li><strong>Injury rehabilitation</strong> — Physical therapists commonly prescribe timed stretches for recovering muscles and joints. This timer helps you follow prescribed hold durations precisely.</li>
            <li><strong>Desk-worker breaks</strong> — Set a 30-second timer for hip flexor, chest, and neck stretches to counteract hours of sitting. Combine with a <a href="/wellness/breathing">breathing exercise</a> for a complete reset.</li>
            <li><strong>Yoga and Pilates practice</strong> — Time your yin yoga holds (2-5 minutes) or Pilates stretches with audio cues so you can close your eyes and focus on your breath.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Set your hold duration</strong> — 30 seconds is a good default for most stretches. Increase to 45-60 seconds for tight muscle groups or decrease to 15 seconds for gentle warm-up stretches.</li>
            <li><strong>Get into position first</strong> — Settle into your stretch before pressing start. You want the full duration under tension, not wasted adjusting your form.</li>
            <li><strong>Press start and breathe</strong> — Inhale deeply through your nose, exhale slowly through your mouth. With each exhale, ease slightly deeper into the stretch without bouncing.</li>
            <li><strong>Repeat for each side and muscle group</strong> — Reset the timer and move to the next position. Aim for 2-4 sets per muscle group in a dedicated flexibility session.</li>
          </ol>

          <h2>Recommended Hold Durations by Goal</h2>
          <ul>
            <li><strong>Warm-up stretches:</strong> 10-15 seconds — light holds to increase blood flow without reducing muscle activation.</li>
            <li><strong>General maintenance:</strong> 30 seconds — sufficient to maintain existing range of motion in healthy adults.</li>
            <li><strong>Flexibility improvement:</strong> 45-60 seconds — the range most supported by research for increasing range of motion over time.</li>
            <li><strong>Rehabilitation:</strong> 30-90 seconds — follow your physical therapist&apos;s guidance. Longer holds at mild intensity are typical for tissue recovery.</li>
            <li><strong>Yin yoga / deep holds:</strong> 2-5 minutes — targets connective tissue and fascia. Use a comfortable position you can sustain without strain.</li>
          </ul>

          <h2>Best Practices for Effective Stretching</h2>
          <ul>
            <li><strong>Never bounce</strong> — Ballistic stretching increases injury risk. Hold each position steadily and let the muscle release gradually.</li>
            <li><strong>Stretch warm muscles</strong> — Flexibility work is most effective after exercise, a warm shower, or at least 5 minutes of light movement. Cold stretching yields less benefit and carries more risk.</li>
            <li><strong>Breathe into the stretch</strong> — Holding your breath triggers the stretch reflex, which tightens muscles. Slow, rhythmic breathing signals your nervous system to relax.</li>
            <li><strong>Be consistent</strong> — Stretching 5 minutes daily outperforms a single 30-minute session per week. Use this timer to build a sustainable daily habit.</li>
            <li><strong>Pair with recovery tools</strong> — Foam rolling before stretching can improve results. Follow your flexibility session with a <a href="/wellness/breathing">guided breathing cool-down</a> for full-body recovery.</li>
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
