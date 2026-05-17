"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { AEROPRESS, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { AEROPRESS_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "AeroPress Inverted",
    href: "/kitchen/pour-over-timer/aeropress-inverted",
    description: "Flipped-brewer method — stronger, more body",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "All 9 recipes — V60, Chemex, French Press, more",
  },
  {
    name: "V60 Classic",
    href: "/kitchen/pour-over-timer/v60",
    description: "Standard one-cup V60 — same dose, paper drip method",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "James Hoffmann&apos;s flagship V60 recipe",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "AeroPress is not espresso — see the actual espresso shot timer",
  },
  {
    name: "Egg Timer",
    href: "/kitchen/eggs",
    description: "Pair your AeroPress with perfect soft-boiled eggs",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(AEROPRESS), []);
  const seconds = total_time(AEROPRESS);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="AeroPress Timer"
      description={`${AEROPRESS.coffee_g}g / ${AEROPRESS.water_g}g · ${AEROPRESS.temp_c}°C · ${AEROPRESS.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={AEROPRESS} />}
      seo_content={
        <TimerSeoContent
          timer_name="AeroPress Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={AEROPRESS_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            AeroPress Timer (Standard)
          </h1>
          <p>
            A free AeroPress timer with the classic upright recipe pre-configured:{" "}
            <strong>17g coffee, 250g water at 85°C, medium-fine grind</strong>.
            Bloom 30 seconds with 50g, top up to 250g, steep 1:00, press 30 seconds.
            Total brew time around 2:15. Audio cues at every phase transition so you
            can focus on the press technique, not the clock.
          </p>

          <h2>The standard AeroPress method</h2>
          <ol>
            <li>
              <strong>Set up:</strong> place the AeroPress upright on top of a sturdy
              mug. Rinse a paper filter in the cap with hot water and attach to the
              brewer. (Optional: pre-warm the mug too.)
            </li>
            <li>
              <strong>Add 17g of ground coffee</strong> to the brewer.
            </li>
            <li>
              <strong>Bloom (0:00-0:30):</strong> pour 50g of water in a quick
              spiral and stir 5 times with the paddle to wet all grounds.
            </li>
            <li>
              <strong>Fill (0:30-0:45):</strong> pour the remaining 200g of water,
              filling to 250g total. Stir twice.
            </li>
            <li>
              <strong>Steep (0:45-1:45):</strong> insert the plunger about 1cm to
              create a seal (prevents drip), wait 1 minute.
            </li>
            <li>
              <strong>Press (1:45-2:15):</strong> press down with even pressure for
              about 30 seconds. Stop when you hear a hiss — that&apos;s air
              pushing through and you&apos;ve extracted enough.
            </li>
          </ol>

          <h2>The recipe in detail</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 17g coffee, medium-fine grind. The standard
              World AeroPress Championship-era starting point.
            </li>
            <li>
              <strong>Water:</strong> 250g filtered water at 80-85°C. Lower than
              typical pour-over because the AeroPress was designed by Alan Adler
              specifically for less-bitter extraction at lower temperatures.
            </li>
            <li>
              <strong>Ratio:</strong> 1:14.7 — slightly stronger than V60 because
              the shorter contact time produces a less-extracted cup at the same
              ratio.
            </li>
            <li>
              <strong>Equipment:</strong> AeroPress (original or Clear), paper or
              metal filter, sturdy mug, kettle, scale, burr grinder.
            </li>
            <li>
              <strong>Total time:</strong> ~2:15
            </li>
          </ul>

          <h2>Why use the AeroPress?</h2>
          <p>
            Three reasons. First, <strong>it&apos;s forgiving</strong> — the short
            contact time prevents the over-extraction that finer grinds cause in
            V60 or Chemex. Even a slightly wrong grind setting produces drinkable
            coffee. Second, <strong>it&apos;s portable</strong> — the plastic
            brewer is nearly indestructible and fits in a backpack pocket. Third,{" "}
            <strong>it&apos;s fast</strong> — start to finish in under three
            minutes including grind. Most coffee professionals own one for travel
            and emergencies even if their daily driver is something else.
          </p>

          <h2>Standard vs. inverted</h2>
          <p>
            This page uses the <strong>standard (upright)</strong> orientation —
            brewer sits on the mug, plunger up, water can drip through during
            brewing. For the <strong>inverted</strong> method — brewer flipped
            upside down with plunger partially inserted, no drip during steep, then
            flipped onto a mug to press — see the dedicated{" "}
            <Link href="/kitchen/pour-over-timer/aeropress-inverted">inverted
            AeroPress timer</Link>. Inverted produces stronger, fuller-body coffee
            because the entire contact time is full immersion. Standard produces a
            cleaner, less-bitter cup. Both are legitimate; competition winners
            have used each.
          </p>

          <h2>Diluting (the AeroPress &quot;Americano&quot; trick)</h2>
          <p>
            Many AeroPress recipes brew concentrated (e.g., 17g/150g) and then
            dilute with hot water to taste. This gives you control over strength
            without re-brewing. Brew the concentrate as above with less water,
            then top up the mug with hot water until the cup tastes right. It
            also lets you brew two cups from one AeroPress — split the
            concentrate between two mugs and dilute each separately.
          </p>

          <h2>About the AeroPress</h2>
          <p>
            The AeroPress was invented in 2005 by Alan Adler, an engineer at
            Stanford. It&apos;s now in every coffee shop kitchen as a backup brewer
            and has its own competitive circuit (the World AeroPress
            Championship). Buy from{" "}
            <a
              href="https://aeropress.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              aeropress.com
            </a>{" "}
            — the original plastic, the Clear (BPA-free tritan), and the Go
            (smaller, travel-oriented) all brew identically.
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
