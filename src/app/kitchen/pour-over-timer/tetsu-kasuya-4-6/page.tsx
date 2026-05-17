"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { TETSU_KASUYA, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { TETSU_KASUYA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "James Hoffmann&apos;s Ultimate V60 — same dripper, different framework",
  },
  {
    name: "V60 Classic",
    href: "/kitchen/pour-over-timer/v60",
    description: "Generic four-pour V60 — a simpler starting point",
  },
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "All 9 pour-over recipes in one place",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "Try the 4:6 framework on Chemex — cleaner cup, longer drawdown",
  },
  {
    name: "Kalita Wave",
    href: "/kitchen/pour-over-timer/kalita-wave",
    description: "Flat-bottom dripper — more forgiving than V60",
  },
  {
    name: "AeroPress Timer",
    href: "/kitchen/pour-over-timer/aeropress",
    description: "Different brewer, different recipe — 17g/250g classic AeroPress",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(TETSU_KASUYA), []);
  const seconds = total_time(TETSU_KASUYA);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Tetsu Kasuya 4:6 Timer"
      description={`${TETSU_KASUYA.coffee_g}g / ${TETSU_KASUYA.water_g}g · ${TETSU_KASUYA.temp_c}°C · ${TETSU_KASUYA.grind} · finishes ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={TETSU_KASUYA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Tetsu Kasuya 4:6 Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={TETSU_KASUYA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Tetsu Kasuya 4:6 Method Timer
          </h1>
          <p>
            A free pour-over timer pre-configured with Tetsu Kasuya&apos;s 2016 World
            Brewers Cup-winning recipe:{" "}
            <strong>20g coffee, 300g water at 92°C, coarse grind</strong>. The 4:6
            method splits the brew into 40% sweetness/acidity control (two pours) and
            60% strength control (three pours). Drawdown finishes around 3:30 total.
          </p>

          <h2>What makes the 4:6 method different</h2>
          <p>
            Most pour-over recipes give you a sequence to follow. The 4:6 method gives
            you a <strong>framework</strong>: the first 40% of water controls
            sweetness and acidity, the last 60% controls strength. Within each half,
            the split between pours adjusts the variable in that half. This means the
            recipe is parametric — you can tune sweetness without touching strength,
            and vice versa.
          </p>

          <h2>The recipe at a glance</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 20g coffee, ground coarser than typical V60 (about
              C40 click 26-28, Baratza Encore 12-14)
            </li>
            <li>
              <strong>Water:</strong> 300g filtered water at 92°C
            </li>
            <li>
              <strong>Ratio:</strong> 1:15 — slightly stronger than standard V60
            </li>
            <li>
              <strong>Equipment:</strong> Hario V60 size 02, gooseneck kettle, scale,
              burr grinder
            </li>
            <li>
              <strong>Total time:</strong> ~3:30 — drawdown completes around 3:30
            </li>
          </ul>

          <h2>The five-pour sequence</h2>
          <ol>
            <li>
              <strong>Pour 1 (0:00-0:45) — Sweetness:</strong> 50g of water. This is
              the &quot;low-side&quot; pour. Less water in the first 40% means more
              sweetness extraction; more water means more acidity. 50g is balanced
              toward sweet.
            </li>
            <li>
              <strong>Pour 2 (0:45-1:30) — Acidity:</strong> 70g of water (cumulative
              to 120g). This larger second pour balances the recipe. Together pours 1
              and 2 are the 40% of total water that controls the sweetness/acidity
              axis.
            </li>
            <li>
              <strong>Pour 3 (1:30-2:00) — Strength:</strong> 60g to 180g. First of
              three strength pours.
            </li>
            <li>
              <strong>Pour 4 (2:00-2:30) — Strength:</strong> 60g to 240g. Second.
            </li>
            <li>
              <strong>Pour 5 (2:30-3:00) — Strength:</strong> 60g to 300g. Third and
              final.
            </li>
            <li>
              <strong>Drawdown (3:00-3:30):</strong> wait for the cup to drain.
            </li>
          </ol>

          <h2>How to tune the recipe</h2>
          <p>
            <strong>For sweeter coffee</strong> — split the first 40% as
            <strong> 50g + 70g</strong> (the default). Small first pour gives more
            sweetness.
          </p>
          <p>
            <strong>For more acidity / brightness</strong> — split as
            <strong> 70g + 50g</strong>. Larger first pour gives more acid expression,
            useful with washed Ethiopian or Kenyan coffees where you want the lemony
            top notes.
          </p>
          <p>
            <strong>For balanced</strong> — split as <strong>60g + 60g</strong>.
          </p>
          <p>
            <strong>For stronger coffee</strong> — replace the three strength pours
            (60g × 3) with <strong>two larger pours (90g × 2)</strong>. Fewer pours =
            less mid-brew agitation = stronger, more concentrated coffee.
          </p>
          <p>
            <strong>For lighter coffee</strong> — replace with{" "}
            <strong>four smaller pours (45g × 4)</strong>. More pours = more agitation
            = lighter, more delineated cup.
          </p>

          <h2>Why a coarser grind?</h2>
          <p>
            Standard V60 recipes use medium-fine grind to extract in 2:30-3:00. The
            4:6 method runs longer (3:30 total) because each pour has time to draw
            down before the next one starts. A coarser grind compensates — the longer
            extraction with a coarser grind produces a similar TDS to a shorter
            extraction with a finer grind, but with more even extraction across the
            bed because each pour is smaller and gentler. The bed channels less.
          </p>

          <h2>Origin and credit</h2>
          <p>
            Tetsu Kasuya developed the 4:6 method while training for the 2016 World
            Brewers Cup, which he won using this exact recipe. He runs Philocoffea
            outside Tokyo and publishes recipes at{" "}
            <a
              href="https://philocoffea.com/blogs/4-6-method"
              target="_blank"
              rel="noopener noreferrer"
            >
              philocoffea.com
            </a>
            . The method remains one of the most-cited modern V60 frameworks alongside
            James Hoffmann&apos;s{" "}
            <Link href="/kitchen/pour-over-timer/hoffmann-v60">Ultimate V60 Technique</Link>.
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
