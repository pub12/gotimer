"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import {
  SOBERG_PRESET,
  expand_contrast,
  type ContrastConfig,
} from "@/lib/contrast-therapy";
import { CONTRAST_THERAPY_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Søberg Protocol Timer",
    href: "/wellness/contrast-therapy/soberg-protocol",
    description: "3 rounds of 15-2-1 ending on cold — the published Søberg sequence",
  },
  {
    name: "15-3-1 Sauna Timer",
    href: "/wellness/contrast-therapy/15-3-rest",
    description: "Sauna-heavy variant: 15 min sauna / 3 min cold / 1 min rest",
  },
  {
    name: "Wim Hof-style Contrast Timer",
    href: "/wellness/contrast-therapy/wim-hof-style",
    description: "Breath work / cold / recovery — 3 rounds ending on cold",
  },
  {
    name: "Sauna Timer",
    href: "/wellness/sauna-timer",
    description: "Single-round sauna timer for any session length",
  },
  {
    name: "Cold Plunge Timer",
    href: "/wellness/cold-plunge-timer",
    description: "Single-round cold plunge timer with research-backed defaults",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Wim Hof, box breathing, and 4-7-8 protocols",
  },
];

const PRESET_OPTIONS: Record<string, { label: string; config: ContrastConfig }> = {
  soberg: {
    label: "Søberg (15-2-1, ends on cold)",
    config: SOBERG_PRESET,
  },
  "15-3-1": {
    label: "Sauna-heavy 15-3-1",
    config: {
      phases: [
        { name: "Sauna", duration: 15 * 60 },
        { name: "Cold plunge", duration: 3 * 60 },
        { name: "Rest", duration: 60 },
      ],
      cycles: 3,
      end_on: "Cold plunge",
    },
  },
  "wim-hof": {
    label: "Wim Hof-style (breath + cold)",
    config: {
      phases: [
        { name: "Breath work", duration: 3 * 60 },
        { name: "Cold plunge", duration: 120 },
        { name: "Recovery", duration: 90 },
      ],
      cycles: 3,
      end_on: "Cold plunge",
    },
  },
};

function Content() {
  const params = useSearchParams();
  const requested = params.get("preset") ?? "";
  const initial_preset = PRESET_OPTIONS[requested] ? requested : "soberg";

  const [preset_key, set_preset_key] = useState(initial_preset);
  const preset = PRESET_OPTIONS[preset_key];

  const steps = useMemo(() => expand_contrast(preset.config), [preset.config]);
  const total_minutes = useMemo(
    () => Math.round(steps.reduce((sum, s) => sum + s.duration, 0) / 60),
    [steps],
  );

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (preset_key === "soberg") {
      url_params.delete("preset");
    } else {
      url_params.set("preset", preset_key);
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [preset_key]);

  return (
    <TimerPage
      key={preset_key}
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Contrast Therapy Timer"
      description={`${preset.config.cycles}-round sauna and cold-plunge sequence — about ${total_minutes} minutes total.`}
      show_skip
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="contrast-preset"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Protocol
            </label>
            <select
              id="contrast-preset"
              value={preset_key}
              onChange={(e) => set_preset_key(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
            >
              {Object.entries(PRESET_OPTIONS).map(([key, opt]) => (
                <option key={key} value={key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {preset.config.cycles} rounds · ends on{" "}
            {preset.config.end_on || preset.config.phases[preset.config.phases.length - 1].name}
          </p>
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Contrast Therapy Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={CONTRAST_THERAPY_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Contrast Therapy Timer
          </h1>
          <p>
            A free multi-phase contrast-therapy timer for sauna and cold-plunge sequencing.
            Pick a published protocol (Søberg, 15-3-1, or Wim Hof-style) or customize your
            own phase lengths and cycle count. The timer sequences each round automatically,
            announces phase transitions with audio cues, and ends on cold by default — the
            structure recommended by Dr. Susanna Søberg&apos;s 2021 brown-adipose research.
          </p>

          <h2>The three pre-built protocols</h2>
          <ul>
            <li>
              <strong>Søberg (15-2-1, ends on cold)</strong> — 15 minutes sauna, 2 minutes
              cold plunge at 0-15&deg;C, 1 minute rest, repeated 3 times. The last
              cycle drops the trailing rest phase so the session ends on cold. About 55
              minutes total. Dedicated page: <Link href="/wellness/contrast-therapy/soberg-protocol">/contrast-therapy/soberg-protocol</Link>.
            </li>
            <li>
              <strong>15-3-1 sauna-heavy</strong> — 15 sauna, 3 cold, 1 rest, three
              rounds, ends on cold. Slightly more cold exposure than the Søberg version.
              Dedicated page: <Link href="/wellness/contrast-therapy/15-3-rest">/contrast-therapy/15-3-rest</Link>.
            </li>
            <li>
              <strong>Wim Hof-style</strong> — 3 minutes breath work, 2 minutes cold, 90
              seconds recovery, three rounds, ends on cold. Replaces the sauna phase with
              a breath-work warm-up. Dedicated page: <Link href="/wellness/contrast-therapy/wim-hof-style">/contrast-therapy/wim-hof-style</Link>.
            </li>
          </ul>

          <h2>What contrast therapy does</h2>
          <p>
            The heat phase opens peripheral blood vessels, raises core body temperature
            roughly 1&deg;C, and triggers heat-shock protein expression. The cold phase
            triggers an abrupt sympathetic-nervous-system response: a sustained
            noradrenaline release (2-3x baseline for an hour after exit), peripheral
            vasoconstriction, and activation of brown adipose tissue. Cycling the two
            amplifies both responses beyond what either alone produces. Practically,
            users report sharper alertness, improved mood, faster perceived recovery, and
            — over weeks of regular practice — a noticeable shift toward feeling cold
            less often in daily life.
          </p>

          <h2>Why end on cold (the Søberg principle)</h2>
          <p>
            Ending the session in the cold phase keeps brown adipose tissue elevated and
            sustains noradrenaline release after exit. Your body warms itself from the
            inside over the next 30-60 minutes — the &quot;adaptive&quot; signal
            researchers measure in studies of cold-induced thermogenesis. Ending on
            sauna instead leaves you passively cooling from the outside in, which blunts
            the signal. Every preset in this hub ends on cold for that reason; the
            <Link href="/wellness/sauna-timer"> single-round sauna timer</Link> exists for
            cases when you only want the heat phase, with no cold component.
          </p>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Pick a protocol</strong> — Søberg is the default and the most
              commonly cited modern sequence. The dropdown also offers a 15-3-1
              sauna-heavy variant and a Wim Hof-style breath-and-cold variant.
            </li>
            <li>
              <strong>Tap the speaker icon</strong> to unlock audio cues. Each phase
              transition fires a distinct chime so you know to move without checking the
              screen.
            </li>
            <li>
              <strong>Press start as you begin round one&apos;s first phase.</strong> The
              timer tracks the round number and remaining phase time. The display shows
              the current phase name plus &quot;Round 2 of 3&quot;-style indicators.
            </li>
            <li>
              <strong>Move between sauna and plunge at each chime.</strong> The 60-second
              rest phase between sauna and plunge is short by design — long enough to
              dry off and walk to the plunge tank, not long enough for your skin
              temperature to fully equalize.
            </li>
            <li>
              <strong>Stay in the cold for the full final phase.</strong> Ending on cold
              is the whole point of the protocol; do not skip the last cold phase even
              if you are tired.
            </li>
          </ol>

          <h2>Safety</h2>
          <p>
            Contrast therapy is well-tolerated by healthy adults but combines two
            stressors — heat and cold — that each have their own risk profile. Skip the
            cold phase if you have uncontrolled hypertension, unstable angina, recent
            heart attack or stroke, severe Raynaud&apos;s syndrome, or are pregnant.
            Skip the heat phase if you have severe aortic stenosis or are febrile.
            Hydrate aggressively — a 15-minute Finnish-style round can shed half a litre
            of sweat — and do not consume alcohol before or during a session. Do not
            perform the cold phase alone if you are new to cold-water immersion.
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export function ContrastTherapyTimer() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
