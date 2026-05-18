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
import { PUBLIC_FORUM } from "@/lib/debate-formats";
import { PUBLIC_FORUM_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Debate Timer Hub",
    href: "/productivity/debate-timer",
    description: "All five debate formats with a single format selector",
  },
  {
    name: "Lincoln-Douglas",
    href: "/productivity/debate-timer/lincoln-douglas",
    description: "1-on-1 value debate, 6-3-7-3-4-6-3 with two CX periods",
  },
  {
    name: "Policy Debate",
    href: "/productivity/debate-timer/policy",
    description: "2-on-2 evidence-heavy, four CX periods, 64-min round",
  },
  {
    name: "World Schools Debate",
    href: "/productivity/debate-timer/wsdc",
    description: "3-on-3 international format with POIs",
  },
  {
    name: "British Parliamentary",
    href: "/productivity/debate-timer/british-parliamentary",
    description: "4-team university format, 8×7 minutes",
  },
  {
    name: "Custom Debate Builder",
    href: "/productivity/debate-timer/custom",
    description: "Define non-standard speech times — shareable URL",
  },
];

function Content() {
  const format = PUBLIC_FORUM;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: format.steps }}
      label="Public Forum Debate Timer"
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
          timer_name="Public Forum Debate Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={PUBLIC_FORUM_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Public Forum Debate Timer
          </h1>
          <p>
            A free NSDA Public Forum debate timer with the standard 11-phase
            round pre-loaded. Two 4-minute constructives, a 3-minute crossfire,
            two 4-minute rebuttals, another 3-minute crossfire, two 3-minute
            summaries, a 3-minute grand crossfire, and two 2-minute final
            focuses — 35 minutes of structured round time, auto-advancing.
          </p>

          <h2>Standard Public Forum speech times</h2>
          <p>
            The table is the authoritative summary of NSDA Public Forum speech
            order and times. Sub-2017 leagues used 2-minute summaries; this
            table reflects the current standard.
          </p>
          <DebateSpeechTable
            rows={format.speech_times}
            caption="NSDA Public Forum — 35 minutes plus 3 min prep per team"
          />

          <h2>How a Public Forum round flows</h2>
          <p>
            The two 1st-speakers open with 4-minute constructive cases. After
            the first crossfire, the two 2nd-speakers deliver 4-minute
            rebuttals — Pro&apos;s rebuttal refutes Con&apos;s case;
            Con&apos;s rebuttal refutes Pro&apos;s case AND rebuilds their own
            (the &quot;second rebuttal frontline&quot;). After the second
            crossfire, the 1st speakers return with 3-minute summaries
            highlighting their best impacts. Grand Crossfire opens the floor to
            all four debaters. Finally the 2nd speakers each deliver a
            2-minute final focus, framing the world of the ballot for the
            judge.
          </p>

          <h2>Using the judge controls</h2>
          <ul>
            <li>
              <strong>Skip</strong> — Advances to the next phase early. Use
              when a debater yields the remainder of their time back, or skips
              a speech entirely (rare in PF but legal).
            </li>
            <li>
              <strong>Previous</strong> — Rewinds one phase. Use if you
              advanced by mistake or if a speech needs replaying (online
              tournaments sometimes have audio dropouts that trigger replays).
            </li>
            <li>
              <strong>Pause / Reset</strong> — Standard timer controls. Pause
              when a team calls prep; reset only between rounds.
            </li>
          </ul>

          <h2>Crossfire timing — questions and answers alternate</h2>
          <p>
            Each crossfire is 3 minutes. The first speaker asks the first
            question, then the questioning alternates. In <strong>Grand
            Crossfire</strong> (after the summaries), <em>any</em> of the four
            debaters can ask or answer — the conventional opener is the 1st
            speaker of the first-speaking team. Judges typically don&apos;t
            interrupt to enforce alternation; running this timer projected
            lets the debaters self-regulate.
          </p>

          <h2>Public Forum vs. other formats</h2>
          <p>
            Compared to{" "}
            <Link href="/productivity/debate-timer/lincoln-douglas">
              Lincoln-Douglas
            </Link>{" "}
            (1-on-1, value-based) and{" "}
            <Link href="/productivity/debate-timer/policy">Policy</Link>{" "}
            (evidence-heavy, longer round), Public Forum is the most
            accessible high-school format — shorter speeches, less technical
            vocabulary, monthly topic rotation. WSDC and BP are international
            university-leaning formats. Use the{" "}
            <Link href="/productivity/debate-timer">debate hub</Link> to switch
            between formats during a mixed-format invitational.
          </p>

          <h2>Custom variations</h2>
          <p>
            Some districts and invitational tournaments shave 30 seconds off
            rebuttal or extend summaries. The{" "}
            <Link href="/productivity/debate-timer/custom">
              custom builder
            </Link>{" "}
            lets you redefine each phase and produces a shareable URL — paste
            it on your school club page or send to your team chat.
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
