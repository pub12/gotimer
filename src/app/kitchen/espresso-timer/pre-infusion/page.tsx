"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { espressoShotStrategy } from "@/lib/timer-strategies/espresso-shot";
import { EspressoExtras } from "@/components/coffee/espresso-extras";
import { PRE_INFUSION_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Espresso Timer Hub",
    href: "/kitchen/espresso-timer",
    description: "Same engine, full configurator — pick target band and dial in",
  },
  {
    name: "25-Second Shot Timer",
    href: "/kitchen/espresso-timer/25-second-shot",
    description: "Classic 25-30s target band with recipe-style instructions",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Sibling tool — multi-stage pour scheduling for V60, Chemex and more",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "Pour-over alternative — James Hoffmann&apos;s flagship recipe",
  },
  {
    name: "AeroPress (Standard)",
    href: "/kitchen/pour-over-timer/aeropress",
    description: "Concentrated immersion brew — not espresso, but in the ballpark",
  },
  {
    name: "Egg Timer",
    href: "/kitchen/eggs",
    description: "Pair your espresso with a soft-boiled egg",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={espressoShotStrategy}
      config={{ target_min: 25, target_max: 30 }}
      label="Espresso Pre-Infusion Timer"
      description="First-drip capture + extraction-time tracking — built for dialing in pre-infusion duration."
      below={<EspressoExtras />}
      seo_content={
        <TimerSeoContent
          timer_name="Espresso Pre-Infusion Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={PRE_INFUSION_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Espresso Pre-Infusion Timer
          </h1>
          <p>
            A free espresso timer built specifically for tracking pre-infusion
            duration. Counts up from pump-on, captures the first-drip timestamp
            when you tap the button, and displays the pre-infusion time and
            extraction time separately. Use it to dial in pre-infusion duration
            on any espresso machine — with or without controlled pre-infusion
            hardware.
          </p>

          <h2>What pre-infusion does</h2>
          <p>
            Pre-infusion is the phase at the start of an espresso shot when water
            wets the puck before full extraction pressure builds. It happens
            between pump-on (when the brew button is pressed) and first drip
            (when coffee appears at the portafilter spouts). On most home machines
            this is <strong>4-8 seconds</strong> of unintentional pre-infusion as
            the boiler fills the group head; on machines with controlled
            pre-infusion (Decent, La Marzocco Linea Mini, ECM Synchronika) you
            can extend it to 10-20 seconds with adjustable pressure.
          </p>

          <h2>Why track pre-infusion at all?</h2>
          <ol>
            <li>
              <strong>Even saturation.</strong> Pre-infusion wets the entire
              puck before full pressure. Without it, water finds a path of
              least resistance and channels — the most common cause of sour or
              uneven shots.
            </li>
            <li>
              <strong>CO₂ degassing.</strong> Fresh coffee releases CO₂ that
              interferes with extraction. Low-pressure pre-infusion lets some
              of that gas escape, producing a more consistent extraction in
              the subsequent high-pressure phase.
            </li>
            <li>
              <strong>Consistency signal.</strong> Once you&apos;ve dialed in
              a coffee, your pre-infusion duration should be roughly the same
              shot-to-shot. If it suddenly jumps to 10 seconds when it was
              normally 5, something changed — grind setting drift, bean
              freshness, tamp pressure, or basket condition. The pre-infusion
              time is the canary.
            </li>
          </ol>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Set up your shot</strong> on the machine — dose, tamp,
              lock the portafilter, put cup on scale.
            </li>
            <li>
              <strong>Press the timer start button</strong> at the same moment
              you press brew on the machine. Pump engages; timer at zero.
            </li>
            <li>
              <strong>Watch the portafilter spouts.</strong> As soon as the first
              drop emerges, tap <strong>First Drip</strong>. The timer captures
              the timestamp.
            </li>
            <li>
              <strong>Track both numbers.</strong> &quot;First drip&quot; shows
              the pre-infusion duration (most home machines: 4-8s). &quot;Since
              first drip&quot; shows the extraction time, which is what most
              coffee pros quote (target: 25-30 seconds).
            </li>
            <li>
              <strong>Pause when you stop the shot.</strong> Final numbers stay
              visible. Note them and adjust grind / dose / tamp for the next
              shot.
            </li>
          </ol>

          <h2>Dialing in pre-infusion duration</h2>
          <p>
            For machines <strong>without controlled pre-infusion</strong>, the
            duration is a function of grind, dose, tamp, and bean freshness.
            To lengthen pre-infusion: <strong>finer grind</strong> (more
            resistance, slower fill), <strong>tighter tamp</strong> (more puck
            compression), or <strong>fresher coffee</strong> (more CO₂
            resistance to water flow). To shorten: coarsen, tamp lighter, use
            older coffee. Most home setups stabilize at 4-6 seconds with
            mid-week-old coffee at a normal grind setting.
          </p>
          <p>
            For machines <strong>with controlled pre-infusion</strong>: set the
            target duration directly via the machine&apos;s software (Decent app),
            paddle (Linea Mini), or pre-infusion knob (ECM, Profitec). Verify
            with this timer that the actual pre-infusion duration matches what
            the machine claims — software targets and real-world behavior
            don&apos;t always agree.
          </p>

          <h2>What the &quot;25-30s target&quot; refers to</h2>
          <p>
            Espresso has two common timing targets: <strong>total time</strong>{" "}
            (pump-on to cup-off, 25-30 seconds) and <strong>extraction
            time</strong> (first-drip to cup-off, 25-30 seconds). The target
            band on this timer measures from pump-on — total time. If you want
            to target 25-30s of <em>extraction time</em>, watch the
            &quot;since first drip&quot; readout and stop the shot when it
            reaches 25-30 seconds, ignoring the total-time band.
          </p>

          <h2>Common pre-infusion problems</h2>
          <p>
            <strong>Pre-infusion under 3 seconds</strong> — grind is too
            coarse, dose is too low, or the puck has a crack. Result: gushing
            shot, sour cup, under-extracted.
          </p>
          <p>
            <strong>Pre-infusion over 12 seconds</strong> — grind is too fine,
            dose is too high, or the puck is over-tamped. Result: choking
            shot, bitter cup, over-extracted.
          </p>
          <p>
            <strong>Pre-infusion varies by 3+ seconds shot-to-shot</strong> —
            inconsistent distribution or tamp. Use a WDT tool (distribution),
            then a level tamp. Use a calibrated tamper to remove the pressure
            variable.
          </p>

          <h2>Related</h2>
          <p>
            Need a simpler timer with the 25-30s target locked in and
            recipe-style instructions? See the{" "}
            <Link href="/kitchen/espresso-timer/25-second-shot">25-second
            shot timer</Link>. Need the full configurable version? See the{" "}
            <Link href="/kitchen/espresso-timer">espresso timer hub</Link>.
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
