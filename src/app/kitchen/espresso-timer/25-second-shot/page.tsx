"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { espressoShotStrategy } from "@/lib/timer-strategies/espresso-shot";
import { EspressoExtras } from "@/components/coffee/espresso-extras";
import { TWENTY_FIVE_SECOND_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Espresso Timer Hub",
    href: "/kitchen/espresso-timer",
    description: "Full configurable version — tune target band to taste",
  },
  {
    name: "Pre-Infusion Timer",
    href: "/kitchen/espresso-timer/pre-infusion",
    description: "Same engine, framed for tracking pre-infusion duration",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Sibling tool — multi-stage pour scheduling for V60, Chemex and more",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "When you want a pour-over instead",
  },
  {
    name: "AeroPress (Standard)",
    href: "/kitchen/pour-over-timer/aeropress",
    description: "Concentrated brew alternative — not espresso, but in the ballpark",
  },
  {
    name: "Egg Timer",
    href: "/kitchen/eggs",
    description: "Soft-boiled egg + espresso = breakfast",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={espressoShotStrategy}
      config={{ target_min: 25, target_max: 30 }}
      label="25 Second Espresso Timer"
      description="Classic double-shot recipe — 18g in, 36g out, 25-30 second target locked in."
      below={<EspressoExtras />}
      seo_content={
        <TimerSeoContent
          timer_name="25 Second Espresso Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={TWENTY_FIVE_SECOND_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            25 Second Espresso Timer
          </h1>
          <p>
            A free espresso shot timer pre-configured for the classic double shot:{" "}
            <strong>18g dose, 36g yield, 25-30 second target window</strong>. Start
            the timer when you engage the pump, tap First Drip when coffee appears,
            and stop the shot when total time enters the 25-30 second target band.
            The band turns emerald in range and rose past — both colored visually
            and signaled with audio cues at 25s and 30s.
          </p>

          <h2>The classic 25-second shot recipe</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 18g coffee in a double basket, fine grind
              (machine-specific, dialed-in)
            </li>
            <li>
              <strong>Yield:</strong> 36g of liquid espresso (1:2 ratio by weight)
            </li>
            <li>
              <strong>Time:</strong> 25-30 seconds from pump-on to cup-off
            </li>
            <li>
              <strong>Pressure:</strong> 9 bar (standard pump pressure on most
              machines)
            </li>
            <li>
              <strong>Temperature:</strong> 92-94°C brew temperature
            </li>
            <li>
              <strong>Pre-infusion:</strong> 4-8 seconds of natural pre-infusion
              on most home machines; longer on machines with controlled
              pre-infusion
            </li>
          </ul>

          <h2>How to pull a 25-second shot</h2>
          <ol>
            <li>
              <strong>Weigh and dose</strong> 18g of beans (or your machine&apos;s
              specified basket dose). Single-dose grinding is more consistent than
              dosing from a hopper.
            </li>
            <li>
              <strong>Distribute and tamp.</strong> Use a WDT tool to break
              clumps, then tamp level with consistent pressure (15-30 lbs is the
              traditional range; a calibrated tamper removes the variable
              entirely).
            </li>
            <li>
              <strong>Lock the portafilter</strong> into the group head. Place a
              cup or shot glass on a scale under the spouts. Tare the scale.
            </li>
            <li>
              <strong>Press timer start + machine brew button simultaneously.</strong>
              Pump engages; pre-infusion begins (no drip yet).
            </li>
            <li>
              <strong>Tap First Drip</strong> the moment coffee appears at the
              spouts. Typical: 6-8 seconds.
            </li>
            <li>
              <strong>Watch the scale and the target band.</strong> Stop the pump
              when the scale reads 36g <em>or</em> when the target band turns
              rose (30s) — whichever comes first while you&apos;re still in the
              25-30s window.
            </li>
            <li>
              <strong>Taste within 30 seconds.</strong> Espresso changes flavor
              dramatically as it cools.
            </li>
          </ol>

          <h2>Why 25 seconds?</h2>
          <p>
            The 25-30 second target window comes from decades of Italian-style
            espresso convention plus empirical work by the Specialty Coffee
            Association. At a 1:2 ratio and 9 bar pressure, shots in that window
            produce <strong>20-22% extraction yield</strong> — the range that
            tastes balanced (not sour, not bitter) for most espresso roasts.
            Shorter shots (under 22 seconds) typically under-extract and taste
            sour; longer shots (over 32 seconds) over-extract and taste bitter.
            The 25-30 second window is the &quot;sweet spot&quot; in extraction
            yield curves.
          </p>

          <h2>When to deviate</h2>
          <p>
            <strong>Light roasts</strong> often need finer grind and 28-32
            second total time to extract enough — some specialty shops pull
            light roasts at 1:2.5 ratio for 32+ seconds.
          </p>
          <p>
            <strong>Dark roasts</strong> are easier to extract; some pull at
            1:1.5 (ristretto) in 20-25 seconds for a sweeter, more concentrated
            shot.
          </p>
          <p>
            <strong>Milk drinks</strong> can tolerate slightly shorter, more
            concentrated shots because the milk dilutes and sweetens — 22-25
            seconds at 1:1.5 produces strong cortados and flat whites.
          </p>

          <h2>Dialing in a new bean</h2>
          <p>
            The standard dial-in procedure:
          </p>
          <ol>
            <li>
              <strong>Pull a test shot</strong> with 18g dose, target 36g
              yield. Note the time.
            </li>
            <li>
              <strong>If under 22 seconds:</strong> tighten the grind (finer).
              One notch on a stepped grinder.
            </li>
            <li>
              <strong>If over 32 seconds:</strong> coarsen.
            </li>
            <li>
              <strong>Re-pull and re-measure.</strong> Repeat until you&apos;re
              in the 25-30s window with 36g yield.
            </li>
            <li>
              <strong>Taste-test.</strong> Adjust by taste — finer for more
              body and sweetness; coarser for more clarity and acidity.
            </li>
          </ol>

          <h2>What this timer doesn&apos;t replace</h2>
          <p>
            <strong>A scale.</strong> You still need to weigh dose (in) and
            yield (out). The timer is for time; the scale is for weight. Most
            modern home espresso setups use both.
          </p>
          <p>
            <strong>A calibrated tamper.</strong> Pressure consistency between
            shots is one of the biggest dial-in variables; a calibrated tamper
            (or just very consistent hand pressure) removes it.
          </p>
          <p>
            <strong>Fresh coffee.</strong> Beans past 4-6 weeks from roast date
            produce inconsistent shots regardless of recipe — too much
            degassing, too little CO₂ pressure, drift across the bag. Buy small,
            buy fresh.
          </p>

          <h2>Related</h2>
          <p>
            For tracking pre-infusion duration specifically — useful for
            machines with controlled pre-infusion — see the{" "}
            <Link href="/kitchen/espresso-timer/pre-infusion">pre-infusion
            timer</Link>. For a configurable version where you can change the
            target band, see the{" "}
            <Link href="/kitchen/espresso-timer">espresso timer hub</Link>.
            For pour-over alternatives, see the{" "}
            <Link href="/kitchen/pour-over-timer">pour-over timer hub</Link>.
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
