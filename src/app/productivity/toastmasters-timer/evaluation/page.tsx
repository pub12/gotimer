"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { ToastmastersPresetInfo } from "@/components/debate/toastmasters-preset-info";
import { EVALUATION } from "@/lib/toastmasters-presets";
import { EVALUATION_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Toastmasters Timer Hub",
    href: "/productivity/toastmasters-timer",
    description: "All four Toastmasters speech-type presets",
  },
  {
    name: "Prepared Speech Timer",
    href: "/productivity/toastmasters-timer/prepared-speech",
    description: "5-6-7 cycle — the speech being evaluated",
  },
  {
    name: "Ice Breaker Timer",
    href: "/productivity/toastmasters-timer/ice-breaker",
    description: "4-5-6 cycle — Pathways Project 1",
  },
  {
    name: "Table Topics Timer",
    href: "/productivity/toastmasters-timer/table-topics",
    description: "1:00-2:00 impromptu speaking timer",
  },
  {
    name: "Debate Timer",
    href: "/productivity/debate-timer",
    description: "Multi-format debate round timer",
  },
  {
    name: "Presentation Timer",
    href: "/productivity/presentation",
    description: "General-purpose talk and meeting countdown",
  },
];

function Content() {
  const preset = EVALUATION;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: preset.steps }}
      label="Toastmasters Evaluation Timer"
      description={`${preset.project} · ${preset.tagline}`}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <ToastmastersPresetInfo preset={preset} />
          <Stoplight
            mode="toastmasters"
            signal_colors={preset.signal_colors}
            caption="Green 2:00 · Yellow 2:30 · Red 3:00 (+30s grace)"
          />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Toastmasters Evaluation Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={EVALUATION_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Toastmasters Evaluation Timer
          </h1>
          <p>
            A free Toastmasters speech-evaluation timer with the standard{" "}
            <strong>2:00 / 2:30 / 3:00 signal cycle</strong> pre-loaded. Green
            at 2:00, yellow at 2:30, red at 3:00 — the official qualifying
            window used by speech evaluators in club meetings and at the
            Toastmasters Evaluation Contest from Club through District level.
          </p>

          <h2>What evaluators do</h2>
          <p>
            Every Toastmasters speech is paired with an <strong>individual
            evaluator</strong> — a member assigned to give a 2-3 minute spoken
            evaluation immediately after the speech. The evaluator&apos;s
            role is to highlight what worked, suggest one or two specific
            improvements, and leave the speaker motivated to give the next
            speech. It&apos;s the single most valuable mechanism in the
            Toastmasters method — every speaker gets honest feedback from a
            trained peer evaluator after every speech.
          </p>

          <h2>The CRC framework for evaluations</h2>
          <p>
            The classic evaluation structure is <strong>CRC</strong>: Commend,
            Recommend, Commend.
          </p>
          <ol>
            <li>
              <strong>Commend</strong> (30-45s) — open with what worked.
              Specific moments are better than general praise. &quot;Your
              opening question got me on the edge of my seat&quot; beats
              &quot;great speech&quot;.
            </li>
            <li>
              <strong>Recommend</strong> (60-90s) — pick <em>one or two</em>{" "}
              specific improvements. Common targets: vocal pace, body
              language, the transition into the conclusion, or one specific
              moment that confused you.
            </li>
            <li>
              <strong>Commend</strong> (30s) — close with another
              commendation. The speaker should leave wanting to give the next
              speech.
            </li>
          </ol>

          <h2>The Evaluation Contest</h2>
          <p>
            Each year Toastmasters runs an <strong>Evaluation Contest</strong>{" "}
            in parallel with the International Speech Contest. All
            contestants watch the same 5-7 minute target speech, then
            individually deliver a 2-3 minute evaluation. Judges score on
            insight, specific feedback, and delivery. Evaluation is the
            harder contest — you have no preparation time, just the speech
            you just watched and 5 minutes to organise your thoughts before
            delivering. Strong evaluators stick to 2-3 specific points; broad
            evaluations come across as shallow under time pressure.
          </p>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Press Start</strong> when the evaluator stands to
              deliver their evaluation.
            </li>
            <li>
              <strong>Green at 2:00</strong> — qualifying window opens.
              Evaluator may finish anytime.
            </li>
            <li>
              <strong>Yellow at 2:30</strong> — wrap-up signal. Most contest
              evaluators are entering their closing commendation here.
            </li>
            <li>
              <strong>Red at 3:00</strong> — conclude immediately. The
              30-second grace window after red gives some flexibility for
              club meetings; in contests, anything past 3:30 is
              non-qualifying.
            </li>
          </ol>

          <h2>For the speech being evaluated</h2>
          <p>
            Use the{" "}
            <Link href="/productivity/toastmasters-timer/prepared-speech">
              5-6-7 prepared speech timer
            </Link>{" "}
            for the underlying speech. The convention that evaluation time
            equals half the speech time means a 5-7 minute speech gets a 2-3
            minute evaluation — that&apos;s where this cycle comes from.
            Longer speeches (8-10 minutes) get 4-5 minute evaluations; use the{" "}
            <Link href="/productivity/debate-timer/custom">custom builder</Link>{" "}
            for those.
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
