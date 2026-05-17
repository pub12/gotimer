"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { CHEMEX, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { CHEMEX_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Switch between Hoffmann, Kasuya, AeroPress, French Press and more",
  },
  {
    name: "V60 Classic",
    href: "/kitchen/pour-over-timer/v60",
    description: "Smaller dripper, faster drawdown, more body",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "James Hoffmann&apos;s flagship V60 recipe",
  },
  {
    name: "Kalita Wave",
    href: "/kitchen/pour-over-timer/kalita-wave",
    description: "Flat-bottom dripper — between V60 and Chemex in body",
  },
  {
    name: "Hoffmann French Press",
    href: "/kitchen/pour-over-timer/hoffmann-french-press",
    description: "Same coffee/water ratio, immersion technique",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "When you need a shot, not a pour-over",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(CHEMEX), []);
  const seconds = total_time(CHEMEX);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Chemex Timer"
      description={`${CHEMEX.coffee_g}g / ${CHEMEX.water_g}g · ${CHEMEX.temp_c}°C · ${CHEMEX.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={CHEMEX} />}
      seo_content={
        <TimerSeoContent
          timer_name="Chemex Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={CHEMEX_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Chemex Pour-Over Timer
          </h1>
          <p>
            A free pour-over timer for the Chemex with the standard 3-cup recipe
            pre-configured: <strong>30g coffee, 500g water at 94°C, medium-coarse
            grind</strong>. Bloom 45 seconds at 60g, then three even pours pulsing
            up to 500g, with a long 2-minute drawdown for the thick bonded filter.
            Total brew time around 5:00-5:30.
          </p>

          <h2>Why Chemex coffee is different</h2>
          <p>
            The Chemex isn&apos;t just &quot;a bigger V60&quot;. The bonded paper
            filter is <strong>20-30% thicker</strong> than a Hario V60 filter — it
            traps more oils, more micro-fines, and more dissolved bitter compounds.
            The result is a more delineated, &quot;tea-like&quot; cup with no
            sediment and very little body. If you brew the same coffee on V60 and
            Chemex side-by-side, the V60 will taste fuller and more aromatic while
            the Chemex will taste cleaner and more crystalline.
          </p>

          <h2>The recipe</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 30g coffee, medium-coarse grind (C40 click
              28-32, Encore 18-22)
            </li>
            <li>
              <strong>Water:</strong> 500g filtered water at 94°C
            </li>
            <li>
              <strong>Ratio:</strong> 1:16.7 — standard for medium-light roasts
            </li>
            <li>
              <strong>Equipment:</strong> Chemex 3-cup or 6-cup, Chemex bonded
              filter (FP-2 or FS-100), gooseneck kettle, scale
            </li>
            <li>
              <strong>Total time:</strong> 5:00-5:30 (slower than V60 due to thick
              filter)
            </li>
          </ul>

          <h2>The three-pour sequence</h2>
          <ol>
            <li>
              <strong>Rinse the filter</strong> with 200-300g of hot water with the
              thick three-fold side against the spout. Dump the rinse through the
              spout to pre-warm the carafe. The rinse is non-optional with
              Chemex — unrinsed filters add noticeable paper taste.
            </li>
            <li>
              <strong>Add 30g of coffee</strong> to the rinsed filter. Shake to
              level the bed.
            </li>
            <li>
              <strong>Bloom (0:00-0:45):</strong> pour 60g of water in a slow
              center spiral to wet all grounds. Swirl the brewer gently and wait.
            </li>
            <li>
              <strong>Pour 1 (0:45-1:15):</strong> slowly pour to 200g. Keep the
              pour in the center; avoid pouring water directly on the filter
              walls.
            </li>
            <li>
              <strong>Wait (1:15-1:45):</strong> let the level drop.
            </li>
            <li>
              <strong>Pour 2 (1:45-2:15):</strong> pour to 350g.
            </li>
            <li>
              <strong>Wait (2:15-2:45):</strong> let it draw down.
            </li>
            <li>
              <strong>Pour 3 (2:45-3:15):</strong> final pour to 500g. Swirl the
              brewer once to flatten the bed.
            </li>
            <li>
              <strong>Drawdown (3:15-5:15):</strong> wait for the cup to drain.
              Drawdown is long — 2 full minutes on a 3-cup brew.
            </li>
          </ol>

          <h2>What grind for Chemex?</h2>
          <p>
            Medium-coarse is non-negotiable. The thick filter already slows
            extraction; if you grind too fine, the bed clogs and total brew time
            stretches to 7-8 minutes, producing bitter coffee. If you grind too
            coarse, water rushes through and you get a sour, under-extracted
            cup. Aim for drawdown to finish around 5:15-5:30 from the start of
            the bloom. If yours is consistently 4:30 or under, tighten one click;
            if over 6:00, coarsen one click.
          </p>

          <h2>Bigger Chemex brews</h2>
          <p>
            For a 6-cup Chemex: 60g coffee, 1000g water, same ratio. Pour structure
            scales — bloom at 120g, then three pours to 400g, 700g, 1000g. Total
            brew time pushes to 6:30-7:00. For an 8-cup: 80g/1300g, total brew
            time around 8 minutes.
          </p>

          <h2>Chemex vs. other drippers</h2>
          <p>
            Compared to{" "}
            <Link href="/kitchen/pour-over-timer/v60">V60</Link>: cleaner, brighter,
            less body, slower drawdown. Compared to{" "}
            <Link href="/kitchen/pour-over-timer/kalita-wave">Kalita Wave</Link>:
            both have flat-ish beds, but Kalita drains faster and produces more
            body. Compared to{" "}
            <Link href="/kitchen/pour-over-timer/french-press">French Press</Link>:
            Chemex is paper-filtered (no sediment, no oils); French press is
            metal-filtered (full body, some sludge). Pick Chemex when you want
            <em> the cleanest possible cup</em> from a light or medium roast.
          </p>

          <h2>About Chemex</h2>
          <p>
            The Chemex was invented in 1941 by Peter Schlumbohm and remains
            substantially unchanged 80+ years later. The borosilicate glass design
            is in the permanent collection of the Museum of Modern Art. Buy from{" "}
            <a
              href="https://chemexcoffeemaker.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              chemexcoffeemaker.com
            </a>
            ; the bonded paper filters (FP-2 squares for the Classic series, FS-100
            for the Handblown) are the most important consumable — don&apos;t
            substitute generic cone filters.
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
