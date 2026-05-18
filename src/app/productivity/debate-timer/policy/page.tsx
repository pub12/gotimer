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
import { POLICY } from "@/lib/debate-formats";
import { POLICY_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Debate Timer Hub",
    href: "/productivity/debate-timer",
    description: "All five debate formats with a single format selector",
  },
  {
    name: "Lincoln-Douglas",
    href: "/productivity/debate-timer/lincoln-douglas",
    description: "1-on-1 value debate, 32-min round with two CX periods",
  },
  {
    name: "Public Forum",
    href: "/productivity/debate-timer/public-forum",
    description: "2-on-2 team debate, three crossfires, 35-min round",
  },
  {
    name: "World Schools Debate",
    href: "/productivity/debate-timer/wsdc",
    description: "3-on-3 international format with POIs",
  },
  {
    name: "Custom Debate Builder",
    href: "/productivity/debate-timer/custom",
    description: "College-policy CEDA/NDT variants and other tournament rules",
  },
  {
    name: "Toastmasters Timer",
    href: "/productivity/toastmasters-timer",
    description: "Green/yellow/red signal cycles for club speeches",
  },
];

function Content() {
  const format = POLICY;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: format.steps }}
      label="Policy Debate Timer"
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
          timer_name="Policy Debate Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={POLICY_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Policy Debate Timer — Cross-Examination Format
          </h1>
          <p>
            A free NSDA Policy debate timer with the standard 12-phase round
            pre-loaded. Four 8-minute constructives, four 3-minute
            cross-examination periods, four 5-minute rebuttals — 64 minutes of
            structured round time plus 8 minutes of prep per team. The longest,
            most paper-heavy major American debate format, used at every
            level from local invitationals to NSDA Nationals and the Tournament
            of Champions.
          </p>

          <h2>Standard Policy speech times</h2>
          <p>
            The table is the authoritative summary of NSDA Policy speech order
            and times. College Policy (CEDA / NDT) uses similar structure with
            9-minute constructives and 6-minute rebuttals at some tournaments;
            use the{" "}
            <Link href="/productivity/debate-timer/custom">custom builder</Link>{" "}
            for college variants.
          </p>
          <DebateSpeechTable
            rows={format.speech_times}
            caption="NSDA Policy / CX Debate — 64 minutes plus 8 min prep per team"
          />

          <h2>The neg block — 2NC plus 1NR</h2>
          <p>
            The 2NC (8 minutes) and 1NR (5 minutes) are delivered back-to-back
            with no aff speech in between — 13 minutes of uninterrupted
            negative time called &quot;the neg block&quot;. The conventional
            approach is to <strong>split the block</strong>: the 2NC takes
            case attacks, disads, and counterplans; the 1NR takes topicality,
            kritiks, or other off-case positions. Duplicating arguments
            between the two speeches wastes the structural advantage.
          </p>

          <h2>The 1AR — speech that breaks debaters</h2>
          <p>
            After 13 minutes of negative time, the 1AR has 5 minutes to cover
            everything: case extensions, frontline to every disad, topicality
            answers, counterplan permutation arguments, kritik framework
            response. Hierarchical time allocation is the only path through.
            Common splits: case 60-90s, T 60s, K 90s, CP+DA 90s. 1AR collapses
            are common at the high-school level.
          </p>

          <h2>Using the judge controls</h2>
          <ul>
            <li>
              <strong>Skip</strong> — Advances to the next phase early when a
              speaker finishes under time.
            </li>
            <li>
              <strong>Previous</strong> — Rewinds one phase. Especially useful
              in Policy where the 4 CX periods are easy to lose track of —
              advance-by-mistake is the #1 timer error.
            </li>
            <li>
              <strong>Pause</strong> — Use for prep. Both teams pull prep at
              different times in Policy (much more than PF or LD), so the
              pause control gets heavy use across a round.
            </li>
          </ul>

          <h2>Policy as a format</h2>
          <p>
            Policy is the evidence-heavy debate format. Teams carry tubs of
            paper evidence to tournaments and read cards rather than speaking
            extemporaneously. Topics are year-long (one resolution per year
            from August to June). Critics, kritiks, performance affirmatives,
            and topicality debates all evolved inside Policy — many of those
            techniques later migrated to{" "}
            <Link href="/productivity/debate-timer/lincoln-douglas">
              Lincoln-Douglas
            </Link>{" "}
            in the &quot;LD-Policy&quot; hybrid style that dominated NSDA LD
            Nationals in the 2010s.
          </p>

          <h2>Online policy rounds</h2>
          <p>
            Many tournaments run hybrid online + in-person rounds via Tabroom
            for pairings and Zoom for video. This timer projects cleanly via
            screen share — both judges and debaters can have the page open in
            a separate tab as the round source-of-truth. Press F to fullscreen
            if you&apos;re screen-sharing.
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
