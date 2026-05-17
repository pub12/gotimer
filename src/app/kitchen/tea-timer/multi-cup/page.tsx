"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { TeaCupGrid } from "@/components/tea/tea-cup-grid";
import { MULTI_CUP_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "Per-type pages with sub-variety steep timings",
  },
  {
    name: "Gongfu Cha Timer",
    href: "/kitchen/tea-timer/gongfu",
    description: "Multi-infusion auto-progress for one tea session",
  },
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "1-3 min at 75-80°C — Sencha, Dragon Well presets",
  },
  {
    name: "Multi-Timer (Kitchen)",
    href: "/kitchen/multi-timer",
    description: "Generic multi-timer for any cooking — no tea presets",
  },
  {
    name: "Black Tea Timer",
    href: "/kitchen/tea-timer/black",
    description: "3-5 min at 90-100°C — Assam, Darjeeling, Earl Grey",
  },
  {
    name: "Oolong Tea Timer",
    href: "/kitchen/tea-timer/oolong",
    description: "2-4 min at 85-95°C — Tieguanyin, Da Hong Pao",
  },
];

function Content() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-20 pb-4 px-3 md:px-4">
        <header className="w-full max-w-3xl mx-auto mb-6 text-center">
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground">
            Multi-Cup Tea Timer
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Brew up to six teas at once. Each cup has its own type, its own
            countdown, its own chime.
          </p>
        </header>

        <TeaCupGrid />

        <TimerSeoContent
          timer_name="Multi-Cup Tea Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={MULTI_CUP_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>When you need to brew multiple teas at once</h2>
          <p>
            A single tea timer works for one cup of green tea. But three
            common situations need parallel brewing — and trying to track
            multiple steeps mentally (or with one timer reset between cups)
            leaves at least one tea over-steeped:
          </p>
          <ul>
            <li>
              <strong>Tea parties.</strong> Different guests want different
              teas. Without parallel brewing, the first cup goes cold while
              the second steeps. With parallel brewing, every cup is ready at
              the same time.
            </li>
            <li>
              <strong>Side-by-side tastings.</strong> Comparing two oolongs,
              three pu-erhs, or a vintage-to-vintage comparison requires the
              cups to brew at the same time so taste-memory comparisons are
              fair. A 30-second gap between brews ruins the comparison.
            </li>
            <li>
              <strong>Mixed-household needs.</strong> One strong black tea for
              the morning, one chamomile for the kids, one decaffeinated for
              a partner — all steeping at the same time so the kitchen
              doesn&apos;t become a tea bottleneck.
            </li>
          </ul>

          <h2>How to use this multi-cup timer</h2>
          <ol>
            <li>
              <strong>Three cups load by default</strong> — green, oolong,
              black. Each shows its tea-type name and its default steep time.
            </li>
            <li>
              <strong>Change a tea type</strong> using the dropdown at the
              top of each cup card. The duration resets automatically to that
              tea&apos;s default (green 2 min, black 4 min, herbal 6 min,
              matcha 30s, etc.).
            </li>
            <li>
              <strong>Add or remove cups</strong> with the Add Cup button or
              the × on each card. Maximum six cups.
            </li>
            <li>
              <strong>Tap Start All</strong> when everyone is pouring
              simultaneously, or use each cup&apos;s Start button to
              stagger.
            </li>
            <li>
              <strong>Enable audio</strong> using the speaker icon — each
              cup chimes individually when it finishes.
            </li>
            <li>
              <strong>Share your setup</strong> by tapping the link icon.
              The URL encodes the full cup set with names and durations;
              opening the link recreates the same configuration.
            </li>
          </ol>

          <h2>How to time a multi-tea tasting</h2>
          <p>
            The technique is the same as cooking a multi-dish meal — work
            backwards from when you want everything ready. For a 4-cup
            tasting where you want every cup poured at the same moment:
          </p>
          <ol>
            <li>
              <strong>Boil enough water for all four cups</strong> — typically
              700-900ml depending on cup size. Use one large kettle, not four
              small ones.
            </li>
            <li>
              <strong>Pre-warm all four vessels.</strong> Pour a splash of
              boiling water into each, swirl, discard. This step matters more
              than most home tea drinkers realise — cold porcelain robs heat
              from the brew and changes the result.
            </li>
            <li>
              <strong>Measure leaf into all four vessels</strong> before
              pouring water into any of them. Trying to measure and pour at
              the same time means at least one cup over-steeps.
            </li>
            <li>
              <strong>Pour water into each vessel as fast as possible, then
              tap Start All.</strong> The 5-10 second gap between the first
              and last pour is well within tolerance for everything except
              Sencha and Silver Needle.
            </li>
            <li>
              <strong>Strain into tasting cups when the chime sounds.</strong>{" "}
              Each cup has its own chime — you don&apos;t need to watch the
              page.
            </li>
          </ol>

          <h2>Cup card colors</h2>
          <p>
            Each cup card uses two visual states. <strong>Brewing
            cards</strong> show the countdown in foreground text with a
            progress bar at the bottom. <strong>Finished cards</strong> turn
            green-tinted and display &quot;Done!&quot; — this is the cue to
            strain. Other cups continue independently; finishing one
            doesn&apos;t pause the others.
          </p>

          <h2>Related</h2>
          <p>
            For a single tea with auto-progressing multi-infusion steps, see
            the{" "}
            <Link href="/kitchen/tea-timer/gongfu">gongfu cha timer</Link>{" "}
            instead — that&apos;s the right tool for one oolong or one
            pu-erh session with 8+ infusions. For a generic multi-timer
            without tea presets (handy for cooking + tea + bread proofing
            simultaneously), see the{" "}
            <Link href="/kitchen/multi-timer">kitchen multi-timer</Link>.
          </p>
        </TimerSeoContent>
      </main>
      <Footer />
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
