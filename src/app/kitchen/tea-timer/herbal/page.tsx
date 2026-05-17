"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { HERBAL_TEA } from "@/lib/tea-presets";
import { HERBAL_TEA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "Low-caffeine real tea — 1-3 min at 75-80°C",
  },
  {
    name: "Matcha Timer",
    href: "/kitchen/tea-timer/matcha",
    description: "Whisked green tea — high caffeine + L-theanine",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Brew chamomile for one, mint for another",
  },
  {
    name: "Sleep Timer",
    href: "/wellness/sleep",
    description: "Wind-down countdown — pair with chamomile",
  },
  {
    name: "Meditation Timer",
    href: "/wellness/meditation",
    description: "Pair tea ritual with a meditation session",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={countdownStrategy}
      config={{ duration: HERBAL_TEA.steep_seconds }}
      label="Herbal Tea Timer"
      description={`${HERBAL_TEA.temp_c}°C · ${HERBAL_TEA.ratio} · default 6:00 steep`}
      below={<TeaInfo tea={HERBAL_TEA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Herbal Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={HERBAL_TEA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Herbal Tea Timer (Tisane Timer)
          </h1>
          <p>
            A free herbal tea timer pre-loaded with a{" "}
            <strong>6-minute default steep at boiling water (100°C)</strong>.
            Strictly speaking, herbal &quot;teas&quot; are{" "}
            <strong>tisanes</strong> — infusions of plants other than{" "}
            <em>Camellia sinensis</em> — but the English-language convention
            calls them tea. Most herbals are caffeine-free and forgive long
            steeps that would ruin a real tea.
          </p>

          <h2>Steeping times by herbal</h2>
          <ul>
            <li>
              <strong>Chamomile:</strong> 5 minutes at 100°C. Soothing,
              honey-like. The classic sleep tea — apigenin binds to
              benzodiazepine receptors for a mild sedative effect.
            </li>
            <li>
              <strong>Peppermint:</strong> 6 minutes at 100°C. Digestion aid,
              cooling. Strong after 6+ minutes; bump to 8 if you want
              menthol intensity.
            </li>
            <li>
              <strong>Rooibos:</strong> 7 minutes at 100°C. South African
              red bush. Naturally sweet, smooth, milk-friendly. Can steep
              10+ minutes without bitterness.
            </li>
            <li>
              <strong>Hibiscus:</strong> 6 minutes at 100°C. Tart, ruby-red.
              The base for most &quot;red zinger&quot;-style blends. Lowers
              blood pressure in clinical studies.
            </li>
            <li>
              <strong>Ginger (fresh slices):</strong> 10 minutes at 100°C, or
              simmer 15 minutes. For maximum kick, simmer rather than steep —
              the volatile gingerols extract slowly.
            </li>
            <li>
              <strong>Lemon balm:</strong> 5 minutes at 100°C. Mildly
              calming, citrusy. Often blended with chamomile for sleep.
            </li>
          </ul>

          <h2>How to brew herbal tea</h2>
          <ol>
            <li>
              <strong>Boil filtered water.</strong> Herbals are robust enough
              for full boiling water — no temperature finesse needed.
            </li>
            <li>
              <strong>Use enough leaf.</strong> Most herbals are bulky; a
              level teaspoon is rarely enough. Use 1 full tea bag or 2g of
              loose herbal per 8oz. For roots and barks (ginger, cinnamon),
              use even more.
            </li>
            <li>
              <strong>Start the timer at 6 minutes.</strong> Most herbals are
              forgiving — over-steeping by a minute or two rarely ruins the
              cup. The exception is hibiscus blended with hard-water
              minerals, which can turn slightly metallic past 8 minutes.
            </li>
            <li>
              <strong>Cover the vessel while steeping</strong> for aromatic
              herbals like mint and lavender — the lid traps the volatile
              oils that would otherwise evaporate with the steam.
            </li>
          </ol>

          <h2>Bedtime herbal blends</h2>
          <p>
            For sleep, the standard reliable blends are:{" "}
            <strong>chamomile + lemon balm + lavender</strong> (gentle,
            consistent),{" "}
            <strong>chamomile + valerian root</strong> (stronger, slightly
            harsh — use less valerian),{" "}
            <strong>passionflower + chamomile</strong> (anxiety-leaning). All
            steep 6-8 minutes at 100°C. Pair with the{" "}
            <Link href="/wellness/sleep">sleep timer</Link> as a wind-down
            ritual.
          </p>

          <h2>Cold-brewed herbals for iced tea</h2>
          <p>
            Hibiscus, mint, and rooibos make excellent cold brews — 1.5x the
            normal leaf in cold filtered water, 8-12 hours in the fridge,
            strain. The cup tastes smoother because cold water extracts more
            gently. Hibiscus cold-brewed makes the most visually striking
            iced tea on this list (deep ruby-red).
          </p>

          <h2>Caffeinated &quot;herbals&quot;</h2>
          <p>
            A few non-tea plants do contain caffeine and are often grouped
            with herbals: <strong>yerba mate</strong> (South American holly —
            roughly the caffeine of green tea), <strong>guayusa</strong>{" "}
            (Ecuadorian — slightly less than mate), and{" "}
            <strong>yaupon</strong> (the only caffeinated plant native to
            North America). Read the label — &quot;herbal&quot; on the
            package doesn&apos;t guarantee caffeine-free.
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
