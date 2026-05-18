"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const STUDY_FAQ = [
  {
    question: "What is the Pomodoro Technique?",
    answer:
      "The Pomodoro Technique, developed by Francesco Cirillo in the late 1980s, structures work into <strong>25-minute focus blocks separated by 5-minute breaks</strong>. After four pomodoros, you take a longer 15-30 minute break. The method works because it creates artificial urgency and prevents mental fatigue through regular recovery periods.",
  },
  {
    question: "What is the optimal study session length?",
    answer:
      "Research varies, but most cognitive scientists recommend <strong>25 to 50 minutes of focused study</strong> followed by a 5-15 minute break. The default 45-minute session on this timer aligns with university lecture lengths, which are themselves based on attention span research. Shorter sessions (25 min) work better for difficult material; longer sessions (50 min) suit review and practice problems.",
  },
  {
    question: "How many study sessions should I do per day?",
    answer:
      "Most students can sustain <strong>4-6 focused study sessions (3-5 hours of deep work) per day</strong>. Beyond this, diminishing returns set in rapidly. Quality matters more than quantity — three deeply focused 45-minute sessions outperform six distracted hours. Track your sessions to find your personal limit.",
  },
  {
    question: "Should I study in silence or with music?",
    answer:
      "Research is mixed. <strong>Silence or ambient noise (like a coffee shop)</strong> tends to be best for learning new material. Familiar instrumental music can help with repetitive tasks like flashcard review. Avoid music with lyrics during reading or writing — it competes for the same language-processing resources in your brain.",
  },
  {
    question: "How do breaks improve studying?",
    answer:
      "Breaks allow your brain to consolidate information through a process called <strong>memory consolidation</strong>. During rest, your hippocampus replays recently learned material, strengthening neural connections. Walk, stretch (<a href='/fitness/stretching'>stretching timer</a>), or do <a href='/wellness/breathing'>breathing exercises</a> — avoid social media, which fragments attention further.",
  },
];

const RELATED_TIMERS = [
  { name: "20-20-20 Rule Timer", href: "/wellness/20-20-20-timer", description: "Eye-strain break reminder for long study sessions — stack with your focus blocks" },
  { name: "Classroom Timer", href: "/productivity/classroom", description: "Large-display timer for teachers and group activities" },
  { name: "Debate Timer", href: "/productivity/debate-timer", description: "Multi-phase round timer for PF, LD, Policy, WSDC, BP — great for debate-team practice" },
  { name: "Toastmasters Timer", href: "/productivity/toastmasters-timer", description: "Green/yellow/red signal cycles for prepared speeches and Table Topics" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Stress-relief breathing exercises between study sessions" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Quick break countdown between focus blocks" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 2700;
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
      label="Study Timer"
      description="Study session timer. Focus deeply for 45 minutes, then take a break. Adjust the duration to match your optimal focus window."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Study Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={STUDY_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why Timed Study Sessions Work</h2>
          <p>
            Open-ended study sessions invite procrastination. When there is no deadline, your brain
            defaults to low-effort tasks — re-reading notes, highlighting passages, scrolling your phone.
            A visible countdown creates what psychologists call &quot;artificial urgency&quot;: you know the
            clock is running, so you engage with the material instead of circling around it. Research from
            the University of Illinois found that timed work periods with scheduled breaks produced 16%
            better recall than continuous study of the same duration.
          </p>
          <p>
            This free study timer defaults to a 45-minute session — long enough for deep engagement with
            complex material, short enough to maintain focus throughout. Adjust the duration to match your
            personal concentration window, whether that is a classic 25-minute Pomodoro or a 90-minute
            ultradian cycle.
          </p>

          <h2>Pomodoro and Beyond: Study-Break Ratios</h2>
          <ul>
            <li><strong>Classic Pomodoro (25/5)</strong> — 25 minutes of study, 5-minute break. Best for new or difficult material. Set the timer to 1500 seconds.</li>
            <li><strong>Extended Pomodoro (45/15)</strong> — The default setting. Works well for essay writing, problem sets, and code review.</li>
            <li><strong>Ultradian Rhythm (90/20)</strong> — Matches your body&apos;s natural 90-minute alertness cycles. Ideal for exam preparation marathons.</li>
            <li><strong>52/17 Rule</strong> — A study by DeskTime found that top-performing employees worked for 52 minutes and rested for 17. Translates well to academic work.</li>
          </ul>

          <h2>Spaced Repetition and Timing</h2>
          <p>
            Spaced repetition — reviewing material at increasing intervals — is the most evidence-backed
            study technique in cognitive science. After your initial study session, review the material
            after 1 day, then 3 days, then 7 days, then 14 days. Each review session can be shorter than
            the first. Use this study timer for your initial deep-dive session, then set shorter
            <a href="/countdown"> countdown timers</a> for subsequent review sessions (15-20 minutes each).
          </p>

          <h2>Tips for Deep Work</h2>
          <ul>
            <li><strong>Eliminate distractions before starting</strong> — Close all browser tabs, silence your phone, and tell housemates you are unavailable. Use full-screen mode on the timer to block visual clutter.</li>
            <li><strong>Start with the hardest task</strong> — Your willpower and focus are highest at the beginning of a session. Tackle the most demanding material first.</li>
            <li><strong>Use active recall</strong> — Close your textbook and try to write down everything you remember. This is 3x more effective than re-reading.</li>
            <li><strong>Move during breaks</strong> — Walk, stretch, or do <a href="/wellness/breathing">breathing exercises</a>. Physical movement increases blood flow to the prefrontal cortex, restoring attention.</li>
            <li><strong>Track your sessions</strong> — Log how many focused sessions you complete each day. Consistency compounds: four focused sessions daily for a semester outperforms cramming every time.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Set your session length</strong> — Start with the 45-minute default. If you consistently lose focus before the timer ends, shorten to 25-30 minutes.</li>
            <li><strong>Prepare your workspace</strong> — Clear your desk, gather materials, and open only the resources you need.</li>
            <li><strong>Press start and commit</strong> — No phone, no social media, no context-switching until the session ends.</li>
            <li><strong>Take a real break</strong> — When the alert sounds, step away from your desk. Breaks at the <a href="/productivity/classroom">classroom timer</a> level are equally important for teachers managing student energy.</li>
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
