"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { FRENCH_PRESS, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { FRENCH_PRESS_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Hoffmann French Press",
    href: "/kitchen/pour-over-timer/hoffmann-french-press",
    description: "James Hoffmann&apos;s skim-and-rest variation — cleaner, longer",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Switch between V60, Chemex, AeroPress and more",
  },
  {
    name: "V60 Classic",
    href: "/kitchen/pour-over-timer/v60",
    description: "Paper-filtered drip — cleaner than French press",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "Same coffee/water amount, paper filter, much cleaner cup",
  },
  {
    name: "AeroPress Inverted",
    href: "/kitchen/pour-over-timer/aeropress-inverted",
    description: "Immersion brew with stronger body — closer to press",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "When you need a shot, not 500g of press coffee",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(FRENCH_PRESS), []);
  const seconds = total_time(FRENCH_PRESS);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="French Press Timer"
      description={`${FRENCH_PRESS.coffee_g}g / ${FRENCH_PRESS.water_g}g · ${FRENCH_PRESS.temp_c}°C · ${FRENCH_PRESS.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={FRENCH_PRESS} />}
      seo_content={
        <TimerSeoContent
          timer_name="French Press Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={FRENCH_PRESS_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            French Press Timer (Classic 4-Minute)
          </h1>
          <p>
            A free French press timer with the standard 4-minute recipe pre-configured:{" "}
            <strong>30g coffee, 500g water at 94°C, coarse grind</strong>. Pour, steep
            4 minutes, plunge gently, pour. Total time around 5 minutes from start to
            first sip. Audio cue when the steep finishes so you don&apos;t over-extract.
          </p>

          <h2>The classic French press method</h2>
          <ol>
            <li>
              <strong>Pre-warm the press</strong> with hot water from the kettle.
              Discard before brewing — pour everything out and dry the press body.
            </li>
            <li>
              <strong>Add 30g of coarse-ground coffee</strong> to the press.
            </li>
            <li>
              <strong>Pour (0:00-0:30):</strong> pour all 500g of water in one steady
              stream. Aim for the center of the press to keep grounds saturated
              evenly.
            </li>
            <li>
              <strong>Steep (0:30-4:30):</strong> place the lid on (plunger up — do
              not press yet). Wait 4 minutes undisturbed. The bloom is happening on
              the surface; the bed is extracting underneath.
            </li>
            <li>
              <strong>Plunge (4:30-4:50):</strong> press the plunger down{" "}
              <em>slowly and evenly</em>, just enough to push the grounds to the
              bottom. Don&apos;t force it.
            </li>
            <li>
              <strong>Pour-off (4:50-5:10):</strong> pour all the coffee into a
              separate vessel immediately. Coffee left sitting on the grounds
              continues to extract bitterness.
            </li>
          </ol>

          <h2>The recipe at a glance</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 30g coffee, coarse grind (C40 click 30-36,
              Encore 28-32)
            </li>
            <li>
              <strong>Water:</strong> 500g filtered water at 94°C
            </li>
            <li>
              <strong>Ratio:</strong> 1:16.7 — standard for medium roasts
            </li>
            <li>
              <strong>Equipment:</strong> 1-litre French press (Bodum Chambord is
              the standard), kettle, scale, burr grinder
            </li>
            <li>
              <strong>Total time:</strong> ~5:00
            </li>
          </ul>

          <h2>The two biggest French press mistakes</h2>
          <p>
            <strong>(1) Grind too fine.</strong> French press uses a metal mesh
            filter with much larger gaps than paper. Anything finer than coarse
            slips through and produces sludge at the bottom of the cup. If your
            grinder can&apos;t go coarse enough, use a press with a finer mesh
            (Espro P3 has dual mesh filters) or switch to a paper-filtered method.
          </p>
          <p>
            <strong>(2) Coffee sitting on the grounds.</strong> Over-extraction
            continues after plunging because the grounds are still in contact with
            water. Pour everything into a separate vessel immediately after
            plunging — even leaving it 5 minutes can push the cup into bitter
            territory.
          </p>

          <h2>Press variations</h2>
          <p>
            <strong>
              <Link href="/kitchen/pour-over-timer/hoffmann-french-press">
                Hoffmann French press
              </Link>
            </strong>{" "}
            — same dose and water, but the steep extends to 9 minutes with a
            skim-and-rest technique that produces a cleaner cup. Use when you want
            less sediment.
          </p>
          <p>
            <strong>Cold brew French press</strong> — 60g coarse coffee + 600g
            cold filtered water, steep 12-24 hours in the fridge, plunge. Produces
            cold-brew concentrate. Use a French press with a tight-fitting lid.
          </p>
          <p>
            <strong>Smaller batch</strong> — scale down proportionally. A 600ml
            press handles 25g coffee with 400g water; a 350ml personal press
            handles 15g with 240g.
          </p>

          <h2>French press vs. other brewers</h2>
          <p>
            Compared to{" "}
            <Link href="/kitchen/pour-over-timer/v60">V60</Link>: more body,
            less clarity, easier to brew well consistently. Compared to{" "}
            <Link href="/kitchen/pour-over-timer/chemex">Chemex</Link>: much
            more body, more sediment, dramatically less clean. Compared to{" "}
            <Link href="/kitchen/pour-over-timer/aeropress-inverted">inverted
            AeroPress</Link>: similar body but the press is metal-filtered
            (some sediment) while AeroPress is paper-filtered (no sediment).
            Pick French press when you want full-body, easy-to-make morning
            coffee and don&apos;t mind some sludge at the bottom of the cup.
          </p>

          <h2>About the French press</h2>
          <p>
            The French press (cafetière, plunger pot, press pot, Bodum Chambord)
            is an immersion brewer with a mesh plunger filter. The design dates
            to 1929 (Italy) but was popularized worldwide by Bodum in the 1980s.
            It&apos;s the most-owned coffee brewer in the world after drip
            machines — most kitchens have one even if they don&apos;t use it
            daily. Buy from{" "}
            <a
              href="https://www.bodum.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              bodum.com
            </a>{" "}
            (the Chambord is the standard 1-litre model) or look at Espro
            presses for finer mesh filters.
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
