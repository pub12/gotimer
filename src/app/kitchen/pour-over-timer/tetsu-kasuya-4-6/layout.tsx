import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { TETSU_KASUYA } from "@/lib/coffee-recipes";
import { TETSU_KASUYA_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "tetsu-kasuya-4-6",
  "pour-over",
  {
    title: "Tetsu Kasuya 4:6 Method Timer — World Brewers Cup Recipe",
    description:
      "Free 4:6 method timer with Tetsu Kasuya's 2016 World Brewers Cup recipe pre-configured. 20g coffee, 300g water, 5 pours, sweetness/strength controlled independently.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Tetsu Kasuya 4:6 Method Timer",
  url_path: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
  description:
    "Free 4:6 method timer pre-configured with Tetsu Kasuya's 2016 World Brewers Cup recipe. 20g coffee, 300g water at 92°C, coarse grind. Five pours split 40%/60% — first two control sweetness/acidity, last three control strength. Drawdown finishes around 3:30.",
  features: [
    "Pre-loaded with Kasuya's published 4:6 recipe (20g/300g)",
    "Five-pour sequence with stage-by-stage water targets",
    "Audio cue at every pour transition",
    "Sweetness/strength explained inline",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for fast drawdowns",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "tetsu-kasuya-4-6",
  leaf_name: "Tetsu Kasuya 4:6 Method Timer",
});

const faqLd = build_coffee_faq_ld(TETSU_KASUYA_FAQ);
const recipeLd = build_pour_over_recipe_ld(TETSU_KASUYA);

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
