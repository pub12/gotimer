"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { intervalReminderStrategy } from "@/lib/timer-strategies/interval-reminder";
import { EyeStrainExtras } from "@/components/wellness/eye-strain-extras";

const EYE_STRAIN_FAQ = [
  {
    question: "What causes digital eye strain?",
    answer:
      "Three things, in roughly equal measure: sustained near-focus that holds the ciliary muscles in contraction, a reduced blink rate that lets the tear film evaporate, and screen glare or contrast that forces the iris to compromise. The 20-20-20 rule directly addresses the first two; lighting and posture changes address the third.",
  },
  {
    question: "How long should an eye-strain break be?",
    answer:
      "<strong>20 seconds at minimum.</strong> That is long enough for the ciliary muscles to fully relax and for two or three deliberate blinks to redistribute the tear film. Longer breaks help marginally; the rule of thumb is that the consistency matters more than the duration.",
  },
  {
    question: "How often should the timer fire?",
    answer:
      "Every 20 minutes is the research-backed default. People with mild symptoms can space breaks out to 30 or 45 minutes; people with heavy symptoms or who wear contact lenses often go down to 10 or 15 minutes during peak screen sessions.",
  },
  {
    question: "Does this timer keep working in a background tab?",
    answer:
      "Yes. Modern browsers throttle background scripts but allow one tick per second, which is plenty for a 20-minute cadence. The tab title shows a live countdown and, if you enable browser notifications, you get system-level reminders even when the tab is hidden.",
  },
  {
    question: "Will it work on my phone?",
    answer:
      "Yes — the page is responsive and the audio chime works on iOS and Android. Browser notifications are flakier on mobile (especially iOS Safari before iOS 16.4); if you mainly need this on a phone, keep the tab visible.",
  },
];

const RELATED_TIMERS = [
  { name: "20-20-20 Rule Timer", href: "/wellness/20-20-20-timer", description: "The same timer with deeper background on the 20-20-20 method" },
  { name: "Pomodoro Timer", href: "/productivity/pomodoro", description: "25-minute focus blocks that pair naturally with eye-strain breaks" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Box-breathing and 4-7-8 for stress relief" },
  { name: "Meditation Timer", href: "/wellness/meditation", description: "Guided mindfulness with interval bells" },
];

const FOCUS_OPTIONS_MIN = [10, 20, 30, 45, 60];

function Content() {
  const params = useSearchParams();
  const requested = Number(params.get("focus"));
  const initial_focus = FOCUS_OPTIONS_MIN.includes(requested) ? requested : 20;

  const [focus_minutes, set_focus_minutes] = useState(initial_focus);
  const config = { focus: focus_minutes * 60, break_seconds: 20 };

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (focus_minutes === 20) url_params.delete("focus");
    else url_params.set("focus", String(focus_minutes));
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [focus_minutes]);

  return (
    <TimerPage
      key={focus_minutes}
      strategy={intervalReminderStrategy}
      config={config}
      label="Eye Strain Timer"
      description="A short look-away break on a regular schedule. Reduces digital eye strain from sustained screen use."
      below={
        <EyeStrainExtras
          focus_minutes={focus_minutes}
          break_seconds={20}
          on_focus_change={set_focus_minutes}
        />
      }
      seo_content={
        <TimerSeoContent
          timer_name="Eye Strain Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={EYE_STRAIN_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Eye Strain Timer
          </h1>
          <p>
            A free, no-install eye-strain timer built around the{" "}
            <a href="/wellness/20-20-20-timer">20-20-20 rule</a> — the simplest
            evidence-backed habit for reducing digital eye fatigue. Set your
            reminder interval, press play, and the timer chimes every time it is
            time to look away. Optional browser notifications keep it useful even
            when you switch tabs.
          </p>

          <h2>Why an eye-strain timer matters</h2>
          <p>
            Modern office work routinely involves six to ten hours of continuous
            near-focus, an exposure pattern human eyes were never tuned for.
            Three things go wrong over the course of a heavy screen day. First,
            the ciliary body that adjusts the lens for near vision stays
            contracted for far longer than it would in any natural activity,
            producing the dull ache behind the eyes that often shows up by
            mid-afternoon. Second, blink rate drops by roughly half, which lets
            the tear film evaporate and leaves the corneal surface gritty.
            Third, prolonged screen use is the most common cause of tension
            headaches in office workers, mediated by the small frowning muscles
            that contract when reading low-contrast type.
          </p>
          <p>
            A scheduled break does not eliminate any of this, but it interrupts
            the accumulation. Twenty seconds of distance vision relaxes the
            ciliary muscles; the same twenty seconds is enough time for two or
            three deliberate full blinks to restore the tear film; and the
            simple act of stopping reading every twenty minutes lets the
            frowning muscles release.
          </p>

          <h2>Who benefits the most</h2>
          <ul>
            <li>
              <strong>Software developers, designers, writers</strong> — anyone
              whose work involves looking at a single screen for hours at a
              time.
            </li>
            <li>
              <strong>Students preparing for exams</strong> — combine with the{" "}
              <a href="/productivity/study">Study Timer</a> for a stacked
              break cadence.
            </li>
            <li>
              <strong>Contact-lens wearers</strong> — reduced blink rate while
              reading screens hits this group hardest; a regular look-away helps
              extend comfortable wear time.
            </li>
            <li>
              <strong>Office workers in dry climates</strong> — low ambient
              humidity exacerbates evaporative dryness; scheduled breaks help
              the tear film recover.
            </li>
            <li>
              <strong>Anyone over 40</strong> — presbyopia reduces accommodative
              range, which means screen work is incrementally more fatiguing
              than it was at 25.
            </li>
          </ul>

          <h2>How to use this timer</h2>
          <ol>
            <li>Pick your interval — 20 minutes is the default.</li>
            <li>Tap the speaker icon to enable the audio chime.</li>
            <li>(Optional) tap the bell button to enable browser notifications for cross-tab reminders.</li>
            <li>Look at something at least 20 feet away when the chime fires.</li>
            <li>Take two deliberate blinks during the 20-second break.</li>
          </ol>
          <p>
            For a deeper walk-through of the underlying science and the
            ophthalmology citations behind it, see the full{" "}
            <a href="/wellness/20-20-20-timer">20-20-20 Rule Timer</a> page.
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
