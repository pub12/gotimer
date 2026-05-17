import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { KALITA_WAVE } from "@/lib/coffee-recipes";
import { KALITA_WAVE_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "kalita-wave",
  "pour-over",
  {
    title: "Kalita Wave Timer — Free Pour-Over Timer for Flat-Bottom Brews",
    description:
      "Free Kalita Wave 185 pour-over timer with the 22g/350g recipe pre-configured. Medium grind, three even pours, ~4-minute drawdown. Audio cues at every transition.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Kalita Wave Pour-Over Timer",
  url_path: "/kitchen/pour-over-timer/kalita-wave",
  description:
    "Free Kalita Wave 185 pour-over timer with a 22g/350g recipe pre-configured: medium grind, 93°C water, three even pours with rest periods. The flat-bottom dripper with three small drain holes produces a more forgiving brew than V60.",
  features: [
    "Pre-loaded Kalita Wave 185 recipe (22g/350g)",
    "Pour-by-pour water target display",
    "Audio cue at every pour transition",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for fast drawdowns",
    "Cross-linked to V60 and Chemex for comparison",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "kalita-wave",
  leaf_name: "Kalita Wave Timer",
});

const faqLd = build_coffee_faq_ld(KALITA_WAVE_FAQ);
const recipeLd = build_pour_over_recipe_ld(KALITA_WAVE);

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
