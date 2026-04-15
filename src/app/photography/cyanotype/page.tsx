"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { DurationInput } from "@/components/shared/timer-shell";

const CYANOTYPE_FAQ = [
  {
    question: "How long should I expose a cyanotype print?",
    answer:
      "Exposure times vary widely depending on your UV source. In direct midday summer sunlight, 5-10 minutes is typical. Under overcast skies, you may need 15-30 minutes. With a UV lamp unit, exposure is more consistent — usually 3-8 minutes depending on wattage and distance. Always run a test strip first to determine the ideal time for your specific setup.",
  },
  {
    question: "What affects cyanotype exposure time?",
    answer:
      "Several variables influence exposure: <strong>UV intensity</strong> (season, latitude, time of day, cloud cover), <strong>negative density</strong> (inkjet transparency vs. contact-printed film negative), <strong>coating thickness</strong> (thicker coatings need longer exposure), <strong>paper type</strong> (sizing and absorbency matter), and <strong>humidity</strong> (damp coatings expose faster). Tracking these variables helps you dial in repeatable results.",
  },
  {
    question: "Can I use a UV lamp instead of sunlight for cyanotype?",
    answer:
      "Yes. UV exposure units, blacklight bulbs, and even nail-curing LED lamps work for cyanotype printing. The main advantage is consistency — sunlight strength changes with weather, season, and time of day. A UV lamp lets you standardize your exposure. Position the lamp 6-12 inches from the print surface and run a test strip to calibrate timing.",
  },
  {
    question: "How do I know when my cyanotype is properly exposed?",
    answer:
      "During exposure, the coated surface shifts from yellow-green to a silvery blue-grey. A properly exposed print appears slightly <strong>overexposed</strong> before washing — the highlights should look bronzed or solarized. After washing in water, the image darkens and blues significantly over 24 hours (a process called oxidation). Under-exposure produces weak, pale prints; over-exposure flattens highlights.",
  },
  {
    question: "What is the cyanotype process?",
    answer:
      "Cyanotype is an iron-based photographic printing process invented by Sir John Herschel in 1842. Paper or fabric is coated with a solution of ferric ammonium citrate and potassium ferricyanide, dried in the dark, then contact-printed under UV light using a negative or found object. After exposure, the print is washed in running water to clear unexposed chemistry, revealing the characteristic Prussian blue image. It is one of the simplest and most accessible <a href='/photography'>photographic processes</a> to learn.",
  },
];

const RELATED_TIMERS = [
  { name: "Enlarger Timer", href: "/photography/enlarger-timer", description: "Darkroom enlarger timer with f-stop printing and test strip modes" },
  { name: "Film Development Timer", href: "/photography/film-development", description: "Multi-step sequential timer for B&W, C-41, and E-6 processing" },
  { name: "Photo Walk Timer", href: "/photography/photo-walk", description: "Timed photography challenges with shoot and review intervals" },
  { name: "Stand Development Timer", href: "/photography/stand-development", description: "Ambient countdown timer for stand and semi-stand development" },
  { name: "Countdown Timer", href: "/countdown", description: "Simple countdown for any timed activity" },
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
      label="Cyanotype Timer"
      description="UV exposure timer for cyanotype printing. Typical exposure times range from 5-20 minutes depending on UV intensity, negative density, and paper coating."
      below={<DurationInput value={duration} onChange={set_duration} />}
      seo_content={
        <TimerSeoContent
          timer_name="Cyanotype Timer"
          category_name="Photography"
          category_slug="photography"
          faq={CYANOTYPE_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h2>What Is a Cyanotype Timer?</h2>
          <p>
            Cyanotype printing requires precise UV exposure to produce rich, deep Prussian blue tones.
            Too little light and the image washes away; too much and you lose shadow detail to solarization.
            This free cyanotype timer gives you an audible alert when your exposure is complete, so you
            can focus on coating, registering negatives, and monitoring conditions instead of watching a clock.
          </p>
          <p>
            Set your target duration based on your UV source and previous test results, press start, and
            the timer counts down with a clear audio signal at zero. It works equally well for sunlight
            exposures outdoors and UV lamp setups in a studio or darkroom.
          </p>

          <h2>Understanding Cyanotype Exposure Variables</h2>
          <p>
            Unlike silver gelatin printing where the enlarger provides a fixed, repeatable light source,
            cyanotype exposure depends on ambient UV conditions that change constantly. The key variables are:
          </p>
          <ul>
            <li><strong>UV intensity</strong> — Direct midday sun at a low latitude delivers far more UV than morning light in northern climates. A UV index meter or smartphone app can help quantify conditions.</li>
            <li><strong>Negative density range</strong> — Digital negatives printed on inkjet transparency film typically require longer exposures than in-camera film negatives due to their higher maximum density.</li>
            <li><strong>Coating thickness and paper choice</strong> — Heavier coatings need more exposure. Watercolor papers with internal sizing hold chemistry differently than unsized papers, affecting both exposure and wash behavior.</li>
            <li><strong>Humidity</strong> — Slightly damp coatings expose faster than bone-dry ones. Some practitioners mist their coated paper before exposure for more responsive results.</li>
          </ul>

          <h2>How to Determine Your Exposure Time</h2>
          <ol>
            <li><strong>Coat a test strip</strong> — Apply your sensitizer to a strip of your printing paper and dry it completely in the dark.</li>
            <li><strong>Cover in increments</strong> — Place your densest negative area on the strip and expose for your minimum expected time. Then cover one section and expose the rest for an additional increment. Repeat 5-7 times.</li>
            <li><strong>Wash and evaluate</strong> — After washing and drying, identify the strip segment that shows the best shadow-to-highlight separation. That cumulative exposure is your starting point.</li>
            <li><strong>Refine with full prints</strong> — Make a full print at that time. Adjust by 10-15% in either direction if highlights are too flat or shadows lack depth.</li>
          </ol>

          <h2>Common Exposure Times by UV Source</h2>
          <ul>
            <li><strong>Direct summer sun (UV index 8+)</strong> — 4-8 minutes for most digital negatives on well-coated watercolor paper.</li>
            <li><strong>Overcast or winter sun (UV index 3-5)</strong> — 15-30 minutes. Consistency drops significantly, so bracket your exposures.</li>
            <li><strong>UV exposure unit (BL/BLB tubes)</strong> — 3-6 minutes at 4-6 inch distance. Very repeatable once calibrated.</li>
            <li><strong>UV LED panel</strong> — 2-5 minutes depending on wattage and distance. Modern LED units offer excellent uniformity.</li>
          </ul>

          <h2>Tips for Better Cyanotype Prints</h2>
          <ul>
            <li><strong>Always over-expose slightly</strong> — A cyanotype print that looks perfect during exposure will be too light after washing. Aim for a slightly bronzed appearance before the wash step.</li>
            <li><strong>Use a contact printing frame</strong> — Firm, even contact between negative and paper is essential for sharp detail. Spring-back frames let you check progress without losing registration.</li>
            <li><strong>Let prints oxidize overnight</strong> — Freshly washed cyanotypes deepen significantly over 24 hours as the iron complex oxidizes. Judge your final results the next day, not immediately after washing.</li>
            <li><strong>Pair with a <a href="/photography/film-development">film development timer</a></strong> — If you are shooting your own negatives, consistent development produces negatives with predictable density ranges for cyanotype printing.</li>
          </ul>
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
