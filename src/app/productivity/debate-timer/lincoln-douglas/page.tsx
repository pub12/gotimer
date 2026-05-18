"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { DebatePreviousButton } from "@/components/timer/plugins/debate-controls";
import { DebateSpeechTable } from "@/components/debate/debate-speech-table";
import { DebateFormatInfo } from "@/components/debate/debate-format-info";
import { LINCOLN_DOUGLAS } from "@/lib/debate-formats";
import { LINCOLN_DOUGLAS_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Debate Timer Hub",
    href: "/productivity/debate-timer",
    description: "All five debate formats with a single format selector",
  },
  {
    name: "Public Forum",
    href: "/productivity/debate-timer/public-forum",
    description: "2-on-2 team debate, three crossfires, 35-min round",
  },
  {
    name: "Policy Debate",
    href: "/productivity/debate-timer/policy",
    description: "2-on-2 evidence-heavy, four CX periods, 64-min round",
  },
  {
    name: "Toastmasters Timer",
    href: "/productivity/toastmasters-timer",
    description: "Green/yellow/red signals for Toastmasters speeches",
  },
  {
    name: "Custom Debate Builder",
    href: "/productivity/debate-timer/custom",
    description: "Build non-standard formats with shareable URL",
  },
  {
    name: "Presentation Timer",
    href: "/productivity/presentation",
    description: "Simpler countdown for talks and meetings",
  },
];

function Content() {
  const format = LINCOLN_DOUGLAS;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: format.steps }}
      label="Lincoln-Douglas Debate Timer"
      description={`NSDA · ${format.total_minutes} min · ${format.summary}`}
      show_skip
      control_extra={<DebatePreviousButton />}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <DebateFormatInfo format={format} />
          <Stoplight
            mode="debate"
            caption="Last 60s = yellow · last 30s = red"
            yellow_at={60}
            red_at={30}
          />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Lincoln-Douglas Debate Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={LINCOLN_DOUGLAS_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Lincoln-Douglas Debate Timer
          </h1>
          <p>
            A free NSDA Lincoln-Douglas debate timer with the standard 7-phase
            round pre-loaded. Two constructives (6 and 7 minutes), two
            cross-examination periods (3 minutes each), and three rebuttals
            (4-6-3) — 32 minutes of structured round time, auto-advancing
            through every phase. 4 minutes of prep per side, used at the
            debater&apos;s discretion.
          </p>

          <h2>Standard Lincoln-Douglas speech times</h2>
          <p>
            The table is the authoritative summary of NSDA LD speech order and
            times. Some leagues — primarily local invitationals — give 5
            minutes of prep instead of 4; use the{" "}
            <Link href="/productivity/debate-timer/custom">custom builder</Link>{" "}
            for non-NSDA variations.
          </p>
          <DebateSpeechTable
            rows={format.speech_times}
            caption="NSDA Lincoln-Douglas — 32 minutes plus 4 min prep per side"
          />

          <h2>How a Lincoln-Douglas round flows</h2>
          <p>
            The affirmative opens with a 6-minute Affirmative Constructive (AC)
            reading their value, criterion, and contentions. The negative
            cross-examines for 3 minutes, then delivers a 7-minute Negative
            Constructive (NC) — typically a competing value or framework, plus
            answers to the AC. The affirmative cross-examines for 3 minutes,
            then collapses the round in a 4-minute 1st Affirmative Rebuttal
            (1AR) — covering all 7 minutes of negative argumentation in 4
            minutes is widely considered the hardest speech in any debate
            format. The negative delivers a 6-minute Negative Rebuttal (NR)
            crystallising their position. The affirmative closes with a
            3-minute 2nd Affirmative Rebuttal (2AR).
          </p>

          <h2>The 1AR — and why it&apos;s the speech that breaks debaters</h2>
          <p>
            The 4-minute 1AR has to cover the entire 7-minute NC: case
            framework, off-case positions (theory, kritik, topicality), and
            any new responses to the affirmative case. Ruthless time
            allocation is the only path through. Common targets: 1:00-1:30 on
            framework, 1:30-2:00 on the negative&apos;s primary off-case,
            30-60 seconds on case-side extensions. Going deep on any one
            argument loses the round; going thin everywhere gets out-flowed in
            NR.
          </p>

          <h2>Using the judge controls</h2>
          <ul>
            <li>
              <strong>Skip</strong> — Advances to the next phase early. Use
              when the debater finishes a CX or rebuttal under time.
            </li>
            <li>
              <strong>Previous</strong> — Rewinds one phase. Use if you
              advanced by mistake, or to replay a CX exchange disputed by one
              side (rare; mostly used in coaching scrimmages).
            </li>
            <li>
              <strong>Pause</strong> — Use during prep time. The pause control
              freezes both the phase timer and any visual cues until you
              resume.
            </li>
          </ul>

          <h2>LD versus Public Forum and Policy</h2>
          <p>
            Compared to{" "}
            <Link href="/productivity/debate-timer/public-forum">
              Public Forum
            </Link>{" "}
            (2-on-2, 11 phases, monthly topics) and{" "}
            <Link href="/productivity/debate-timer/policy">Policy</Link>{" "}
            (2-on-2, 12 phases, year-long topic with evidence-heavy debate),
            Lincoln-Douglas is the 1-on-1 value debate format with 60-day
            topics. LD rewards philosophical depth and the ability to manage
            time pressure under the 1AR collapse. Use the{" "}
            <Link href="/productivity/debate-timer">debate hub</Link> to switch
            formats during mixed-format invitationals.
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
