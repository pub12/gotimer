"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const FASTING_PRESETS = [
  { label: "12h", seconds: 43200 },
  { label: "14h", seconds: 50400 },
  { label: "16h", seconds: 57600 },
  { label: "18h", seconds: 64800 },
  { label: "20h", seconds: 72000 },
  { label: "24h", seconds: 86400 },
];

const FASTING_FAQ = [
  {
    question: "What is intermittent fasting?",
    answer:
      "Intermittent fasting (IF) is an eating pattern that cycles between periods of <strong>fasting and eating</strong>. Unlike traditional diets, IF focuses on <em>when</em> you eat rather than <em>what</em> you eat. Popular protocols include 16:8 (16 hours fasting, 8 hours eating), 18:6, 20:4, and OMAD (one meal a day). During the fasting window, you consume only water, black coffee, or plain tea.",
  },
  {
    question: "Which fasting protocol should I start with?",
    answer:
      "Most beginners should start with <strong>12:12 or 14:10</strong> and gradually extend the fasting window over 2-3 weeks. If you already skip breakfast naturally, 16:8 is an easy transition — for example, eating between 12 PM and 8 PM. More aggressive protocols like 20:4 and OMAD are best reserved for experienced fasters.",
  },
  {
    question: "What breaks a fast?",
    answer:
      "Generally, anything with calories breaks a fast. <strong>Water, black coffee, plain tea, and sparkling water</strong> are safe. Bone broth (under 50 calories) is debated — purists avoid it, while others allow it for longer fasts. Artificial sweeteners may trigger an insulin response in some people, so most experts recommend avoiding them during the fasting window.",
  },
  {
    question: "Is intermittent fasting safe?",
    answer:
      "For most healthy adults, intermittent fasting is considered safe. However, it is <strong>not recommended for pregnant or breastfeeding women, children, people with eating disorder history, or those with diabetes</strong> without medical supervision. Always consult a healthcare provider before starting any fasting protocol.",
  },
  {
    question: "Can I exercise while fasting?",
    answer:
      "Yes, many people exercise during their fasting window. Light to moderate exercise like walking, yoga, or <a href='/fitness/stretching'>stretching</a> is well-tolerated. For intense workouts using an <a href='/fitness/emom'>EMOM timer</a> or <a href='/fitness/tabata'>Tabata protocol</a>, consider scheduling them near the end of your fast or during your eating window to fuel recovery properly.",
  },
];

const RELATED_TIMERS = [
  { name: "Breathing Timer", href: "/wellness/breathing", description: "Manage hunger-related stress with guided breathing exercises" },
  { name: "Sleep Timer", href: "/wellness/sleep", description: "Wind-down countdown — good sleep supports fasting adherence" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any custom duration" },
  { name: "Cooking Timer", href: "/kitchen/cooking", description: "Time your meals when the eating window opens" },
  { name: "Rest Timer", href: "/fitness/rest-timer", description: "Recovery timer between fasted workout sets" },
];

function Content() {
  const params = useSearchParams();
  const initial = Number(params.get("duration")) || 57600;
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
      label="Fasting Timer"
      description="Intermittent fasting tracker. Popular protocols: 12:12, 14:10, 16:8, 18:6, 20:4, and OMAD (23:1)."
      below={
        <div className="w-full max-w-xs mx-auto space-y-3 mt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {FASTING_PRESETS.map((p) => (
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
          <DurationInput value={duration} onChange={set_duration} />
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Fasting Timer"
          category_name="Wellness"
          category_slug="wellness"
          faq={FASTING_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>Intermittent Fasting Explained</h2>
          <p>
            Intermittent fasting is not a diet — it is an eating schedule. By restricting food intake to a
            defined window each day, you give your body extended periods without caloric input. During these
            fasting windows, insulin levels drop, allowing your body to access stored fat for energy. After
            approximately 12 hours of fasting, your body begins to increase autophagy — the cellular cleanup
            process that removes damaged proteins and organelles.
          </p>
          <p>
            This free fasting timer tracks your fasting window with one-tap presets for the most popular
            protocols. Select 16h for the standard 16:8 protocol, or choose 12h, 14h, 18h, 20h, or 24h
            depending on your experience level and goals. The custom duration input lets you set any
            fasting window length.
          </p>

          <h2>Popular Fasting Protocols</h2>
          <ul>
            <li><strong>12:12</strong> — 12 hours fasting, 12 hours eating. The gentlest introduction to IF. Example: eat between 7 AM and 7 PM.</li>
            <li><strong>14:10</strong> — A slightly extended fast that most people can adopt within a week. Example: eat between 10 AM and 8 PM.</li>
            <li><strong>16:8</strong> — The most popular protocol. Skip breakfast and eat between noon and 8 PM. This is the default setting on this timer (16 hours).</li>
            <li><strong>18:6</strong> — A compressed eating window, typically lunch and dinner only. Offers stronger autophagy benefits than 16:8.</li>
            <li><strong>20:4 (Warrior Diet)</strong> — A 4-hour eating window, usually one large meal and one small snack. Best for experienced fasters.</li>
            <li><strong>OMAD (One Meal A Day)</strong> — A 23:1 protocol where you eat all daily calories in a single meal. Use the 24h preset and adjust slightly.</li>
          </ul>

          <h2>Benefits of Tracking Your Fasting Window</h2>
          <p>
            A visible countdown creates accountability. When you can see exactly how many hours remain in
            your fast, you are far less likely to break it impulsively. Research on habit formation shows
            that external tracking tools — like timers and journals — increase adherence to new behaviors
            by 30-40%. The fasting timer also removes mental math: no more calculating when you last ate
            and whether enough time has passed.
          </p>

          <h2>How to Use This Fasting Timer</h2>
          <ol>
            <li><strong>Start the timer after your last meal</strong> — Tap the preset that matches your protocol (e.g., 16h for 16:8).</li>
            <li><strong>Hydrate during the fast</strong> — Water, black coffee, and plain tea are your allies. They help manage hunger and maintain energy.</li>
            <li><strong>Stay busy</strong> — Hunger peaks around hours 2-4 of waking. Plan activities, work, or <a href="/wellness/breathing">breathing exercises</a> during these windows.</li>
            <li><strong>Break your fast gently</strong> — When the timer reaches zero, start with a moderate meal. Avoid bingeing after long fasts.</li>
          </ol>

          <h2>What Breaks a Fast?</h2>
          <p>
            The general rule: anything with calories breaks a fast. Water, black coffee (no cream, no sugar),
            plain green or herbal tea, and sparkling water are universally accepted during fasting windows.
            Supplements like electrolytes (zero-calorie) are fine and often recommended for fasts over 16
            hours. Apple cider vinegar (1-2 tablespoons in water) is debated but generally considered
            acceptable. When your eating window opens, use a <a href="/kitchen/cooking">cooking timer</a>
            to prepare a balanced first meal rather than reaching for processed convenience food.
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
