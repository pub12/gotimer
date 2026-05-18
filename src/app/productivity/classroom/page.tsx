"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const CLASSROOM_FAQ = [
  {
    question: "Why do visual timers help classroom management?",
    answer:
      "Visual timers reduce transition time by <strong>up to 50%</strong> according to classroom management research. When students can see time remaining, they self-regulate pacing without repeated verbal reminders. This is especially effective for students with ADHD or executive function challenges, who benefit from concrete visual cues rather than abstract time awareness.",
  },
  {
    question: "How do I display the timer on a projector or smartboard?",
    answer:
      "Open this page on the computer connected to your projector or interactive whiteboard, then click the <strong>full-screen button</strong> (bottom-right corner). The timer will expand to fill the entire display with large, readable numbers. The full-screen mode uses high-contrast colors visible even in brightly lit classrooms.",
  },
  {
    question: "What duration should I set for different classroom activities?",
    answer:
      "Common durations: <strong>2-3 minutes</strong> for transitions between activities, <strong>5-10 minutes</strong> for quick writes or journal entries, <strong>15-20 minutes</strong> for group work, <strong>30-45 minutes</strong> for independent work or tests, and <strong>60+ minutes</strong> for exams. The default 10-minute setting covers most short activities.",
  },
  {
    question: "Can I use this for standardized tests or exams?",
    answer:
      "Yes. Set the timer to the exact exam duration and display it in full-screen mode. Students can monitor their own pacing without asking &quot;how much time is left?&quot; For multi-section exams with different time limits, bookmark this page with different duration parameters for quick switching.",
  },
  {
    question: "Does this timer work without an internet connection?",
    answer:
      "Once the page is loaded, the timer runs entirely in your browser — <strong>no ongoing internet connection is required</strong>. However, you do need internet to initially load the page. For completely offline use, consider bookmarking the page while connected and using your browser&apos;s offline mode.",
  },
];

const RELATED_TIMERS = [
  { name: "Study Timer", href: "/productivity/study", description: "Pomodoro-style focus sessions for students" },
  { name: "Debate Timer", href: "/productivity/debate-timer", description: "Multi-phase debate round timer — PF, LD, Policy, WSDC, BP for classroom debate units" },
  { name: "Toastmasters Timer", href: "/productivity/toastmasters-timer", description: "Green/yellow/red signal cycles for student speech assignments" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Multi-round timer for structured class activities" },
  { name: "Turn Timer", href: "/board-games/turn-timer", description: "Turn-based timer for classroom games and debates" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Calming breathing exercises for classroom mindfulness breaks" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 600;
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
      label="Classroom Timer"
      description="Classroom activity timer. Set time limits for group work, presentations, quizzes, and transitions."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Classroom Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={CLASSROOM_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why Visual Timers Transform Classroom Management</h2>
          <p>
            Every teacher knows the friction of transitions: &quot;Five more minutes!&quot; repeated three
            times, students who never heard the first warning, and activities that bleed into the next
            lesson. A projected visual timer eliminates this friction. When the countdown is visible to
            every student simultaneously, they self-monitor their pacing without requiring verbal
            reminders. Research published in the <em>Journal of Applied Behavior Analysis</em> found that
            visual timers reduced off-task behavior by 30-50% in elementary classrooms and improved
            transition speed in secondary settings.
          </p>
          <p>
            This free classroom timer is designed for full-screen projection on whiteboards, smartboards,
            and monitors. The large, high-contrast display is readable from the back of any classroom.
            No accounts, no ads, no student-facing distractions — just a countdown that works.
          </p>

          <h2>Classroom Activities That Benefit from a Timer</h2>
          <ul>
            <li><strong>Activity transitions</strong> — Set 2-3 minutes for students to pack up, move seats, or retrieve materials. The visible countdown creates urgency without yelling.</li>
            <li><strong>Group work and discussions</strong> — Give groups 15-20 minutes for collaborative tasks. The timer prevents discussions from wandering and ensures all groups stay on pace.</li>
            <li><strong>Quick writes and journal entries</strong> — A 5-minute timer on the board signals &quot;pen to paper now&quot; and prevents overthinking. Students write more when they see the clock ticking.</li>
            <li><strong>Presentations</strong> — Assign each presenter a fixed time (3-5 minutes). Display the timer so both the speaker and audience know the schedule. Fair and transparent.</li>
            <li><strong>Tests and quizzes</strong> — Project the full exam duration. Students manage their own pacing, reducing the number of &quot;how much time is left?&quot; interruptions to zero.</li>
            <li><strong>Brain breaks and mindfulness</strong> — Use a <a href="/wellness/breathing">breathing timer</a> for 2-3 minute classroom mindfulness breaks that help students refocus.</li>
          </ul>

          <h2>How to Display Full-Screen in Your Classroom</h2>
          <ol>
            <li><strong>Open this page</strong> on the computer connected to your projector, interactive whiteboard, or classroom TV.</li>
            <li><strong>Set the duration</strong> — Use the input field to enter the exact time needed for your activity.</li>
            <li><strong>Click the full-screen button</strong> — The timer expands to fill the entire display with large, high-contrast numbers.</li>
            <li><strong>Press start</strong> — The countdown begins. Students can see the remaining time from anywhere in the room.</li>
            <li><strong>Audio alert</strong> — An audible tone plays when time expires, signaling the transition without your voice.</li>
          </ol>

          <h2>Tips for Teachers</h2>
          <ul>
            <li><strong>Be consistent</strong> — Use the timer for the same activities each day. Students internalize the routine and transitions become automatic within a week.</li>
            <li><strong>Add buffer time</strong> — If an activity needs 15 minutes, set the timer for 17. The extra 2 minutes prevent rushing and reduce stress.</li>
            <li><strong>Use for positive reinforcement</strong> — &quot;If everyone is seated with materials out before the timer ends, we earn 5 minutes of free choice.&quot; The visual countdown makes the goal concrete.</li>
            <li><strong>Combine with round timers</strong> — For station rotations, a <a href="/round-timer">round timer</a> automatically cycles through multiple timed periods. For classroom debates with turns, try the <a href="/board-games/turn-timer">turn timer</a>.</li>
            <li><strong>Bookmark preset durations</strong> — Save URLs with your most-used durations (e.g., <code>?duration=300</code> for 5 minutes) as browser bookmarks for one-click access.</li>
          </ul>

          <h2>Supporting Students with Different Needs</h2>
          <p>
            Visual timers are particularly valuable for students with ADHD, autism spectrum conditions, and
            executive function challenges. These students often struggle with time blindness — the
            inability to intuitively sense how much time has passed or remains. A projected countdown
            externalizes time perception, reducing anxiety and improving task completion rates. For
            individual student use, suggest they open a <a href="/productivity/study">study timer</a>
            on their personal device during independent work periods.
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
