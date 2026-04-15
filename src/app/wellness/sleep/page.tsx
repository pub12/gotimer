"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const SLEEP_FAQ = [
  {
    question: "How long should a wind-down routine be before bed?",
    answer:
      "Sleep researchers recommend a <strong>30 to 60 minute wind-down period</strong> before your target bedtime. This gives your body time to lower core temperature, reduce cortisol, and increase melatonin production. The default 30-minute timer is a good starting point for most people.",
  },
  {
    question: "Why does a consistent bedtime matter?",
    answer:
      "Your circadian rhythm thrives on regularity. Going to bed and waking at the same time — even on weekends — strengthens your body&apos;s internal clock. Studies show that <strong>irregular sleep schedules are associated with higher BMI, worse mood, and lower academic performance</strong>. A nightly countdown timer reinforces that consistency.",
  },
  {
    question: "What should I do during the wind-down countdown?",
    answer:
      "Avoid screens, bright lights, and stimulating content. Effective wind-down activities include reading a physical book, gentle <a href='/fitness/stretching'>stretching</a>, journaling, or <a href='/wellness/breathing'>breathing exercises</a>. The key is to signal to your brain that the day is ending.",
  },
  {
    question: "Can I use this timer as an auto-off sleep timer?",
    answer:
      "Yes. Set the timer to the duration of your audio content (podcast, audiobook, or white noise) and use the audio alert as your cue to stop playback. For longer sessions, use a <a href='/countdown'>countdown timer</a> with a custom duration.",
  },
  {
    question: "How does screen time affect sleep quality?",
    answer:
      "Blue light from screens suppresses melatonin production by up to 50%, delaying sleep onset by an average of 30 minutes. <strong>Stopping screen use 30-60 minutes before bed</strong> is one of the most effective sleep hygiene improvements you can make. This timer gives you a clear finish line for screen time.",
  },
];

const RELATED_TIMERS = [
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Box breathing and 4-7-8 exercises for pre-sleep relaxation" },
  { name: "Fasting Timer", href: "/wellness/fasting", description: "Intermittent fasting tracker — avoid late-night eating for better sleep" },
  { name: "Stretching Timer", href: "/fitness/stretching", description: "Gentle stretching routine timer for bedtime flexibility" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Study Timer", href: "/productivity/study", description: "Focus session timer — plan study sessions around your sleep schedule" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 1800;
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
      label="Sleep Timer"
      description="Gentle wind-down countdown for better sleep."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Sleep Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={SLEEP_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why a Wind-Down Timer Improves Sleep</h2>
          <p>
            Your body does not have an off switch. Transitioning from the stimulation of daily life to restful
            sleep requires a deliberate deceleration period. Sleep scientists call this &quot;sleep onset
            latency&quot; — the time it takes to fall asleep — and it is directly influenced by what you do
            in the 30-60 minutes before bed. A structured wind-down countdown gives you a clear boundary
            between &quot;awake time&quot; and &quot;sleep preparation time,&quot; making it easier to
            build and maintain the routine that shortens sleep onset.
          </p>
          <p>
            This free sleep timer provides a simple countdown that signals the start of your wind-down
            routine. Set it for 30 minutes (the default) or adjust based on your schedule. When the timer
            ends, it is bedtime — lights off, eyes closed.
          </p>

          <h2>Sleep Hygiene: The Fundamentals</h2>
          <p>
            Good sleep hygiene is the foundation of consistent, high-quality rest. The following practices
            are supported by decades of research from institutions like the National Sleep Foundation and
            Stanford Sleep Medicine Center:
          </p>
          <ul>
            <li><strong>Consistent schedule</strong> — Go to bed and wake up at the same time every day, including weekends. Your circadian rhythm rewards regularity.</li>
            <li><strong>Cool room temperature</strong> — The ideal sleeping temperature is 60-67°F (15-19°C). Your body needs to drop its core temperature to initiate sleep.</li>
            <li><strong>Dark environment</strong> — Use blackout curtains or an eye mask. Even dim light from standby LEDs can suppress melatonin.</li>
            <li><strong>No screens in the last hour</strong> — Blue light delays melatonin release. If you must use a device, enable a warm-tone night mode.</li>
            <li><strong>Limit caffeine after 2 PM</strong> — Caffeine has a half-life of 5-6 hours. An afternoon coffee can still be in your system at midnight.</li>
          </ul>

          <h2>Building Your Wind-Down Routine</h2>
          <p>
            A wind-down routine is a sequence of calming activities you perform in the same order each night.
            Repetition trains your brain to associate the routine with sleep. Here is a sample 30-minute
            wind-down using GoTimer tools:
          </p>
          <ol>
            <li><strong>Minutes 0-5:</strong> Put away all screens. Start your sleep timer.</li>
            <li><strong>Minutes 5-15:</strong> Light stretching or gentle yoga. Use a <a href="/fitness/stretching">stretching timer</a> for hold durations.</li>
            <li><strong>Minutes 15-20:</strong> Journaling or reading a physical book.</li>
            <li><strong>Minutes 20-25:</strong> Brush teeth, wash face, prepare your sleeping environment.</li>
            <li><strong>Minutes 25-30:</strong> <a href="/wellness/breathing">Breathing exercises</a> (4-7-8 technique) in bed with the lights off.</li>
          </ol>

          <h2>Screen Time and Blue Light</h2>
          <p>
            Screens are the single biggest sleep disruptor in modern life. Research from Harvard Medical
            School found that blue-light exposure before bed suppresses melatonin for twice as long as
            other light wavelengths and shifts the circadian rhythm by up to 90 minutes. The practical
            solution is simple: set a screen curfew. Use this sleep timer as your curfew countdown —
            when you start the timer, all screens go away. Over time, this boundary becomes automatic.
          </p>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Set your wind-down duration</strong> — 30 minutes is the default and works well for most people. Extend to 45-60 minutes if you have trouble falling asleep.</li>
            <li><strong>Start the timer when screens go off</strong> — This creates a hard boundary for digital device use.</li>
            <li><strong>Follow your routine</strong> — Perform the same sequence of calming activities each night.</li>
            <li><strong>Get into bed when the alert sounds</strong> — Lights off, and let your breathing slow naturally.</li>
          </ol>
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
