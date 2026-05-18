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
import { WSDC } from "@/lib/debate-formats";
import { WSDC_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Debate Timer Hub",
    href: "/productivity/debate-timer",
    description: "All five debate formats with a single format selector",
  },
  {
    name: "British Parliamentary",
    href: "/productivity/debate-timer/british-parliamentary",
    description: "4-team university format, 8×7-minute speeches, POIs",
  },
  {
    name: "Public Forum",
    href: "/productivity/debate-timer/public-forum",
    description: "NSDA 2-on-2 high-school format",
  },
  {
    name: "Lincoln-Douglas",
    href: "/productivity/debate-timer/lincoln-douglas",
    description: "NSDA 1-on-1 value debate",
  },
  {
    name: "Custom Debate Builder",
    href: "/productivity/debate-timer/custom",
    description: "Build host-country variants with shareable URL",
  },
  {
    name: "Toastmasters Timer",
    href: "/productivity/toastmasters-timer",
    description: "Green/yellow/red signal cycles for club speeches",
  },
];

function Content() {
  const format = WSDC;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: format.steps }}
      label="World Schools Debate Timer"
      description={`WSDC · ${format.total_minutes} min · ${format.summary}`}
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
          timer_name="World Schools Debate Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={WSDC_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            World Schools Debate Timer (WSDC)
          </h1>
          <p>
            A free WSDC (World Schools Debating Championships) timer with the
            standard 8-speech round pre-loaded. Six 8-minute constructive
            speeches in alternation, followed by two 4-minute reply speeches —
            56 minutes of in-round time. Points of Information are accepted
            between minute 1:00 and 7:00 of each constructive. Preparation is
            60 minutes for impromptu motions, released ahead of the round.
          </p>

          <h2>Standard WSDC speech times</h2>
          <p>
            The table is the authoritative summary of WSDC speech order and
            times. POIs are part of the format — judges remind speakers to
            accept 2-3 over the speech and to take them only within the
            unprotected window.
          </p>
          <DebateSpeechTable
            rows={format.speech_times}
            caption="WSDC — 56 minutes in-round, 60 minutes prep released with motion"
          />

          <h2>Points of Information — the WSDC defining feature</h2>
          <p>
            POIs differentiate WSDC and{" "}
            <Link href="/productivity/debate-timer/british-parliamentary">
              British Parliamentary
            </Link>{" "}
            from American formats. During the unprotected minutes
            (1:00&nbsp;–&nbsp;7:00 in an 8-minute speech), the opposing team can
            stand and offer a 15-second intervention. The speaker accepts or
            declines. Conventional expectations: <strong>take 2-3 POIs per
            speech</strong>. Refusing all POIs reads as scared or
            inflexible; taking too many wastes the floor time. POIs from
            third-party speakers (a debater on a future speech) are also legal
            within the unprotected window.
          </p>

          <h2>The 3rd speaker — pure rebuttal</h2>
          <p>
            Speakers 1 and 2 of each side give constructive speeches that
            balance arguments and rebuttal. The 3rd speaker (5th proposition
            and 6th opposition in order) delivers a <strong>rebuttal-only
            speech</strong> — no new arguments are allowed. Reply speeches,
            given by either the 1st or 2nd speaker (never the 3rd), are a
            final summary highlighting why the team won.
          </p>

          <h2>Using the judge controls</h2>
          <ul>
            <li>
              <strong>Skip</strong> — Advances to the next speech early. WSDC
              speeches rarely end under time; skip is mostly used when a
              speaker dramatically finishes early.
            </li>
            <li>
              <strong>Previous</strong> — Rewinds one phase. Use if the panel
              advanced by mistake or to replay a contested portion in
              practice rounds.
            </li>
            <li>
              <strong>Pause</strong> — In tournament rounds the chair
              ordinarily doesn&apos;t pause; the timer runs continuously
              through transitions.
            </li>
          </ul>

          <h2>WSDC compared to other formats</h2>
          <p>
            WSDC is the international high-school standard, used at the World
            Schools Debating Championships and most international qualifiers.
            It&apos;s 3-on-3 (versus PF&apos;s 2-on-2 and BP&apos;s 4 teams of
            2). The format rewards big-picture rhetoric, principled framing,
            and engagement with the opposition — POIs make it the most
            <em> interactive</em> of the major formats. American teams
            preparing for international qualifiers should adjust from PF/LD
            style toward longer, more rhetorical speeches with explicit
            framing.
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
