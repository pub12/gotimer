"use client";

import React, { Suspense, useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TimerProvider, useTimer } from "@/components/timer/timer-provider";
import { TimerShellV2 } from "@/components/timer/timer-shell-v2";
import { TimerDisplay, format_time } from "@/components/timer/timer-display";
import { TimerControls } from "@/components/timer/timer-controls";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { multiStepStrategy } from "@/lib/timer-strategies/multi-step";
import {
  FILM_DEV_PROCESSES,
  FILM_RECIPES,
  PUSH_PULL_MULTIPLIERS,
  adjust_for_temperature,
} from "@/lib/timer-configs/film-dev";
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

const FILM_DEV_FAQ = [
  {
    question: "Why is precise timing important in film development?",
    answer:
      "Film development is a chemical reaction where silver halide crystals are reduced to metallic silver at a rate determined by developer strength, temperature, agitation, and time. Even 15-30 seconds of over- or under-development shifts contrast and grain noticeably. With <strong>push processing</strong> (+1 or +2 stops), extended development amplifies highlights faster than shadows, increasing contrast. With <strong>pull processing</strong>, shortened times compress the tonal range. Precise sequential timing across developer, stop bath, fixer, and wash steps ensures repeatable, predictable negatives.",
  },
  {
    question: "What is the difference between B&W, C-41, and E-6 processing?",
    answer:
      "These are three distinct chemical processes. <strong>B&W (black-and-white)</strong> uses a single developer, stop bath, and fixer — times vary widely by film and developer combination. <strong>C-41</strong> is the standardized color negative process running at 38C/100.4F with fixed times for all color negative films. <strong>E-6</strong> is the color slide (reversal) process, also temperature-critical at 38C, with a first developer, reversal bath, color developer, and stabilizer. C-41 and E-6 have tight temperature tolerances (plus or minus 0.3C) where B&W is more forgiving.",
  },
  {
    question: "How does push and pull processing work?",
    answer:
      "Push processing extends development time to compensate for under-exposure (shooting film at a higher ISO than rated). Pushing +1 stop approximately doubles the development time; +2 stops roughly triples it. This increases shadow density and overall contrast. Pull processing shortens development time to compensate for over-exposure, reducing contrast and highlight density. The exact multipliers depend on the film-developer combination — this timer applies standard correction factors that work as reliable starting points.",
  },
  {
    question: "Why does temperature affect development time?",
    answer:
      "Chemical reaction rates roughly double for every 10C increase in temperature. Standard B&W development is calibrated at 20C (68F). If your chemicals are warmer, development happens faster and you need to shorten the time; if cooler, you need to extend it. This timer applies a temperature compensation factor based on the Ilford method: approximately +10% time per degree below 20C and -10% per degree above. For C-41 and E-6, maintaining exact temperature is critical — use a water bath or sous vide circulator.",
  },
  {
    question: "What are agitation reminders and why do they matter?",
    answer:
      "Agitation replenishes fresh developer at the film surface by displacing exhausted chemistry. Standard agitation is typically 10 seconds of gentle inversions every 30 or 60 seconds. Too little agitation causes uneven development and bromide drag (streaking near sprocket holes). Too much agitation increases contrast and can cause surge marks. This timer provides audible agitation reminders at configurable intervals so you can maintain a consistent rhythm without watching the clock.",
  },
];

const RELATED_TIMERS = [
  { name: "Stand Development Timer", href: "/photography/stand-development", description: "Ambient countdown for stand and semi-stand development with Rodinal and other highly dilute developers" },
  { name: "Enlarger Timer", href: "/photography/enlarger-timer", description: "Darkroom enlarger timer with f-stop printing and test strip modes" },
  { name: "Cyanotype Timer", href: "/photography/cyanotype", description: "UV exposure countdown for cyanotype and alternative process printing" },
  { name: "Long Exposure Calculator", href: "/photography/long-exposure-calculator", description: "Reciprocity failure calculator for long film exposures with ND filter support" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
];

const seo_content_block = (
  <TimerSeoContent
    timer_name="Film Development Timer"
    category_name="Photography"
    category_slug="photography"
    faq={FILM_DEV_FAQ}
    related_timers={RELATED_TIMERS}
  >
    <h2>What Is a Film Development Timer?</h2>
    <p>
      Developing film requires precise, sequential timing across multiple chemical baths — developer,
      stop bath, fixer, and wash. Each step has a specific duration that directly affects the density,
      contrast, and grain structure of the final negative. This free multi-step film development timer
      sequences all steps automatically with audio alerts at each transition and agitation reminders
      throughout, so you can focus on handling the tank and chemicals instead of watching a clock.
    </p>
    <p>
      Select your process (B&W standard, C-41 color negative, or E-6 slide film), choose from
      pre-loaded recipes for popular film-developer combinations, adjust for push/pull processing and
      temperature variations, and press start. The timer walks you through each step from first pour
      to final wash.
    </p>

    <h2>Supported Development Processes</h2>
    <ul>
      <li><strong>Black-and-white (B&W)</strong> — The most flexible process with the widest range of developer choices and timing variations. Standard steps: developer, stop bath, fixer, wash. Development times range from 4 minutes (fast developers like Ilfosol 3) to 20+ minutes (dilute developers like Rodinal 1:50). For minimal-agitation approaches, see our dedicated <a href="/photography/stand-development">stand development timer</a>.</li>
      <li><strong>C-41 color negative</strong> — Standardized process at 38C/100.4F. All color negative films from any manufacturer use identical times: 3:15 developer, 1:00 bleach, 3:00 fix (or 6:30 blix for combined bleach-fix kits), wash, and stabilizer. Temperature precision is critical.</li>
      <li><strong>E-6 color slide</strong> — Reversal process at 38C/100.4F for transparency (slide) film. Includes first developer, reversal bath, color developer, conditioner, bleach, fixer, wash, and stabilizer. First developer time is the only step that varies for push/pull.</li>
    </ul>

    <h2>Push and Pull Processing</h2>
    <p>
      Pushing film means rating it at a higher ISO than its native speed and compensating with extended
      development. A roll of ISO 400 film shot at ISO 1600 is &quot;pushed 2 stops&quot; and needs
      approximately 2.5-3x the normal development time. This increases shadow density and overall
      contrast — useful for low-light situations where you need faster shutter speeds.
    </p>
    <p>
      Pulling is the opposite: over-exposing the film (shooting at a lower ISO) and shortening
      development. Pull processing reduces contrast and can recover highlight detail in high-contrast
      scenes. Wedding and portrait photographers sometimes pull film for softer tonal gradation.
    </p>
    <p>
      This timer applies standard push/pull multipliers when you select +1, +2, +3, -1, or -2 stops
      in the configuration panel. The adjusted development time is shown in the timeline preview
      before you start.
    </p>

    <h2>Temperature Compensation</h2>
    <p>
      Published development times assume a standard temperature — 20C (68F) for most B&W processes
      and 38C (100.4F) for C-41 and E-6. If your chemicals are above or below the standard, the
      timer adjusts development time using established compensation curves. For B&W, a 1C increase
      shortens development by roughly 10%; a 1C decrease extends it by the same amount. Keeping your
      chemicals within 0.5C of the target temperature produces the most consistent results.
    </p>

    <h2>How to Use This Timer</h2>
    <ol>
      <li><strong>Select your process</strong> — Choose B&W Standard, C-41 Color, or E-6 Slide from the process selector.</li>
      <li><strong>Pick a recipe (optional)</strong> — Select a pre-loaded film + developer combination to automatically set the developer step duration. Recipes include popular pairings like HP5+ in DD-X, Tri-X in D-76, and T-Max in T-Max Developer.</li>
      <li><strong>Adjust parameters</strong> — Open the Customize panel to set push/pull compensation and temperature. The timeline preview updates in real time.</li>
      <li><strong>Review the timeline</strong> — Verify each step duration before starting. The total processing time is displayed at the bottom.</li>
      <li><strong>Start development</strong> — Press the start button, pour your developer, and follow the audio cues for agitation and step transitions. The timer advances through each step automatically.</li>
    </ol>

    <h2>Tips for Consistent Film Development</h2>
    <ul>
      <li><strong>Pre-soak your film</strong> — A 60-second water pre-soak at development temperature ensures even wetting and brings the film and tank to the correct temperature before developer hits the emulsion.</li>
      <li><strong>Standardize your agitation</strong> — Whether you use inversions, rotary, or swirl agitation, keep the pattern identical between rolls. Inconsistent agitation is the most common cause of uneven negatives.</li>
      <li><strong>Use a thermometer</strong> — Do not estimate temperature. A digital kitchen thermometer accurate to 0.1C costs a few dollars and pays for itself in consistent results.</li>
      <li><strong>Keep notes</strong> — Record every roll: film, developer, dilution, time, temperature, agitation pattern, and results. A development log is the fastest way to refine your technique and build a personal reference library.</li>
      <li><strong>Print or scan promptly</strong> — Evaluate your negatives while you remember the shooting conditions. Use our <a href="/photography/enlarger-timer">enlarger timer</a> for darkroom printing or scan the negatives to compare against your development notes.</li>
    </ul>
  </TimerSeoContent>
);

function FilmDevSetup({ on_start }: { on_start: (steps: StepDefinition[]) => void }) {
  const [process_id, set_process_id] = useState("bw-standard");
  const [recipe_idx, set_recipe_idx] = useState(-1);
  const [push_pull, set_push_pull] = useState("0");
  const [temp_c, set_temp_c] = useState(20);
  const [show_customize, set_show_customize] = useState(false);

  const process = FILM_DEV_PROCESSES.find((p) => p.id === process_id) || FILM_DEV_PROCESSES[0];

  const steps = useMemo(() => {
    const base_steps = [...process.steps];
    // If a recipe is selected, override the developer time
    if (recipe_idx >= 0 && recipe_idx < FILM_RECIPES.length) {
      const recipe = FILM_RECIPES[recipe_idx];
      let dev_time = recipe.time_seconds;
      // Apply push/pull
      dev_time = Math.round(dev_time * (PUSH_PULL_MULTIPLIERS[push_pull] || 1));
      // Apply temperature
      dev_time = adjust_for_temperature(dev_time, temp_c);
      // Find developer step and replace its duration
      const dev_idx = base_steps.findIndex((s) => s.name === "Developer");
      if (dev_idx >= 0) {
        base_steps[dev_idx] = { ...base_steps[dev_idx], duration: dev_time };
      }
    }
    return base_steps;
  }, [process, recipe_idx, push_pull, temp_c]);

  const total_time = steps.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-4">
      {/* Process selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Process</label>
        <div className="flex flex-wrap gap-2">
          {FILM_DEV_PROCESSES.map((p) => (
            <button
              key={p.id}
              onClick={() => set_process_id(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                process_id === p.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Recipe</label>
        <select
          value={recipe_idx}
          onChange={(e) => set_recipe_idx(Number(e.target.value))}
          className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
        >
          <option value={-1}>Manual — use default times</option>
          {FILM_RECIPES.map((r, i) => (
            <option key={i} value={i}>
              {r.film} + {r.developer} ({r.dilution}) — {format_time(r.time_seconds)}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline preview */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Timeline Sequence</label>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-foreground">{step.name}</span>
              </div>
              <span className="text-sm font-mono text-foreground">{format_time(step.duration)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">Total: {format_time(total_time)}</p>
      </div>

      {/* Customize section */}
      <button
        onClick={() => set_show_customize(!show_customize)}
        className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
      >
        {show_customize ? "Hide" : "Customize"} Parameters
      </button>

      {show_customize && (
        <div className="space-y-4 border-t border-surface-container-high pt-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Push/Pull</label>
            <select
              value={push_pull}
              onChange={(e) => set_push_pull(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container-low rounded-xl text-foreground outline-none"
            >
              <option value="-2">-2 stops</option>
              <option value="-1">-1 stop</option>
              <option value="0">Normal</option>
              <option value="+1">+1 stop</option>
              <option value="+2">+2 stops</option>
              <option value="+3">+3 stops</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Temperature (°C)</label>
            <input
              type="number"
              value={temp_c}
              onChange={(e) => set_temp_c(Number(e.target.value))}
              className="w-24 px-4 py-2 bg-surface-container-low rounded-xl text-foreground outline-none"
            />
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={() => on_start(steps)}
        className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl text-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
      >
        Start Development
      </button>
    </div>
  );
}

function FilmDevActive({ on_configure }: { on_configure: () => void }) {
  const { machine, fullscreen } = useTimer();
  const { display, action } = machine;
  const is_fs = fullscreen.is_fullscreen;
  const agitation_pending = display.extra?.agitation_pending as boolean | undefined;
  const steps = (display.extra?.steps || []) as StepDefinition[];
  const skipped_times = (display.extra?.skipped_times || []) as (number | undefined)[];

  return (
    <TimerShellV2
      label="Film Development"
      dark
      controls={
        <TimerControls show_skip />
      }
      timer_type="film-development"
      running={machine.status === "running"}
      remaining={display.primary_time}
      on_configure={on_configure}
      below={
        <>
          {/* Agitation overlay */}
          {agitation_pending && (
            <button
              onClick={() => action("acknowledge_agitation")}
              className="w-full py-8 flex flex-col items-center gap-3 animate-pulse"
            >
              <span className="text-3xl md:text-5xl font-headline font-black text-secondary">
                AGITATE
              </span>
              <span className="text-sm text-muted-foreground">Tap anywhere to confirm</span>
            </button>
          )}
          {/* Step list */}
          {!is_fs && (
            <div className="w-full space-y-1.5 mt-4">
              {steps.map((step, i) => {
                const is_current = i === display.step_info?.current;
                const is_done = i < (display.step_info?.current ?? 0);
                const was_skipped = skipped_times[i] !== undefined;
                return (
                  <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm ${
                    is_current ? "bg-secondary/20 text-secondary font-bold" : is_done ? "text-muted-foreground" : "text-foreground"
                  }`}>
                    <span className={is_done && !was_skipped ? "line-through" : ""}>{step.name}</span>
                    <span className="font-mono flex items-center gap-2">
                      {was_skipped && (
                        <>
                          <span className="line-through opacity-50">{format_time(step.duration)}</span>
                          <span className="text-secondary text-xs">@{format_time(skipped_times[i]!)}</span>
                        </>
                      )}
                      {!was_skipped && (
                        <span className={is_done ? "line-through" : ""}>{format_time(step.duration)}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      }
    >
      <TimerDisplay
        time={display.primary_time}
        progress={display.progress}
        variant="ring"
        color="var(--secondary)"
        phase_label={display.phase_label}
        sub_label={display.step_info ? `Step ${display.step_info.current + 1} of ${display.step_info.total}` : undefined}
      />
    </TimerShellV2>
  );
}

function FilmDevTimerContent() {
  const [steps, set_steps] = useState<StepDefinition[] | null>(null);

  if (!steps) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
          <h1 className="font-headline font-black text-2xl md:text-3xl text-center text-foreground mt-8 mb-2">
            Film Development Timer
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Multi-step sequential timer for B&W, C-41, and E-6 processes
          </p>
          <FilmDevSetup on_start={set_steps} />
        </main>
        {seo_content_block}
        <Footer />
      </>
    );
  }

  return (
    <TimerProvider strategy={multiStepStrategy} config={{ steps }}>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <h1 className="sr-only">Film Development Timer</h1>
        <div className="mt-4 mb-8 w-full max-w-lg mx-auto">
          <FilmDevActive on_configure={() => set_steps(null)} />
        </div>
      </main>
      {seo_content_block}
      <Footer />
    </TimerProvider>
  );
}

export default function FilmDevelopmentPage() {
  return (
    <Suspense>
      <FilmDevTimerContent />
    </Suspense>
  );
}
