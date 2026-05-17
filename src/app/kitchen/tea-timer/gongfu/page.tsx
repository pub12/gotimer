"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import {
  STANDARD_GONGFU,
  expand_gongfu,
  total_gongfu_seconds,
} from "@/lib/tea-presets";
import { GongfuSchedule } from "@/components/tea/gongfu-schedule";
import { GONGFU_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup mode",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "The classic gongfu tea — Tieguanyin, Da Hong Pao, Dancong",
  },
  {
    name: "Pu-Erh Tea Timer",
    href: "/kitchen/tea-timer/pu-erh",
    description: "Sheng and shou pu-erh — gongfu is the traditional method",
  },
  {
    name: "White Tea Timer",
    href: "/kitchen/tea-timer/white",
    description: "Aged white tea brews beautifully gongfu",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Brew multiple gongfu sessions side-by-side",
  },
  {
    name: "Pour-Over Coffee Timer",
    href: "/kitchen/pour-over-timer",
    description: "Sibling multi-stage beverage timer for coffee",
  },
];

function Content() {
  const steps = useMemo(() => expand_gongfu(STANDARD_GONGFU), []);
  const total_seconds = total_gongfu_seconds(STANDARD_GONGFU);
  const total_minutes = Math.round(total_seconds / 60);

  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps }}
      label="Gongfu Cha Timer"
      description={`${STANDARD_GONGFU.infusions.length} infusions · 5-8g leaf · ~${total_minutes} min session`}
      show_skip
      below={<GongfuSchedule config={STANDARD_GONGFU} />}
      seo_content={
        <TimerSeoContent
          timer_name="Gongfu Cha Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={GONGFU_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Gongfu Cha Multi-Infusion Tea Timer
          </h1>
          <p>
            A free <strong>gongfu cha (功夫茶) multi-infusion tea timer</strong>{" "}
            that auto-progresses through a standard 8-infusion ladder:{" "}
            <strong>10-second rinse + 10s, 15s, 20s, 30s, 45s, 60s, 90s, 120s</strong>.
            Each transition fires an audio cue so you can keep both hands on
            the kettle and pitcher. Skip ahead if a session moves faster
            than the curve.
          </p>

          <h2>What is gongfu cha?</h2>
          <p>
            Gongfu cha — &quot;tea brewed with skill&quot; — is a Chinese
            multi-infusion brewing method using a small (100-150ml){" "}
            <strong>gaiwan</strong> (lidded bowl) or small clay teapot with a
            high leaf ratio (5-8g leaf per 100ml water — much more than
            Western brewing). Each infusion is short — 10-30 seconds for the
            early infusions — and the leaves are <strong>reused 6-15+ times
            across one session</strong>. Each infusion tastes slightly
            different as the leaves spend, which is the entire point of the
            method.
          </p>

          <h2>What teas brew well gongfu?</h2>
          <ul>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/oolong">Oolong</Link>
              </strong>{" "}
              — the classic gongfu tea. Tieguanyin, Da Hong Pao, Dong Ding,
              Phoenix Dancong, Wuyi rock oolongs all evolve dramatically
              across 8-12 infusions. Some single-bush Dancongs change
              character so much between infusions 1 and 8 that they barely
              taste like the same tea.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/pu-erh">Pu-erh</Link>
              </strong>{" "}
              — gongfu is the traditional and best method. Aged sheng
              (15-30+ years) reveals layers across 12-20 infusions; shou is
              deep and consistent across 8-12. The compressed cakes need a
              rinse to open before infusion 1.
            </li>
            <li>
              <strong>
                <Link href="/kitchen/tea-timer/white">Aged white tea</Link>
              </strong>{" "}
              — aged Bai Mu Dan and Shou Mei (3+ years) brew honey-deep
              gongfu. Many aged-white practitioners prefer gongfu to Western
              for these teas.
            </li>
            <li>
              <strong>Yunnan black (Dianhong)</strong> — high-quality
              old-tree Yunnan blacks do well gongfu with 5-10g per 100ml at
              boiling water.
            </li>
          </ul>

          <h2>The standard ladder</h2>
          <p>
            Our timer auto-progresses through the most widely-used ladder:
          </p>
          <ol>
            <li>
              <strong>Rinse (10s):</strong> pour hot water, immediately
              decant. Washes off processing dust and starts opening
              compressed leaves. Skip for very young sheng if you want to
              taste the first infusion.
            </li>
            <li>
              <strong>Infusion 1 (10s):</strong> refill and steep. Decant
              fully into a pitcher (gongdaobei), then pour from the pitcher
              into tasting cups. <strong>Never leave water on the leaves
              between infusions.</strong>
            </li>
            <li>
              <strong>Infusions 2-8 (15s, 20s, 30s, 45s, 60s, 90s, 120s):</strong>{" "}
              each subsequent infusion gets longer as the leaves spend.
              Adjust by feel — taste between infusions and add 5-10s if the
              cup is thin, subtract if it&apos;s overpowering.
            </li>
          </ol>

          <h2>What you need</h2>
          <ul>
            <li>
              <strong>Gaiwan or small teapot</strong> — 100-150ml. A gaiwan
              is the right starting tool because it pours cleanly. Small
              Yixing clay teapots (~100ml) are the upgrade — they retain
              heat better and develop seasoning over years.
            </li>
            <li>
              <strong>Pitcher (gongdaobei)</strong> — for decanting from the
              gaiwan, so all tasting cups get the same strength. Roughly the
              same volume as the gaiwan.
            </li>
            <li>
              <strong>Small tasting cups</strong> — 30-50ml each. The small
              size matters: gongfu cups are meant to be drunk in 1-2 sips
              while the next infusion brews.
            </li>
            <li>
              <strong>Variable-temperature kettle</strong> at 95-100°C for
              most gongfu sessions. Aged whites and high-grade greens use
              80-85°C; everything else uses near-boiling water.
            </li>
            <li>
              <strong>5-8g of leaf.</strong> A scale is more useful than
              guessing — quality oolong and pu-erh come in different leaf
              densities and a teaspoon could be 2g or 5g.
            </li>
          </ul>

          <h2>Common gongfu mistakes</h2>
          <p>
            Three mistakes account for most disappointing sessions:
          </p>
          <ul>
            <li>
              <strong>Leaving water on the leaves between infusions.</strong>{" "}
              Always decant fully into the pitcher. Even 30 seconds of
              residual water steeps the next cup before you start. Use a
              pitcher; pour the gaiwan into the pitcher; pour the pitcher
              into cups.
            </li>
            <li>
              <strong>Too little leaf.</strong> Western-trained drinkers
              under-leaf because 6g of oolong looks like a lot. The short
              infusions only work because of the high leaf ratio — under-
              leaf and the cups come out thin no matter how long you steep.
            </li>
            <li>
              <strong>Quitting too early.</strong> Most quality oolongs and
              all aged pu-erhs are still going strong at infusion 8. The
              session ends when the tea tastes thin and watery, even after
              extending the steep time — not at some predetermined
              infusion count.
            </li>
          </ul>

          <h2>When the session ends</h2>
          <p>
            Stop when the tea tastes thin and watery, even after pushing the
            infusion time to 3+ minutes. The leaves will visibly stay fully
            open in the gaiwan — they look beautiful and some practitioners
            arrange them on a small dish (cha he) to admire before
            composting. A typical good oolong session lasts 30-45 minutes; a
            good aged pu-erh session can stretch past an hour and a half.
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
