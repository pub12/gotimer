"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const BREAD_FAQ = [
  {
    question: "How long should bread dough proof?",
    answer:
      "It depends on the recipe and temperature. <strong>First rise (bulk fermentation)</strong> typically takes 60-90 minutes at room temperature (72-78°F). <strong>Second rise (final proof)</strong> takes 30-60 minutes. Cold fermentation in the refrigerator takes 8-18 hours. The default 60-minute timer covers a standard first rise.",
  },
  {
    question: "How does temperature affect proofing time?",
    answer:
      "Yeast activity roughly <strong>doubles for every 15°F increase</strong> in temperature. At 72°F, a standard first rise takes about 90 minutes. At 80°F, it might take 60 minutes. Below 60°F, fermentation slows dramatically — this is the principle behind cold proofing. Above 95°F, yeast begins to die. Aim for 75-80°F for consistent timing.",
  },
  {
    question: "What is the difference between sourdough and commercial yeast timing?",
    answer:
      "Commercial active dry yeast produces predictable rise times: 60-90 minutes for bulk fermentation. <strong>Sourdough starters are slower and less predictable</strong> — bulk fermentation typically takes 4-8 hours at room temperature, and timing depends on starter strength, flour type, hydration, and ambient temperature. Set longer timers (4-6 hours) and check dough volume rather than relying on time alone.",
  },
  {
    question: "How do I know if my dough has over-proofed?",
    answer:
      "Over-proofed dough shows these signs: <strong>it collapses when touched</strong>, the surface is bubbly and loose, and the poke test shows the dent does not spring back at all. Over-proofed bread will be dense, flat, and have a sour or alcoholic smell. If you suspect over-proofing, gently deflate the dough and reshape it for a shorter second rise.",
  },
  {
    question: "Can I proof bread dough overnight in the fridge?",
    answer:
      "Yes, cold proofing (retarding) is a common technique that <strong>develops deeper flavor through slow fermentation</strong>. Place shaped dough in the refrigerator for 8-18 hours. The cold slows yeast activity without stopping it. Remove from the fridge 30-60 minutes before baking to allow the dough to warm slightly. Use a <a href='/countdown'>countdown timer</a> for the 18-hour maximum.",
  },
];

const RELATED_TIMERS = [
  { name: "Pour-Over Coffee Timer", href: "/kitchen/pour-over-timer", description: "Multi-stage timer for V60, Chemex, AeroPress and more recipes" },
  { name: "Espresso Timer", href: "/kitchen/espresso-timer", description: "Espresso shot timer with first-drip capture and 25-30s target band" },
  { name: "Cooking Timer", href: "/kitchen/cooking", description: "General kitchen timer with presets for baking and cooking" },
  { name: "Egg Timer", href: "/kitchen/eggs", description: "Presets for soft, medium, and hard boiled eggs" },
  { name: "Multi-Timer", href: "/kitchen/multi-timer", description: "Track multiple baking steps simultaneously" },
  { name: "Fasting Timer", href: "/wellness/fasting", description: "Long-duration countdown for extended fermentation tracking" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 3600;
  const [duration, set_duration] = useState(initial);

  useEffect(() => {
    const url = `${window.location.pathname}?duration=${duration}`;
    window.history.replaceState(null, "", url);
  }, [duration]);

  return (
    <TimerPage
      key={duration}
      strategy={countdownStrategy}
      config={{ duration }}
      label="Bread Proofing Timer"
      description="Dough rise timer. First rise typically 60-90 minutes, second rise 30-60 minutes. Adjust based on room temperature and recipe."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Bread Proofing Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={BREAD_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why Proofing Time Matters for Bread</h2>
          <p>
            Proofing — the final rise before baking — is the stage where dough develops its structure,
            flavor, and texture. During proofing, yeast consumes sugars in the flour and produces carbon
            dioxide gas, which inflates the gluten network you built during kneading. Too little proofing
            and your bread will be dense and tight. Too much proofing and the gluten structure collapses,
            producing a flat, coarse loaf with large irregular holes.
          </p>
          <p>
            This free bread proofing timer gives you a reliable countdown for any dough rise. The default
            60-minute setting covers a standard first rise for commercial yeast bread at room temperature.
            Adjust for longer sourdough fermentations, shorter second rises, or overnight cold proofs.
          </p>

          <h2>Temperature and Yeast Activity</h2>
          <p>
            Temperature is the single biggest factor in proofing time. Yeast is a living organism — its
            metabolic rate is directly tied to ambient temperature. Here is how temperature changes
            affect typical proofing times:
          </p>
          <ul>
            <li><strong>60-65°F (cool kitchen)</strong> — Slow fermentation. First rise may take 2-3 hours. Produces more complex flavor compounds. Good for artisan bread with character.</li>
            <li><strong>72-78°F (room temperature)</strong> — Standard fermentation. First rise takes 60-90 minutes. The sweet spot for most recipes and the basis for this timer&apos;s default.</li>
            <li><strong>80-85°F (warm proof)</strong> — Fast fermentation. First rise can finish in 40-60 minutes. Use your oven with just the light on, or place dough near a warm appliance.</li>
            <li><strong>38-42°F (refrigerator)</strong> — Cold retard. Rise takes 8-18 hours. Develops deep flavor through slow enzymatic activity. Set a <a href="/countdown">countdown timer</a> for your target pull time.</li>
          </ul>

          <h2>Sourdough vs. Commercial Yeast Timing</h2>
          <p>
            Commercial active dry yeast and instant yeast are concentrated, predictable, and fast. A
            typical packet produces reliable results in 60-90 minutes. Sourdough starter, by contrast,
            is a wild culture of multiple yeast strains and lactic acid bacteria. Its rising power depends
            on how recently it was fed, the flour it was fed with, and your kitchen temperature. Plan for
            4-8 hours of bulk fermentation at room temperature for sourdough. Use the &quot;poke test&quot;
            alongside the timer: press a floured finger into the dough. If the indent springs back slowly
            and partially, the dough is ready. If it springs back immediately, it needs more time.
          </p>

          <h2>Signs of Over-Proofing and Under-Proofing</h2>
          <ul>
            <li><strong>Under-proofed</strong> — Dough is tight and springy. Poke test: indent springs back quickly. Bread will be dense with a tight crumb and may burst at seams during baking.</li>
            <li><strong>Properly proofed</strong> — Dough is pillowy and airy. Poke test: indent springs back slowly and partially. Bread will have an open, even crumb with good oven spring.</li>
            <li><strong>Over-proofed</strong> — Dough is slack and fragile. Poke test: indent stays put and does not spring back. Bread will be flat with a collapsed structure. If caught early, gently reshape and proof again for a shorter time.</li>
          </ul>

          <h2>How to Use This Timer</h2>
          <ol>
            <li><strong>Set your proofing duration</strong> — 60 minutes for a standard first rise. 30-45 minutes for a second rise. 4-8 hours for sourdough. 8-18 hours for cold proof.</li>
            <li><strong>Start the timer when dough is shaped and placed</strong> — For bulk fermentation, start after kneading. For final proof, start after shaping.</li>
            <li><strong>Check the dough when the timer alerts</strong> — Use the poke test to confirm readiness. If the dough needs more time, set a shorter follow-up timer (15-20 minutes).</li>
            <li><strong>Preheat your oven during the last 30 minutes</strong> — Use a <a href="/kitchen/cooking">cooking timer</a> to track the preheat period alongside the final proof.</li>
          </ol>

          <h2>Proofing Tips for Better Bread</h2>
          <ul>
            <li><strong>Cover your dough</strong> — Use plastic wrap, a damp towel, or a proofing bag to prevent the surface from drying out and forming a skin.</li>
            <li><strong>Create a warm proofing environment</strong> — Turn your oven light on (no heat) and place the dough inside. Most oven lights raise the temperature to 78-82°F — ideal for proofing.</li>
            <li><strong>Track multiple bakes</strong> — If you are proofing multiple batches with staggered timing, our <a href="/kitchen/multi-timer">Multi-Timer</a> lets you name and track each batch independently.</li>
            <li><strong>Log your times</strong> — Note the ambient temperature, flour type, and proofing duration for each bake. Over time, this builds your intuition for when dough is ready.</li>
          </ul>
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
