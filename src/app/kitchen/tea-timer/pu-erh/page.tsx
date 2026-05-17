"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { PU_ERH_TEA } from "@/lib/tea-presets";
import { PU_ERH_TEA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Gongfu Cha Timer",
    href: "/kitchen/tea-timer/gongfu",
    description: "8-infusion auto-progress — the traditional pu-erh method",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "Sibling fermented tea — also gongfu-friendly",
  },
  {
    name: "White Tea Timer",
    href: "/kitchen/tea-timer/white",
    description: "Aged white tea brews similarly to aged pu-erh",
  },
  {
    name: "Black Tea Timer",
    href: "/kitchen/tea-timer/black",
    description: "Fully oxidised — different processing, similar brewing",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Up to 6 concurrent steeps for side-by-side tastings",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={countdownStrategy}
      config={{ duration: PU_ERH_TEA.steep_seconds }}
      label="Pu-Erh Tea Timer"
      description={`${PU_ERH_TEA.temp_c}°C · ${PU_ERH_TEA.ratio} · default 3:00 Western steep`}
      below={<TeaInfo tea={PU_ERH_TEA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Pu-Erh Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={PU_ERH_TEA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Pu-Erh Tea Timer
          </h1>
          <p>
            A free pu-erh tea timer for fermented Chinese tea from Yunnan
            province. Pre-loaded with a{" "}
            <strong>3-minute default Western steep at 95-100°C</strong>. For
            the traditional and more rewarding{" "}
            <strong>gongfu brewing method</strong> with 8-15 short infusions,
            use the{" "}
            <Link href="/kitchen/tea-timer/gongfu">gongfu cha timer</Link>.
          </p>

          <h2>Sheng vs. shou — which kind of pu-erh do you have?</h2>
          <ul>
            <li>
              <strong>Sheng (raw / green pu-erh):</strong> the traditional
              form. Leaves are processed, compressed into cakes, and
              fermented naturally over years to decades. Young sheng (under 5
              years) is bitter and astringent; aged sheng (10+ years, often
              30+) is smooth, sweet, woody. Stored cakes are valuable —
              vintage sheng commands prices comparable to fine wine.
            </li>
            <li>
              <strong>Shou (ripe / cooked pu-erh):</strong> invented in
              Kunming in 1973 to accelerate fermentation. Leaves are piled
              wet for 45-60 days; the result tastes earthy, deep, and
              forest-floor-like right away — no aging required. Shou is the
              easier entry point for new pu-erh drinkers.
            </li>
          </ul>

          <h2>Steeping by sub-variety</h2>
          <ul>
            <li>
              <strong>Sheng pu-erh — young (under 5 years):</strong> Gongfu
              10s rinse + infusions starting at 10-15s. Western 3 minutes at
              95°C with reduced leaf (2.5g per 8oz) to soften the
              astringency.
            </li>
            <li>
              <strong>Sheng pu-erh — aged (10+ years):</strong> Gongfu 10s
              rinse + infusions starting at 10-20s. Western 4 minutes at
              95°C. Aged sheng tolerates longer steeps because the
              fermentation has rounded the bitter compounds.
            </li>
            <li>
              <strong>Shou pu-erh:</strong> Gongfu 10s rinse + 10s starts.
              Western 3 minutes at 100°C. Shou is the most aggressive-water-
              tolerant tea on this site — boiling water and 3-5 minute steeps
              are fine.
            </li>
            <li>
              <strong>Pu-erh tuocha (compressed bird-nest):</strong> needs
              extra time to unfurl. Use 30-second rinse + 30-second first
              infusion before settling into the normal ladder.
            </li>
          </ul>

          <h2>How to brew pu-erh (Western method)</h2>
          <ol>
            <li>
              <strong>Break off a chunk from the cake.</strong> A pu-erh
              pick (a sharp metal awl) is the right tool; a paring knife
              works too. Aim for 3g for an 8-oz Western cup. For loose-leaf
              pu-erh skip this step.
            </li>
            <li>
              <strong>Rinse the leaves.</strong> Pour boiling water over,
              swirl for 5 seconds, decant immediately. This washes off
              compressing dust and starts opening the leaves. Skip the rinse
              only for young sheng if you want to taste it from the first
              infusion.
            </li>
            <li>
              <strong>Refill with 95-100°C water and start the timer.</strong>{" "}
              Default 3 minutes for shou, 4 minutes for aged sheng, 3 minutes
              with reduced leaf for young sheng.
            </li>
            <li>
              <strong>Strain immediately when the timer ends.</strong> Save
              the leaves for a second infusion — bump by 60 seconds and
              brew again.
            </li>
          </ol>

          <h2>Storage and aging</h2>
          <p>
            If you bought a pu-erh cake to age, store it in a clean, ventilated
            cabinet away from strong odors. Humidity matters: 60-70% relative
            humidity is the sweet spot for sheng aging. Too dry and the
            fermentation stalls; too humid and you risk mold. Cakes from
            high-humidity climates (Hong Kong, Guangdong) age faster than
            cakes stored in dry Kunming. Most casual collectors store cakes
            at room temperature for 5-30 years before drinking; commercial
            shou is ready to drink immediately.
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
