"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { PourSchedule } from "@/components/coffee/pour-schedule";
import { KALITA_WAVE, expand_recipe, total_time } from "@/lib/coffee-recipes";
import { KALITA_WAVE_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Pour-Over Timer Hub",
    href: "/kitchen/pour-over-timer",
    description: "Browse all 9 pour-over recipes",
  },
  {
    name: "V60 Classic",
    href: "/kitchen/pour-over-timer/v60",
    description: "Cone dripper alternative — more clarity, less forgiving",
  },
  {
    name: "Chemex Timer",
    href: "/kitchen/pour-over-timer/chemex",
    description: "Larger brew, cleanest cup, longest drawdown",
  },
  {
    name: "Hoffmann V60",
    href: "/kitchen/pour-over-timer/hoffmann-v60",
    description: "Same dose ballpark on a different dripper",
  },
  {
    name: "Tetsu Kasuya 4:6",
    href: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    description: "Adaptive pour framework — works on Kalita too",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "Different brewer entirely — pre-infusion + first drip",
  },
];

function Content() {
  const steps = useMemo(() => expand_recipe(KALITA_WAVE), []);
  const seconds = total_time(KALITA_WAVE);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Kalita Wave Timer"
      description={`${KALITA_WAVE.coffee_g}g / ${KALITA_WAVE.water_g}g · ${KALITA_WAVE.temp_c}°C · ${KALITA_WAVE.grind} · ~${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`}
      show_skip
      below={<PourSchedule recipe={KALITA_WAVE} />}
      seo_content={
        <TimerSeoContent
          timer_name="Kalita Wave Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={KALITA_WAVE_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Kalita Wave Timer
          </h1>
          <p>
            A free pour-over timer for the Kalita Wave 185 with a balanced recipe
            pre-configured: <strong>22g coffee, 350g water at 93°C, medium grind</strong>.
            Bloom 45 seconds at 50g, then three even pours pulsing to 350g with rest
            periods between. Drawdown completes around 4:00 total. Audio cues at every
            pour transition.
          </p>

          <h2>Why the Kalita Wave?</h2>
          <p>
            The Kalita Wave is the most forgiving of the common pour-over drippers.
            Two design features explain why: the <strong>flat bottom</strong> keeps
            the coffee bed even regardless of pour technique, and the{" "}
            <strong>three small drainage holes</strong> in the base pace drawdown
            independently of grind size. The result is that pour-over mistakes —
            uneven pours, slightly wrong grind, imperfect ratio — produce
            recoverable cups rather than ruined ones. V60 amplifies your errors; the
            Wave damps them.
          </p>

          <h2>The recipe at a glance</h2>
          <ul>
            <li>
              <strong>Dose:</strong> 22g coffee, medium grind (C40 click 24-28,
              Encore 14-18)
            </li>
            <li>
              <strong>Water:</strong> 350g filtered water at 93°C
            </li>
            <li>
              <strong>Ratio:</strong> 1:16 — balanced default
            </li>
            <li>
              <strong>Equipment:</strong> Kalita Wave 185 (steel, ceramic, or glass)
              + Kalita Wave paper filter, gooseneck kettle, scale, burr grinder
            </li>
            <li>
              <strong>Total time:</strong> ~4:00
            </li>
          </ul>

          <h2>The three-pour sequence</h2>
          <ol>
            <li>
              <strong>Set up:</strong> seat a Wave filter in the dripper. Rinse with
              hot water from the kettle to flush paper taste and warm everything.
              Dump the rinse water.
            </li>
            <li>
              <strong>Add 22g of coffee</strong> to the wet filter. Tap to level.
            </li>
            <li>
              <strong>Bloom (0:00-0:45):</strong> pour 50g of water and swirl
              gently. The flat bed makes the swirl effective at de-clumping.
            </li>
            <li>
              <strong>Pour 1 (0:45-1:05):</strong> steady center spiral to 150g.
            </li>
            <li>
              <strong>Wait (1:05-1:25):</strong> let the water level drop a third.
            </li>
            <li>
              <strong>Pour 2 (1:25-1:45):</strong> pour to 250g.
            </li>
            <li>
              <strong>Wait (1:45-2:05):</strong> let it draw down.
            </li>
            <li>
              <strong>Pour 3 (2:05-2:25):</strong> final pour to 350g. The bed
              should flatten naturally — no swirl needed (the flat-bottom design
              does it for you).
            </li>
            <li>
              <strong>Drawdown (2:25-3:55):</strong> wait for the cup to drain.
              Drawdown is paced by the three small holes regardless of grind size.
            </li>
          </ol>

          <h2>Wave sizes</h2>
          <p>
            The Kalita Wave comes in three sizes: <strong>155</strong> (1 cup;
            15g/240g), <strong>185</strong> (2-3 cups; this page&apos;s 22g/350g
            recipe), and <strong>215</strong> (3-4 cups; 35g/560g). The 185 is the
            most common and the default for home brewing. The 155 is excellent for
            travel — it&apos;s the smallest pour-over dripper with the
            forgiveness factor.
          </p>

          <h2>Steel vs. ceramic vs. glass</h2>
          <p>
            The three Wave materials brew nearly identically. <strong>Stainless
            steel</strong> heats up fast but cools fast — pre-warm it. <strong>
            Ceramic</strong> holds heat longer and produces marginally more
            consistent extraction temperatures. <strong>Glass</strong> sits
            between the two. None of the three is wrong. The wavy paper filter
            does the heavy lifting; the body material is mostly aesthetic.
          </p>

          <h2>Wave vs. other drippers</h2>
          <p>
            Compared to{" "}
            <Link href="/kitchen/pour-over-timer/v60">V60</Link>: more
            forgiving, less clarity, similar body. Compared to{" "}
            <Link href="/kitchen/pour-over-timer/chemex">Chemex</Link>: faster
            drawdown, more body, slightly less clean. Compared to{" "}
            <Link href="/kitchen/pour-over-timer/aeropress">AeroPress</Link>:
            the Wave is paper-filtered drip; AeroPress is immersion-plus-pressure.
            Pick the Wave when you want a low-effort daily driver that&apos;s
            hard to ruin.
          </p>

          <h2>About Kalita</h2>
          <p>
            Kalita is a Japanese coffee-equipment company founded in 1958. The
            Wave dripper launched in the 2000s and quickly became a third-wave
            shop standard for its forgiving extraction. The wavy filter shape
            is engineered to minimize contact between paper and grounds (the
            crinkles act as &quot;flow channels&quot;), and the three-hole base
            is the company&apos;s signature feature. Buy from{" "}
            <a
              href="https://kalita.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              kalita.co.jp
            </a>{" "}
            or specialty coffee retailers — don&apos;t substitute generic
            flat-bottom filters; the wavy shape matters.
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
