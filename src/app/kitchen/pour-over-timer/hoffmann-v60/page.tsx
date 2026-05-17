"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { HOFFMANN_V60, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { HOFFMANN_V60_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Switch between Hoffmann, Kasuya, Chemex, AeroPress and more recipes",
  },
  {
    name: "V60 Classic Timer",
    href: "/kitchen/pour-over-timer/v60",
    description: "Generic 15g/240g four-pour V60 — when you don&apos;t want a named recipe",
  },
  {
    name: "Tetsu Kasuya 4:6",
    href: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    description: "World Brewers Cup recipe — sweetness/strength split into 4:6 pours",
  },
  {
    name: "Hoffmann French Press",
    href: "/kitchen/pour-over-timer/hoffmann-french-press",
    description: "James Hoffmann&apos;s French press technique — coarse grind, no aggressive press",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "30g/500g, medium-coarse — cleanest cup, longest drawdown",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "Pre-infusion + first-drip capture for espresso shots",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(HOFFMANN_V60), []);
  const seconds = total_time(HOFFMANN_V60);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Hoffmann V60 Timer"
      description={`${HOFFMANN_V60.coffee_g}g / ${HOFFMANN_V60.water_g}g · ${HOFFMANN_V60.temp_c}°C · ${HOFFMANN_V60.grind} · finishes ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={HOFFMANN_V60} />}
      seo_content={
        <TimerSeoContent
          timer_name="Hoffmann V60 Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={HOFFMANN_V60_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Hoffmann V60 Timer
          </h1>
          <p>
            A free pour-over timer pre-configured with James Hoffmann&apos;s &quot;Ultimate V60
            Technique&quot; (2021):{" "}
            <strong>15g coffee, 250g water at 93°C, medium-fine grind</strong>. Bloom 45
            seconds at 50g, then four 50g pours with rests, finishing the drawdown
            around <strong>3:30 total</strong>. Audio cues fire at every pour transition
            so you can keep both hands on the kettle and scale.
          </p>

          <h2>The recipe at a glance</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 15g coffee, ground medium-fine (Comandante click
              around 23, Baratza Encore 8-10)
            </li>
            <li>
              <strong>Water:</strong> 250g filtered water at 93°C
            </li>
            <li>
              <strong>Ratio:</strong> 1:16.6 — slightly leaner than the standard 1:15
              for a lighter, more delineated cup
            </li>
            <li>
              <strong>Equipment:</strong> Hario V60 (size 02), tabbed paper filter,
              gooseneck kettle, gram scale, brewing vessel
            </li>
            <li>
              <strong>Total time:</strong> 3:30 — drawdown should complete by 3:30
            </li>
          </ul>

          <h2>The pour sequence</h2>
          <ol>
            <li>
              <strong>Bloom (0:00-0:45):</strong> Pour 50g of water in a quick spiral
              from center outward, ensuring every ground is wet. Pick up the dripper
              and{" "}
              <strong>swirl gently</strong> for 2-3 seconds to break up dry clumps. Set
              it down and wait until 0:45. The swirl is the most important part of this
              step.
            </li>
            <li>
              <strong>Pour 1 (0:45-1:00):</strong> Pour to 100g in a slow center spiral.
              Aim to finish the pour at 1:00. The bed should look uniform.
            </li>
            <li>
              <strong>Wait (1:00-1:30):</strong> Let the bed draw down. You should see
              the water level recede halfway.
            </li>
            <li>
              <strong>Pour 2 (1:30-1:45):</strong> Pour to 150g, same slow center
              spiral.
            </li>
            <li>
              <strong>Wait (1:45-2:15):</strong> Let it draw down again.
            </li>
            <li>
              <strong>Pour 3 (2:15-2:30):</strong> Pour to 200g.
            </li>
            <li>
              <strong>Pour 4 (2:30-2:40):</strong> Pour the final 50g to 250g.{" "}
              <strong>Swirl the dripper</strong> immediately to flatten the bed.
            </li>
            <li>
              <strong>Drawdown (2:40-3:30):</strong> Wait for the cup to drain. Aim to
              finish by 3:30. A flat bed at the end is the visual signature of a
              well-executed brew.
            </li>
          </ol>

          <h2>Why this recipe works</h2>
          <p>
            Three elements separate the Hoffmann V60 from a generic four-pour: the
            post-bloom swirl, the 50g pulses with rest periods, and the final
            bed-flattening swirl. The swirl after the bloom eliminates dry pockets and
            channeling — two of the biggest causes of uneven extraction. The 50g pulses
            with rest periods let the slurry agitate itself naturally as water drains;
            you don&apos;t need to stir mid-brew. The final swirl flattens the
            grounds for an even drawdown. The result is a cup with{" "}
            <strong>clarity and sweetness</strong> that lighter-roast V60 brewers find
            difficult to achieve with simpler recipes.
          </p>

          <h2>Who is James Hoffmann?</h2>
          <p>
            James Hoffmann is a British coffee professional and the 2007 World Barista
            Champion. He runs Square Mile Coffee Roasters in London and has produced
            one of the most-watched coffee YouTube channels (over 1.6M subscribers). His{" "}
            <a
              href="https://www.youtube.com/watch?v=AI4ynXzkSQo"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Ultimate V60 Technique&quot; video
            </a>{" "}
            (2021) crossed 8M views and became the de-facto reference recipe for
            light-roast home V60 brewing.
          </p>

          <h2>Troubleshooting</h2>
          <p>
            <strong>Drawdown over 4 minutes:</strong> grind too fine. Coarsen by one
            Comandante click or one notch on a flat-burr grinder. Also check that you
            rinsed the paper filter with hot water before brewing — unrinsed filters
            slow drainage.
          </p>
          <p>
            <strong>Drawdown under 2:30:</strong> grind too coarse. Tighten by one
            click. Also check that your pours aren&apos;t too aggressive — a fast pour
            disrupts the bed and accelerates drawdown.
          </p>
          <p>
            <strong>Sour cup:</strong> under-extracted. Try a finer grind first; if
            already in the right range, increase water temperature to 95°C and re-test.
          </p>
          <p>
            <strong>Bitter cup:</strong> over-extracted. Coarsen the grind and lower
            water temperature to 91°C.
          </p>

          <h2>Other Hoffmann recipes</h2>
          <p>
            For a milder press-style brew, see the{" "}
            <Link href="/kitchen/pour-over-timer/hoffmann-french-press">Hoffmann French Press</Link>{" "}
            recipe — same coffee/water ratio (30g/500g for 2 cups), coarse grind,
            skim-and-rest technique. For a comparison with another world-class V60
            recipe, see the{" "}
            <Link href="/kitchen/pour-over-timer/tetsu-kasuya-4-6">Tetsu Kasuya 4:6 method</Link>,
            which structures the pours differently to give the brewer explicit control
            over sweetness vs. strength.
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
