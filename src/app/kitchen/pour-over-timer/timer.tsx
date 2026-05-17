"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import {
  POUR_OVER_RECIPES,
  DEFAULT_POUR_OVER_RECIPE,
  expand_recipe,
  total_time,
} from "@/lib/coffee-recipes";
import { POUR_OVER_HUB_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "James Hoffmann&apos;s Ultimate V60 — 15g/250g, 4 pours, ends at 3:30",
  },
  {
    name: "Tetsu Kasuya 4:6",
    href: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    description: "2016 World Brewers Cup winning recipe — 5 pours, 1:15 ratio",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "30g/500g, medium-coarse, 5-minute drawdown",
  },
  {
    name: "AeroPress Timer",
    href: "/kitchen/pour-over-timer/aeropress",
    description: "17g/250g, 1:30 steep, 30-second press",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "Sibling tool — pre-infusion + first-drip capture, 25-30s target band",
  },
  {
    name: "Egg Timer",
    href: "/kitchen/eggs",
    description: "While you wait for the drawdown — perfect soft, medium, hard boiled",
  },
];

function Content() {
  const params = useSearchParams();
  const requested = params.get("recipe") ?? "";
  const initial_key =
    requested && POUR_OVER_RECIPES[requested]
      ? requested
      : DEFAULT_POUR_OVER_RECIPE.slug;

  const [recipe_key, set_recipe_key] = useState(initial_key);
  const recipe = POUR_OVER_RECIPES[recipe_key] ?? DEFAULT_POUR_OVER_RECIPE;

  const steps = useMemo(() => expand_recipe(recipe), [recipe]);
  const minutes = useMemo(() => Math.round(total_time(recipe) / 60), [recipe]);

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (recipe_key === DEFAULT_POUR_OVER_RECIPE.slug) {
      url_params.delete("recipe");
    } else {
      url_params.set("recipe", recipe_key);
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [recipe_key]);

  return (
    <TimerPage
      key={recipe_key}
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Pour-Over Timer"
      description={`${recipe.name} · ${recipe.coffee_g}g / ${recipe.water_g}g · ~${minutes} min total`}
      show_skip
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="pour-over-recipe"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Recipe
            </label>
            <select
              id="pour-over-recipe"
              value={recipe_key}
              onChange={(e) => set_recipe_key(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
            >
              {Object.values(POUR_OVER_RECIPES).map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <PourSchedule recipe={recipe} />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Pour-Over Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={POUR_OVER_HUB_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Pour-Over Coffee Timer
          </h1>
          <p>
            A free, multi-stage pour-over coffee timer that walks you through nine named
            recipes — Hoffmann V60, Tetsu Kasuya 4:6, Chemex, AeroPress (standard and
            inverted), Kalita Wave, French Press, plus generic V60. Each recipe is
            pre-loaded with the published pour schedule (water target per stage, pour
            duration, drawdown). Audio cues at every transition so you can keep both
            hands on the kettle and scale.
          </p>

          <h2>The recipes</h2>
          <ul>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/hoffmann-v60">Hoffmann V60</Link>
              </strong>{" "}
              — James Hoffmann&apos;s &quot;Ultimate V60 Technique&quot; (2021). 15g
              coffee / 250g water at 93°C, four 50g pours after a 45-second bloom, finish
              at 3:30. The single most-cited modern pour-over recipe.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/tetsu-kasuya-4-6">Tetsu Kasuya 4:6</Link>
              </strong>{" "}
              — 2016 World Brewers Cup-winning recipe. 20g / 300g at 1:15, five pours.
              The first 40% (two pours) controls sweetness/acidity; the remaining 60%
              (three pours) controls strength. Coarser grind than typical V60.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/chemex">Chemex</Link>
              </strong>{" "}
              — 30g / 500g at 94°C, medium-coarse grind, three pours and a long
              drawdown. The thick Chemex filter produces the cleanest cup but takes
              5-5:30 total.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/aeropress">AeroPress (Standard)</Link>
              </strong>{" "}
              and{" "}
              <strong>
                <Link href="/kitchen/pour-over-timer/aeropress-inverted">AeroPress (Inverted)</Link>
              </strong>{" "}
              — 17g / 250g and 18g / 220g respectively. Inverted brews stronger by
              steeping without dripping.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/kalita-wave">Kalita Wave 185</Link>
              </strong>{" "}
              — 22g / 350g, three even pours into the flat-bottom dripper with the
              three-hole drain.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/hoffmann-french-press">Hoffmann French Press</Link>
              </strong>{" "}
              and{" "}
              <strong>
                <Link href="/kitchen/pour-over-timer/french-press">French Press (Classic)</Link>
              </strong>{" "}
              — 30g / 500g coarse. Hoffmann&apos;s method skims the crust and rests an
              extra 5 minutes for a cleaner cup; classic is the standard 4-minute brew.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/pour-over-timer/v60">V60 Classic</Link>
              </strong>{" "}
              — generic 15g / 240g four-pour. Use when you want a sane default without
              committing to a named recipe.
            </li>
          </ul>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Pick a recipe</strong> using the dropdown above. The pour schedule
              underneath shows each stage&apos;s pour amount and cumulative water target.
              Default is the Hoffmann V60.
            </li>
            <li>
              <strong>Tap the speaker icon</strong> to unlock audio cues. Each pour
              transition fires a chime so you can watch the kettle, not the screen.
            </li>
            <li>
              <strong>Press start as you start pouring the bloom.</strong> Keep the
              kettle moving in a slow center spiral; aim to hit the cumulative target
              by the time the timer transitions to the next stage.
            </li>
            <li>
              <strong>Skip stages with the Skip button</strong> if a pour finishes early
              and you want to move on. Useful if your grinder is producing faster
              drawdowns than the recipe expected.
            </li>
            <li>
              <strong>Share the URL.</strong> Each recipe has a dedicated page — copy
              the URL after picking a recipe and the recipient lands on the same timer
              pre-configured.
            </li>
          </ol>

          <h2>Common pour-over mistakes this timer prevents</h2>
          <p>
            The two pour-over mistakes that account for most of the &quot;why does my
            coffee taste bad&quot; questions in r/coffee are <strong>uneven
            extraction</strong> (channeling, dry patches, or pouring too fast) and{" "}
            <strong>over-extraction</strong> (drawdown takes too long, water keeps
            extracting bitter compounds). A timer fixes the second one mechanically:
            when you know the recipe finishes at 3:30 and yours is still dripping at
            4:30, you know to grind coarser next time. For the first, the bloom step
            (30-45 seconds) is the most important — every recipe in this hub starts with
            a properly-timed bloom for a reason.
          </p>

          <h2>About the espresso timer</h2>
          <p>
            Pour-over and espresso need different tools. Pour-over is a multi-stage
            sequence of pours with explicit durations between them — exactly what this
            timer handles. Espresso is a single count-up with a target band (typically
            25-30s) and a first-drip timestamp. Use the{" "}
            <Link href="/kitchen/espresso-timer">espresso timer</Link> for that, or one
            of its presets:{" "}
            <Link href="/kitchen/espresso-timer/pre-infusion">pre-infusion timer</Link>{" "}
            or the{" "}
            <Link href="/kitchen/espresso-timer/25-second-shot">25-second shot timer</Link>.
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export function PourOverTimer() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
