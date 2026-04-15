"use client";

import React, { Suspense, useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import {
  FILM_STOCKS,
  calculate_reciprocity,
  apply_nd_filter,
  group_by_manufacturer,
} from "@/lib/timer-configs/exposure-data";

const METERED_PRESETS = [1, 2, 4, 8, 15, 30, 60];
const ND_OPTIONS = [
  { label: "None", stops: 0 },
  { label: "ND2 (1 stop)", stops: 1 },
  { label: "ND4 (2 stops)", stops: 2 },
  { label: "ND8 (3 stops)", stops: 3 },
  { label: "ND64 (6 stops)", stops: 6 },
  { label: "ND1000 (10 stops)", stops: 10 },
];

const LONG_EXPOSURE_FAQ = [
  {
    question: "What is reciprocity failure in film photography?",
    answer:
      "Reciprocity failure (also called reciprocity departure) is a property of photographic film where the relationship between exposure intensity and exposure duration stops being linear beyond a threshold — typically around 1-2 seconds. Below this threshold, halving the light and doubling the time gives identical results. Above it, the film&apos;s sensitivity <strong>decreases</strong> with longer exposures, requiring progressively more additional time to achieve proper density. A metered 10-second exposure might actually need 25 seconds on Ilford HP5+, or 50 seconds on Fuji Acros depending on each emulsion&apos;s reciprocity characteristics.",
  },
  {
    question: "How do I use this long exposure calculator?",
    answer:
      "Select your film stock from the dropdown (grouped by manufacturer), enter the exposure time your light meter reads, and optionally select an ND filter strength. The calculator applies the film&apos;s reciprocity correction formula and displays the adjusted exposure time. When you are ready, press the start button to launch a countdown timer set to the corrected duration. The calculation happens instantly as you change inputs.",
  },
  {
    question: "Which film stocks have the least reciprocity failure?",
    answer:
      "Fuji Neopan Acros 100 (and Acros II) is legendary for minimal reciprocity failure — it needs no correction up to 120 seconds. Ilford Delta 3200 and Kodak T-Max 100 also perform well at long exposures. Traditional cubic-grain films like Kodak Tri-X and Ilford HP5+ exhibit more pronounced failure and need significant correction beyond 1-2 seconds. T-grain (tabular grain) technology generally outperforms conventional emulsions in reciprocity behavior.",
  },
  {
    question: "Do ND filters affect reciprocity failure?",
    answer:
      "ND filters do not cause reciprocity failure themselves, but they extend the exposure time into the range where reciprocity failure becomes significant. A scene metering at 1/4 second without a filter might meter at 4 minutes with an ND1000 (10-stop) filter — well into reciprocity territory. This calculator accounts for ND filter extension <strong>before</strong> applying reciprocity correction, giving you the true total exposure time needed.",
  },
  {
    question: "Can I use this calculator for digital long exposures?",
    answer:
      "Digital sensors do not suffer from reciprocity failure — they maintain linear response across all exposure durations. However, you can still use this tool&apos;s ND filter calculation and built-in countdown timer for digital long exposure photography. Simply select any film stock and ignore the reciprocity correction, or use the metered time directly with our <a href='/countdown'>countdown timer</a>.",
  },
];

const RELATED_TIMERS = [
  { name: "Film Development Timer", href: "/photography/film-development", description: "Multi-step sequential timer for B&W, C-41, and E-6 processing" },
  { name: "Stand Development Timer", href: "/photography/stand-development", description: "Ambient countdown for stand and semi-stand development" },
  { name: "Cyanotype Timer", href: "/photography/cyanotype", description: "UV exposure countdown for cyanotype and alternative process printing" },
  { name: "Photo Walk Timer", href: "/photography/photo-walk", description: "Timed photography challenges with shoot and review intervals" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
];

function format_exposure(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m} min`;
}

const seo_content_block = (
  <TimerSeoContent
    timer_name="Long Exposure Calculator"
    category_name="Photography"
    category_slug="photography"
    faq={LONG_EXPOSURE_FAQ}
    related_timers={RELATED_TIMERS}
  >
    <h2>What Is Reciprocity Failure?</h2>
    <p>
      The reciprocity law states that exposure equals intensity multiplied by time — halve the light,
      double the time, and you get the same result. This holds true for most everyday exposures, but
      film emulsions break this reciprocal relationship during long exposures. Beyond a threshold
      (typically 1-4 seconds depending on the emulsion), silver halide crystals lose efficiency at
      capturing photons. The film effectively becomes slower the longer it is exposed, requiring
      additional time beyond what a light meter indicates.
    </p>
    <p>
      This free long exposure calculator applies published reciprocity correction formulas for over
      30 film stocks from Kodak, Ilford, Fuji, Foma, and other manufacturers. Enter your metered
      exposure, select your film, and the calculator shows exactly how much additional time you need.
      When you are ready, start the integrated countdown timer to time your corrected exposure in the field.
    </p>

    <h2>Why Different Films Need Different Corrections</h2>
    <p>
      Reciprocity characteristics depend on the physical structure of the silver halide crystals
      in the emulsion. Two broad categories exist:
    </p>
    <ul>
      <li><strong>Conventional cubic-grain films</strong> (Tri-X, HP5+, FP4+, Pan F+) — These classic emulsions use randomly shaped silver halide crystals. They exhibit noticeable reciprocity failure starting around 1 second, with correction factors that escalate rapidly. A metered 30-second exposure on Tri-X may need 2-3 minutes of actual exposure time.</li>
      <li><strong>Tabular-grain (T-grain) films</strong> (T-Max, Delta, Acros) — These modern emulsions use flat, tablet-shaped crystals with higher surface area. They maintain near-linear response much longer. Fuji Acros is exceptional, needing no correction below 120 seconds. T-Max 100 holds well to about 10 seconds before correction becomes necessary.</li>
    </ul>

    <h2>Using ND Filters with Long Exposures</h2>
    <p>
      Neutral density filters reduce the light entering your lens by a specified number of stops,
      extending your shutter speed proportionally. An ND1000 (10-stop) filter turns a 1/125s exposure
      into an 8-second exposure — firmly in reciprocity territory for most films. This calculator
      applies ND filter extension first, then calculates reciprocity correction on the extended time.
    </p>
    <ul>
      <li><strong>ND8 (3 stops)</strong> — Useful for blurring water in daylight. Extends a 1/30s exposure to about 1/4 second — usually no reciprocity correction needed.</li>
      <li><strong>ND64 (6 stops)</strong> — Smooths ocean waves and removes pedestrians from architecture shots. A 1/4s metered exposure becomes 16 seconds — reciprocity correction is essential for most films.</li>
      <li><strong>ND1000 (10 stops)</strong> — Creates ethereal, surreal motion blur. Even a fast 1/125s base exposure becomes 8 seconds; slower base exposures can push corrected times into several minutes.</li>
    </ul>

    <h2>How to Use This Calculator in the Field</h2>
    <ol>
      <li><strong>Meter without the ND filter</strong> — Take a light meter reading (or use your camera&apos;s meter) at your desired aperture without any ND filter attached.</li>
      <li><strong>Select your film stock</strong> — Choose the emulsion you are shooting from the grouped dropdown. If your exact film is not listed, select a similar emulsion from the same manufacturer.</li>
      <li><strong>Enter the metered time</strong> — Use the preset buttons for common durations or type a custom value in seconds.</li>
      <li><strong>Add your ND filter</strong> — Select the filter density. The calculator extends the metered time by the appropriate number of stops, then applies reciprocity correction.</li>
      <li><strong>Start the timer</strong> — Press the start button to launch a countdown set to the corrected exposure time. Open the shutter on Bulb and close it when the timer sounds.</li>
    </ol>

    <h2>Common Film Stocks and Reciprocity Behavior</h2>
    <ul>
      <li><strong>Fuji Acros 100 / Acros II</strong> — No correction needed below 120 seconds. The gold standard for long exposure film work.</li>
      <li><strong>Kodak T-Max 100</strong> — Minimal correction to about 10 seconds. Moderate correction beyond that. Excellent resolving power for landscape work.</li>
      <li><strong>Ilford Delta 100</strong> — Similar to T-Max 100 in reciprocity behavior. Good choice for European photographers.</li>
      <li><strong>Kodak Tri-X 400</strong> — Significant correction above 1 second. A 10-second metered exposure needs approximately 35-50 seconds. Still a favorite for its distinctive grain and tonal character.</li>
      <li><strong>Ilford HP5+ 400</strong> — Comparable to Tri-X in reciprocity characteristics. Slightly more forgiving in some published tests. Develop your long exposures with our <a href="/photography/film-development">film development timer</a> for consistent results.</li>
    </ul>
  </TimerSeoContent>
);

function LongExposureContent() {
  const [film_idx, set_film_idx] = useState(0);
  const [metered, set_metered] = useState(4);
  const [custom_metered, set_custom_metered] = useState("");
  const [nd_stops, set_nd_stops] = useState(0);
  const [timer_started, set_timer_started] = useState(false);

  const grouped = useMemo(() => group_by_manufacturer(), []);
  const film = FILM_STOCKS[film_idx];

  const effective_metered = nd_stops > 0 ? apply_nd_filter(metered, nd_stops) : metered;
  const result = useMemo(() => calculate_reciprocity(effective_metered, film), [effective_metered, film]);

  if (timer_started) {
    return (
      <TimerPage
        strategy={countdownStrategy}
        config={{ duration: Math.round(result.corrected_seconds) }}
        label="Long Exposure Timer"
        description={`${film.name} — ${format_exposure(result.corrected_seconds)} corrected exposure`}
        on_configure={() => set_timer_started(false)}
        seo_content={seo_content_block}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <div className="w-full max-w-md mx-auto space-y-6 mt-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground">
            <span className="uppercase tracking-wide">Photography</span> &gt; <span className="uppercase tracking-wide">Long Exposure</span>
          </nav>

          <h1 className="font-headline font-black text-2xl md:text-3xl text-foreground">
            Long Exposure Calculator
          </h1>

          {/* Film stock selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
              Film Stock &amp; Reciprocity
            </label>
            <select
              value={film_idx}
              onChange={(e) => set_film_idx(Number(e.target.value))}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
            >
              {Object.entries(grouped).map(([mfr, films]) => (
                <optgroup key={mfr} label={mfr}>
                  {films.map((f) => {
                    const idx = FILM_STOCKS.indexOf(f);
                    return (
                      <option key={idx} value={idx}>
                        {f.name}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
            {film.notes && <p className="text-xs text-muted-foreground mt-1">{film.notes}</p>}
          </div>

          {/* Metered exposure */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
              Metered Exposure
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {METERED_PRESETS.map((t) => (
                <button
                  key={t}
                  onClick={() => { set_metered(t); set_custom_metered(""); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    metered === t && !custom_metered
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                  }`}
                >
                  {t >= 60 ? `${t / 60}m` : `${t}s`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={custom_metered || metered}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v > 0) { set_metered(v); set_custom_metered(e.target.value); }
                }}
                className="w-24 px-4 py-3 bg-surface-container-low rounded-xl text-2xl font-headline font-black text-foreground outline-none text-center"
              />
              <span className="text-lg font-semibold text-muted-foreground">SECONDS</span>
            </div>
          </div>

          {/* ND Filter */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
              ND Filter
            </label>
            <select
              value={nd_stops}
              onChange={(e) => set_nd_stops(Number(e.target.value))}
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none"
            >
              {ND_OPTIONS.map((nd) => (
                <option key={nd.stops} value={nd.stops}>{nd.label}</option>
              ))}
            </select>
          </div>

          {/* Result card */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 space-y-3">
            <p className="text-xs uppercase tracking-wide text-primary-foreground/60">Corrected Exposure</p>
            <p className="text-4xl font-headline font-black text-secondary">
              {format_exposure(result.corrected_seconds)}
            </p>
            <p className="text-sm text-primary-foreground/60">
              +{result.correction_stops} stops reciprocity compensation
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/70 pt-2">
              <div>
                <span className="text-xs uppercase tracking-wide block">Metered</span>
                <span className="font-semibold">{format_exposure(metered)}</span>
              </div>
              <span className="text-primary-foreground/30">&rarr;</span>
              <div>
                <span className="text-xs uppercase tracking-wide block">Corrected</span>
                <span className="font-semibold">{format_exposure(result.corrected_seconds)}</span>
              </div>
            </div>
          </div>

          {/* Start timer button */}
          <button
            onClick={() => set_timer_started(true)}
            className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl text-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
          >
            Start {format_exposure(result.corrected_seconds)} Timer
          </button>
        </div>
      </main>
      {seo_content_block}
      <Footer />
    </>
  );
}

export default function LongExposurePage() {
  return (
    <Suspense>
      <LongExposureContent />
    </Suspense>
  );
}
