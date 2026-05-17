"use client";

import React, { Suspense } from "react";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { WHITE_TEA } from "@/lib/tea-presets";
import { WHITE_TEA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "1-3 min at 75-80°C — the closest cousin to white",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "Partially oxidised — 2-4 min at 85-95°C, gongfu-friendly",
  },
  {
    name: "Gongfu Cha Timer",
    href: "/kitchen/tea-timer/gongfu",
    description: "Multi-infusion — aged white tea brews beautifully gongfu",
  },
  {
    name: "Pu-Erh Tea Timer",
    href: "/kitchen/tea-timer/pu-erh",
    description: "Fermented Chinese tea — similar aged-and-stored approach",
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
      config={{ duration: WHITE_TEA.steep_seconds }}
      label="White Tea Timer"
      description={`${WHITE_TEA.temp_c}°C · ${WHITE_TEA.ratio} · default 3:00 steep`}
      below={<TeaInfo tea={WHITE_TEA} />}
      seo_content={
        <TimerSeoContent
          timer_name="White Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={WHITE_TEA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            White Tea Timer
          </h1>
          <p>
            A free white tea steeping timer pre-loaded with a{" "}
            <strong>3-minute default steep at 75-85°C</strong>. White tea is
            the least processed of all the tea types — the leaves are simply
            withered and dried, with no rolling, no firing, no oxidation
            step. The result is a delicate, slightly sweet cup with melon and
            hay notes.
          </p>

          <h2>Steeping times by sub-variety</h2>
          <ul>
            <li>
              <strong>Silver Needle (Bai Hao Yin Zhen):</strong> 4 minutes at
              75-80°C. Pure buds only — the highest grade. Delicate,
              honey-sweet, the most expensive white tea.
            </li>
            <li>
              <strong>White Peony (Bai Mu Dan):</strong> 3 minutes at 80°C.
              Buds plus young leaves. More body and flavor than Silver Needle,
              less expensive, and the most forgiving white tea for beginners.
            </li>
            <li>
              <strong>Shou Mei:</strong> 4 minutes at 85°C. Made from more
              mature leaves harvested later in the season. Stronger,
              fruitier, more like a light oolong than a delicate white.
            </li>
            <li>
              <strong>Aged white tea (3+ years):</strong> 5 minutes at 85-90°C
              Western, or gongfu-style with 15s starts. Develops honey,
              jujube, and woody notes as it ages. Often compressed into cakes.
            </li>
          </ul>

          <h2>How to brew white tea</h2>
          <ol>
            <li>
              <strong>Heat water to 75-85°C</strong> depending on grade.
              Silver Needle: 75-80°C. White Peony: 80°C. Shou Mei: 85°C. Aged
              white: 85-90°C. Boiling water on Silver Needle isn&apos;t
              catastrophic (white tea is more forgiving than green) but it
              flattens the delicate aromas.
            </li>
            <li>
              <strong>Measure 3g of leaf per 8 oz of water.</strong> Silver
              Needle is fluffy — a teaspoon weighs less than for tightly
              rolled teas. Use a scale if accuracy matters.
            </li>
            <li>
              <strong>Pour and start the timer.</strong> Default 3 minutes is
              right for White Peony. Bump to 4 for Silver Needle and Shou Mei.
              Push to 5 for aged white. White tea forgives over-steeping more
              than any other tea type.
            </li>
            <li>
              <strong>Strain and consider a second infusion.</strong> White
              tea re-steeps well — bump by 60 seconds for round 2, and again
              for round 3.
            </li>
          </ol>

          <h2>Aged white tea and the &quot;one year tea, three year medicine, seven year treasure&quot; saying</h2>
          <p>
            In Fuzhou and Fuding (Fujian province, the origin region of all
            classical Chinese white teas), the saying goes:{" "}
            <em>yi nian cha, san nian yao, qi nian bao</em> — &quot;one year
            tea, three year medicine, seven year treasure.&quot; Fresh white
            tea is everyday refreshment; 3-year-aged white is consumed
            medicinally (often hot, with longer steeps, for sore throats); 7+
            year aged white is the connoisseur&apos;s grade, brewed gongfu
            for its honeyed depth. Aged white teas are often pressed into
            300g cakes (like pu-erh) for compact storage.
          </p>

          <h2>Common questions about white tea</h2>
          <p>
            <strong>Is white tea low in caffeine?</strong> Not particularly.
            Silver Needle (made from buds, where caffeine concentrates) has
            similar or slightly more caffeine than green tea. Shou Mei (made
            from mature leaves) is lower. The marketing claim that white tea
            is &quot;low caffeine&quot; is an oversimplification.
          </p>
          <p>
            <strong>Why is Silver Needle so expensive?</strong> Yield is the
            answer. Silver Needle is made only from unopened buds, harvested
            for a short window in early spring, picked by hand. About 30,000
            buds are needed for 500g of finished tea. Grades and harvest
            timing matter; early-spring (pre-Qingming) Silver Needle from
            Fuding commands the highest prices.
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
