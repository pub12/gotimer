"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { GREEN_TEA } from "@/lib/tea-presets";
import { GREEN_TEA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Matcha Timer",
    href: "/kitchen/tea-timer/matcha",
    description: "30-second whisk cycle for ceremonial usucha and koicha",
  },
  {
    name: "White Tea Timer",
    href: "/kitchen/tea-timer/white",
    description: "Minimally processed — 2-5 min at 75-85°C",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "Partially oxidised — 2-4 min at 85-95°C, gongfu friendly",
  },
  {
    name: "Gongfu Cha Timer",
    href: "/kitchen/tea-timer/gongfu",
    description: "Multi-infusion timer — works with high-grade green too",
  },
  {
    name: "Pour-Over Coffee Timer",
    href: "/kitchen/pour-over-timer",
    description: "Sibling beverage tool — Hoffmann V60, Kasuya 4:6, more",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={countdownStrategy}
      config={{ duration: GREEN_TEA.steep_seconds }}
      label="Green Tea Timer"
      description={`${GREEN_TEA.temp_c}°C · ${GREEN_TEA.ratio} · default 2:00 steep`}
      below={<TeaInfo tea={GREEN_TEA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Green Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={GREEN_TEA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Green Tea Timer
          </h1>
          <p>
            A free green tea steeping timer pre-loaded with a{" "}
            <strong>2-minute default steep at 75-80°C (167-176°F)</strong>,
            covering most Chinese and Japanese green tea sub-varieties. The
            reference table beneath the timer lists per-sub-variety timings —
            Sencha, Dragon Well (Longjing), Gyokuro, Bi Luo Chun, Genmaicha, and
            matcha — so you can pick the right number for what&apos;s in the
            cup.
          </p>

          <h2>Steeping times by sub-variety</h2>
          <ul>
            <li>
              <strong>Sencha:</strong> 1 minute at 75°C. Japanese steamed
              green tea. Strong umami; over-steeping past 90 seconds turns it
              vegetal-bitter fast.
            </li>
            <li>
              <strong>Dragon Well (Longjing):</strong> 2 minutes at 80°C.
              Pan-fired Chinese green from Hangzhou. Nutty, sweet, the most
              forgiving green tea for beginners.
            </li>
            <li>
              <strong>Gyokuro:</strong> 90 seconds at 60-65°C. Shade-grown
              Japanese green. Needs much cooler water than other greens —
              boiled water destroys the umami compounds and turns it harsh.
            </li>
            <li>
              <strong>Bi Luo Chun:</strong> 90 seconds at 75°C. Delicate
              spring-pluck Chinese green. Use cooler water and shorter steep
              than Dragon Well.
            </li>
            <li>
              <strong>Genmaicha:</strong> 2 minutes at 80°C. Toasted brown rice
              blended with Bancha or Sencha. The rice masks any over-extraction
              harshness — the most forgiving Japanese green.
            </li>
            <li>
              <strong>Matcha:</strong> not steeped — whisked. Use the{" "}
              <Link href="/kitchen/tea-timer/matcha">matcha timer</Link> for the
              30-second whisk cycle.
            </li>
          </ul>

          <h2>How to brew green tea</h2>
          <ol>
            <li>
              <strong>Heat water to 75-80°C.</strong> Use a variable
              temperature kettle if you have one. If not, boil and rest the
              kettle for 90 seconds — water drops about 5°C every 30 seconds.
            </li>
            <li>
              <strong>Measure 2g of leaf per 8 oz of water</strong> (about 1
              level teaspoon, but a scale is more accurate because leaf density
              varies — Sencha is dense, Bi Luo Chun is fluffy).
            </li>
            <li>
              <strong>Pour and start the timer.</strong> Use the default 2
              minutes for Dragon Well-style green, drop to 1 minute for Sencha,
              push to 3 minutes for old-leaf or roasted green tea like
              Houjicha.
            </li>
            <li>
              <strong>Strain immediately when the timer ends.</strong> Leaves
              left in cooling water continue extracting catechins past your
              target time — the cup that was perfect at 2:00 turns harsh by
              2:30.
            </li>
          </ol>

          <h2>The most common green tea mistakes</h2>
          <p>
            Three mistakes account for almost every &quot;why does my green tea
            taste bad&quot; complaint:
          </p>
          <ul>
            <li>
              <strong>Boiling water on delicate green leaves.</strong>{" "}
              Catechins extract too fast and the leaves scald. The cup tastes
              like burnt grass. Drop to 75-80°C and it&apos;ll taste sweet and
              vegetal-fresh instead.
            </li>
            <li>
              <strong>Steeping past 3 minutes.</strong> Most green teas turn
              harsh-astringent past the 3-minute mark. Sencha turns by 90
              seconds. The timer fixes this mechanically — when it beeps,
              strain.
            </li>
            <li>
              <strong>Stale leaves.</strong> Green tea oxidises in storage.
              Leaves more than a year old taste flat and increasingly bitter no
              matter how perfectly you brew them. Buy small amounts, store
              air-tight, drink within 6-12 months.
            </li>
          </ul>

          <h2>Multi-infusion green tea</h2>
          <p>
            Most quality Chinese and Japanese green teas give 2-3 good
            infusions. Bump each subsequent steep by 30 seconds and keep the
            temperature the same. The second infusion is often the most
            balanced. For ratios above 5g per 100ml in a small vessel, see the{" "}
            <Link href="/kitchen/tea-timer/gongfu">gongfu cha timer</Link> —
            the 8-infusion progression works for high-grade greens too,
            although most gongfu practice is with oolong and pu-erh.
          </p>

          <h2>Caffeine in green tea</h2>
          <p>
            A typical 8oz cup of green tea contains 25-50mg of caffeine —
            roughly half the caffeine of a cup of black tea or a third of a
            cup of drip coffee. Gyokuro is on the higher end (the shade-growing
            increases caffeine content), and decaffeinated green teas (CO2 or
            water-process decaf) are widely available. The combination of
            caffeine and L-theanine in green tea is the source of the
            often-cited &quot;alert but calm&quot; effect.
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
