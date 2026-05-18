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
import { BRITISH_PARLIAMENTARY } from "@/lib/debate-formats";
import { BRITISH_PARLIAMENTARY_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Debate Timer Hub",
    href: "/productivity/debate-timer",
    description: "All five debate formats with a single format selector",
  },
  {
    name: "World Schools Debate",
    href: "/productivity/debate-timer/wsdc",
    description: "3-on-3 international format, POIs minute 1-7",
  },
  {
    name: "Lincoln-Douglas",
    href: "/productivity/debate-timer/lincoln-douglas",
    description: "NSDA 1-on-1 value debate",
  },
  {
    name: "Public Forum",
    href: "/productivity/debate-timer/public-forum",
    description: "NSDA 2-on-2 high-school format",
  },
  {
    name: "Custom Debate Builder",
    href: "/productivity/debate-timer/custom",
    description: "Build society-specific variants with shareable URL",
  },
  {
    name: "Toastmasters Timer",
    href: "/productivity/toastmasters-timer",
    description: "Green/yellow/red signal cycles for club speeches",
  },
];

function Content() {
  const format = BRITISH_PARLIAMENTARY;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: format.steps }}
      label="British Parliamentary Debate Timer"
      description={`WUDC · ${format.total_minutes} min · ${format.summary}`}
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
          timer_name="British Parliamentary Debate Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={BRITISH_PARLIAMENTARY_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            British Parliamentary Debate Timer (BP / WUDC)
          </h1>
          <p>
            A free British Parliamentary (BP / WUDC) debate timer with the
            standard 8-speech round pre-loaded. Four teams of two — Opening
            Government, Opening Opposition, Closing Government, Closing
            Opposition — each delivering one 7-minute speech in alternation.
            Total round time is 56 minutes plus 15 minutes of preparation
            released with the motion.
          </p>

          <h2>Standard BP speech times</h2>
          <p>
            The table is the authoritative summary of BP speech order. POIs
            are part of the format — speakers should expect to take 1-3 POIs
            per speech inside the unprotected window (minute 1:00 to 6:00).
          </p>
          <DebateSpeechTable
            rows={format.speech_times}
            caption="British Parliamentary / WUDC — 56 minutes in-round, 15 min prep"
          />

          <h2>Four teams, three roles</h2>
          <p>
            Unlike{" "}
            <Link href="/productivity/debate-timer/wsdc">WSDC</Link>{" "}
            (two teams of three) or{" "}
            <Link href="/productivity/debate-timer/public-forum">PF</Link>{" "}
            (two teams of two), BP runs <strong>four teams</strong>:
          </p>
          <ul>
            <li>
              <strong>Opening Government (OG)</strong> — PM and Deputy PM.
              Define the motion, lay out the affirmative case.
            </li>
            <li>
              <strong>Opening Opposition (OO)</strong> — Leader of Opposition
              and Deputy LO. Engage OG&apos;s case directly.
            </li>
            <li>
              <strong>Closing Government (CG)</strong> — Member of Govt and
              Govt Whip. Extend OG&apos;s case with a new analytical angle —
              must be substantively different from what OG already said.
            </li>
            <li>
              <strong>Closing Opposition (CO)</strong> — Member of Opp and Opp
              Whip. Same role for the opposition side — extend with a new
              angle.
            </li>
          </ul>

          <h2>Whip speeches — no new arguments</h2>
          <p>
            The Government Whip and Opposition Whip are speakers 7 and 8 — the
            final speakers of each side. They <strong>cannot introduce new
            analytical arguments</strong>; their job is to summarise, weigh
            arguments against each other, and explain why their side won. New
            examples illustrating an existing argument are fine; new framing,
            new contention-level arguments, or new analytical claims are
            penalised. Closing-team Members (speakers 5 and 6) <em>must</em>
            introduce a new extension — that&apos;s their structural job.
          </p>

          <h2>Ranking the room — how BP is scored</h2>
          <p>
            BP judges <strong>rank teams 1st through 4th</strong>, not
            win/loss. 1st place earns 3 team points, 2nd earns 2, 3rd earns 1,
            4th earns 0. This means the two government teams compete against
            each other for the higher government rank, even though they
            nominally share a side. Extension quality is what differentiates
            teams within a side — Closing teams that fail to extend
            meaningfully lose to Opening teams that build a solid case.
          </p>

          <h2>Using the judge controls</h2>
          <ul>
            <li>
              <strong>Skip</strong> — Advances to the next speech early. BP
              speeches rarely end under time; the protected windows usually
              fill.
            </li>
            <li>
              <strong>Previous</strong> — Rewinds one phase. Use if the chair
              advanced by mistake.
            </li>
            <li>
              <strong>Pause</strong> — Tournament chairs run BP timers
              continuously through transitions; pause is mainly for practice
              rounds.
            </li>
          </ul>

          <h2>BP at universities</h2>
          <p>
            British Parliamentary is the standard university format
            worldwide, used at the World Universities Debating Championships
            (WUDC), European University Debating Championship (EUDC), and most
            national university circuits. Society practice rounds run on this
            format throughout the academic year. The 15-minute prep window
            and motion-based topic make BP the most extemporaneous of the
            major formats — debaters research broadly and improvise framing
            in the moment.
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
