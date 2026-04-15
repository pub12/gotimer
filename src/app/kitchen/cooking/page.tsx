"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";

const PRESETS = [
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "20 min", seconds: 1200 },
  { label: "30 min", seconds: 1800 },
  { label: "45 min", seconds: 2700 },
  { label: "60 min", seconds: 3600 },
];

const COOKING_FAQ = [
  {
    question: "Why is accurate timing important in cooking?",
    answer:
      "Unlike baking, where measurements must be precise, cooking timing affects <strong>texture, safety, and flavor</strong>. Overcooking vegetables destroys nutrients and texture. Undercooking chicken is a food safety risk. Caramelizing onions requires 30-45 minutes of patient low heat. A reliable timer removes guesswork and lets you multitask confidently.",
  },
  {
    question: "What are common cooking times I should know?",
    answer:
      "Some essential reference times: <strong>pasta (8-12 min)</strong>, <strong>rice (15-20 min)</strong>, <strong>steamed broccoli (5-7 min)</strong>, <strong>roast chicken (60-90 min at 375°F)</strong>, <strong>baked potato (45-60 min at 400°F)</strong>, and <strong>seared steak (3-4 min per side for medium-rare)</strong>. Use the preset buttons for quick access to common durations.",
  },
  {
    question: "How do I time multiple dishes at once?",
    answer:
      "Work backwards from your target serving time. If dinner is at 7 PM and your roast takes 90 minutes, start it at 5:30 PM. For dishes that need simultaneous attention, use our <a href='/kitchen/multi-timer'>Multi-Timer</a> to run independent countdowns for each item.",
  },
  {
    question: "Should I use a timer for baking too?",
    answer:
      "Absolutely. Baking is even more time-sensitive than stovetop cooking. Start checking 5 minutes before the timer ends — oven temperatures vary, and the difference between perfectly golden and burnt is often just 2-3 minutes. For bread specifically, try our <a href='/kitchen/bread-proofing'>bread proofing timer</a>.",
  },
  {
    question: "What is carryover cooking and how does it affect timing?",
    answer:
      "Carryover cooking occurs when <strong>residual heat continues cooking food after it is removed from the heat source</strong>. A roast can rise 5-10°F during resting. Steaks continue cooking for 3-5 minutes off the pan. Account for this by pulling food slightly before your target doneness — your timer should signal when to remove from heat, not when the food is done resting.",
  },
];

const RELATED_TIMERS = [
  { name: "Egg Timer", href: "/kitchen/eggs", description: "Presets for soft, medium, and hard boiled eggs" },
  { name: "Bread Proofing Timer", href: "/kitchen/bread-proofing", description: "Track dough rise and fermentation times" },
  { name: "Multi-Timer", href: "/kitchen/multi-timer", description: "Run multiple kitchen timers simultaneously" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Quick countdown for meat resting periods" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 600;
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
      label="Cooking Timer"
      description="General purpose kitchen timer."
      below={
        <div className="w-full max-w-xs mx-auto mt-2">
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.seconds}
                onClick={() => set_duration(p.seconds)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
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
      }
      seo_content={
        <TimerSeoContent
          timer_name="Cooking Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={COOKING_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Why Every Kitchen Needs a Reliable Timer</h2>
          <p>
            The difference between perfectly al dente pasta and a mushy mess is about 90 seconds. Between
            a juicy roast chicken and a dry one, roughly 10 minutes. Cooking is a series of chemical
            reactions — Maillard browning, protein denaturation, starch gelatinization — and each one
            depends on time at temperature. A dedicated cooking timer removes the guesswork, letting you
            focus on technique instead of watching the clock.
          </p>
          <p>
            This free online cooking timer includes one-tap presets for the most common kitchen durations:
            5, 10, 15, 20, 30, 45, and 60 minutes. Select a preset or enter a custom time. The audio
            alert ensures you hear the timer even when you step out of the kitchen, and full-screen mode
            makes the countdown visible across the room.
          </p>

          <h2>Common Cooking Times Reference</h2>
          <ul>
            <li><strong>Boiling pasta</strong> — 8-12 minutes depending on shape and brand. Start testing 1 minute before the package time.</li>
            <li><strong>Steaming vegetables</strong> — Broccoli 5-7 min, asparagus 3-5 min, carrots 7-10 min, green beans 5-7 min.</li>
            <li><strong>Pan-searing steak</strong> — 3-4 min per side for medium-rare (1-inch thickness). Rest for 5 minutes before cutting.</li>
            <li><strong>Roasting chicken</strong> — 20 min per pound at 375°F, plus 15 min for crisping at 425°F. Internal temp should reach 165°F.</li>
            <li><strong>Simmering rice</strong> — White rice 15-18 min, brown rice 40-50 min, basmati 12-15 min. Keep the lid on.</li>
            <li><strong>Baking cookies</strong> — 9-12 min at 350°F. Remove when edges are set but centers look slightly underdone.</li>
          </ul>

          <h2>Using Presets for Faster Kitchen Workflow</h2>
          <p>
            The preset buttons are designed around real kitchen scenarios. Tap &quot;10 min&quot; for pasta,
            &quot;15 min&quot; for rice, &quot;30 min&quot; for a casserole check, or &quot;60 min&quot;
            for a roast. No typing, no scrolling — just one tap and start. For dishes requiring precise
            times that do not match a preset, the custom duration input accepts any value in seconds.
          </p>

          <h2>Multi-Dish Timing Strategies</h2>
          <p>
            Cooking a complete meal means coordinating multiple dishes to finish at the same time. The key
            is working backwards from your serving time:
          </p>
          <ol>
            <li><strong>Identify the longest-cooking item</strong> — This sets your start time. A 90-minute roast means starting at least 2 hours before dinner (including rest time).</li>
            <li><strong>Stagger your starts</strong> — Add side dishes at calculated intervals so everything finishes together.</li>
            <li><strong>Use the multi-timer for parallel tracking</strong> — When you have three or more items cooking simultaneously, our <a href="/kitchen/multi-timer">Multi-Timer</a> lets you name and track each one independently.</li>
            <li><strong>Account for resting time</strong> — Meats need 5-15 minutes of rest after cooking. Use this window to finish sauces and sides.</li>
          </ol>

          <h2>How to Use This Cooking Timer</h2>
          <ol>
            <li><strong>Tap a preset or enter a custom time</strong> — Choose from 5 to 60 minutes, or type any duration.</li>
            <li><strong>Press start when food hits the heat</strong> — Start the timer the moment your food goes into the oven, pan, or pot.</li>
            <li><strong>Enable audio alerts</strong> — The sound notification ensures you hear the timer from another room.</li>
            <li><strong>Use full-screen for kitchen visibility</strong> — Mount a tablet or prop your phone where you can see it across the kitchen.</li>
          </ol>
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
