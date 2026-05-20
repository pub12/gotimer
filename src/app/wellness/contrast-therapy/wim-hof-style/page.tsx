"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { WIM_HOF_PRESET, expand_contrast } from "@/lib/contrast-therapy";
import { WIM_HOF_CONTRAST_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Contrast Therapy Hub",
    href: "/wellness/contrast-therapy",
    description: "Pick a preset or customize your own phase lengths",
  },
  {
    name: "11-Minute Cold Protocol Timer",
    href: "/wellness/contrast-therapy/11-minute-cold-protocol",
    description: "Sauna-based 15-2-1 sequence — the canonical end-on-cold contrast version",
  },
  {
    name: "15-3-1 Sauna Timer",
    href: "/wellness/contrast-therapy/15-3-rest",
    description: "Sauna-heavy variant with longer cold rounds",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Standalone breath-work timer for box, 4-7-8, and Wim Hof patterns",
  },
  {
    name: "Cold Plunge Timer",
    href: "/wellness/cold-plunge-timer",
    description: "Single-round cold plunge timer for cold-only sessions",
  },
  {
    name: "Sauna Timer",
    href: "/wellness/sauna-timer",
    description: "Single-round sauna timer for heat-only sessions",
  },
];

function Content() {
  const steps = useMemo(() => expand_contrast(WIM_HOF_PRESET), []);
  const total_minutes = Math.round(
    steps.reduce((sum, s) => sum + s.duration, 0) / 60,
  );

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Wim Hof-style Contrast Timer"
      description={`3 rounds of breath work, cold, recovery — ${total_minutes} min total, ends on cold.`}
      show_skip
      seo_content={
        <TimerSeoContent
          timer_name="Wim Hof-style Contrast Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={WIM_HOF_CONTRAST_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Wim Hof-style Contrast Timer
          </h1>
          <p>
            A free contrast-therapy timer that substitutes <strong>3 minutes of breath
            work</strong> for the sauna phase — useful when you have no sauna available,
            want to combine breath training with cold exposure, or want a substantially
            shorter session. <strong>3 rounds of 3-min breath work, 2-min cold plunge,
            and 90-second recovery</strong>, ending on cold. About 22 minutes total.
          </p>

          <h2>What is the Wim Hof method?</h2>
          <p>
            Dutch extreme-athlete Wim Hof popularized a three-pillar practice combining
            <strong> controlled hyperventilation breath work, deliberate cold exposure,
            and commitment</strong>. The breath-work component is a sequence of 30-40
            deep breaths followed by a passive breath hold on the empty exhale; the
            cold-exposure component is short cold-water immersion. Hof has demonstrated
            unusual physiological control under experimental conditions, and limited
            peer-reviewed work (Kox et al., 2014; <em>PNAS</em>) supports a modest
            voluntary influence over the autonomic nervous system through this practice.
          </p>

          <h2>The protocol structure</h2>
          <p>
            One complete session is three identical rounds, with the trailing recovery
            phase of the final round removed so the session ends in the cold:
          </p>
          <ul>
            <li>
              <strong>Round 1:</strong> Breath work 3 min &rarr; Cold plunge 2 min &rarr; Recovery 90 sec
            </li>
            <li>
              <strong>Round 2:</strong> Breath work 3 min &rarr; Cold plunge 2 min &rarr; Recovery 90 sec
            </li>
            <li>
              <strong>Round 3:</strong> Breath work 3 min &rarr; Cold plunge 2 min (no
              trailing recovery — session ends here)
            </li>
          </ul>
          <p>
            Total time: about 22 minutes. Total cold exposure: 6 minutes per session.
            Two sessions per week put you at the 11-minute weekly cold-exposure target
            for adaptive brown-fat activation, in less than a quarter of the time a
            sauna-based protocol takes.
          </p>

          <h2>How to do the breath-work phase</h2>
          <p>
            The classical Wim Hof breath pattern, in a safe seated or lying position on
            a soft surface, away from water:
          </p>
          <ol>
            <li>
              <strong>30-40 deep breaths</strong> — full inhale through the nose or
              mouth, passive exhale through the mouth. Aim for a steady rhythm, not a
              gasping one.
            </li>
            <li>
              <strong>Empty-lung hold</strong> — after your final exhale, do not breathe
              in. Hold until the strong urge to breathe arrives; typically 1-2 minutes
              for trained practitioners.
            </li>
            <li>
              <strong>Recovery breath</strong> — take one big inhale, hold for 15
              seconds, release.
            </li>
            <li>
              Repeat steps 1-3 if the 3-minute window allows. Most people fit one or
              two rounds depending on tolerance.
            </li>
          </ol>

          <h2>Why end on cold rather than recovery?</h2>
          <p>
            The end-on-cold principle applies regardless of whether the
            heat-or-arousal phase comes from sauna or breath work. Finishing in the cold
            sustains noradrenaline release and keeps brown adipose tissue active for
            30-60 minutes after exit; your body warms itself internally through brown-fat
            thermogenesis. Ending on recovery instead leaves you passively warming and
            dampens the adaptive signal. This is why every preset in our{" "}
            <Link href="/wellness/contrast-therapy">contrast-therapy hub</Link> finishes
            in the cold.
          </p>

          <h2>Safety</h2>
          <p>
            <strong>Never perform Wim Hof breath work in water</strong> — the breath
            holds can cause loss of consciousness without warning, which is fatal in
            water. Always do the breath-work phase out of the plunge tank, on a soft
            surface, in a safe seated or lying position. Move to the cold immersion
            only after the breath-work phase is fully complete. Skip the breath work if
            you have a history of epilepsy, recent panic attacks, or are pregnant. Skip
            the cold phase if you have uncontrolled hypertension, unstable angina,
            recent heart attack or stroke, severe Raynaud&apos;s, or are pregnant. Do
            not perform the cold phase alone if you are new to cold-water immersion.
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
