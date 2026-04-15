"use client";

import React, { Suspense, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { enlargerStrategy } from "@/lib/timer-strategies/enlarger";
import type { EnlargerMode } from "@/lib/timer-strategies/enlarger";

const MODES: { id: EnlargerMode; label: string; description: string }[] = [
  { id: "simple", label: "Simple", description: "Single timed exposure" },
  { id: "fstop", label: "F-Stop", description: "F-stop based exposure timing" },
  { id: "test_strip", label: "Test Strip", description: "Sequential test strip exposures" },
];

const ENLARGER_FAQ = [
  {
    question: "What is f-stop printing and why should I use it?",
    answer:
      "F-stop printing applies the same logarithmic scaling used in camera aperture settings to darkroom exposure times. Instead of adding or subtracting fixed seconds, you multiply or divide exposure time by a constant factor — typically 1/3 or 1/2 stop increments. A 1-stop increase <strong>doubles</strong> the exposure time. This produces <strong>perceptually even</strong> changes in print density because photographic paper responds logarithmically to light. A 2-second increase means very different things at a 5-second base vs. a 30-second base, but a 1/3-stop increase is always the same visible change.",
  },
  {
    question: "How do I make a test strip for darkroom printing?",
    answer:
      "Cut a strip of your printing paper that spans important tonal areas of the image (include both highlight and shadow regions). In <strong>additive mode</strong>, give each section an equal exposure time and progressively cover sections with cardboard. In <strong>f-stop mode</strong>, each strip receives a geometrically increasing exposure. After processing, evaluate the strip under proper viewing light and choose the strip where highlights show detail without being washed out and shadows are rich without blocking up.",
  },
  {
    question: "What is dry-down compensation?",
    answer:
      "Fiber-based photographic papers appear lighter when wet than when fully dried — a phenomenon called <strong>dry-down</strong>. A print that looks perfect in the wash will darken by 5-12% once dry, depending on the paper. This timer includes a dry-down compensation setting (default 8%) that reduces your exposure time proportionally so the dried print matches your wet-print evaluation. RC (resin-coated) papers exhibit minimal dry-down.",
  },
  {
    question: "What base exposure time should I start with?",
    answer:
      "For a typical 8x10 enlargement from a well-exposed 35mm negative at f/8 on the enlarger lens, 10-15 seconds is a common starting point. Dense negatives or large prints need more time; thin negatives or small prints need less. The exact time depends on your enlarger bulb, lens aperture, negative density, and paper speed. Always make a test strip first — guessing exposure wastes paper and chemistry.",
  },
  {
    question: "How do dodging and burning relate to the enlarger timer?",
    answer:
      "Dodging (holding back light from an area) and burning (adding extra light to an area) are exposure modifications applied during the main exposure or as separate timed exposures. Use the f-stop system to calculate burn times: if an area needs +1 stop of burning, give it an additional exposure equal to your base time. For -1 stop of dodging, shade that area for half the base exposure. This timer helps you track precise increments for repeatable printing.",
  },
];

const RELATED_TIMERS = [
  { name: "Film Development Timer", href: "/photography/film-development", description: "Multi-step sequential timer for B&W, C-41, and E-6 processing" },
  { name: "Stand Development Timer", href: "/photography/stand-development", description: "Ambient countdown timer for stand and semi-stand development" },
  { name: "Cyanotype Timer", href: "/photography/cyanotype", description: "UV exposure countdown for cyanotype and alternative process printing" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Long Exposure Calculator", href: "/photography/long-exposure-calculator", description: "Reciprocity failure calculator for long film exposures" },
];

const seo_content_block = (
  <TimerSeoContent
    timer_name="Enlarger Timer"
    category_name="Photography"
    category_slug="photography"
    faq={ENLARGER_FAQ}
    related_timers={RELATED_TIMERS}
  >
    <h2>What Is a Darkroom Enlarger Timer?</h2>
    <p>
      An enlarger timer controls the duration of light projected through a negative onto photographic
      paper in a darkroom. Precise, repeatable exposure timing is the foundation of consistent
      black-and-white and color printing. This free digital enlarger timer offers three modes —
      simple timed exposure, f-stop based timing, and sequential test strips — replacing the
      mechanical GraLab and foot-switch timers found in traditional darkrooms.
    </p>
    <p>
      Whether you are making your first contact sheet or fine-tuning a gallery print with complex
      dodge-and-burn sequences, accurate exposure control eliminates guesswork and reduces paper waste.
      Set your base time, choose your mode, and let the timer handle the counting while you focus
      on the craft of printing.
    </p>

    <h2>F-Stop Printing Explained</h2>
    <p>
      Traditional darkroom timers count in linear seconds, but photographic paper responds
      logarithmically to light. Adding 2 seconds to a 5-second exposure is a massive 40% increase,
      while adding 2 seconds to a 25-second exposure is a barely visible 8% change. F-stop printing
      solves this inconsistency by using geometric (doubling/halving) increments that produce
      <strong>perceptually uniform</strong> steps across the entire exposure range.
    </p>
    <p>
      In f-stop mode, each increment is a fraction of a stop — 1/3 stop, 1/2 stop, or 1 full stop.
      A 1/3 stop increase multiplies the exposure by approximately 1.26x. A full stop doubles it.
      This scaling means a 1/3-stop adjustment looks the same whether your base exposure is 4 seconds
      or 40 seconds, making exposure decisions intuitive and repeatable.
    </p>

    <h2>Making Test Strips with F-Stop Timing</h2>
    <p>
      The test strip mode in this timer automates the sequential exposure process used to determine
      optimal print exposure. Instead of additive strips (where each section accumulates all previous
      exposure), f-stop test strips give each section a geometrically increasing total exposure:
    </p>
    <ol>
      <li><strong>Set your base time</strong> — Start with an estimated exposure (10 seconds is a common default for 35mm negatives at f/8).</li>
      <li><strong>Choose your increment</strong> — 1/3 stop gives fine control for final prints; 1/2 or 1 full stop gives a wider range for initial tests.</li>
      <li><strong>Set the strip count</strong> — 5-7 strips covers a useful range. The timer calculates the exposure for each strip automatically.</li>
      <li><strong>Expose and evaluate</strong> — Process the strip normally, then examine it under proper viewing light. The strip with the best highlight-shadow balance indicates your target exposure.</li>
    </ol>

    <h2>Dry-Down Compensation</h2>
    <p>
      Fiber-based silver gelatin papers darken as they dry — a phenomenon that catches many printers
      off guard. A wet print that looks perfect in the wash can appear noticeably too dark once it
      has dried on a screen or in a heated dryer. The typical dry-down shift is 5-12%, depending on
      paper brand and surface finish. Glossy papers tend to show more dry-down than matte.
    </p>
    <p>
      This timer includes a configurable dry-down compensation percentage (default 8%) that
      automatically reduces your calculated exposure to account for the darkening. Enable it when
      printing on fiber paper; disable it for RC (resin-coated) papers, which exhibit minimal dry-down.
    </p>

    <h2>Dodging and Burning with Precise Timing</h2>
    <ul>
      <li><strong>Dodging (holding back light)</strong> — Use a card or wire-mounted mask to shade areas that print too dark. Calculate dodge time as a fraction of base exposure in f-stop terms: -1/3 stop means shading for about 20% of the exposure time.</li>
      <li><strong>Burning (adding extra light)</strong> — After the main exposure, give additional time to areas that need more density. +1 stop of burning doubles the exposure in that area. Use your hands or a card with a hole to direct light.</li>
      <li><strong>Keep records</strong> — Note your base exposure, dodge times, and burn times in f-stop increments. This makes it easy to reproduce a print or make controlled adjustments. Pair this timer with our <a href="/photography/film-development">film development timer</a> to maintain precision across your entire darkroom workflow.</li>
    </ul>
  </TimerSeoContent>
);

function EnlargerSetup({ on_start }: { on_start: (config: Record<string, unknown>) => void }) {
  const [mode, set_mode] = useState<EnlargerMode>("simple");
  const [base_time, set_base_time] = useState(10);
  const [fstop_increment, set_fstop_increment] = useState(0.333);
  const [strips, set_strips] = useState(5);
  const [dry_down, set_dry_down] = useState(false);
  const [dry_down_percent, set_dry_down_percent] = useState(8);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-4">
      {/* Mode selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Mode</label>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => set_mode(m.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                mode === m.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {MODES.find((m) => m.id === mode)?.description}
        </p>
      </div>

      {/* Base time */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
          Base Exposure Time (seconds)
        </label>
        <input
          type="number"
          min={1}
          step={0.5}
          value={base_time}
          onChange={(e) => set_base_time(Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>

      {/* F-Stop increment (for fstop and test strip modes) */}
      {(mode === "fstop" || mode === "test_strip") && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
            F-Stop Increment
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "1/3 stop", value: 0.333 },
              { label: "1/2 stop", value: 0.5 },
              { label: "1 stop", value: 1 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => set_fstop_increment(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  fstop_increment === opt.value
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Strip count (test strip mode) */}
      {mode === "test_strip" && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
            Number of Strips
          </label>
          <input
            type="number"
            min={2}
            max={10}
            value={strips}
            onChange={(e) => set_strips(Number(e.target.value))}
            className="w-24 px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
          />
        </div>
      )}

      {/* Dry-down compensation */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={dry_down}
          onChange={(e) => set_dry_down(e.target.checked)}
          className="w-4 h-4 rounded accent-secondary"
        />
        <span className="text-sm text-foreground">Dry-down compensation ({dry_down_percent}%)</span>
      </label>

      {dry_down && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
            Dry-down Percentage
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={dry_down_percent}
            onChange={(e) => set_dry_down_percent(Number(e.target.value))}
            className="w-24 px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
          />
        </div>
      )}

      {/* Start button */}
      <button
        onClick={() =>
          on_start({
            mode,
            base_time,
            fstop_increment,
            strips,
            dry_down,
            dry_down_percent,
          })
        }
        className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl text-lg font-semibold hover:bg-secondary/90 transition-colors"
      >
        Start Exposure
      </button>
    </div>
  );
}

function EnlargerTimerContent() {
  const [config, set_config] = useState<Record<string, unknown> | null>(null);

  if (!config) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
          <h1 className="font-headline font-black text-2xl md:text-3xl text-center text-foreground mt-8 mb-2">
            Enlarger Timer
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Precision darkroom exposure timer with f-stop and test strip modes
          </p>
          <EnlargerSetup on_start={set_config} />
        </main>
        {seo_content_block}
        <Footer />
      </>
    );
  }

  return (
    <TimerPage
      strategy={enlargerStrategy}
      config={config}
      label="Enlarger Timer"
      description="Precision darkroom exposure timer"
      show_skip={config.mode === "test_strip"}
      on_configure={() => set_config(null)}
      seo_content={seo_content_block}
    />
  );
}

export default function Page() {
  return (
    <Suspense>
      <EnlargerTimerContent />
    </Suspense>
  );
}
