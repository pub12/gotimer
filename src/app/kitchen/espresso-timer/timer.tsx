"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { espressoShotStrategy } from "@/lib/timer-strategies/espresso-shot";
import { EspressoExtras } from "@/components/coffee/espresso-extras";
import { ESPRESSO_HUB_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Espresso Pre-Infusion Timer",
    href: "/kitchen/espresso-timer/pre-infusion",
    description: "First-drip capture optimised for pre-infusion tracking",
  },
  {
    name: "25-Second Shot Timer",
    href: "/kitchen/espresso-timer/25-second-shot",
    description: "Pre-set 25-30s target band for the classic shot recipe",
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
    description: "Concentrated brew alternative — not espresso, but in the ballpark",
  },
  {
    name: "Egg Timer",
    href: "/kitchen/eggs",
    description: "Pair an espresso with a soft-boiled egg",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={espressoShotStrategy}
      config={{ target_min: 25, target_max: 30 }}
      label="Espresso Shot Timer"
      description="Count-up timer with pre-infusion / first-drip capture and a 25-30 second target band."
      below={<EspressoExtras />}
      seo_content={
        <TimerSeoContent
          timer_name="Espresso Shot Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={ESPRESSO_HUB_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Espresso Shot Timer
          </h1>
          <p>
            A free espresso shot timer with first-drip capture and a configurable
            target band. Start it when you engage the pump, tap{" "}
            <strong>First Drip</strong> when coffee first appears at the portafilter
            spout, and watch the target band turn green at <strong>25
            seconds</strong> and red at <strong>30 seconds</strong>. Both elapsed
            time and time-since-first-drip stay visible so you can pull to either
            measurement.
          </p>

          <h2>What this timer tracks</h2>
          <ul>
            <li>
              <strong>Total elapsed time</strong> — from pump-on, in seconds. The
              standard &quot;shot took 28 seconds&quot; reference.
            </li>
            <li>
              <strong>First-drip timestamp</strong> — captured when you tap the
              First Drip button. The space between pump-on and first drip is the
              pre-infusion phase, typically 4-8 seconds on a home machine.
            </li>
            <li>
              <strong>Time since first drip</strong> — extraction time, which is
              what most third-wave coffee shops actually quote. Aim for 25-30
              seconds of extraction for a balanced double shot.
            </li>
            <li>
              <strong>Target band</strong> — colored indicator: amber before
              target, emerald in target, rose after target. Audio cue at 25s and
              30s.
            </li>
          </ul>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Lock in your portafilter</strong> with a properly tamped
              puck. Place the cup or shot glass under the spouts on a scale.
            </li>
            <li>
              <strong>Press the timer&apos;s start button</strong> at the same
              moment you press the brew button on the espresso machine. The
              machine&apos;s pump turns on; the timer starts at zero.
            </li>
            <li>
              <strong>Watch the portafilter spouts</strong>. As soon as the first
              drop of coffee emerges, tap <strong>First Drip</strong> on the
              timer. The timer captures the timestamp; the &quot;Since first
              drip&quot; readout starts counting.
            </li>
            <li>
              <strong>Pull to your target</strong>. Most shots target 36g yield
              (for an 18g dose, 1:2 ratio) or 25-30 seconds of extraction time —
              whichever you hit first depends on your grind setting. The audio
              cue at 25s and 30s warns you when you&apos;re approaching and past
              the target.
            </li>
            <li>
              <strong>Tap pause to stop the timer</strong> when you stop the
              shot. The final elapsed time, first-drip timestamp, and extraction
              time stay visible until you reset.
            </li>
          </ol>

          <h2>Dialing in a new espresso bean</h2>
          <p>
            The standard dial-in procedure with this timer:
          </p>
          <ol>
            <li>
              <strong>Set a starting grind</strong> — finer than your previous
              bean if you&apos;re going darker, coarser if lighter. Start a notch
              off your usual setting.
            </li>
            <li>
              <strong>Pull a test shot</strong> with 18g dose, target 36g yield.
              Note the time.
            </li>
            <li>
              <strong>Adjust grind based on time:</strong> If the shot ran
              <strong> under 22 seconds</strong>, tighten the grind. If
              <strong> over 32 seconds</strong>, coarsen. Adjust one notch on a
              stepped grinder.
            </li>
            <li>
              <strong>Re-pull</strong>. Repeat until you&apos;re in the 25-30s
              window.
            </li>
            <li>
              <strong>Taste-test once you&apos;re in range</strong>. Adjust by
              taste from there — finer for more body and sweetness, coarser for
              more clarity and acidity.
            </li>
          </ol>

          <h2>The two-target debate</h2>
          <p>
            Espresso has two common timing targets: <strong>total time</strong>{" "}
            (pump-on to cup-off, 25-30 seconds) and <strong>extraction
            time</strong> (first-drip to cup-off, 25-30 seconds). They&apos;re
            different by your pre-infusion duration — 4-8 seconds on most home
            machines, longer on machines with controlled pre-infusion. This timer
            shows both so you don&apos;t have to choose. Most third-wave shops
            track extraction time; most home guides and machine documentation
            quote total time. Pick the one that matches your reference.
          </p>

          <h2>What this timer doesn&apos;t do</h2>
          <p>
            <strong>It doesn&apos;t measure yield.</strong> You still need a
            scale under the cup to weigh the shot output (the canonical 18g
            dose → 36g yield 1:2 ratio). The timer is for time; the scale is for
            weight. Most home espresso setups use both.
          </p>
          <p>
            <strong>It doesn&apos;t profile pressure.</strong> If your machine
            has a pressure gauge and supports profiling (Decent, La Marzocco
            Linea Mini with paddle, ECM machines with manual pre-infusion), the
            actual pressure curve over time matters too — this timer just tracks
            seconds, not bars.
          </p>

          <h2>Related presets</h2>
          <p>
            <Link href="/kitchen/espresso-timer/pre-infusion">Pre-infusion
            timer</Link> — same engine, framed for tracking the pre-infusion
            phase specifically. Useful for dialing in machines with adjustable
            pre-infusion duration.
          </p>
          <p>
            <Link href="/kitchen/espresso-timer/25-second-shot">25-second shot
            timer</Link> — pre-configured target band locked at 25-30s with
            recipe-style instructions for the classic double shot.
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export function EspressoTimer() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
