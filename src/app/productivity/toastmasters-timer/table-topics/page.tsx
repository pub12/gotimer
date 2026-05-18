"use client";

import React, { Suspense } from "react";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { ToastmastersPresetInfo } from "@/components/debate/toastmasters-preset-info";
import { TABLE_TOPICS } from "@/lib/toastmasters-presets";
import { TABLE_TOPICS_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Toastmasters Timer Hub",
    href: "/productivity/toastmasters-timer",
    description: "All four Toastmasters speech-type presets",
  },
  {
    name: "Prepared Speech Timer",
    href: "/productivity/toastmasters-timer/prepared-speech",
    description: "5-6-7 cycle — the standard club speech",
  },
  {
    name: "Ice Breaker Timer",
    href: "/productivity/toastmasters-timer/ice-breaker",
    description: "4-5-6 cycle — Pathways Project 1",
  },
  {
    name: "Evaluation Timer",
    href: "/productivity/toastmasters-timer/evaluation",
    description: "2:00-3:00 for speech evaluators",
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
  const preset = TABLE_TOPICS;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: preset.steps }}
      label="Table Topics Timer"
      description={`${preset.project} · ${preset.tagline}`}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <ToastmastersPresetInfo preset={preset} />
          <Stoplight
            mode="toastmasters"
            signal_colors={preset.signal_colors}
            caption="Green 1:00 · Yellow 1:30 · Red 2:00 (+15s grace)"
          />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Table Topics Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={TABLE_TOPICS_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Toastmasters Table Topics Timer
          </h1>
          <p>
            A free Table Topics timer with the standard{" "}
            <strong>1:00 / 1:30 / 2:00 signal cycle</strong> pre-loaded. Green
            light at 1:00, yellow at 1:30, red at 2:00 — the official
            qualifying window for the impromptu speaking segment of every
            Toastmasters meeting and the Table Topics Contest at all levels.
          </p>

          <h2>What is Table Topics?</h2>
          <p>
            <strong>Table Topics</strong> is the impromptu speaking segment of
            a Toastmasters meeting. The Table Topics Master poses a question
            and a randomly-selected member answers it on the spot in 1 to 2
            minutes. The point is to train spontaneous thinking — getting from
            a cold-start prompt to a coherent answer is the most-transferable
            skill Toastmasters teaches. Job interviews, panel discussions, and
            difficult meetings all use the same cognitive muscle.
          </p>

          <h2>Three frameworks for 90-second impromptu answers</h2>
          <ul>
            <li>
              <strong>PREP</strong> (Point, Reason, Example, Point) — state
              your answer, give a reason, illustrate with one example,
              re-state. Most common at Toastmasters; produces clean 90-second
              answers reliably.
            </li>
            <li>
              <strong>Past-Present-Future</strong> — how the topic was, how it
              is now, where it&apos;s going. Works for trend questions, opinion
              prompts, and policy questions.
            </li>
            <li>
              <strong>Personal-Local-Global</strong> — start with you, expand
              to your community, expand to the world. Strong for values
              questions and reflective prompts.
            </li>
          </ul>

          <h2>The 1-to-2-minute timing</h2>
          <p>
            <strong>Going under 1:00</strong> is the more common failure mode
            for new members — they freeze, deliver a 40-second answer, and sit
            down. Going over 2:00 happens to seasoned speakers who fall in
            love with their own answer. The 1-minute qualifying band is the
            tightest in all of Toastmasters timing — every second matters.
          </p>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Press Start</strong> when the speaker begins their
              answer (Table Topics doesn&apos;t have a long &quot;walk to the
              lectern&quot; in most clubs).
            </li>
            <li>
              <strong>Green at 1:00</strong> — qualifying window opens. From
              here, the speaker may finish anytime.
            </li>
            <li>
              <strong>Yellow at 1:30</strong> — wrap-up signal. Most strong
              answers conclude here.
            </li>
            <li>
              <strong>Red at 2:00</strong> — conclude immediately. The
              15-second grace window is generous compared to other Toastmasters
              cycles.
            </li>
          </ol>

          <h2>For Table Topics contests</h2>
          <p>
            The Table Topics Contest runs from Club through District level
            each year. All contestants are sequestered until called; each
            answers the same question. Judges score on insight, structure,
            and delivery. Going outside the 1:00-2:00 window disqualifies the
            answer from contest scoring — and unlike prepared speech contests,
            the grace window is enforced strictly. Strong contest answers
            typically land at 1:45-1:55 — using almost all the qualifying
            window without risking the boundary.
          </p>

          <h2>Practising Table Topics solo</h2>
          <p>
            Bookmark this timer and run impromptu drills. Pick a question from
            a Table Topics question bank, hit Start, and answer aloud for 90
            seconds. Even five minutes of solo practice per day measurably
            improves on-stage performance — the cognitive load of generating
            structure under time pressure is the trainable skill.
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
