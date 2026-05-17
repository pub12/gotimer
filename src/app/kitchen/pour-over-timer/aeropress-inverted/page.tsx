"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { AEROPRESS_INVERTED, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { AEROPRESS_INVERTED_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "AeroPress (Standard)",
    href: "/kitchen/pour-over-timer/aeropress",
    description: "Upright AeroPress — cleaner, less-bitter cup",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Switch between V60, Chemex, French Press and more",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "Different brewer, world-class recipe",
  },
  {
    name: "Tetsu Kasuya 4:6",
    href: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    description: "Adaptive recipe framework for V60",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "When you need a real shot — pre-infusion + first drip",
  },
  {
    name: "Cooking Timer",
    href: "/kitchen/cooking",
    description: "While you wait for the steep",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(AEROPRESS_INVERTED), []);
  const seconds = total_time(AEROPRESS_INVERTED);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Inverted AeroPress Timer"
      description={`${AEROPRESS_INVERTED.coffee_g}g / ${AEROPRESS_INVERTED.water_g}g · ${AEROPRESS_INVERTED.temp_c}°C · ${AEROPRESS_INVERTED.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={AEROPRESS_INVERTED} />}
      seo_content={
        <TimerSeoContent
          timer_name="Inverted AeroPress Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={AEROPRESS_INVERTED_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Inverted AeroPress Timer
          </h1>
          <p>
            A free inverted AeroPress timer with the World AeroPress
            Championship-style upside-down recipe pre-configured:{" "}
            <strong>18g coffee, 220g water at 82°C, medium-fine grind</strong>.
            Bloom 30s, fill to 220g, steep 1:15, then flip onto a mug and press for
            25-30 seconds. Stronger, fuller body than the standard upright method.
          </p>

          <h2>How to brew inverted AeroPress</h2>
          <ol>
            <li>
              <strong>Set up:</strong> insert the plunger into the brewing chamber
              about 2cm — just enough to seal. Stand the assembled brewer with the
              plunger on the counter, brewing chamber pointing up. The chamber
              opening (where the cap goes) is now at the top.
            </li>
            <li>
              <strong>Add 18g of ground coffee</strong> to the chamber.
            </li>
            <li>
              <strong>Bloom (0:00-0:30):</strong> pour 50g of water and stir 3 times
              with the paddle. The plunger seal at the bottom prevents drip.
            </li>
            <li>
              <strong>Fill (0:30-0:50):</strong> pour the remaining 170g, filling
              to 220g total.
            </li>
            <li>
              <strong>Steep (0:50-2:05):</strong> rinse a paper filter and snap the
              filter cap onto the chamber. Wait 1:15 for full immersion steep.
            </li>
            <li>
              <strong>Flip and press (2:05-2:35):</strong> place a sturdy mug over
              the filter cap, hold the assembly firmly with both hands, and flip in
              one smooth motion. Press straight down with even pressure for 25-30
              seconds. Stop pressing when you hear a hiss.
            </li>
          </ol>

          <h2>The recipe at a glance</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 18g coffee, medium-fine grind
            </li>
            <li>
              <strong>Water:</strong> 220g at 82°C — lower than typical because
              AeroPress was designed for low-temp extraction
            </li>
            <li>
              <strong>Ratio:</strong> 1:12 — stronger than standard AeroPress for
              more body
            </li>
            <li>
              <strong>Equipment:</strong> AeroPress, paper or metal filter, sturdy
              mug, gooseneck kettle (optional), scale, burr grinder
            </li>
            <li>
              <strong>Total time:</strong> ~2:35
            </li>
          </ul>

          <h2>Inverted vs. standard — which should you use?</h2>
          <p>
            Use <strong>inverted</strong> when you want{" "}
            <em>stronger, fuller-body coffee</em> — typically with darker roasts,
            espresso-style concentrate, or as the base for a milk drink. The full
            immersion steep extracts more solids per gram of coffee.
          </p>
          <p>
            Use <strong>
              <Link href="/kitchen/pour-over-timer/aeropress">standard upright</Link>
            </strong>{" "}
            when you want a <em>cleaner, less-bitter</em> cup — typically with
            lighter single-origin coffees where you want clarity over body, or
            when you&apos;re training someone new to the AeroPress and want to
            avoid the flip risk.
          </p>

          <h2>The flip technique</h2>
          <p>
            The flip is the only tricky part of inverted AeroPress. Three rules:
          </p>
          <ul>
            <li>
              <strong>Hold firmly.</strong> One hand on the plunger handle, the
              other on the side of the chamber. The filter cap should be locked on
              tight (twist a quarter turn past finger-tight).
            </li>
            <li>
              <strong>Flip over a sink the first few times.</strong> Once
              you&apos;ve done it 10 times the motion becomes automatic.
            </li>
            <li>
              <strong>Flip quickly, not slowly.</strong> A slow flip lets
              brewed coffee leak around the plunger seal. A quick flip keeps
              everything against the cap until it&apos;s seated on the mug.
            </li>
          </ul>

          <h2>Variations</h2>
          <p>
            <strong>Tim Wendelboe inverted</strong> — 15g/200g, 1:30 steep, slow
            press. Influential Norwegian roaster recipe; cleaner than the default
            1:12 here.
          </p>
          <p>
            <strong>James Hoffmann inverted</strong> — 11g/200g, 1:30 steep, no
            stir. Hoffmann&apos;s less-is-more take.
          </p>
          <p>
            <strong>Espresso-style concentrate</strong> — 20g/60g, fine grind, 30s
            steep, fast press. Dilute to taste; works as an espresso substitute
            in milk drinks (cortados, lattes), though without crema.
          </p>

          <h2>About the AeroPress</h2>
          <p>
            The AeroPress was invented in 2005 by Alan Adler, an engineer at
            Stanford. The inverted method emerged from the early World AeroPress
            Championship era (2008-2012) and remains a community staple even
            though AeroPress Inc. itself doesn&apos;t officially endorse it (citing
            spill risk). Buy from{" "}
            <a
              href="https://aeropress.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              aeropress.com
            </a>{" "}
            — original plastic, Clear (tritan), or Go all brew identically.
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
