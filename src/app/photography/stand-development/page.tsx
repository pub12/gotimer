"use client";

import React, { Suspense, useState } from "react";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { ambientStrategy } from "@/lib/timer-strategies/ambient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const PRESETS = [
  { label: "30 min (Semi-stand)", seconds: 1800 },
  { label: "45 min", seconds: 2700 },
  { label: "60 min (Full stand)", seconds: 3600 },
];

const STAND_DEV_FAQ = [
  {
    question: "What is stand development in film photography?",
    answer:
      "Stand development is a technique where film is placed in a highly dilute developer solution — typically Rodinal at 1:100 or 1:200 — and left virtually undisturbed for 30-60 minutes. The developer exhausts itself in the dense highlight areas while continuing to work in the thinner shadow areas. This self-limiting behavior produces <strong>compensating development</strong>: compressed highlights, rich shadow detail, and a characteristic smooth tonal range.",
  },
  {
    question: "What is the difference between stand and semi-stand development?",
    answer:
      "In <strong>full stand development</strong>, the film sits completely still for the entire duration (typically 60 minutes) with no agitation after the initial inversions. <strong>Semi-stand development</strong> adds one gentle agitation at the midpoint (usually at 30 minutes in a 60-minute process, or at 15 minutes in a 30-minute process). Semi-stand reduces the risk of uneven development and bromide drag while retaining most of the compensating effect.",
  },
  {
    question: "Which developers work best for stand development?",
    answer:
      "Rodinal (Adonal) at 1:100 or 1:200 is the classic choice because it has excellent keeping properties at high dilution and produces sharp grain. HC-110 at Dilution H or more dilute also works well. Xtol can be used at 1:3 for shorter stand times. Avoid high-energy developers like D-76 stock solution — they are not designed for the extreme dilution stand development requires.",
  },
  {
    question: "What films work well with stand development?",
    answer:
      "Nearly any black-and-white film can be stand-developed, but it particularly benefits high-contrast scenes. Ilford HP5+ and Kodak Tri-X are popular choices. Low-speed films like Ilford Pan F+ and Kodak T-Max 100 produce exceptionally fine grain with stand. T-grain films (T-Max, Delta) may need slightly shorter times to avoid excessive highlight density. Always run a test roll with a new film-developer combination.",
  },
  {
    question: "How do I avoid uneven development with stand processing?",
    answer:
      "Uneven development and bromide drag (streaking near sprocket holes) are the main risks. To minimize them: use <strong>semi-stand</strong> with one midpoint agitation, ensure the tank is fully filled with solution so film is completely submerged, give 3-4 gentle initial inversions to dislodge air bubbles, and keep the tank on a level surface away from vibration. Using a pre-wash before pouring in developer also helps ensure even wetting.",
  },
];

const RELATED_TIMERS = [
  { name: "Film Development Timer", href: "/photography/film-development", description: "Multi-step sequential timer for standard B&W, C-41, and E-6 processing" },
  { name: "Enlarger Timer", href: "/photography/enlarger-timer", description: "Darkroom enlarger timer with f-stop printing and test strip modes" },
  { name: "Cyanotype Timer", href: "/photography/cyanotype", description: "UV exposure countdown for cyanotype and alternative process printing" },
  { name: "Photo Walk Timer", href: "/photography/photo-walk", description: "Timed photography challenges with shoot and review intervals" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
];

const seo_content_block = (
  <TimerSeoContent
    timer_name="Stand Development Timer"
    category_name="Photography"
    category_slug="photography"
    faq={STAND_DEV_FAQ}
    related_timers={RELATED_TIMERS}
  >
    <h2>What Is Stand Development?</h2>
    <p>
      Stand development is a darkroom technique that trades active agitation for patience. You pour a
      highly dilute developer — Rodinal at 1:100 is the textbook recipe — into a loaded developing tank,
      give a few gentle inversions to dislodge air bubbles, and then walk away. Over 30 to 60 minutes,
      the developer self-exhausts in the dense highlight regions of the negative while continuing to
      work in the thinner shadow areas. The result is a naturally compressed tonal range with open
      shadows, controlled highlights, and distinctive smooth grain.
    </p>
    <p>
      This free stand development timer counts down your chosen duration with an optional midpoint
      agitation reminder for semi-stand workflows. Add session notes to record your film, developer,
      and dilution for future reference.
    </p>

    <h2>Benefits of Stand Development</h2>
    <ul>
      <li><strong>Compensating development</strong> — Highlights self-limit while shadows continue to build density. This is invaluable for high-contrast scenes like backlit landscapes or mixed indoor-outdoor lighting.</li>
      <li><strong>Reduced apparent grain</strong> — The gentle, even development produces smoother grain structure than conventional agitation, particularly noticeable in medium and large format negatives.</li>
      <li><strong>Simplified workflow</strong> — No need to watch a clock for agitation cycles every 30 or 60 seconds. Pour, set the timer, and attend to other darkroom tasks.</li>
      <li><strong>Exposure latitude</strong> — Stand development is forgiving of exposure errors. Under-exposed shadows receive extra development time, making it a practical rescue technique for poorly metered rolls.</li>
      <li><strong>One recipe for many films</strong> — Rodinal 1:100 for 60 minutes works acceptably with a wide range of black-and-white films, reducing the need to look up specific time-temperature charts.</li>
    </ul>

    <h2>Common Stand Development Recipes</h2>
    <ul>
      <li><strong>Rodinal 1:100, 60 min</strong> — The classic full stand recipe. Works with nearly any B&W film. Excellent starting point for first-timers.</li>
      <li><strong>Rodinal 1:100, 30 min semi-stand</strong> — Agitate gently at the 15-minute mark. Slightly more contrast than full stand, with lower risk of uneven development.</li>
      <li><strong>Rodinal 1:200, 120 min</strong> — Extreme dilution for maximum compensating effect. Best suited to medium and large format where grain is less visible.</li>
      <li><strong>HC-110 Dilution H (~1:63), 45 min</strong> — An alternative for photographers who prefer HC-110. Produces slightly different tonal characteristics than Rodinal.</li>
    </ul>

    <h2>Stand vs. Conventional Development</h2>
    <p>
      Conventional development with regular agitation (every 30-60 seconds) produces consistent,
      repeatable results optimized for a specific film speed and contrast index. It is the right
      choice when you need predictable negatives for enlargement or scanning. Stand development
      sacrifices some of that predictability in exchange for its compensating properties and workflow
      simplicity. Use stand when you want to tame high-contrast scenes, rescue uncertain exposures,
      or simply enjoy a more meditative darkroom process. For conventional timed development with
      agitation reminders, use our <a href="/photography/film-development">film development timer</a> instead.
    </p>

    <h2>Tips for Successful Stand Development</h2>
    <ul>
      <li><strong>Pre-wash the film</strong> — A 60-second water pre-wash ensures even wetting and removes anti-halation dye, promoting uniform developer contact from the start.</li>
      <li><strong>Use enough solution</strong> — Ensure the tank is filled completely. Air pockets above the solution level cause uneven development on the top frames of the roll.</li>
      <li><strong>Keep temperature stable</strong> — Stand times are long enough for ambient temperature to matter. Develop at 20C/68F and avoid placing the tank near heat sources or drafty windows.</li>
      <li><strong>Try semi-stand first</strong> — One gentle agitation at the midpoint dramatically reduces the risk of bromide drag and uneven density while preserving most of the compensating effect. Use this timer&apos;s midpoint reminder to stay on track.</li>
    </ul>
  </TimerSeoContent>
);

function StandDevContent() {
  const [config, set_config] = useState<{ duration: number; midpoint_agitation: boolean; notes: string } | null>(null);
  const [duration, set_duration] = useState(3600);
  const [midpoint, set_midpoint] = useState(true);
  const [notes, set_notes] = useState("");

  if (config) {
    return (
      <TimerPage
        strategy={ambientStrategy}
        config={config}
        label="Stand Development"
        description="Long-form ambient timer for stand and semi-stand development"
        on_configure={() => set_config(null)}
        seo_content={seo_content_block}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-4 px-3 w-full md:pt-20 md:px-4 md:items-center">
        <div className="w-full max-w-md mx-auto space-y-6 mt-8">
          <h1 className="font-headline font-black text-2xl md:text-3xl text-foreground">
            Stand Development Timer
          </h1>
          <p className="text-muted-foreground">
            Set and forget. Perfect for Rodinal 1:100 and other highly dilute developers.
          </p>

          {/* Duration presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Duration</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.seconds}
                  onClick={() => set_duration(p.seconds)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    duration === p.seconds
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Midpoint agitation */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={midpoint}
              onChange={(e) => set_midpoint(e.target.checked)}
              className="w-4 h-4 rounded accent-secondary"
            />
            <span className="text-sm text-foreground">Mid-point agitation reminder</span>
          </label>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => set_notes(e.target.value)}
              placeholder="e.g., Rodinal 1:100, HP5+ @400"
              className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-foreground outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <button
            onClick={() => set_config({ duration, midpoint_agitation: midpoint, notes })}
            className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl text-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            Start Stand Development
          </button>
        </div>
      </main>
      {seo_content_block}
      <Footer />
    </>
  );
}

export default function StandDevelopmentPage() {
  return (
    <Suspense>
      <StandDevContent />
    </Suspense>
  );
}
