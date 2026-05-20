"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { ELEVEN_MIN_PRESET, expand_contrast } from "@/lib/contrast-therapy";
import { ELEVEN_MIN_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Contrast Therapy Hub",
    href: "/wellness/contrast-therapy",
    description: "Choose between 11-Minute Cold, 15-3-1, and Wim Hof-style protocols",
  },
  {
    name: "15-3-1 Sauna Timer",
    href: "/wellness/contrast-therapy/15-3-rest",
    description: "Sauna-heavy variant: 15 sauna / 3 cold / 1 rest, 3 rounds",
  },
  {
    name: "Wim Hof-style Contrast Timer",
    href: "/wellness/contrast-therapy/wim-hof-style",
    description: "Breath work / cold / recovery — 3 rounds ending on cold",
  },
  {
    name: "Sauna Timer",
    href: "/wellness/sauna-timer",
    description: "Single-round sauna timer for when you only want the heat phase",
  },
  {
    name: "Cold Plunge Timer",
    href: "/wellness/cold-plunge-timer",
    description: "Single-round cold plunge timer with research-backed 2-minute default",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Box-breathing and 4-7-8 patterns for pre- and post-session recovery",
  },
];

function Content() {
  const steps = useMemo(() => expand_contrast(ELEVEN_MIN_PRESET), []);
  const total_minutes = Math.round(
    steps.reduce((sum, s) => sum + s.duration, 0) / 60,
  );

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="11-Minute Cold Protocol Timer"
      description={`3 rounds of 15 min sauna, 2 min cold, 1 min rest — ${total_minutes} min total, ends on cold.`}
      show_skip
      seo_content={
        <TimerSeoContent
          timer_name="11-Minute Cold Protocol Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={ELEVEN_MIN_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            The 11-Minute Cold Protocol Timer
          </h1>
          <p>
            A free, pre-configured contrast-therapy timer built around the most-cited
            finding in modern cold-exposure literature: a weekly target of about{" "}
            <strong>11 minutes of total deliberate cold exposure</strong>, ending each
            session on cold. The structure is <strong>3 rounds of 15 minutes sauna,
            2 minutes cold plunge at 0-15&deg;C, and 1 minute rest</strong>, ending on
            cold. About 55 minutes total, with audio cues at every phase transition.
          </p>

          <h2>Also called the 11-minute rule</h2>
          <p>
            The 11-Minute Cold Protocol is the contrast-therapy sequence most often
            cited in modern discussion of cold exposure and metabolic adaptation. The
            two practical recommendations it is built on — both well established in
            peer-reviewed cold-water immersion research — are (1) a weekly target of
            about <strong>11 minutes of total deliberate cold exposure</strong> split
            across 2-4 short sessions, and (2) <strong>end on cold</strong> rather than
            heat in any contrast session. These two ideas are the basis of the
            structure on this page.
          </p>

          <h2>The structure: 15-2-1, three times, ending on cold</h2>
          <p>
            One complete session consists of three identical rounds, with the final
            round&apos;s trailing rest phase removed so the protocol ends in the cold:
          </p>
          <ul>
            <li>
              <strong>Round 1:</strong> Sauna 15 min &rarr; Cold plunge 2 min &rarr; Rest 1 min
            </li>
            <li>
              <strong>Round 2:</strong> Sauna 15 min &rarr; Cold plunge 2 min &rarr; Rest 1 min
            </li>
            <li>
              <strong>Round 3:</strong> Sauna 15 min &rarr; Cold plunge 2 min (no
              trailing rest — protocol ends here)
            </li>
          </ul>
          <p>
            Total time: about 55 minutes. Total cold exposure: 6 minutes per session.
            Two sessions per week put you at the 11-minute weekly target identified in
            the research as sufficient for measurable brown-fat adaptation.
          </p>

          <h2>Why end on cold</h2>
          <p>
            Ending the session in the cold phase keeps brown adipose tissue elevated
            and sustains noradrenaline release for 30-60 minutes after exit. Your body
            warms itself internally through brown-fat thermogenesis — the adaptive
            signal researchers measure in cold-induced metabolism studies. Ending on
            sauna leaves you passively cooling from outside in, which blunts the signal.
            This is why every preset in our <Link href="/wellness/contrast-therapy">contrast-therapy
            hub</Link> ends on cold, and why this timer drops the trailing rest phase of
            the final round.
          </p>

          <h2>Customize your protocol</h2>
          <p>
            This page is locked to the canonical 15-2-1 parameters. If you want to
            adjust phase lengths or round counts — for example a 10-2-1 version while
            you build tolerance, or a 20-3-2 version for trained users — open the
            parent <Link href="/wellness/contrast-therapy">Contrast Therapy Timer</Link> and
            pick a different preset, or hand-edit the URL parameters. For sauna or cold
            plunge in isolation, use the dedicated <Link href="/wellness/sauna-timer">Sauna
            Timer</Link> and <Link href="/wellness/cold-plunge-timer">Cold Plunge Timer</Link>.
          </p>

          <h2>Sauna and cold-plunge safety</h2>
          <p>
            The 11-Minute Cold Protocol combines two physiological stressors and each
            carries its own risk profile. Skip the cold phase if you have uncontrolled
            hypertension, unstable angina, recent heart attack or stroke, severe
            Raynaud&apos;s, or are pregnant. Skip the sauna phase if you have severe
            aortic stenosis, recent surgery, or febrile illness. Hydrate aggressively —
            a Finnish-style 15-minute sauna round can shed half a litre of sweat — and
            never combine the session with alcohol. <strong>Do not perform the cold
            phase alone</strong> if you are new to cold-water immersion: the cold-shock
            response can cause arrhythmia or aspiration in susceptible people.
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
