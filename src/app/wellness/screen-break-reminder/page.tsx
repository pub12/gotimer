"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { intervalReminderStrategy } from "@/lib/timer-strategies/interval-reminder";
import { EyeStrainExtras } from "@/components/wellness/eye-strain-extras";

const SCREEN_BREAK_FAQ = [
  {
    question: "Why use a screen-break reminder?",
    answer:
      "Long uninterrupted screen sessions accumulate eye fatigue, neck tightness, and reduced focus. A scheduled break is a low-cost interrupt that prevents most of the damage. The 20-minute cadence is the most evidence-backed default.",
  },
  {
    question: "How is this different from a Pomodoro timer?",
    answer:
      "A <a href='/productivity/pomodoro'>Pomodoro</a> structures work into 25-minute focus blocks separated by long breaks; a screen-break reminder fires a brief 20-second nudge inside any block, regardless of what you are doing. Many people stack the two: a 25-minute pomodoro plus a 20-minute screen-break overlap, then a long break.",
  },
  {
    question: "Will the reminder fire when I am on another tab?",
    answer:
      "Yes, with two caveats: browsers throttle background tabs, so the countdown can drift by a few seconds; and you only get a visual reminder if browser notifications are enabled. Once the tab refocuses, the chime fires for whichever cycle expired.",
  },
  {
    question: "Can I shorten the interval for intense work sessions?",
    answer:
      "Yes. Pick 10 or 15 minutes via the dropdown. People with mild eye-strain symptoms often run at 30–45 minutes; people with strong symptoms drop to 10 minutes. Whatever cadence you pick, the 20-second break itself stays constant.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes — the page is responsive and the audio chime works on both iOS and Android. Browser notifications are less reliable on mobile (iOS Safari historically did not support them at all), so for phones we recommend keeping the tab in the foreground.",
  },
];

const RELATED_TIMERS = [
  { name: "20-20-20 Rule Timer", href: "/wellness/20-20-20-timer", description: "The most-detailed background on the rule and the underlying science" },
  { name: "Eye Strain Timer", href: "/wellness/eye-strain-timer", description: "The same timer with eye-strain-specific guidance" },
  { name: "Pomodoro Timer", href: "/productivity/pomodoro", description: "25-minute focus blocks separated by structured breaks" },
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Box-breathing and 4-7-8 for stress relief" },
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
      label="Screen Break Reminder"
      description="A small chime every 20 minutes to remind you to look away. Reduces accumulated screen-time fatigue."
      below={
        <EyeStrainExtras
          focus_minutes={focus_minutes}
          break_seconds={20}
          on_focus_change={set_focus_minutes}
        />
      }
      seo_content={
        <TimerSeoContent
          timer_name="Screen Break Reminder"
          category_name="Wellness"
          category_slug="wellness"
          faq={SCREEN_BREAK_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Screen Break Reminder
          </h1>
          <p>
            A free, browser-based screen-break reminder. Press play, get on with
            your work, and the timer chimes every 20 minutes (or any interval
            you choose) to nudge you to look away. There is no install, no
            account, and no browser extension to manage across machines — open
            the URL on any device and it works.
          </p>

          <h2>Why bother with a break reminder?</h2>
          <p>
            People radically underestimate how long they actually stay glued to
            a screen. Self-reports cluster around four to six hours per day for
            office workers; objective measurements via screen-time apps put the
            real number closer to nine to ten hours when you count phones,
            tablets, and laptops together. That much uninterrupted near-focus
            is metabolically unusual for the human visual system, and the
            consequences — gritty eyes, mid-afternoon headaches, end-of-day
            blur — accumulate quietly. A scheduled chime is one of the cheapest
            interventions you can run: it costs you twenty seconds, and it
            interrupts the accumulation before you notice it building.
          </p>

          <h2>What a good break looks like</h2>
          <ol>
            <li>
              <strong>Stop reading.</strong> Even a glance back at the screen
              during the break partially defeats the purpose.
            </li>
            <li>
              <strong>Look somewhere far.</strong> Twenty feet (six metres) is
              the canonical distance; anything past about ten feet still helps.
            </li>
            <li>
              <strong>Take two deliberate full blinks.</strong> Squeeze your
              eyelids together, hold briefly, then open. This restores the
              tear film that has thinned out during the previous focus block.
            </li>
            <li>
              <strong>(Optional) move.</strong> Stand up, roll your shoulders,
              shake out your hands. Most screen workers also have an
              upper-body tension problem; the eye-break is a free trigger to
              address it.
            </li>
          </ol>

          <h2>Stacking break reminders with focus blocks</h2>
          <p>
            If you already run a focus-block discipline like Pomodoro, the
            screen-break reminder slots in without conflict. A common pattern:
            run a 25-minute <a href="/productivity/pomodoro">Pomodoro</a> with
            the screen-break reminder at 20 minutes. The screen-break fires
            five minutes before the pomodoro ends; you take your screen-break
            within the pomodoro, then the pomodoro break itself is for getting
            water and moving. For longer focus blocks, the{" "}
            <a href="/productivity/study">Study Timer</a> at 50 minutes
            combined with screen-breaks at 20 minutes gives you two breaks
            inside each block — usually enough to maintain attention through
            the second half.
          </p>

          <h2>Frequently asked tweaks</h2>
          <ul>
            <li>
              <strong>I do not want the chime.</strong> Tap the speaker icon
              once to disable audio. The countdown still runs and the
              notification (if enabled) still fires.
            </li>
            <li>
              <strong>I want a quieter notification.</strong> The browser
              notification uses your system&apos;s default tone. Adjust it in
              system preferences if it is too loud.
            </li>
            <li>
              <strong>I work in flow blocks and resent the interrupt.</strong>{" "}
              Try a 30-minute or 45-minute interval; the break still helps
              even at a longer cadence, and the perceived disruption falls
              sharply.
            </li>
          </ul>

          <p>
            For the full background on the 20-20-20 rule and the
            ophthalmology research behind it, see the flagship{" "}
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
