"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { intervalReminderStrategy } from "@/lib/timer-strategies/interval-reminder";
import { EyeStrainExtras } from "@/components/wellness/eye-strain-extras";
import { EYE_STRAIN_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Pomodoro Timer",
    href: "/productivity/pomodoro",
    description: "25-minute focus blocks — pairs naturally with eye-strain breaks",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Box-breathing and 4-7-8 patterns for stress relief and recovery",
  },
  {
    name: "Meditation Timer",
    href: "/wellness/meditation",
    description: "Guided mindfulness with interval bells",
  },
  {
    name: "Study Timer",
    href: "/productivity/study",
    description: "Focus-session timer for deep work and exam prep",
  },
];

const FOCUS_OPTIONS_MIN = [10, 20, 30, 45, 60];

function Content() {
  const params = useSearchParams();
  const requested = Number(params.get("focus"));
  const initial_focus =
    FOCUS_OPTIONS_MIN.includes(requested) ? requested : 20;

  const [focus_minutes, set_focus_minutes] = useState(initial_focus);
  const config = {
    focus: focus_minutes * 60,
    break_seconds: 20,
  };

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (focus_minutes === 20) {
      url_params.delete("focus");
    } else {
      url_params.set("focus", String(focus_minutes));
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [focus_minutes]);

  return (
    <TimerPage
      key={focus_minutes}
      strategy={intervalReminderStrategy}
      config={config}
      label="20-20-20 Rule Timer"
      description={`Every ${focus_minutes} minutes, look 20 feet away for 20 seconds. Optional browser notifications.`}
      below={
        <EyeStrainExtras
          focus_minutes={focus_minutes}
          break_seconds={20}
          on_focus_change={set_focus_minutes}
        />
      }
      seo_content={
        <TimerSeoContent
          timer_name="20-20-20 Rule Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={EYE_STRAIN_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            20-20-20 Rule Timer
          </h1>
          <p>
            A free browser-based timer that automates the most-recommended habit for
            preventing digital eye strain: every <strong>20 minutes</strong>, take a{" "}
            <strong>20-second</strong> break to look at something at least{" "}
            <strong>20 feet away</strong>. The cycle runs in the background while you
            work, alerts you with an audio chime, and — if you give your browser
            permission — sends a system notification even when this tab is hidden. No
            installs, no extensions, no accounts.
          </p>

          <h2>What is the 20-20-20 rule?</h2>
          <p>
            The 20-20-20 rule was popularised in the late 1990s by California
            optometrist <strong>Dr. Jeffrey Anshel</strong> as a low-friction
            countermeasure to the rising tide of computer-related eye complaints.
            Today the rule is endorsed by the{" "}
            <a
              href="https://www.aao.org/eye-health/tips-prevention/computer-usage"
              rel="noopener nofollow"
              target="_blank"
            >
              American Academy of Ophthalmology
            </a>{" "}
            and the{" "}
            <a
              href="https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome"
              rel="noopener nofollow"
              target="_blank"
            >
              American Optometric Association
            </a>{" "}
            as a baseline habit for anyone who looks at a screen for more than two
            hours a day. The idea is simple: prolonged near-focus contracts the
            ciliary muscles that bend the lens of the eye to keep close objects
            sharp, and that sustained contraction is the proximate cause of the
            tired, gritty, slightly-blurry feeling that creeps in after a few hours
            of screen work. Twenty seconds of distance vision lets those muscles
            relax — much like stretching your legs after a long flight.
          </p>

          <h2>Why it works (the underlying mechanics)</h2>
          <p>
            Three independent effects stack up across the day. First, accommodation:
            when you look at a screen 50 centimetres away, the ciliary body pulls
            the lens into a more spherical shape and holds it there. Take that away,
            and the lens snaps back to its relaxed long-distance shape, giving the
            muscle a few seconds of rest. Second, vergence: your two eyes converge
            inward to fuse a single near image; staring far away lets them
            de-converge to their resting position. Third, blink rate: spontaneous
            blinking falls by <strong>30–60%</strong> while reading a screen,
            because your visual cortex prioritises content over reflexes. The
            twenty-second pause is long enough for two or three deliberate full
            blinks, which redistributes the tear film and reduces the corneal
            dryness that drives end-of-day discomfort.
          </p>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Start the timer</strong> — press play. The countdown begins
              from 20 minutes (the default; adjustable to 10, 30, 45, or 60
              minutes via the dropdown).
            </li>
            <li>
              <strong>Tap the speaker icon</strong> to enable the audio chime.
              Browsers require an explicit user gesture before any web page can
              play sound; one tap unlocks audio for the rest of the session.
            </li>
            <li>
              <strong>Enable notifications (optional but recommended).</strong>{" "}
              Click the bell button to give your browser permission to surface a
              system-level alert when each cycle ends. Once granted, you can tab
              away to other work and still get reminded.
            </li>
            <li>
              <strong>When the chime fires</strong>, look out a window or across
              the room. Pick something with detail — a tree, a building, a
              picture frame — and let your eyes settle on it for the 20-second
              countdown.
            </li>
            <li>
              <strong>Take two deliberate blinks</strong> during the break. Close
              your eyes fully, hold briefly, then open. This resets the tear film
              and is especially important for contact-lens wearers.
            </li>
          </ol>

          <h2>Adapting the rule for contact-lens wearers</h2>
          <p>
            Contact-lens wearers feel digital eye strain more acutely than
            spectacle wearers because the lens itself reduces tear-film stability,
            and the reduced screen blink rate amplifies the dryness. Practical
            tweaks: shorten the interval to 10 or 15 minutes during long screen
            sessions; use the 20-second break to take two slow full blinks rather
            than just gazing; keep preservative-free lubricating drops within
            reach; and if you wear extended-wear lenses, switch to daily
            disposables for high-intensity screen days. If you wake up with red,
            sticky, or sore eyes after a heavy screen day, talk to an optometrist
            — that is a sign the protective routine is not keeping up with the
            load.
          </p>

          <h2>What &quot;20 feet away&quot; actually means</h2>
          <p>
            Twenty feet (about six metres) is not a precise medical
            specification — it is the threshold beyond which the human eye treats
            incoming light as effectively parallel. At that distance the lens is
            in its fully relaxed state. In a typical office: the far end of the
            open-plan floor, the door to a meeting room, a building visible
            through a window. In a typical home office: the opposite wall of a
            larger room, a window onto the street, a hallway with a picture at
            the end of it. If you genuinely cannot find a 20-foot sightline,
            anything past 10 feet still helps; the goal is to break the near-focus
            spell, not to satisfy a measuring tape.
          </p>

          <h2>Other digital eye-strain practices that complement the rule</h2>
          <ul>
            <li>
              <strong>Monitor distance.</strong> The recommended viewing distance
              is one arm&apos;s length (50–70 cm) from your eyes to the screen,
              with the top of the screen at or just below eye level. Lower
              screens reduce eyelid retraction, which slows tear evaporation.
            </li>
            <li>
              <strong>Ambient lighting.</strong> Match room lighting to screen
              brightness; a glaring screen in a dark room forces the iris to
              compromise. Aim for soft indirect light from behind you or above
              the monitor.
            </li>
            <li>
              <strong>Blink consciously.</strong> Build a habit of taking a deep
              blink whenever you scroll a long page or switch applications. The
              cumulative effect is significant.
            </li>
            <li>
              <strong>Hydration.</strong> Mild dehydration measurably reduces
              tear-film production. Pair the 20-20-20 rule with the{" "}
              <a href="/wellness/fasting">Hydration Tracker</a> style of
              prompting.
            </li>
            <li>
              <strong>Sleep hygiene.</strong> The most consistent driver of
              morning eye-strain is poor sleep, not screen exposure. Use the{" "}
              <a href="/wellness/sleep">Sleep Timer</a> to wind down without
              extending screen time before bed.
            </li>
            <li>
              <strong>Skip the blue-light marketing.</strong> The American
              Academy of Ophthalmology has explicitly stated that screen blue
              light does not damage the retina. Blue-light glasses are not
              harmful, but they are not solving the problem either — the 20-20-20
              rule does.
            </li>
          </ul>

          <h2>Pair the 20-20-20 rule with your work rhythm</h2>
          <p>
            The 20-minute eye-strain cadence and a 25-minute{" "}
            <a href="/productivity/pomodoro">Pomodoro</a> focus block fit
            together cleanly: complete a pomodoro, take the eye-strain break and
            the pomodoro break together, then start the next pomodoro. Knowledge
            workers report that this rhythm feels less disruptive than either
            cadence on its own — the eye-break gives the pomodoro break a useful
            structure, and the pomodoro gives the eye-break a clean rhythm. For
            longer deep-work sessions where a 25-minute cycle is too short, try
            the <a href="/productivity/study">Study Timer</a> at 50 minutes and
            keep the eye-strain timer at 20 minutes; you will get two micro-breaks
            inside each study block.
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
