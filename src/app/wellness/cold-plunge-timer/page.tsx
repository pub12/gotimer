"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { COLD_PLUNGE_FAQ } from "./faq";

const PLUNGE_OPTIONS_SEC = [30, 60, 120, 180, 300];

function format_option(sec: number): string {
  if (sec < 60) return `${sec} seconds`;
  return `${sec / 60} ${sec === 60 ? "minute" : "minutes"}`;
}

const RELATED_TIMERS = [
  {
    name: "Sauna Timer",
    href: "/wellness/sauna-timer",
    description: "Free sauna timer with adjustable session length — pairs with cold plunge for contrast therapy",
  },
  {
    name: "Søberg Protocol Timer",
    href: "/wellness/contrast-therapy/soberg-protocol",
    description: "3 rounds of sauna and cold plunge, ending on cold — the Søberg sequence",
  },
  {
    name: "Wim Hof-style Timer",
    href: "/wellness/contrast-therapy/wim-hof-style",
    description: "Breath work, cold immersion, recovery — repeated for 3 rounds",
  },
  {
    name: "Breathing Timer",
    href: "/wellness/breathing",
    description: "Wim Hof, box breathing, and 4-7-8 protocols for pre-plunge preparation",
  },
];

function Content() {
  const params = useSearchParams();
  const requested = Number(params.get("duration"));
  const initial =
    PLUNGE_OPTIONS_SEC.includes(requested) ? requested : 120;

  const [duration, set_duration] = useState(initial);

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    if (duration === 120) {
      url_params.delete("duration");
    } else {
      url_params.set("duration", String(duration));
    }
    const next = url_params.toString();
    const path = window.location.pathname + (next ? `?${next}` : "");
    window.history.replaceState(null, "", path);
  }, [duration]);

  return (
    <TimerPage
      key={duration}
      strategy={countdownStrategy}
      config={{ duration }}
      label="Cold Plunge Timer"
      description={`${format_option(duration)} of cold-water immersion. Exhale slowly through pursed lips for the first 15-30 seconds.`}
      below={
        <div className="w-full max-w-md mx-auto flex items-center justify-between gap-3 mt-2 px-4">
          <label
            htmlFor="cold-plunge-length"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Plunge length
          </label>
          <select
            id="cold-plunge-length"
            value={duration}
            onChange={(e) => set_duration(Number(e.target.value))}
            className="px-3 py-1.5 bg-surface-container-low rounded-lg text-foreground text-sm outline-none cursor-pointer"
          >
            {PLUNGE_OPTIONS_SEC.map((s) => (
              <option key={s} value={s}>
                {format_option(s)}
              </option>
            ))}
          </select>
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Cold Plunge Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={COLD_PLUNGE_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Cold Plunge Timer
          </h1>
          <p>
            A free browser-based cold plunge timer for ice baths, cold-water swims, and
            home cold-plunge tanks. The 2-minute default is taken straight from the{" "}
            <Link href="/wellness/contrast-therapy/soberg-protocol">Søberg protocol</Link> —
            the most-cited contrast-therapy sequence in current biohacking literature.
            Adjustable from 30 seconds (a starter dose) to 5 minutes (the practical
            upper bound for most home setups at 4-12&deg;C).
          </p>

          <h2>How long is the right cold plunge?</h2>
          <p>
            The largest body of practical guidance comes from Dr. Susanna Søberg, whose
            2021 work on contrast therapy and brown adipose tissue activation set a
            useful weekly target: about <strong>11 minutes of total cold exposure per
            week</strong>, split into 2-4 sessions. At a typical plunge length of 2-3
            minutes that works out to four short rounds per week — sustainable, safe
            for healthy adults, and enough to drive measurable adaptation.
          </p>
          <p>
            For an individual session, most protocols settle in a <strong>30-second to
            3-minute window</strong>. Beginners should start at 30-60 seconds; trained
            cold-plungers extend to 2-3 minutes. Beyond 5 minutes the benefits plateau
            and the recovery cost (especially afterdrop hypothermia) grows quickly.
          </p>

          <h2>Cold water temperature: what actually works</h2>
          <ul>
            <li>
              <strong>10-15&deg;C (50-59&deg;F)</strong> — the &quot;research-relevant&quot;
              cold-immersion zone. Strong autonomic response, manageable for trained
              individuals, sustainable.
            </li>
            <li>
              <strong>4-10&deg;C (39-50&deg;F)</strong> — &quot;ice bath&quot; territory.
              Shorter rounds (60-120 seconds), more dramatic noradrenaline spike, faster
              afterdrop.
            </li>
            <li>
              <strong>15-20&deg;C (59-68&deg;F)</strong> — &quot;cool&quot; rather than
              cold. The stress response is weaker but still measurable; a reasonable
              entry point for people without a chilled plunge tank.
            </li>
            <li>
              <strong>Cold shower at home</strong> — usually 12-18&deg;C from mains in
              winter, 20-22&deg;C in summer. Useful for adaptation when no plunge tank is
              available; shorter rounds are fine.
            </li>
          </ul>

          <h2>How to use this timer</h2>
          <ol>
            <li>
              <strong>Pick a duration</strong> — 2 minutes is the default. Start at 30
              or 60 seconds if you are new to deliberate cold exposure.
            </li>
            <li>
              <strong>Tap the speaker icon to enable audio</strong> — the chime tells
              you when to step out without checking the screen.
            </li>
            <li>
              <strong>Exhale slowly for the first 15-30 seconds</strong> — through
              pursed lips. This blocks the involuntary cold-shock gasp reflex and brings
              the parasympathetic nervous system back online.
            </li>
            <li>
              <strong>Breathe slowly through your nose</strong> once the initial shock
              passes. Keep your face out of the water; never hold your breath underwater
              in cold immersion.
            </li>
            <li>
              <strong>Step out when the chime fires.</strong> Towel off and let your body
              warm up through shivering for 5-10 minutes — do not jump straight into a
              hot shower; afterdrop continues for several minutes and a sudden warm
              stimulus can cause arrhythmia in susceptible people.
            </li>
          </ol>

          <h2>Pairing cold plunge with sauna</h2>
          <p>
            Cold plunge alone is effective. Combining it with a sauna round
            (&quot;contrast therapy&quot;) amplifies the autonomic response and is the
            structure used in the published Søberg protocol. Two common sequences:
          </p>
          <ul>
            <li>
              <strong>Søberg sequence</strong> — 15 minutes sauna &rarr; 2 minutes cold
              &rarr; 1 minute rest, repeated 3 times, ending on cold. Automated by the{" "}
              <Link href="/wellness/contrast-therapy/soberg-protocol">Søberg Protocol
              Timer</Link>.
            </li>
            <li>
              <strong>Wim Hof-style</strong> — 3 minutes breath work &rarr; 2 minutes
              cold &rarr; 90 seconds recovery, repeated 3 times. Automated by the{" "}
              <Link href="/wellness/contrast-therapy/wim-hof-style">Wim Hof-style timer</Link>.
            </li>
          </ul>

          <h2>Safety</h2>
          <p>
            Cold-water immersion has real risks. <strong>Do not cold plunge
            alone</strong> if you are new to it. Avoid cold immersion if you have
            uncontrolled hypertension, recent heart attack or stroke, unstable angina,
            severe Raynaud&apos;s syndrome, or are pregnant. The cold-shock gasp reflex
            can cause aspiration if your face is in the water; keep your head above the
            surface. Afterdrop — your core temperature continuing to fall after exit —
            is normal; shivering for 5-10 minutes after a 2-minute plunge is helpful and
            expected. If you remain shivering uncontrollably after 15 minutes, warm up
            actively with a hot drink and warm dry clothing.
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
