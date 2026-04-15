"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const BREATHING_FAQ = [
  {
    question: "What is box breathing and how does it work?",
    answer:
      "Box breathing (also called square breathing or 4-4-4-4 breathing) is a technique where you <strong>inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds</strong>. This pattern activates your parasympathetic nervous system, slowing your heart rate and lowering cortisol levels. Navy SEALs use box breathing to stay calm under pressure.",
  },
  {
    question: "What is the 4-7-8 breathing technique?",
    answer:
      "The 4-7-8 technique, developed by Dr. Andrew Weil, involves <strong>inhaling for 4 seconds, holding for 7 seconds, and exhaling slowly for 8 seconds</strong>. The extended exhale activates the vagus nerve and promotes deep relaxation. Many people use it as a natural sleep aid. Pair it with our <a href='/wellness/sleep'>Sleep Timer</a> for a complete wind-down routine.",
  },
  {
    question: "How long should a breathing exercise session last?",
    answer:
      "Most guided breathing sessions last <strong>3 to 10 minutes</strong>. Beginners should start with 2-4 minutes (about 6-8 breath cycles) and build up gradually. Even a single minute of controlled breathing can measurably reduce stress hormones. The default 4-minute session on this timer gives you roughly 15 box-breathing cycles.",
  },
  {
    question: "When should I use breathing exercises?",
    answer:
      "Breathing exercises are effective <strong>before sleep, during anxiety or stress, before presentations or exams, and after intense workouts</strong>. Athletes use them for recovery between sets (see our <a href='/fitness/rest-timer'>Rest Timer</a>), while students use them before study sessions to improve focus. There is no wrong time to practice.",
  },
  {
    question: "Can breathing exercises help with sleep?",
    answer:
      "Yes. Controlled breathing shifts your nervous system from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest) mode. The 4-7-8 technique in particular has been shown to help people fall asleep faster. Try a 5-minute breathing session followed by our <a href='/wellness/sleep'>Sleep Timer</a> for a structured bedtime routine.",
  },
];

const RELATED_TIMERS = [
  { name: "Sleep Timer", href: "/wellness/sleep", description: "Wind-down countdown for building a consistent bedtime routine" },
  { name: "Fasting Timer", href: "/wellness/fasting", description: "Intermittent fasting tracker with 16:8, 18:6, and OMAD presets" },
  { name: "Stretching Timer", href: "/fitness/stretching", description: "Hold timer with customizable durations for flexibility work" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Study Timer", href: "/productivity/study", description: "Focus session timer for Pomodoro-style deep work" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 240;
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
      label="Breathing Timer"
      description="Box breathing exercises. Inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold 4 seconds. Repeat for the full session."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Breathing Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={BREATHING_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>The Science of Controlled Breathing</h2>
          <p>
            Controlled breathing is one of the fastest ways to shift your autonomic nervous system from a
            stress response to a relaxation response. When you consciously slow your breathing rate below
            about 10 breaths per minute, baroreceptors in your aorta and carotid arteries signal the vagus
            nerve to reduce heart rate and blood pressure. Studies published in <em>Frontiers in Human
            Neuroscience</em> have shown that as little as five minutes of paced breathing can significantly
            lower cortisol and self-reported anxiety.
          </p>
          <p>
            This free online breathing timer handles the timing so you can close your eyes and focus entirely
            on each inhale and exhale. Set a session length, press start, and follow the cadence. The default
            4-minute session is calibrated for approximately 15 complete box-breathing cycles.
          </p>

          <h2>Breathing Techniques Explained</h2>
          <ul>
            <li><strong>Box Breathing (4-4-4-4)</strong> — Inhale 4s, hold 4s, exhale 4s, hold 4s. Used by Navy SEALs and first responders. Excellent for acute stress and pre-performance nerves.</li>
            <li><strong>4-7-8 Breathing</strong> — Inhale 4s, hold 7s, exhale 8s. Developed by Dr. Andrew Weil for sleep induction. The long exhale triggers deep parasympathetic activation.</li>
            <li><strong>Physiological Sigh</strong> — Double inhale through the nose, long exhale through the mouth. Reinflates collapsed alveoli and rapidly reduces CO2, producing near-instant calm.</li>
            <li><strong>Coherence Breathing (5-5)</strong> — Inhale 5s, exhale 5s with no holds. Targets the ~6 breaths/minute rate that maximizes heart rate variability (HRV).</li>
            <li><strong>Wim Hof Rhythmic Breathing</strong> — 30 deep breaths followed by a breath hold. Designed for cold exposure preparation and energy, not relaxation.</li>
          </ul>

          <h2>When to Use This Breathing Timer</h2>
          <ul>
            <li><strong>Before sleep</strong> — Run a 5-minute 4-7-8 session, then transition to a <a href="/wellness/sleep">sleep countdown timer</a> for your full wind-down routine.</li>
            <li><strong>During work or study breaks</strong> — A 2-minute box breathing session between <a href="/productivity/study">study sessions</a> restores focus without consuming your break time.</li>
            <li><strong>Pre-performance</strong> — Use 3-5 minutes of coherence breathing before a presentation, exam, or athletic event to lower heart rate and steady your hands.</li>
            <li><strong>Post-workout recovery</strong> — Pair with a <a href="/fitness/stretching">stretching timer</a> to bring your heart rate down faster after intense exercise.</li>
            <li><strong>Intermittent fasting support</strong> — Breathing exercises can reduce hunger-related anxiety during a <a href="/wellness/fasting">fasting window</a>.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Choose your session length</strong> — Start with 4 minutes (default) and increase as you build your practice. Most benefits plateau around 10 minutes.</li>
            <li><strong>Pick a technique</strong> — Box breathing for stress, 4-7-8 for sleep, coherence for general well-being.</li>
            <li><strong>Press start and close your eyes</strong> — Breathe through your nose, keeping your shoulders relaxed and your jaw soft.</li>
            <li><strong>Use the audio cue</strong> — The timer alert signals the end of your session so you can fully immerse without watching the clock.</li>
          </ol>

          <h2>Building a Daily Breathing Practice</h2>
          <p>
            Consistency matters more than duration. A daily 3-minute practice yields more long-term benefits
            than an occasional 20-minute session. Anchor your breathing practice to an existing habit —
            right after your morning coffee, during your lunch break, or as the first step in your
            evening wind-down. Over time, you will notice lower resting heart rate, improved HRV, and a
            greater ability to stay calm under pressure. Pair breathing with a <a href="/countdown">simple
            countdown timer</a> for other mindfulness exercises like body scans or gratitude journaling.
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
