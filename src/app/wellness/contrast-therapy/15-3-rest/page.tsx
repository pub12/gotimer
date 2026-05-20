"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { FIFTEEN_THREE_PRESET, expand_contrast } from "@/lib/contrast-therapy";
import { FIFTEEN_THREE_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "11-Minute Cold Protocol Timer",
    href: "/wellness/contrast-therapy/11-minute-cold-protocol",
    description: "The canonical 15-2-1 sequence — slightly less cold dose per round",
  },
  {
    name: "Contrast Therapy Hub",
    href: "/wellness/contrast-therapy",
    description: "Pick a preset or customize your own phase lengths",
  },
  {
    name: "Wim Hof-style Contrast Timer",
    href: "/wellness/contrast-therapy/wim-hof-style",
    description: "Breath work / cold / recovery — no sauna required",
  },
  {
    name: "Sauna Timer",
    href: "/wellness/sauna-timer",
    description: "Single-round sauna timer for heat-only sessions",
  },
  {
    name: "Cold Plunge Timer",
    href: "/wellness/cold-plunge-timer",
    description: "Single-round cold plunge timer for cold-only sessions",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Pre- and post-session breath work for HRV recovery",
  },
];

function Content() {
  const steps = useMemo(() => expand_contrast(FIFTEEN_THREE_PRESET), []);
  const total_minutes = Math.round(
    steps.reduce((sum, s) => sum + s.duration, 0) / 60,
  );

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="15-3-1 Sauna + Cold Plunge Timer"
      description={`3 rounds of 15 min sauna, 3 min cold, 1 min rest — ${total_minutes} min total, ends on cold.`}
      show_skip
      seo_content={
        <TimerSeoContent
          timer_name="15-3-1 Sauna + Cold Plunge Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={FIFTEEN_THREE_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            15-3-1 Sauna + Cold Plunge Timer
          </h1>
          <p>
            A free, sauna-heavy contrast-therapy timer: <strong>15 minutes sauna at
            80-90&deg;C, 3 minutes cold plunge at 10-15&deg;C, 1 minute rest</strong>,
            repeated 3 times, ending on cold. About 57 minutes total with 9 minutes of
            cold exposure per session — close to the entire 11-minute weekly cold-exposure
            target in a single workout.
          </p>

          <h2>How 15-3-1 compares with the 11-Minute Cold Protocol</h2>
          <p>
            The structure is identical to the <Link href="/wellness/contrast-therapy/11-minute-cold-protocol">11-Minute
            Cold Protocol</Link> (3 rounds, ends on cold) except the cold phase is one
            minute longer per round. Both protocols put you firmly in the dose range the
            research identifies as effective, with the 15-3-1 variant accumulating cold
            exposure faster:
          </p>
          <ul>
            <li>
              <strong>11-Minute Cold Protocol:</strong> 15 sauna + 2 cold + 1 rest, 3 rounds &rarr;
              ~55 min total, <strong>6 min cold</strong> per session.
            </li>
            <li>
              <strong>15-3-1 variant:</strong> 15 sauna + 3 cold + 1 rest, 3 rounds &rarr;
              ~57 min total, <strong>9 min cold</strong> per session.
            </li>
          </ul>

          <h2>When to use 15-3-1 instead of the 11-Minute Cold version</h2>
          <p>
            Use this protocol when you already tolerate 1-2 minute cold plunges comfortably
            and want to push toward the 11-minute weekly cold-exposure target in fewer
            sessions. One 15-3-1 session per week covers most of the target; two sessions
            put you well above it. If 3-minute cold immersion at 10-15&deg;C still feels
            difficult, stick with the 2-minute version — extra cold is not the point if it
            forces you to skip sessions.
          </p>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Tap the speaker icon</strong> to enable the audio chime that fires
              at each phase transition.
            </li>
            <li>
              <strong>Press start as you sit down in the sauna.</strong> The 15-minute
              countdown begins immediately.
            </li>
            <li>
              <strong>Move to the plunge tank when the chime fires.</strong> Take about
              30 seconds to walk over and dry off; the protocol does not penalize the
              transition gap.
            </li>
            <li>
              <strong>Exhale slowly for the first 15-30 seconds in the cold.</strong>
              This blocks the cold-shock gasp reflex.
            </li>
            <li>
              <strong>Step out and rest briefly</strong>, then start round two as the
              chime fires.
            </li>
            <li>
              <strong>End in the cold.</strong> The final round drops the trailing rest
              phase by design — do not skip the final cold phase.
            </li>
          </ol>

          <h2>End-on-cold in this protocol</h2>
          <p>
            The 15-3-1 sequence ends on cold like the 11-Minute Cold Protocol — your last
            3 minutes are in the plunge tank. This keeps brown adipose tissue elevated and
            sustains noradrenaline release for 30-60 minutes after exit, during which your
            body warms itself internally through brown-fat thermogenesis. That sustained
            internal warming is the adaptive signal the protocol is structured to elicit,
            and it is the practical reason every preset in our
            <Link href="/wellness/contrast-therapy"> contrast-therapy hub</Link> finishes in
            the cold rather than the sauna.
          </p>

          <h2>Safety</h2>
          <p>
            Three-minute cold immersion at 10-15&deg;C is genuinely demanding. Skip the
            cold phase if you have uncontrolled hypertension, unstable angina, recent
            heart attack or stroke, severe Raynaud&apos;s, or are pregnant. Skip the
            sauna phase if you have severe aortic stenosis or febrile illness. Hydrate
            aggressively and never consume alcohol before or during a session. <strong>Do
            not perform the cold phase alone</strong> if you are new to cold-water
            immersion — the cold-shock response can cause arrhythmia or aspiration in
            susceptible people. If you are not already comfortable with 1-2 minute
            plunges, build tolerance first with the <Link href="/wellness/cold-plunge-timer">standalone
            cold plunge timer</Link> before attempting 3-minute rounds.
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
