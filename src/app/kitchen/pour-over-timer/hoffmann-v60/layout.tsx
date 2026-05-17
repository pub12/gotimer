import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { HOFFMANN_V60 } from "@/lib/coffee-recipes";
import { HOFFMANN_V60_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "hoffmann-v60",
  "pour-over",
  {
    title: "Hoffmann V60 Timer — James Hoffmann's Ultimate V60 Recipe",
    description:
      "Free V60 pour-over timer with James Hoffmann's Ultimate V60 recipe pre-configured: 15g coffee, 250g water, 4 pours, finish at 3:30. Audio cues per pour. No signup.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Hoffmann V60 Pour-Over Timer",
  url_path: "/kitchen/pour-over-timer/hoffmann-v60",
  description:
    "Free pour-over timer pre-configured with James Hoffmann's Ultimate V60 Technique (2021). 15g coffee, 250g water at 93°C, medium-fine grind. Bloom + four 50g pours + drawdown, finishing at 3:30.",
  features: [
    "Pre-loaded with Hoffmann's published 15g/250g recipe",
    "Pour-by-pour water target display (50g → 100g → 150g → 200g → 250g)",
    "Audio cue at every pour transition",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for fast drawdowns",
    "Direct link to Hoffmann's source video",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "hoffmann-v60",
  leaf_name: "Hoffmann V60 Timer",
});

const faqLd = build_coffee_faq_ld(HOFFMANN_V60_FAQ);
const recipeLd = build_pour_over_recipe_ld(HOFFMANN_V60);

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
