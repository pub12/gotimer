"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { OOLONG_TEA } from "@/lib/tea-presets";
import { OOLONG_TEA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Gongfu Cha Timer",
    href: "/kitchen/tea-timer/gongfu",
    description: "8-infusion auto-progressing — built for oolong",
  },
  {
    name: "Pu-Erh Tea Timer",
    href: "/kitchen/tea-timer/pu-erh",
    description: "Fermented Chinese — also gongfu-friendly",
  },
  {
    name: "White Tea Timer",
    href: "/kitchen/tea-timer/white",
    description: "Aged white tea takes gongfu well too",
  },
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "Less-oxidised sibling — 1-3 min at 75-80°C",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Up to 6 concurrent cups for tea tastings",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={countdownStrategy}
      config={{ duration: OOLONG_TEA.steep_seconds }}
      label="Oolong Tea Timer"
      description={`${OOLONG_TEA.temp_c}°C · ${OOLONG_TEA.ratio} · default 3:00 Western steep`}
      below={<TeaInfo tea={OOLONG_TEA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Oolong Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={OOLONG_TEA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Oolong Tea Timer
          </h1>
          <p>
            A free oolong tea steeping timer pre-loaded with a{" "}
            <strong>3-minute default Western steep at 85-95°C</strong>. Oolong
            sits between green and black on the oxidation spectrum — partially
            oxidised, which makes it the most versatile and re-steepable tea
            type. For a high-leaf, short-infusion approach, see the{" "}
            <Link href="/kitchen/tea-timer/gongfu">gongfu cha timer</Link>.
          </p>

          <h2>Steeping times by sub-variety</h2>
          <ul>
            <li>
              <strong>Tieguanyin (Iron Goddess):</strong> 3 minutes at 90°C
              Western, or gongfu 15s starts. Lightly oxidised, floral,
              jade-green leaves, bright yellow liquor.
            </li>
            <li>
              <strong>Da Hong Pao (Big Red Robe):</strong> 3 minutes at 95°C
              Western, or gongfu 10s starts. Heavily oxidised and roasted
              Wuyi rock oolong; mineral, dark amber liquor.
            </li>
            <li>
              <strong>Dong Ding:</strong> 3 minutes at 95°C Western. Taiwanese
              medium-roast oolong. Toasty, slightly sweet, very forgiving.
            </li>
            <li>
              <strong>Milk Oolong (Jin Xuan):</strong> 2.5 minutes at 85°C
              Western. Taiwanese cultivar that develops a naturally creamy
              aroma without any added flavoring.
            </li>
            <li>
              <strong>Phoenix Dancong:</strong> 3 minutes at 95°C Western, or
              gongfu 15s starts. Single-bush from Guangdong; aggressive
              aromatics that evolve dramatically across infusions.
            </li>
            <li>
              <strong>Oriental Beauty (Bai Hao):</strong> 3 minutes at 85°C
              Western. Bug-bitten Taiwanese oolong with natural honey notes.
              The leaves are bitten by leafhoppers, which triggers the
              honey-like aroma development.
            </li>
          </ul>

          <h2>Western vs. gongfu brewing for oolong</h2>
          <p>
            Oolong is the tea type that benefits most from gongfu brewing
            (high leaf ratio in a small gaiwan with short infusions). Western
            brewing gives you one balanced cup; gongfu gives you 6-15+ cups
            that each taste slightly different as the leaves spend. For
            casual everyday drinking, Western brewing at 3 minutes is fine —
            this timer is set up for that. For a Sunday-morning ritual or
            tasting session, use the{" "}
            <Link href="/kitchen/tea-timer/gongfu">gongfu timer</Link> with
            its auto-progressing 8-infusion ladder.
          </p>

          <h2>How to brew oolong (Western method)</h2>
          <ol>
            <li>
              <strong>Heat water to 85-95°C</strong> depending on oxidation.
              Lightly oxidised (Tieguanyin, Milk Oolong, Bai Hao): 85-90°C.
              Heavily oxidised or roasted (Da Hong Pao, Dong Ding, aged
              oolongs): 95-100°C. As a rule of thumb, the darker the leaf,
              the hotter the water.
            </li>
            <li>
              <strong>Measure 3g of leaf per 8 oz of water.</strong> Slightly
              more than green or black tea because oolong leaves are often
              tightly rolled and unfurl as they steep.
            </li>
            <li>
              <strong>Pour and start the timer.</strong> Default 3 minutes is
              right for most Western brews. Adjust by 30 seconds in either
              direction based on the first taste.
            </li>
            <li>
              <strong>Strain and taste.</strong> Save the leaves for a second
              infusion — bump the steep time by 60 seconds for round 2.
            </li>
          </ol>

          <h2>Oxidation and what it tastes like</h2>
          <p>
            Oolong covers 8-80% oxidation. The lightly-oxidised end (10-30%)
            tastes like a richer, floral green tea — Tieguanyin, Milk Oolong,
            Bai Hao. The mid-oxidation range (40-60%) tastes fruity and
            balanced — Dong Ding, traditional Dancong. The heavily-oxidised
            and roasted end (70-80%) tastes mineral, dark, almost coffee-like —
            Da Hong Pao, aged Wuyi oolongs. There is no &quot;best&quot; spot
            on this spectrum; pick what suits the day.
          </p>

          <h2>Aged oolong</h2>
          <p>
            Quality oolongs (especially Wuyi rock and aged Taiwanese
            high-mountain) improve with 5-30+ years of aging. Aged oolong
            tastes deeper, smoother, more mineral, with the floral/fruity
            top notes replaced by woody and date-like flavors. Aged oolong
            brews exactly like fresh oolong; the timer is identical.
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
