"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { BLACK_TEA } from "@/lib/tea-presets";
import { BLACK_TEA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "1-3 min at 75-80°C — Sencha, Dragon Well, Gyokuro",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "2-4 min at 85-95°C — Tieguanyin, Da Hong Pao",
  },
  {
    name: "Pu-Erh Tea Timer",
    href: "/kitchen/tea-timer/pu-erh",
    description: "Fermented Chinese tea — gongfu or Western brewing",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Up to 6 concurrent steeps — different teas, one page",
  },
  {
    name: "Pour-Over Coffee Timer",
    href: "/kitchen/pour-over-timer",
    description: "Sibling beverage tool — Hoffmann V60, Kasuya 4:6",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={countdownStrategy}
      config={{ duration: BLACK_TEA.steep_seconds }}
      label="Black Tea Timer"
      description={`${BLACK_TEA.temp_c}°C · ${BLACK_TEA.ratio} · default 4:00 steep`}
      below={<TeaInfo tea={BLACK_TEA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Black Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={BLACK_TEA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Black Tea Timer
          </h1>
          <p>
            A free black tea steeping timer pre-loaded with a{" "}
            <strong>4-minute default steep at 90-100°C (194-212°F)</strong>,
            sized for one 8oz mug with 2.5g of leaf. The reference table
            beneath the timer lists per-sub-variety timings — English
            Breakfast, Assam, Darjeeling First Flush, Ceylon, Earl Grey, and
            Lapsang Souchong — so you can pick the right number for your
            specific blend.
          </p>

          <h2>Steeping times by sub-variety</h2>
          <ul>
            <li>
              <strong>English Breakfast:</strong> 4 minutes at 100°C. Classic
              malty blend, milk-friendly, the safest default for most British
              and Irish-style black teas.
            </li>
            <li>
              <strong>Assam:</strong> 4 minutes at 100°C. Malty, full-bodied,
              high-tannin. Stands up to milk and sugar. The backbone of most
              breakfast blends.
            </li>
            <li>
              <strong>Darjeeling First Flush:</strong> 3 minutes at 95°C.
              Lighter, muscatel, more like an oolong. Drink without milk.
              Second-flush Darjeeling can go 4 minutes.
            </li>
            <li>
              <strong>Ceylon:</strong> 4 minutes at 100°C. Brisk and citrusy,
              the most common iced-tea base.
            </li>
            <li>
              <strong>Earl Grey:</strong> 4 minutes at 100°C. Black tea
              scented with bergamot oil. Drink without milk for the citrus
              aroma to come through.
            </li>
            <li>
              <strong>Lapsang Souchong:</strong> 5 minutes at 100°C. Pine-
              smoked Chinese black. The smoke flavor masks any over-extraction
              harshness, so longer steeps are fine.
            </li>
          </ul>

          <h2>How to brew black tea</h2>
          <ol>
            <li>
              <strong>Boil filtered water.</strong> Black tea is fully oxidised
              and can take 95-100°C without scalding. Bring the kettle to a
              rolling boil. Filtered water matters more for delicate teas
              (Darjeeling) than for blends (English Breakfast).
            </li>
            <li>
              <strong>Measure 2.5g of leaf per 8 oz of water</strong> (about 1
              level teaspoon for most leaf grades; CTC and broken-leaf blends
              are denser).
            </li>
            <li>
              <strong>Pour and start the timer.</strong> Default 4 minutes is
              right for Assam, Ceylon, English Breakfast, Earl Grey, and most
              Yunnan blacks. Drop to 3 minutes for Darjeeling First Flush; go
              to 5 minutes for Lapsang Souchong or very mature leaf grades.
            </li>
            <li>
              <strong>Strain immediately.</strong> Black tea is more forgiving
              than green, but past 6 minutes most blacks turn flat and
              tannin-heavy. Strain when the timer ends.
            </li>
            <li>
              <strong>Add milk and sugar after.</strong> Milk masks delicate
              flavors — fine for Assam and English Breakfast, less so for
              Darjeeling and Earl Grey.
            </li>
          </ol>

          <h2>Iced tea and cold brew</h2>
          <p>
            For iced tea, the easier path is <strong>cold brew</strong>: 1.5x
            the normal leaf (about 4g per 8oz) in cold filtered water,
            refrigerate 8-12 hours, strain. The cup tastes smoother because
            cold water extracts less tannin and less caffeine. For hot-brewed
            iced tea, double the leaf (5g per 8oz), brew normally for 3-4
            minutes, then pour over a glass full of ice to flash-chill.
          </p>

          <h2>Caffeine in black tea</h2>
          <p>
            A typical 8oz cup of black tea contains 40-70mg of caffeine —
            roughly half to two-thirds of a cup of drip coffee. Assam and CTC
            blends are at the higher end of that range; Darjeeling and
            single-origin Yunnan blacks tend to be lower. Decaffeinated black
            tea is widely available; CO2 decaf preserves flavor better than
            ethyl acetate.
          </p>

          <h2>Related</h2>
          <p>
            For the green-tea counterpart see the{" "}
            <Link href="/kitchen/tea-timer/green">green tea timer</Link>; for
            partially oxidised teas see the{" "}
            <Link href="/kitchen/tea-timer/oolong">oolong tea timer</Link>; for
            fermented Chinese tea see the{" "}
            <Link href="/kitchen/tea-timer/pu-erh">pu-erh tea timer</Link>. To
            brew several teas concurrently (different teas for different
            guests), use the{" "}
            <Link href="/kitchen/tea-timer/multi-cup">multi-cup tea timer</Link>.
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
