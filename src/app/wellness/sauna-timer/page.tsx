"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { SAUNA_TIMER_FAQ } from "./faq";

const SESSION_OPTIONS_MIN = [5, 10, 15, 20, 30];

const RELATED_TIMERS = [
  {
    name: "Cold Plunge Timer",
    href: "/wellness/cold-plunge-timer",
    description: "Free cold-plunge timer with research-backed default of 2-3 minutes",
  },
  {
    name: "11-Minute Cold Protocol Timer",
    href: "/wellness/contrast-therapy/11-minute-cold-protocol",
    description: "3 rounds of sauna and cold plunge, ending on cold — the canonical 15-2-1 sequence",
  },
  {
    name: "Contrast Therapy Timer",
    href: "/wellness/contrast-therapy",
    description: "Custom multi-phase sauna and cold-plunge sequencer",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Box breathing and 4-7-8 protocols for pre- and post-sauna decompression",
  },
];

function Content() {
  const params = useSearchParams();
  const requested = Number(params.get("duration"));
  const initial_minutes =
    SESSION_OPTIONS_MIN.includes(Math.round(requested / 60))
      ? Math.round(requested / 60)
      : 15;

  const [minutes, set_minutes] = useState(initial_minutes);

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (minutes === 15) {
      url_params.delete("duration");
    } else {
      url_params.set("duration", String(minutes * 60));
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [minutes]);

  return (
    <TimerPage
      key={minutes}
      strategy={countdownStrategy}
      config={{ duration: minutes * 60 }}
      label="Sauna Timer"
      description={`${minutes}-minute sauna round. Step out when the chime sounds and rehydrate before your next round.`}
      below={
        <div className="w-full max-w-md mx-auto flex items-center justify-between gap-3 mt-2 px-4">
          <label
            htmlFor="sauna-session-length"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Session length
          </label>
          <select
            id="sauna-session-length"
            value={minutes}
            onChange={(e) => set_minutes(Number(e.target.value))}
            className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
          >
            {SESSION_OPTIONS_MIN.map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Sauna Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={SAUNA_TIMER_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Sauna Timer
          </h1>
          <p>
            A free browser-based sauna timer for Finnish, infrared, and steam saunas. Pick
            a session length, press start, and the timer counts down with a clear audio
            cue when the round is over. The screen stays on for the duration of the round
            so a quick glance through the sauna door tells you exactly where you are.
            Nothing to install, no account, no advertising — just a session length and a
            chime.
          </p>

          <h2>How long should one sauna round be?</h2>
          <p>
            The most-cited Finnish protocol — and the one used in the long-running{" "}
            <a
              href="https://www.uef.fi/en"
              rel="noopener nofollow"
              target="_blank"
            >
              KIHD study from the University of Eastern Finland
            </a>{" "}
            — is built on rounds of 10 to 20 minutes at 80-90&deg;C, repeated 2 or 3
            times with cool-down breaks between. Fifteen minutes (this timer&apos;s
            default) sits squarely inside that window and is the per-round duration used
            in the canonical <Link href="/wellness/contrast-therapy/11-minute-cold-protocol">11-Minute
            Cold contrast-therapy protocol</Link>. Newcomers should start shorter — five to ten
            minutes — and build tolerance over a few weeks before extending rounds.
          </p>

          <h2>How this timer is calibrated for each sauna type</h2>
          <ul>
            <li>
              <strong>Finnish sauna (80-100&deg;C):</strong> 10-20 minute rounds, 2-3
              rounds per session. The default 15 minutes is a comfortable middle ground.
            </li>
            <li>
              <strong>Infrared cabin (50-65&deg;C):</strong> 25-45 minute sessions, often
              a single round. Set the timer to 30 minutes; the lower air temperature
              tolerates longer exposure without core overheating.
            </li>
            <li>
              <strong>Steam room (40-50&deg;C, near 100% humidity):</strong> 10-20 minute
              rounds. The saturated air feels hotter than a dry sauna at the same
              temperature, so most people prefer shorter rounds.
            </li>
            <li>
              <strong>Sauna blanket / portable sauna pod:</strong> 30-45 minute sessions.
              Set the timer for the full session length and rely on the audio cue to
              signal the end.
            </li>
          </ul>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Pick a session length</strong> — 15 minutes is the default. The
              dropdown offers 5, 10, 15, 20, and 30 minute presets.
            </li>
            <li>
              <strong>Tap the speaker icon</strong> to unlock the audio cue. Browsers
              require an explicit gesture before playing sound; one tap covers the rest
              of the session.
            </li>
            <li>
              <strong>Press start as you sit down on the bench.</strong> The countdown
              keeps running even if your phone&apos;s screen dims; the wake lock prevents
              it from sleeping entirely.
            </li>
            <li>
              <strong>Step out when the chime fires.</strong> Cool down for at least the
              duration of the round before going back in — a typical pattern is sauna 15
              minutes, cool 5-10 minutes, sauna 15 minutes again.
            </li>
            <li>
              <strong>Rehydrate between rounds.</strong> A 15-minute Finnish-style round
              can shed half a litre of sweat. Replace fluids and electrolytes between
              rounds, especially in summer or after exercise.
            </li>
          </ol>

          <h2>Sauna and cold-plunge contrast</h2>
          <p>
            The strongest claim sauna has on long-term cardiovascular and recovery
            benefit comes from <em>regular</em> use — four or more sessions per week.
            Pairing the sauna with a brief cold-plunge or cold-shower step (the{" "}
            <Link href="/wellness/contrast-therapy">contrast-therapy protocol</Link>) adds an
            acute hormonal stress response on top of the heat exposure. The two
            best-known structured versions are:
          </p>
          <ul>
            <li>
              <strong>11-Minute Cold Protocol</strong> — three rounds of sauna and cold
              plunge, ending on cold, built around the 11-minute weekly cold-exposure
              target from peer-reviewed cold-water immersion research. The{" "}
              <Link href="/wellness/contrast-therapy/11-minute-cold-protocol">11-Minute
              Cold Protocol Timer</Link> automates the full sequence.
            </li>
            <li>
              <strong>Wim Hof-style contrast</strong> — breath work, cold immersion,
              recovery, repeated. Less time in the sauna, more in the cold. See the{" "}
              <Link href="/wellness/contrast-therapy/wim-hof-style">Wim Hof-style timer</Link>.
            </li>
          </ul>

          <h2>Safety</h2>
          <p>
            Sauna is well-tolerated by most healthy adults, but a few caveats matter.
            Skip the sauna if you have uncontrolled high blood pressure, unstable angina,
            recent heart attack or stroke, severe aortic stenosis, or active acute illness.
            Avoid alcohol before or during sauna use — it dramatically increases the risk
            of arrhythmia and orthostatic hypotension. Hydrate aggressively. If you feel
            dizzy, nauseated, light-headed, or your heart starts pounding hard, step out
            immediately and cool down. Sauna is meant to feel hot and slightly intense,
            not unbearable.
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
