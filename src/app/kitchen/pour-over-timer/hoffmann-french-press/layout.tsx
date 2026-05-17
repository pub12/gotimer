import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { HOFFMANN_FRENCH_PRESS } from "@/lib/coffee-recipes";
import { HOFFMANN_FRENCH_PRESS_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "hoffmann-french-press",
  "pour-over",
  {
    title: "Hoffmann French Press Timer — James Hoffmann's Best Press Technique",
    description:
      "Free Hoffmann French press timer with the skim-and-rest method pre-configured: 30g/500g, 4-min steep, break crust, skim, 5-min rest, pour. Cleanest French press cup possible.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Hoffmann French Press Timer",
  url_path: "/kitchen/pour-over-timer/hoffmann-french-press",
  description:
    "Free French press timer pre-configured with James Hoffmann's 'Best French Press Technique' (2020). 30g coffee, 500g water at 94°C, coarse grind. Pour, 4-minute steep, crust-break, skim, 5-minute rest, pour without plunging — produces a much cleaner cup with minimal sediment.",
  features: [
    "Pre-loaded with Hoffmann's published French press recipe (30g/500g)",
    "9-minute total timing with skim-and-rest sequence",
    "Audio cue at every phase transition (steep, crust-break, rest, pour)",
    "Wake lock keeps screen on through the full 9 minutes",
    "Skip-stage button for varying steep times",
    "Direct link to Hoffmann's source video",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "hoffmann-french-press",
  leaf_name: "Hoffmann French Press Timer",
});

const faqLd = build_coffee_faq_ld(HOFFMANN_FRENCH_PRESS_FAQ);
const recipeLd = build_pour_over_recipe_ld(HOFFMANN_FRENCH_PRESS);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeLd) }}
      />
      {children}
    </>
  );
}
