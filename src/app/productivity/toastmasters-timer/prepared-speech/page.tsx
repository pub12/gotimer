"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { ToastmastersPresetInfo } from "@/components/debate/toastmasters-preset-info";
import { PREPARED_SPEECH } from "@/lib/toastmasters-presets";
import { PREPARED_SPEECH_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Toastmasters Timer Hub",
    href: "/productivity/toastmasters-timer",
    description: "All four Toastmasters speech-type presets",
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
  const preset = PREPARED_SPEECH;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: preset.steps }}
      label="Toastmasters Prepared Speech Timer"
      description={`${preset.project} · ${preset.tagline}`}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <ToastmastersPresetInfo preset={preset} />
          <Stoplight
            mode="toastmasters"
            signal_colors={preset.signal_colors}
            caption="Green 5:00 · Yellow 6:00 · Red 7:00 (+30s grace)"
          />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Toastmasters Prepared Speech Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={PREPARED_SPEECH_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Toastmasters Prepared Speech Timer (5-6-7)
          </h1>
          <p>
            A free Toastmasters prepared speech timer with the classic{" "}
            <strong>5-6-7 signal cycle</strong> pre-loaded. Green at 5:00,
            yellow at 6:00, red at 7:00 — used for most Pathways prepared-
            speech projects across Levels 1 through 5, and for the
            International Speech Contest at every level from Club through
            District. The most-used timing in Toastmasters worldwide.
          </p>

          <h2>What the 5-6-7 cycle means</h2>
          <p>
            <strong>Green at 5:00</strong> — the speech has reached the
            qualifying minimum. From here, the speaker may conclude at any
            time and the speech counts. <strong>Yellow at 6:00</strong> — one
            minute remaining in the qualifying window. <strong>Red at
            7:00</strong> — conclude immediately. A 30-second grace window
            (through 7:30) is informational for club meetings; in contest play,
            anything past 7:30 disqualifies the speech.
          </p>

          <h2>Pathways projects that use 5-7 minutes</h2>
          <ul>
            <li>
              <strong>Researching and Presenting</strong> (Level 2, 3, 4)
            </li>
            <li>
              <strong>Persuasive Speaking</strong> (Level 2)
            </li>
            <li>
              <strong>Organize Your Speech</strong> (Level 2)
            </li>
            <li>
              <strong>Vocal Variety and Body Language</strong> (Level 2)
            </li>
            <li>
              <strong>Connect with Your Audience</strong> (Level 2)
            </li>
            <li>
              <strong>International Speech Contest</strong> (Club through
              District) — same 5-7 window
            </li>
            <li>
              And most Level 3, 4, and 5 prepared speech electives
            </li>
          </ul>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Press Start</strong> when the speaker reaches the
              lectern. The timer counts down internally — the display shows
              the time until the next signal change.
            </li>
            <li>
              <strong>Green at 5:00</strong> — the qualifying window opens.
              Speaker may finish anytime.
            </li>
            <li>
              <strong>Yellow at 6:00</strong> — wrap up signal. Most speakers
              are heading toward their conclusion by yellow.
            </li>
            <li>
              <strong>Red at 7:00</strong> — conclude immediately. Anything
              past 7:30 risks disqualification in contest play.
            </li>
            <li>
              <strong>Report the time</strong> at the end. The Timer role
              records the exact speaking time on a ballot or roll-call note.
            </li>
          </ol>

          <h2>For contestants — practising at contest pace</h2>
          <p>
            International Speech Contest speakers practice this timing
            obsessively. Most champions land in the <strong>6:30-6:50</strong>
            zone — using almost all the qualifying window without risking the
            7:00 boundary. The famous World Championship speeches by Darren
            LaCroix, Lance Miller, Mark Hunter, and others all live in that
            band. Hit the timer&apos;s start button at the same moment you&apos;d
            start your contest speech and run the whole thing twice — the
            stoplight gives you honest feedback on pacing.
          </p>

          <h2>For Pathways evaluators</h2>
          <p>
            When you&apos;re scheduled as the evaluator on a prepared speech,
            use the <Link href="/productivity/toastmasters-timer/evaluation">
              evaluation timer
            </Link>{" "}
            (2-3 minutes) for your evaluation segment. The evaluator&apos;s
            timing window is half the prepared speech length — that&apos;s
            the convention across all Toastmasters projects.
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
