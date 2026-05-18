"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import { DebatePreviousButton } from "@/components/timer/plugins/debate-controls";
import {
  DEBATE_FORMATS,
  DEFAULT_DEBATE_FORMAT,
  DEBATE_FORMAT_ORDER,
} from "@/lib/debate-formats";
import { DEBATE_HUB_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Public Forum",
    href: "/productivity/debate-timer/public-forum",
    description: "11-phase NSDA PF round — 4-4-3-4-4-3-3-3-3-2-2 minutes",
  },
  {
    name: "Lincoln-Douglas",
    href: "/productivity/debate-timer/lincoln-douglas",
    description: "1-on-1 value debate, 6-3-7-3-4-6-3 with two CX periods",
  },
  {
    name: "Policy",
    href: "/productivity/debate-timer/policy",
    description: "2-on-2 evidence-heavy debate, 8-3-8-3-8-3-8-3-5-5-5-5",
  },
  {
    name: "World Schools (WSDC)",
    href: "/productivity/debate-timer/wsdc",
    description: "8-min speeches with POIs minute 1-7, two replies",
  },
  {
    name: "British Parliamentary",
    href: "/productivity/debate-timer/british-parliamentary",
    description: "4-team university format, 8×7 minute speeches",
  },
  {
    name: "Toastmasters Timer",
    href: "/productivity/toastmasters-timer",
    description: "Green/yellow/red signal cycles for Toastmasters speeches",
  },
  {
    name: "Custom Format Builder",
    href: "/productivity/debate-timer/custom",
    description: "Define any phase sequence — share via URL",
  },
];

function Content() {
  const params = useSearchParams();
  const requested = params.get("format") ?? "";
  const initial_key =
    requested && DEBATE_FORMATS[requested]
      ? requested
      : DEFAULT_DEBATE_FORMAT.slug;

  const [format_key, set_format_key] = useState(initial_key);
  const format = DEBATE_FORMATS[format_key] ?? DEFAULT_DEBATE_FORMAT;

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (format_key === DEFAULT_DEBATE_FORMAT.slug) {
      url_params.delete("format");
    } else {
      url_params.set("format", format_key);
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [format_key]);

  const description = useMemo(
    () => `${format.name} · ${format.total_minutes} min · ${format.summary}`,
    [format],
  );

  return (
    <TimerPage
      key={format_key}
      strategy={multiStepStrategy}
      config={{ steps: format.steps }}
      label="Debate Timer"
      description={description}
      show_skip
      control_extra={<DebatePreviousButton />}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="debate-format"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Format
            </label>
            <select
              id="debate-format"
              value={format_key}
              onChange={(e) => set_format_key(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
            >
              {DEBATE_FORMAT_ORDER.map((slug) => (
                <option key={slug} value={slug}>
                  {DEBATE_FORMATS[slug].name}
                </option>
              ))}
            </select>
          </div>
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
          timer_name="Debate Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={DEBATE_HUB_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Free Debate Timer — Five Formats Pre-Loaded
          </h1>
          <p>
            A complete debate round timer with NSDA{" "}
            <Link href="/productivity/debate-timer/public-forum">Public Forum</Link>,{" "}
            <Link href="/productivity/debate-timer/lincoln-douglas">Lincoln-Douglas</Link>,{" "}
            <Link href="/productivity/debate-timer/policy">Policy</Link>, WSDC{" "}
            <Link href="/productivity/debate-timer/wsdc">World Schools</Link>,
            and{" "}
            <Link href="/productivity/debate-timer/british-parliamentary">
              British Parliamentary
            </Link>{" "}
            speech times pre-configured. Pick a format from the dropdown and the
            phase timer steps through the full round automatically. For state
            and invitational variants that deviate from standard times, the{" "}
            <Link href="/productivity/debate-timer/custom">custom builder</Link>{" "}
            produces a shareable URL.
          </p>

          <h2>The five built-in formats</h2>
          <ul>
            <li>
              <strong>
                <Link href="/productivity/debate-timer/public-forum">
                  Public Forum
                </Link>
              </strong>{" "}
              — 2-on-2 high-school format with three crossfires. 11 phases,
              35 minutes total. The most-used team format in U.S. high-school
              debate.
            </li>
            <li>
              <strong>
                <Link href="/productivity/debate-timer/lincoln-douglas">
                  Lincoln-Douglas
                </Link>
              </strong>{" "}
              — 1-on-1 value debate with two cross-examination periods. 32-minute
              round. Tests one debater&apos;s ability to construct and defend a
              moral framework.
            </li>
            <li>
              <strong>
                <Link href="/productivity/debate-timer/policy">Policy</Link>
              </strong>{" "}
              — 2-on-2 evidence-heavy debate, 64 minutes round time + 8 minutes
              of prep per side. The longest, most paper-heavy major U.S. format.
            </li>
            <li>
              <strong>
                <Link href="/productivity/debate-timer/wsdc">World Schools</Link>
              </strong>{" "}
              — 3-on-3 international high-school format with Points of
              Information allowed between minute 1:00 and 7:00 of each
              constructive. 56-minute round.
            </li>
            <li>
              <strong>
                <Link href="/productivity/debate-timer/british-parliamentary">
                  British Parliamentary
                </Link>
              </strong>{" "}
              — 4-team university format used by WUDC (World Universities). Eight
              7-minute speeches. POIs allowed minute 1:00 to 6:00.
            </li>
          </ul>

          <h2>How the round timer works</h2>
          <ol>
            <li>
              <strong>Pick a format</strong> from the dropdown above. The phase
              list updates immediately to the standard speech times for that
              format.
            </li>
            <li>
              <strong>Press Start</strong> when the first speaker is ready. The
              timer counts down the current speech. The phase label and step
              counter (e.g., &quot;1st Constructive (Pro) — 1/11&quot;) show what&apos;s
              active.
            </li>
            <li>
              <strong>Phases auto-advance</strong> at zero. An audio cue and a
              brief flash mark the transition. No clicking required between
              speeches.
            </li>
            <li>
              <strong>Use Previous and Next/Skip</strong> when needed. Previous
              rewinds one phase (use when you advanced by mistake or a speech
              needs replaying). Next/Skip advances early (use when a speaker
              yields back).
            </li>
            <li>
              <strong>Pause for prep time.</strong> Each side&apos;s prep clock
              is informational — pause the round timer while a team takes prep,
              resume when the next speech starts.
            </li>
          </ol>

          <h2>Projection mode and stoplight signaling</h2>
          <p>
            Press <strong>F</strong> to enter fullscreen mode. The countdown is
            readable from the back of a classroom at 1920×1080. The stoplight
            panel turns yellow in the last 60 seconds of each phase and red in
            the last 30 seconds — speakers see they need to wrap. At zero, the
            red bar flashes and an audio cue fires.
          </p>

          <h2>Why one tool for every format</h2>
          <p>
            Most existing debate timer software is locked to one format
            (Debatekeeper for LD/PF/Policy on Android; tournament-specific
            spreadsheets for WSDC). A coach running a mixed-format invitational
            ends up juggling three apps. The dropdown here covers the five
            common formats; the custom builder covers the rest with the same
            judge controls and stoplight signals.
          </p>

          <h2>For Toastmasters speakers</h2>
          <p>
            Toastmasters speeches use a green-yellow-red signal cycle distinct
            from debate phase transitions. See the{" "}
            <Link href="/productivity/toastmasters-timer">
              Toastmasters timer
            </Link>{" "}
            for the standard 4-5-6, 5-6-7, 1-1:30-2, and 2-2:30-3 signal
            patterns covering Ice Breaker, prepared speech, Table Topics, and
            evaluation.
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export function DebateHubTimer() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
