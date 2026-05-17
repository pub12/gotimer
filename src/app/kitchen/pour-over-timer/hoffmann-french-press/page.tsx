"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { HOFFMANN_FRENCH_PRESS, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { HOFFMANN_FRENCH_PRESS_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "French Press (Classic)",
    href: "/kitchen/pour-over-timer/french-press",
    description: "Standard 4-minute press — faster, more sediment",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "Hoffmann&apos;s V60 method — paper-filtered drip",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Browse all 9 recipes",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "Same dose, paper filter, cleanest possible cup",
  },
  {
    name: "Tetsu Kasuya 4:6",
    href: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    description: "World Brewers Cup recipe for V60 dripper",
  },
  {
    name: "AeroPress Inverted",
    href: "/kitchen/pour-over-timer/aeropress-inverted",
    description: "Stronger immersion brew — similar shape, different brewer",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(HOFFMANN_FRENCH_PRESS), []);
  const seconds = total_time(HOFFMANN_FRENCH_PRESS);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Hoffmann French Press Timer"
      description={`${HOFFMANN_FRENCH_PRESS.coffee_g}g / ${HOFFMANN_FRENCH_PRESS.water_g}g · ${HOFFMANN_FRENCH_PRESS.temp_c}°C · ${HOFFMANN_FRENCH_PRESS.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={HOFFMANN_FRENCH_PRESS} />}
      seo_content={
        <TimerSeoContent
          timer_name="Hoffmann French Press Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={HOFFMANN_FRENCH_PRESS_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Hoffmann French Press Timer
          </h1>
          <p>
            A free French press timer pre-configured with James Hoffmann&apos;s
            &quot;Best French Press Technique&quot; (2020): <strong>30g coffee, 500g
            water at 94°C, coarse grind</strong>. Pour, 4-minute steep, break the
            crust, skim, 5-minute rest, pour without plunging. Total time around 9
            minutes for a much cleaner press cup than the standard 4-minute method.
          </p>

          <h2>Why this method exists</h2>
          <p>
            Classic French press has one persistent complaint: <strong>sediment in
            the cup</strong>. Plunging the press forces fines through the mesh and
            re-suspends grounds from the crust. Hoffmann&apos;s 2020 video proposed
            a different approach: <strong>don&apos;t plunge at all</strong>. Instead,
            break the crust to release trapped grounds, skim off the foam and
            floaters, rest the press so remaining fines settle, then pour directly
            from the press leaving the sediment at the bottom. The result is a
            press cup with sediment levels closer to paper-filtered drip.
          </p>

          <h2>The recipe at a glance</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 30g coffee, coarse grind (C40 click 30-36)
            </li>
            <li>
              <strong>Water:</strong> 500g filtered water at 94°C
            </li>
            <li>
              <strong>Ratio:</strong> 1:16.7 — same as the classic French press
            </li>
            <li>
              <strong>Equipment:</strong> 1-litre French press, kettle, scale,
              burr grinder, a spoon for skimming
            </li>
            <li>
              <strong>Total time:</strong> ~9:00
            </li>
          </ul>

          <h2>The full sequence</h2>
          <ol>
            <li>
              <strong>Pre-warm the press</strong> with hot water; dump.
            </li>
            <li>
              <strong>Add 30g of coarse coffee</strong> to the press.
            </li>
            <li>
              <strong>Pour (0:00-0:30):</strong> pour all 500g of water in one
              steady stream. Aim for the center to wet all grounds evenly.
            </li>
            <li>
              <strong>Steep (0:30-4:30):</strong> place the lid on with the
              plunger up. Wait 4 minutes undisturbed.
            </li>
            <li>
              <strong>Break the crust (4:30-5:00):</strong> remove the lid. Stir
              the crust gently with a spoon 3 times to break the surface layer.
              <strong> Skim off</strong> the foam and floating grounds with the spoon
              and discard.
            </li>
            <li>
              <strong>Rest (5:00-10:00):</strong> place the lid back on, plunger
              still up. Wait 5 more minutes. Suspended fines settle to the
              bottom; the cup clarifies.
            </li>
            <li>
              <strong>Pour-off (10:00-10:30):</strong> tilt the press carefully
              and pour the coffee into a separate vessel.{" "}
              <strong>Do not plunge.</strong> The mesh filter at the top keeps
              any remaining floaters out; settled sediment stays at the bottom.
              The last 50ml or so will be sediment-heavy — stop pouring before
              that.
            </li>
          </ol>

          <h2>Why the skim and rest matter</h2>
          <p>
            The standard 4-minute French press has two sources of sediment: (1)
            grounds and fines in the &quot;crust&quot; on top, which the plunge
            forces back into the water column, and (2) fines suspended throughout
            the brew that settle slowly. Hoffmann&apos;s method addresses both:
            the <strong>skim</strong> removes the floating grounds before they
            re-enter the cup, and the <strong>5-minute rest</strong> lets the
            remaining suspended fines settle out of the drinking column. Pouring
            without plunging completes the trick — gravity does the separation
            instead of the plunger.
          </p>

          <h2>What you give up</h2>
          <p>
            <strong>9 minutes instead of 5.</strong> The Hoffmann method is twice
            as slow as the classic 4-minute press, which is the main reason most
            people don&apos;t use it daily.
          </p>
          <p>
            <strong>Slightly less body.</strong> Some oils settle along with the
            fines during the 5-minute rest. The cup is still fuller than V60 or
            Chemex but marginally lighter than a plunged press. For most
            drinkers this is a feature; for some it&apos;s a loss.
          </p>

          <h2>Scaling the recipe</h2>
          <p>
            Scale proportionally — the 4-minute steep + skim + 5-minute rest
            timing stays constant regardless of batch size:
          </p>
          <ul>
            <li>
              <strong>600ml personal press:</strong> 18g coffee, 300g water
            </li>
            <li>
              <strong>1L standard press (this recipe):</strong> 30g coffee,
              500g water
            </li>
            <li>
              <strong>1.5L large press:</strong> 50g coffee, 800g water
            </li>
          </ul>

          <h2>About James Hoffmann</h2>
          <p>
            James Hoffmann is a British coffee professional, the 2007 World
            Barista Champion, and co-founder of Square Mile Coffee Roasters. His{" "}
            <a
              href="https://www.youtube.com/watch?v=st571DYYTR8"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;The Best French Press Technique&quot; video (2020)
            </a>{" "}
            published this method and remains one of his most-watched videos.
            For his V60 technique, see the dedicated{" "}
            <Link href="/kitchen/pour-over-timer/hoffmann-v60">Hoffmann V60
            timer</Link>.
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
