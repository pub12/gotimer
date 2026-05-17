"use client";

import React, { Suspense } from "react";
import { TimerPage } from "@/components/timer/timer-page";
import { TimerSeoContent } from "@/components/timer/timer-seo-content";
import { countdownStrategy } from "@/lib/timer-strategies/countdown";
import { TeaInfo } from "@/components/tea/tea-info";
import { MATCHA } from "@/lib/tea-presets";
import { MATCHA_FAQ } from "./faq";

const RELATED_TIMERS = [
  {
    name: "Tea Timer Hub",
    href: "/kitchen/tea-timer",
    description: "All seven tea types + multi-cup and gongfu modes",
  },
  {
    name: "Green Tea Timer",
    href: "/kitchen/tea-timer/green",
    description: "Steeped green tea — 1-3 min at 75-80°C",
  },
  {
    name: "Multi-Cup Tea Timer",
    href: "/kitchen/tea-timer/multi-cup",
    description: "Up to 6 cups — whisk one matcha, steep three teas",
  },
  {
    name: "Espresso Timer",
    href: "/kitchen/espresso-timer",
    description: "Sibling beverage timer — pre-infusion + first-drip capture",
  },
  {
    name: "White Tea Timer",
    href: "/kitchen/tea-timer/white",
    description: "Closest delicate-flavor sibling — 75-85°C steeping",
  },
  {
    name: "Pour-Over Coffee Timer",
    href: "/kitchen/pour-over-timer",
    description: "Nine recipes — Hoffmann V60, Kasuya 4:6, more",
  },
];

function Content() {
  return (
    <TimerPage
      strategy={countdownStrategy}
      config={{ duration: MATCHA.steep_seconds }}
      label="Matcha Timer"
      description={`${MATCHA.temp_c}°C · ${MATCHA.ratio} · 30s whisk cycle`}
      below={<TeaInfo tea={MATCHA} />}
      seo_content={
        <TimerSeoContent
          timer_name="Matcha Timer"
          category_name="Kitchen"
          category_slug="kitchen"
          faq={MATCHA_FAQ}
          related_timers={RELATED_TIMERS}
        >
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-foreground mb-4">
            Matcha Timer
          </h1>
          <p>
            A free matcha whisking timer pre-loaded with the{" "}
            <strong>30-second usucha (thin tea) cycle</strong>. Matcha differs
            from every other tea on this site — it isn&apos;t steeped, it is
            whisked. The whole powdered leaf is consumed, which is why matcha
            delivers significantly more caffeine and L-theanine per gram than
            steeped green tea.
          </p>

          <h2>Usucha vs. koicha — the two preparations</h2>
          <ul>
            <li>
              <strong>Usucha (薄茶 — thin tea):</strong> 2g matcha + 60ml water
              at 75°C, whisked vigorously for 30 seconds. Produces a frothy,
              everyday matcha. This is what most home matcha drinkers and
              cafes make.
            </li>
            <li>
              <strong>Koicha (濃茶 — thick tea):</strong> 4g matcha + 30ml
              water at 70°C, kneaded slowly for 45 seconds with a gentle
              motion. Produces a thick, honey-like consistency. Reserved for
              high-grade ceremonial matcha and formal tea ceremony. Should
              never be whisked vigorously — that would produce foam where no
              foam belongs.
            </li>
          </ul>

          <h2>How to whisk matcha (usucha)</h2>
          <ol>
            <li>
              <strong>Heat water to 70-80°C.</strong> Boiling water scorches
              matcha powder and accentuates bitterness. If you don&apos;t
              have a variable kettle, boil and let rest 2 minutes (water
              drops about 5°C every 30s in a kettle off the heat).
            </li>
            <li>
              <strong>Sift 2g of matcha into a chawan (matcha bowl).</strong>{" "}
              The sifting step is non-optional — even high-grade matcha
              clumps, and clumps mean lumps at the bottom of the cup. Use a
              small fine-mesh sieve or a chashitsu (specialized matcha
              sifter).
            </li>
            <li>
              <strong>Pour 60ml of water onto the powder.</strong> The
              traditional gesture is to pour from the lip of the bowl
              outward to wet the powder evenly.
            </li>
            <li>
              <strong>Whisk for 30 seconds.</strong> Use a fast zigzag (W or
              M shape) motion — not a circular stir. The chasen&apos;s
              80-120 fine prongs aerate the water and create the
              characteristic frothy layer. Hold the chasen loosely; the wrist
              should do most of the work, not the arm.
            </li>
            <li>
              <strong>Lift the chasen out as the foam stabilizes.</strong>{" "}
              You should see a uniform layer of fine bubbles (micro-foam)
              across the top — no large bubbles, no powder lumps at the
              bottom. The matcha is ready to drink.
            </li>
          </ol>

          <h2>Ceremonial vs. culinary grade</h2>
          <p>
            Matcha is graded by leaf source, harvest timing, and grinding
            method. <strong>Ceremonial grade</strong> uses early-spring,
            shade-grown leaves stone-ground to 5-10 micron particles —
            vibrant green, sweet, drinks beautifully whisked into water.
            <strong> Culinary grade</strong> uses later harvests and is often
            machine-ground — more astringent, slightly bitter, made for
            lattes and baking. Drinking culinary-grade matcha straight
            whisked is unpleasant; using ceremonial matcha in a latte
            wastes its character. Match grade to use.
          </p>

          <h2>The chasen — bamboo whisks 101</h2>
          <p>
            A bamboo chasen (茶筅) is the right tool. The 80-120 fine prongs
            produce a finer foam than any kitchen whisk or electric frother
            can manage. Chasens are inexpensive ($10-20 for daily-use
            quality, $30-60 for traditional handcrafted Takayama-style
            chasens) and last 6-12 months of daily use before the prongs
            start to splinter. Store chasen tip-up on a chasen-naoshi (a
            ceramic holder) to maintain the prong shape.
          </p>

          <h2>Matcha lattes</h2>
          <p>
            For a matcha latte, whisk 2g of matcha into 30ml of hot water as
            usual to form a paste, then add 200ml of hot or cold milk. The
            paste step is essential — adding matcha powder directly to milk
            produces stubborn lumps. For iced matcha lattes, whisk into the
            small amount of water first, then pour over ice and add cold
            milk. Use culinary-grade matcha here; ceremonial is wasted under
            milk.
          </p>

          <h2>Storage</h2>
          <p>
            Matcha is the most fragile of all teas. The powdered leaf
            oxidises fast — vibrant green fades to dull yellow-green within
            weeks of exposure to air, light, and heat. Store unopened
            packages in the fridge; once opened, transfer to an airtight
            container kept in a cool dark cabinet and finish within 4-6
            weeks. Old matcha tastes dusty and flat — buy small quantities
            and use them fast.
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
