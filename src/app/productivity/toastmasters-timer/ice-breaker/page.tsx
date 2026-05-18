"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { ToastmastersPresetInfo } from "@/components/debate/toastmasters-preset-info";
import { ICE_BREAKER } from "@/lib/toastmasters-presets";
import { ICE_BREAKER_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Toastmasters Timer Hub",
    href: "/productivity/toastmasters-timer",
    description: "All four Toastmasters speech-type presets",
  },
  {
    name: "Prepared Speech Timer",
    href: "/productivity/toastmasters-timer/prepared-speech",
    description: "5-6-7 cycle — your second and subsequent speeches",
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
  const preset = ICE_BREAKER;
  return (
    <TimerPage
      strategy={multiStepStrategy}
      config={{ steps: preset.steps }}
      label="Toastmasters Ice Breaker Speech Timer"
      description={`${preset.project} · ${preset.tagline}`}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <ToastmastersPresetInfo preset={preset} />
          <Stoplight
            mode="toastmasters"
            signal_colors={preset.signal_colors}
            caption="Green 4:00 · Yellow 5:00 · Red 6:00 (+30s grace)"
          />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Toastmasters Ice Breaker Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={ICE_BREAKER_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Toastmasters Ice Breaker Speech Timer
          </h1>
          <p>
            A free Toastmasters Ice Breaker timer with the standard{" "}
            <strong>4-5-6 signal cycle</strong> pre-loaded. Green light fires
            at 4:00, yellow at 5:00, red at 6:00 — the official qualifying
            window for Pathways Level 1 Project 1. A 30-second grace window
            after red still counts as qualifying at club level; contest-level
            disqualification kicks in past 6:30.
          </p>

          <h2>What the Ice Breaker is</h2>
          <p>
            The Ice Breaker is the <strong>first speech every new Toastmasters
            member delivers</strong>. The project asks you to introduce
            yourself to the club — your background, what brought you to
            Toastmasters, what you hope to gain. It&apos;s deliberately
            unstructured so that new speakers don&apos;t get blocked by
            content. The evaluator focuses on overall speech structure (clear
            opening, middle with one or two examples, clear closing) rather
            than advanced delivery skills.
          </p>

          <h2>Why 4-5-6?</h2>
          <p>
            Four minutes minimum gives a new speaker enough time to introduce
            themselves with substance. Six minutes maximum is short enough
            that nervous speakers can&apos;t run on forever. The 1-minute
            qualifying window (4:00 to 5:00 in the green zone, with 5:00 to
            6:00 as a warning) is wider than most Pathways projects on
            purpose — Ice Breaker speakers vary widely in pacing.
          </p>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Press Start</strong> when the speaker steps to the
              lectern. The timer counts down internally — the display shows
              the time until the next signal change.
            </li>
            <li>
              <strong>Watch for the green bar</strong> at 4:00. From this
              moment the speaker is in the qualifying window — they may
              finish anytime.
            </li>
            <li>
              <strong>Yellow at 5:00</strong> — the speaker should be heading
              toward their conclusion. Most speakers wrap up here.
            </li>
            <li>
              <strong>Red at 6:00</strong> — the speaker should conclude
              immediately. The 30-second grace window after red still counts
              as qualifying for club meetings.
            </li>
            <li>
              <strong>Record the time</strong> at the end. The Timer role
              reports each speaker&apos;s total time when called on by the
              Toastmaster of the meeting.
            </li>
          </ol>

          <h2>Tips for Ice Breaker speakers</h2>
          <ul>
            <li>
              <strong>Don&apos;t aim for 6:00.</strong> Targeting the
              maximum means any nervous speed-up bumps you over. Aim for{" "}
              <strong>5:00-5:30</strong> as a safe landing zone.
            </li>
            <li>
              <strong>Pick one theme, not your whole life.</strong> Five
              minutes is short. One defining anecdote beats a chronological
              bio every time.
            </li>
            <li>
              <strong>Memorise opening and closing.</strong> The first 30
              seconds and last 30 seconds make the strongest impression. The
              middle can run from notes.
            </li>
            <li>
              <strong>Practice with this timer.</strong> Bookmark the page and
              run through your speech twice with the actual signal cycle. The
              feedback you get from the lights is more honest than a stopwatch.
            </li>
          </ul>

          <h2>After the Ice Breaker</h2>
          <p>
            Most of your subsequent Pathways speeches will use the{" "}
            <Link href="/productivity/toastmasters-timer/prepared-speech">
              5-6-7 prepared-speech cycle
            </Link>{" "}
            — a similar but longer window with a tighter qualifying band. By
            then your evaluator will start commenting on advanced delivery
            skills (vocal variety, body language, audience connection) rather
            than just structure.
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
