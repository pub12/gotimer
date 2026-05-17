"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { V60_CLASSIC, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { V60_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "James Hoffmann&apos;s Ultimate V60 — same dripper, different recipe",
  },
  {
    name: "Tetsu Kasuya 4:6",
    href: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    description: "World Brewers Cup recipe — sweetness/strength controlled via pour structure",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Browse all 9 pour-over recipes",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "Larger brew, medium-coarse grind, cleanest cup",
  },
  {
    name: "Kalita Wave Timer",
    href: "/kitchen/pour-over-timer/kalita-wave",
    description: "Flat-bottom alternative to V60 — more forgiving",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "Pre-infusion + first-drip capture for espresso",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(V60_CLASSIC), []);
  const seconds = total_time(V60_CLASSIC);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="V60 Timer"
      description={`${V60_CLASSIC.coffee_g}g / ${V60_CLASSIC.water_g}g · ${V60_CLASSIC.temp_c}°C · ${V60_CLASSIC.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={V60_CLASSIC} />}
      seo_content={
        <TimerSeoContent
          timer_name="V60 Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={V60_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            V60 Pour-Over Timer
          </h1>
          <p>
            A free pour-over timer for the Hario V60 with the classic four-pour recipe
            pre-configured: <strong>15g coffee, 240g water at 92°C, medium-fine grind</strong>.
            Bloom 30 seconds, then four pours pulsing to 100g, 160g, 220g, and a small
            top-off at 240g. Drawdown completes around 3:00-3:30 total. Audio cues at
            every pour transition.
          </p>

          <h2>What you need for V60</h2>
          <ul>
            <li>
              <strong>Hario V60 dripper</strong> — size 02 plastic, ceramic, glass, or
              metal. Plastic is cheapest and brews identically to the others.
            </li>
            <li>
              <strong>Hario V60 paper filters</strong> — natural (brown) or bleached
              (white). Bleached is more neutral; natural has a slight paper taste unless
              rinsed thoroughly.
            </li>
            <li>
              <strong>Gooseneck kettle</strong> — gives the slow, steady pour V60
              needs. Fellow Stagg EKG (electric) or Hario V60 Buono (stovetop) are the
              starter standards.
            </li>
            <li>
              <strong>Gram scale</strong> — 0.1g precision, 2kg+ capacity. The Acaia
              Pearl is the barista standard; sub-$30 kitchen scales work too.
            </li>
            <li>
              <strong>Burr grinder</strong> — Baratza Encore (entry), Fellow Ode (mid),
              Comandante C40 (hand). Blade grinders ruin pour-over.
            </li>
          </ul>

          <h2>The four-pour method</h2>
          <ol>
            <li>
              <strong>Rinse the filter</strong> with hot water from the kettle. This
              flushes paper taste and pre-heats the dripper and carafe. Dump the rinse
              water.
            </li>
            <li>
              <strong>Add 15g of ground coffee</strong> to the rinsed filter. Tap to
              level the bed.
            </li>
            <li>
              <strong>Bloom (0:00-0:30):</strong> pour 40g of water in a center spiral
              to wet all grounds. Swirl the dripper once. Wait.
            </li>
            <li>
              <strong>Pour 1 (0:30-0:50):</strong> pour to 100g in a slow center spiral.
            </li>
            <li>
              <strong>Pour 2 (0:50-1:10):</strong> pour to 160g.
            </li>
            <li>
              <strong>Pour 3 (1:10-1:30):</strong> pour to 220g.
            </li>
            <li>
              <strong>Pour 4 (1:30-1:45):</strong> pour the final 20g to 240g. Swirl
              to flatten the bed.
            </li>
            <li>
              <strong>Drawdown (1:45-3:00):</strong> wait for the cup to drain.
              Drawdown should finish by 3:00. If it&apos;s much longer or shorter,
              adjust the grind one click.
            </li>
          </ol>

          <h2>How to dial in your V60</h2>
          <p>
            Start with this recipe and one variable at a time. <strong>Grind
            size</strong> is the highest-leverage adjustment — finer = stronger, fuller
            body, longer drawdown; coarser = lighter, more delineated, faster drawdown.
            Aim for drawdown around 3:00; if you&apos;re consistently over 3:30, coarsen
            one click. <strong>Ratio</strong> is the next lever — 1:15 for more
            concentration, 1:17 for more clarity. <strong>Temperature</strong> is the
            third — 91°C for dark roasts, 94°C for very light roasts.
          </p>

          <h2>Named V60 recipes worth trying</h2>
          <p>
            Once the generic recipe feels comfortable, try a named recipe with a
            specific technique:
          </p>
          <ul>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/hoffmann-v60">Hoffmann V60</Link>
              </strong>{" "}
              — adds a post-bloom swirl and uses larger 50g pulses with rests. Best for
              light single-origin coffees where clarity matters.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/tetsu-kasuya-4-6">Tetsu Kasuya 4:6</Link>
              </strong>{" "}
              — a five-pour method that splits the brew into &quot;sweetness/acidity
              control&quot; (first 40%) and &quot;strength control&quot; (last 60%).
              Coarser grind, longer brew, more control.
            </li>
          </ul>

          <h2>V60 vs. other drippers</h2>
          <p>
            The V60&apos;s spiral ribs and large single hole make it the
            highest-clarity standard dripper — but also the least forgiving. If you
            want a more forgiving brew, try the{" "}
            <Link href="/kitchen/pour-over-timer/kalita-wave">Kalita Wave</Link>{" "}
            (flat-bottom, three small holes — slower drainage, harder to mess up) or
            the <Link href="/kitchen/pour-over-timer/chemex">Chemex</Link> (thick
            filter, longest drawdown, cleanest cup). For immersion brewing, see the{" "}
            <Link href="/kitchen/pour-over-timer/french-press">French Press</Link> and{" "}
            <Link href="/kitchen/pour-over-timer/aeropress">AeroPress</Link> recipes.
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
