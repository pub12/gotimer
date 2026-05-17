"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { SteepingChart } from "@/components/tea/steeping-chart";
import {
  TEA_PRESETS,
  DEFAULT_TEA_PRESET,
} from "@/lib/tea-presets";
import { TEA_HUB_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "1-3 min at 75-80°C — Sencha, Dragon Well, Gyokuro presets",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "2-4 min at 85-95°C — Tieguanyin, Da Hong Pao, Dong Ding",
  },
  {
    name: "Black Tea Timer",
    href: "/kitchen/tea-timer/black",
    description: "3-5 min at 90-100°C — Assam, Darjeeling, Earl Grey",
  },
  {
    name: "Pu-Erh Tea Timer",
    href: "/kitchen/tea-timer/pu-erh",
    description: "Fermented — gongfu 10-30s or Western 3-5 min",
  },
  {
    name: "Gongfu Cha Timer",
    href: "/kitchen/tea-timer/gongfu",
    description: "8-infusion auto-progressing timer for oolong and pu-erh",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Up to 6 concurrent cups — different teas, one page",
  },
];

function Content() {
  const params = useSearchParams();
  const requested = params.get("type") ?? "";
  const initial_key =
    requested && TEA_PRESETS[requested] ? requested : DEFAULT_TEA_PRESET.slug;

  const [tea_key, set_tea_key] = useState(initial_key);
  const tea = TEA_PRESETS[tea_key] ?? DEFAULT_TEA_PRESET;

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (tea_key === DEFAULT_TEA_PRESET.slug) {
      url_params.delete("type");
    } else {
      url_params.set("type", tea_key);
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [tea_key]);

  const description = useMemo(() => {
    const minutes = Math.floor(tea.steep_seconds / 60);
    const seconds = tea.steep_seconds % 60;
    const time =
      minutes > 0 && seconds > 0
        ? `${minutes}:${seconds.toString().padStart(2, "0")}`
        : minutes > 0
          ? `${minutes} min`
          : `${seconds}s`;
    return `${tea.name} · ${tea.temp_c}°C · steep ${time}`;
  }, [tea]);

  return (
    <TimerPage
      key={tea_key}
      strategy={countdownStrategy}
      config={{ duration: tea.steep_seconds }}
      label="Tea Timer"
      description={description}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="tea-type"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Tea type
            </label>
            <select
              id="tea-type"
              value={tea_key}
              onChange={(e) => set_tea_key(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
            >
              {Object.values(TEA_PRESETS).map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <TeaInfo tea={tea} />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={TEA_HUB_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Tea Timer with Per-Type Steeping Presets
          </h1>
          <p>
            A free tea steeping timer with seven per-tea-type presets — green,
            black, oolong, white, pu-erh, herbal, matcha — plus a{" "}
            <Link href="/kitchen/tea-timer/gongfu">gongfu cha multi-infusion timer</Link>{" "}
            and a{" "}
            <Link href="/kitchen/tea-timer/multi-cup">multi-cup brewing grid</Link>{" "}
            for up to six concurrent steeps. The dropdown above switches the timer
            to the right steep time for each tea; the chart below is a complete
            steeping-time reference by tea type and sub-variety.
          </p>

          <h2>Steeping-time chart</h2>
          <p>
            Use this as a starting point. Sub-varieties shift these values
            (Sencha is shorter than Dragon Well; Silver Needle goes longer than
            White Peony). The per-type pages below have full sub-variety tables.
          </p>
          <SteepingChart />

          <h2>The seven tea-type pages</h2>
          <ul>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/green">Green tea</Link>
              </strong>{" "}
              — 1-3 min at 75-80°C. Pre-loaded with Sencha, Dragon Well,
              Gyokuro, Bi Luo Chun, Genmaicha, and matcha sub-variety timings.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/black">Black tea</Link>
              </strong>{" "}
              — 3-5 min at 90-100°C. Sub-variety timings for English Breakfast,
              Assam, Darjeeling, Ceylon, Earl Grey, and Lapsang Souchong.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/oolong">Oolong tea</Link>
              </strong>{" "}
              — 2-4 min at 85-95°C. Tieguanyin, Da Hong Pao, Dong Ding, Milk
              Oolong, Phoenix Dancong, Oriental Beauty. Gongfu-friendly.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/white">White tea</Link>
              </strong>{" "}
              — 2-5 min at 75-85°C. Silver Needle, White Peony, Shou Mei, plus
              aged white tea timings.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/pu-erh">Pu-erh tea</Link>
              </strong>{" "}
              — 95-100°C. Western 3-5 min or gongfu 10-30s. Sheng (raw) and
              shou (ripe) timings.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/herbal">Herbal tea</Link>
              </strong>{" "}
              — 5-10 min at 100°C. Chamomile, peppermint, rooibos, hibiscus,
              ginger, lemon balm. No over-steep risk.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/matcha">Matcha</Link>
              </strong>{" "}
              — whisked, not steeped. 30 seconds of fast zigzag with a chasen.
              Usucha and koicha timings.
            </li>
          </ul>

          <h2>Why steep time and temperature matter</h2>
          <p>
            Tea is mostly water, but the small fraction that isn&apos;t — caffeine,
            theanine, polyphenols (especially catechins and tannins), aromatic
            volatiles — extract at different rates depending on water
            temperature and contact time. Boiling water on delicate green tea
            extracts catechins fast; the cup tastes harsh and astringent. Water
            too cool on a black tea under-extracts and the cup tastes thin and
            watery. A variable-temperature kettle is the single biggest upgrade
            for home tea quality. If you don&apos;t own one, boil and rest: water
            drops about 5°C every 30 seconds in a kettle off the heat.
          </p>

          <h2>Multi-cup and gongfu modes</h2>
          <p>
            Two specialized modes sit alongside the per-type pages.{" "}
            <Link href="/kitchen/tea-timer/gongfu">Gongfu cha</Link> is a
            multi-infusion brewing method using a small (100-150ml) gaiwan with
            a high leaf ratio (5-8g leaf per 100ml). Each infusion is short —
            10 to 30 seconds — and the leaves are reused 6-15+ times across a
            session. The gongfu timer auto-progresses through a standard
            8-infusion ladder (10, 15, 20, 30, 45, 60, 90, 120 seconds) so you
            can keep both hands on the kettle and pitcher.
          </p>
          <p>
            The <Link href="/kitchen/tea-timer/multi-cup">multi-cup timer</Link>{" "}
            runs up to six concurrent countdowns. Each cup has its own
            tea-type dropdown that resets the duration to the right value for
            that tea. Useful for tea parties (different teas for different
            guests), side-by-side tasting comparisons, and brewing a strong pot
            and a decaffeinated pot for the same household.
          </p>

          <h2>Coffee timers</h2>
          <p>
            For coffee, see the sibling{" "}
            <Link href="/kitchen/pour-over-timer">pour-over timer</Link> (nine
            recipes from James Hoffmann, Tetsu Kasuya, Chemex, AeroPress and
            more) and the{" "}
            <Link href="/kitchen/espresso-timer">espresso timer</Link>{" "}
            (pre-infusion + first-drip capture, 25-30s target band).
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export function TeaHubTimer() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
