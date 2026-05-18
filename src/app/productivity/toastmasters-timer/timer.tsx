"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import { Stoplight } from "@/components/timer/plugins/stoplight";
import {
  TOASTMASTERS_PRESETS,
  DEFAULT_TOASTMASTERS_PRESET,
  TOASTMASTERS_PRESET_ORDER,
  format_mmss,
} from "@/lib/toastmasters-presets";
import { TOASTMASTERS_HUB_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Ice Breaker Timer",
    href: "/productivity/toastmasters-timer/ice-breaker",
    description: "4-5-6 minute signal cycle for Pathways Level 1 Project 1",
  },
  {
    name: "Prepared Speech Timer",
    href: "/productivity/toastmasters-timer/prepared-speech",
    description: "5-6-7 cycle — standard 7-minute speech",
  },
  {
    name: "Table Topics Timer",
    href: "/productivity/toastmasters-timer/table-topics",
    description: "1:00 / 1:30 / 2:00 — impromptu speech timer",
  },
  {
    name: "Evaluation Timer",
    href: "/productivity/toastmasters-timer/evaluation",
    description: "2:00 / 2:30 / 3:00 — for speech evaluators",
  },
  {
    name: "Debate Timer",
    href: "/productivity/debate-timer",
    description: "PF, LD, Policy, WSDC, Parli round timers",
  },
  {
    name: "Presentation Timer",
    href: "/productivity/presentation",
    description: "Generic talk and meeting countdown",
  },
];

function Content() {
  const params = useSearchParams();
  const requested = params.get("speech") ?? "";
  const initial_key =
    requested && TOASTMASTERS_PRESETS[requested]
      ? requested
      : DEFAULT_TOASTMASTERS_PRESET.slug;

  const [preset_key, set_preset_key] = useState(initial_key);
  const preset = TOASTMASTERS_PRESETS[preset_key] ?? DEFAULT_TOASTMASTERS_PRESET;

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (preset_key === DEFAULT_TOASTMASTERS_PRESET.slug) {
      url_params.delete("speech");
    } else {
      url_params.set("speech", preset_key);
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [preset_key]);

  const description = useMemo(
    () =>
      `${preset.name} · ${preset.tagline}`,
    [preset],
  );

  return (
    <TimerPage
      key={preset_key}
      strategy={multiStepStrategy}
      config={{ steps: preset.steps }}
      label="Toastmasters Timer"
      description={description}
      below={
        <div className="w-full max-w-md mx-auto space-y-3 mt-2 px-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="speech-type"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Speech type
            </label>
            <select
              id="speech-type"
              value={preset_key}
              onChange={(e) => set_preset_key(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
            >
              {TOASTMASTERS_PRESET_ORDER.map((slug) => (
                <option key={slug} value={slug}>
                  {TOASTMASTERS_PRESETS[slug].name}
                </option>
              ))}
            </select>
          </div>
          <Stoplight
            mode="toastmasters"
            signal_colors={preset.signal_colors}
            caption={`Green ${format_mmss(preset.green_seconds)} · yellow ${format_mmss(preset.yellow_seconds)} · red ${format_mmss(preset.red_seconds)}`}
          />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Toastmasters Timer"
          category_name="Productivity"
          category_slug="productivity"
          faq={TOASTMASTERS_HUB_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Free Toastmasters Timer — Green/Yellow/Red Signal Lights
          </h1>
          <p>
            A free speech timer with the four standard Toastmasters signal
            cycles pre-loaded. Pick a speech type from the dropdown and the
            green, yellow, and red lights fire automatically at the correct
            milestones — projectable for club meetings or held on a phone by
            the Timer role.
          </p>

          <h2>The four Toastmasters speech presets</h2>
          <ul>
            <li>
              <strong>
                <Link href="/productivity/toastmasters-timer/ice-breaker">
                  Ice Breaker — 4-5-6 minutes
                </Link>
              </strong>{" "}
              — Pathways Level 1 Project 1. Green at 4:00, yellow at 5:00, red
              at 6:00. Most new members&apos; first speech.
            </li>
            <li>
              <strong>
                <Link href="/productivity/toastmasters-timer/prepared-speech">
                  Prepared speech — 5-6-7 minutes
                </Link>
              </strong>{" "}
              — The classic 5-6-7 cycle for most Pathways prepared-speech
              projects. Green at 5:00, yellow at 6:00, red at 7:00.
            </li>
            <li>
              <strong>
                <Link href="/productivity/toastmasters-timer/table-topics">
                  Table Topics — 1:00 to 2:00
                </Link>
              </strong>{" "}
              — Impromptu speech format. Green at 1:00, yellow at 1:30, red at
              2:00. Standard at clubs and Table Topics contests.
            </li>
            <li>
              <strong>
                <Link href="/productivity/toastmasters-timer/evaluation">
                  Evaluation — 2:00 to 3:00
                </Link>
              </strong>{" "}
              — For speech evaluators. Green at 2:00, yellow at 2:30, red at
              3:00. Half the speaking time of the speech being evaluated.
            </li>
          </ul>

          <h2>How the signal cycle works</h2>
          <ol>
            <li>
              <strong>Press Start</strong> when the speaker walks to the
              lectern. The timer counts up internally — the visible display
              shows the time until the next signal change.
            </li>
            <li>
              <strong>Green light at the minimum.</strong> The green bar
              illuminates when the speaker hits the qualifying floor. From this
              moment on, the speech is valid in contest scoring.
            </li>
            <li>
              <strong>Yellow light — wrap up soon.</strong> Yellow replaces
              green. The speaker should be heading toward their close.
            </li>
            <li>
              <strong>Red light — conclude immediately.</strong> Red replaces
              yellow. A speaker who continues past the 30-second grace window
              is disqualified in contest play.
            </li>
            <li>
              <strong>Report the time.</strong> At club meetings the Timer
              announces the exact speaking time. At contests the Timer marks
              qualifying / non-qualifying status on the official ballot.
            </li>
          </ol>

          <h2>For the Timer role at a club meeting</h2>
          <p>
            The Timer role keeps the meeting flowing and reports each speaker&apos;s
            time during the role-call. The traditional setup is a physical
            timer box with green/yellow/red bulbs operated manually; this page
            replaces the box for clubs that meet online (Zoom screen-share works
            cleanly with the colour bars) or that don&apos;t have a physical timer
            available. The Wake Lock API keeps the screen on through the speech
            — no need to nudge a sleeping iPad.
          </p>

          <h2>For contest officiating</h2>
          <p>
            For Area, Division, District, and International speech contests,
            consult the current Toastmasters International Speech Contest
            Rulebook on toastmasters.org — it is the authoritative source on
            qualifying times, the grace window, and disqualification rules.
            This timer mirrors current published Pathways guidance but rules
            can change between years.
          </p>

          <h2>Related — debate timers</h2>
          <p>
            For competitive debate, see the sibling{" "}
            <Link href="/productivity/debate-timer">debate timer</Link>{" "}
            which covers NSDA Public Forum, Lincoln-Douglas, Policy, World
            Schools (WSDC), and British Parliamentary formats with auto-advancing
            multi-phase rounds.
          </p>
        </TimerSeoContent>
      }
    />
  );
}

export function ToastmastersHubTimer() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
