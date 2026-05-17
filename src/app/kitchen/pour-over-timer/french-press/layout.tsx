import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { FRENCH_PRESS } from "@/lib/coffee-recipes";
import { FRENCH_PRESS_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "french-press",
  "pour-over",
  {
    title: "French Press Timer — Free Standard 4-Minute Brewing Timer",
    description:
      "Free French press timer with the classic 4-minute recipe pre-configured: 30g coffee, 500g water, coarse grind, plunge, pour. Audio cues at every phase transition.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer French Press Timer",
  url_path: "/kitchen/pour-over-timer/french-press",
  description:
    "Free French press timer pre-configured with the classic 4-minute recipe: 30g coffee, 500g water at 94°C, coarse grind. Pour, steep, plunge, decant — full sequence with audio cues at every transition.",
  features: [
    "Pre-loaded with the standard French press recipe (30g/500g)",
    "Pour + steep + plunge + decant phases",
    "Audio cue at every phase transition",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for varying steep times",
    "Cross-linked to Hoffmann French press variation",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "french-press",
  leaf_name: "French Press Timer",
});

const faqLd = build_coffee_faq_ld(FRENCH_PRESS_FAQ);
const recipeLd = build_pour_over_recipe_ld(FRENCH_PRESS);

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
