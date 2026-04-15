"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";

const EGG_PRESETS = [
  { label: "Soft Boiled", seconds: 360, description: "Runny yolk, set white" },
  { label: "Medium Boiled", seconds: 480, description: "Jammy yolk, firm white" },
  { label: "Hard Boiled", seconds: 600, description: "Fully set yolk and white" },
];

const EGGS_FAQ = [
  {
    question: "How long do I boil eggs for soft, medium, and hard?",
    answer:
      "For large eggs starting in already-boiling water: <strong>soft boiled = 6 minutes</strong> (runny yolk, set white), <strong>medium boiled = 8 minutes</strong> (jammy, golden yolk), and <strong>hard boiled = 10 minutes</strong> (fully set yolk with no gray ring). Transfer to an ice bath immediately after to stop cooking.",
  },
  {
    question: "Should I start eggs in cold water or boiling water?",
    answer:
      "Starting in <strong>boiling water</strong> gives more consistent results because the timing begins at a known temperature. The times on this timer assume boiling-water start. If you start in cold water, timing varies by pot size, water volume, and stove output, making reproducible results harder to achieve.",
  },
  {
    question: "How does altitude affect egg boiling time?",
    answer:
      "Water boils at lower temperatures at higher altitudes — about <strong>1°F less per 500 feet of elevation</strong>. At 5,000 feet, water boils at 203°F instead of 212°F. Add 30-60 seconds to each preset time if you live above 3,000 feet. At very high altitudes (7,000+ feet), add up to 2 minutes.",
  },
  {
    question: "Why do my hard boiled eggs have a green ring around the yolk?",
    answer:
      "The green-gray ring is <strong>iron sulfide</strong>, formed when eggs are overcooked or not cooled quickly. It is harmless but affects taste and appearance. To prevent it: use the 10-minute hard boil preset (not longer), and <strong>immediately transfer eggs to an ice bath</strong> for at least 5 minutes.",
  },
  {
    question: "How do I peel boiled eggs easily?",
    answer:
      "Three factors make peeling easier: <strong>use eggs that are at least 7-10 days old</strong> (fresh eggs cling to the shell), <strong>start in boiling water</strong> (thermal shock separates the membrane), and <strong>ice bath immediately</strong> after cooking. Some cooks add a teaspoon of baking soda to the water to raise the pH, which also helps.",
  },
];

const RELATED_TIMERS = [
  { name: "Cooking Timer", href: "/kitchen/cooking", description: "General kitchen timer with presets for common cooking times" },
  { name: "Bread Proofing Timer", href: "/kitchen/bread-proofing", description: "Track dough rise and fermentation times" },
  { name: "Multi-Timer", href: "/kitchen/multi-timer", description: "Run multiple kitchen timers at once for full meal prep" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 480;
  const [duration, set_duration] = useState(initial);

  useEffect(() => {
    const url = `${window.location.pathname}?duration=${duration}`;
    window.history.replaceState(null, "", url);
  }, [duration]);

  return (
    <TimerPage
      key={duration}
      strategy={countdownStrategy}
      config={{ duration }}
      label="Egg Timer"
      description="Perfect eggs every time. Times are for large eggs starting in boiling water."
      below={
        <div className="w-full max-w-xs mx-auto space-y-2 mt-2">
          {EGG_PRESETS.map((p) => (
            <button
              key={p.seconds}
              onClick={() => set_duration(p.seconds)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                duration === p.seconds
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
              }`}
            >
              <div className="text-left">
                <div>{p.label}</div>
                <div className={`text-xs font-normal ${duration === p.seconds ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                  {p.description}
                </div>
              </div>
              <span className="font-mono text-xs">{Math.floor(p.seconds / 60)}:{String(p.seconds % 60).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Egg Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={EGGS_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>The Science of Boiling Eggs</h2>
          <p>
            An egg is a layered system of proteins that denature (unfold and solidify) at different
            temperatures. The white begins setting around 144°F and is fully firm by 180°F. The yolk
            starts thickening at 149°F and is fully set by 170°F. The key to a perfect boiled egg is
            controlling exposure time at boiling temperature so the white is fully set while the yolk
            reaches exactly the consistency you want — runny, jammy, or firm.
          </p>
          <p>
            This free egg timer has three one-tap presets calibrated for large eggs dropped into
            already-boiling water. Tap &quot;Soft Boiled&quot; for a runny yolk (6 minutes),
            &quot;Medium Boiled&quot; for the coveted jammy texture (8 minutes), or &quot;Hard
            Boiled&quot; for fully set yolks without the dreaded gray ring (10 minutes).
          </p>

          <h2>Why Starting Temperature Matters</h2>
          <p>
            The single biggest variable in egg boiling is whether you start in cold or boiling water.
            Cold-start methods are simpler (put eggs in pot, cover with water, bring to boil) but introduce
            an unpredictable variable: how long your stove takes to boil depends on pot size, water volume,
            burner BTU, and altitude. Starting in already-boiling water standardizes the process. You drop
            the eggs in, start the timer, and get reproducible results every time.
          </p>

          <h2>Altitude and Egg Size Adjustments</h2>
          <ul>
            <li><strong>Large eggs (2 oz)</strong> — Use the preset times as-is. This is the standard egg size in the US.</li>
            <li><strong>Extra-large or jumbo eggs</strong> — Add 30-60 seconds to each preset time.</li>
            <li><strong>Medium eggs</strong> — Subtract 30 seconds from each preset.</li>
            <li><strong>Refrigerator-cold eggs</strong> — The presets assume refrigerator temperature. Room-temperature eggs may need 30 seconds less.</li>
            <li><strong>High altitude (3,000+ feet)</strong> — Water boils at a lower temperature. Add 30 seconds per 2,000 feet above sea level.</li>
          </ul>

          <h2>The Ice Bath: Why It Is Non-Negotiable</h2>
          <p>
            Transferring eggs immediately from boiling water to an ice bath serves two purposes. First,
            it stops carryover cooking — the residual heat in the egg can push a perfect jammy yolk into
            fully set territory in just 2-3 minutes. Second, thermal shock contracts the egg away from
            the inner membrane of the shell, making peeling dramatically easier. Fill a bowl with ice and
            cold water before you start boiling, and submerge the eggs for at least 5 minutes.
          </p>

          <h2>How to Use This Egg Timer</h2>
          <ol>
            <li><strong>Bring water to a rolling boil</strong> — Use enough water to fully submerge your eggs with about an inch of clearance above.</li>
            <li><strong>Tap a preset</strong> — Soft (6 min), Medium (8 min), or Hard (10 min).</li>
            <li><strong>Lower eggs into the water and press start</strong> — Use a slotted spoon or spider to prevent cracking from dropping.</li>
            <li><strong>When the timer alerts, transfer to ice bath</strong> — Immediately move eggs to ice water. Let them cool for at least 5 minutes before peeling.</li>
          </ol>

          <h2>Beyond Boiling: Other Egg Timing</h2>
          <p>
            Need a timer for other kitchen tasks? Poached eggs take 3-4 minutes, steamed eggs (in a
            steamer basket) take 10-12 minutes for hard and produce the easiest-to-peel results. For
            baked eggs (shakshuka-style), use our <a href="/kitchen/cooking">cooking timer</a> set to
            12-15 minutes. When you are preparing eggs as part of a bigger meal, the{" "}
            <a href="/kitchen/multi-timer">multi-timer</a> lets you track eggs alongside other dishes
            without juggling mental countdowns.
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
