"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { intervalStrategy } from "@/lib/timer-strategies/interval";

const PHOTO_WALK_FAQ = [
  {
    question: "What is a photo walk?",
    answer:
      "A photo walk is a planned outing — solo or in a group — where the primary goal is to photograph your surroundings within a set time or route. Adding a timer transforms a casual stroll into a structured creative exercise. Each timed round forces you to commit to compositions quickly, reducing overthinking and encouraging experimentation with angles, subjects, and light.",
  },
  {
    question: "How do timed constraints improve photography?",
    answer:
      "Time pressure bypasses the analytical paralysis that makes photographers walk past good shots. When you have only 5 minutes to shoot before a review break, you stop waiting for the perfect scene and start <strong>finding</strong> photographs in whatever is in front of you. This mirrors editorial and event photography conditions where decisive timing is a core skill.",
  },
  {
    question: "What shoot and review intervals should I use?",
    answer:
      "Start with <strong>5 minutes of shooting</strong> and <strong>1 minute of review</strong> for 6 rounds (a 36-minute session). As you get comfortable, shorten the shoot interval to 3 minutes to increase pressure, or lengthen it to 10 minutes for a more relaxed pace. For group walks, use the review period to compare frames and discuss approach.",
  },
  {
    question: "Can I use this timer for photography classes or workshops?",
    answer:
      "Absolutely. Instructors use timed photo sprints to teach composition, exposure, and creative vision under pressure. Set the timer on a phone or tablet visible to the group. Each round can have a different theme — <em>leading lines</em>, <em>negative space</em>, <em>color contrast</em> — announced during the review break. Pair with a <a href='/round-timer'>round timer</a> for longer workshop sessions.",
  },
  {
    question: "What are some photo walk challenge ideas?",
    answer:
      "Popular challenges include: <strong>one-lens walk</strong> (shoot an entire session with a single focal length), <strong>color theme</strong> (photograph only subjects of a chosen color), <strong>stranger portraits</strong> (approach and photograph people you meet), <strong>alphabet hunt</strong> (find letters A-Z in the environment), and <strong>shadow play</strong> (compose using only shadows and silhouettes). Constraints breed creativity.",
  },
];

const RELATED_TIMERS = [
  { name: "Long Exposure Calculator", href: "/photography/long-exposure-calculator", description: "Reciprocity failure calculator for long film exposures with ND filter support" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
  { name: "Round Timer", href: "/round-timer", description: "Track rounds and total elapsed time for structured sessions" },
  { name: "Cyanotype Timer", href: "/photography/cyanotype", description: "UV exposure countdown for cyanotype and alternative process printing" },
  { name: "Film Development Timer", href: "/photography/film-development", description: "Multi-step sequential timer for B&W, C-41, and E-6 film processing" },
];

function Content() {
  const params = useSearchParams();
  const work = Number(params.get("work")) || 300;
  const rest = Number(params.get("rest")) || 60;
  const rounds = Number(params.get("rounds")) || 6;
  const [config, set_config] = useState({ work, rest, rounds });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("work", String(config.work));
    params.set("rest", String(config.rest));
    params.set("rounds", String(config.rounds));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [config.work, config.rest, config.rounds]);

  return (
    <TimerPage
      key={`${config.work}-${config.rest}-${config.rounds}`}
      strategy={intervalStrategy}
      config={config}
      label="Photo Walk Timer"
      description="Photo sprint challenges. Shoot for 5 minutes, review for 1 minute, repeat. Push your creativity with timed constraints."
      show_skip
      below={
        <div className="w-full max-w-xs mx-auto space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shoot</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={60}
                step={30}
                value={config.work}
                onChange={(e) => set_config((c) => ({ ...c, work: Number(e.target.value) }))}
                className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Review</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={10}
                value={config.rest}
                onChange={(e) => set_config((c) => ({ ...c, rest: Number(e.target.value) }))}
                className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rounds</label>
            <input
              type="number"
              min={1}
              max={20}
              value={config.rounds}
              onChange={(e) => set_config((c) => ({ ...c, rounds: Number(e.target.value) }))}
              className="w-20 px-2 py-1 bg-surface-container-low rounded-lg text-foreground text-sm text-right outline-none"
            />
          </div>
        </div>
      }
      seo_content={
        <TimerSeoContent
          timer_name="Photo Walk Timer"
          category_name="Photography"
          category_slug="photography"
          faq={PHOTO_WALK_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is a Photo Walk Timer?</h2>
          <p>
            A photo walk timer structures your photography outings into timed shooting rounds followed by
            brief review breaks. Instead of wandering aimlessly with a camera, you commit to focused
            bursts of image-making — 3, 5, or 10 minutes of active shooting — then pause to review your
            frames, reflect on what worked, and reset before the next round. This shoot-review-repeat
            cycle is used by photography educators, workshop leaders, and solo practitioners to build
            decisive shooting habits.
          </p>
          <p>
            This free photo walk timer handles the interval pacing with audio cues so you can keep your
            eyes on the scene, not on your phone. Set your shoot duration, review duration, and round
            count, then press start. The timer alternates between shooting and review phases automatically.
          </p>

          <h2>Why Timed Shooting Improves Your Photography</h2>
          <p>
            Professional photographers — from photojournalists covering breaking news to wedding shooters
            working a 30-minute family portrait slot — rarely have the luxury of unlimited time. Practicing
            under timed constraints trains several essential skills:
          </p>
          <ul>
            <li><strong>Decisiveness</strong> — You learn to recognize and commit to compositions faster, eliminating the habit of walking past strong images while searching for something &quot;better.&quot;</li>
            <li><strong>Adaptability</strong> — Each round may present different light, subjects, or locations. You learn to work with what is available rather than waiting for ideal conditions.</li>
            <li><strong>Volume and variation</strong> — Short intense bursts produce more frames per session than a leisurely walk, giving you more material to edit and learn from.</li>
            <li><strong>Self-critique</strong> — The built-in review breaks force you to evaluate your work in the field, while the memory of your intent is still fresh.</li>
          </ul>

          <h2>How to Run a Photo Walk Session</h2>
          <ol>
            <li><strong>Choose your constraints</strong> — Pick a single lens, a color theme, a subject category, or a compositional rule to follow for the entire session. Constraints eliminate decision fatigue and spark creative problem-solving.</li>
            <li><strong>Set your intervals</strong> — 5 minutes of shooting with 1 minute of review is the default. Shorter shoot times (2-3 minutes) increase intensity; longer times (10 minutes) work better for street photography or environmental portraits.</li>
            <li><strong>Walk and shoot</strong> — When the timer starts, move through your environment and photograph deliberately. Do not check your screen until the review beep sounds.</li>
            <li><strong>Review and adjust</strong> — During the review phase, scroll through your last few frames. Identify one thing that worked and one thing to change in the next round.</li>
            <li><strong>Repeat</strong> — Each round builds on the lessons from the previous one. By round 4 or 5, most photographers notice a significant improvement in the quality and consistency of their frames.</li>
          </ol>

          <h2>Photo Walk Challenge Ideas</h2>
          <ul>
            <li><strong>One focal length</strong> — Shoot the entire session at 35mm (or 50mm, or 85mm). Learning what a single lens &quot;sees&quot; builds a deep intuition for framing and perspective.</li>
            <li><strong>Color isolation</strong> — Each round targets a different color. Round 1: red. Round 2: blue. This trains your eye to scan environments for specific visual elements.</li>
            <li><strong>Texture and pattern</strong> — Focus exclusively on surfaces, repetitions, and materials. Excellent for training macro and close-up composition skills.</li>
            <li><strong>Portraits of strangers</strong> — Approach one person per round and ask for a portrait. This builds confidence and interpersonal skills alongside technical ability.</li>
            <li><strong>Light and shadow only</strong> — Photograph only scenes defined by dramatic light — silhouettes, rim lighting, long shadows, window light. Pair with a <a href="/photography/long-exposure-calculator">long exposure calculator</a> if you are shooting film in low light.</li>
          </ul>

          <h2>Organizing Group Photo Walks</h2>
          <p>
            Photo walks are more engaging in groups. Display the timer on a phone or tablet where everyone
            can see it. Between rounds, gather for a 60-second critique where each person shares their
            strongest frame. For workshops, assign a different theme per round and discuss how constraints
            shaped each participant&apos;s approach. Use a <a href="/round-timer">round timer</a> for
            longer sessions where you want elapsed time tracking alongside the interval structure.
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
