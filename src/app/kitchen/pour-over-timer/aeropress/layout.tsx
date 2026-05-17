import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { AEROPRESS } from "@/lib/coffee-recipes";
import { AEROPRESS_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata("aeropress", "pour-over", {
  title: "AeroPress Timer — Free Standard AeroPress Recipe Timer",
  description:
    "Free AeroPress timer with the classic upright recipe pre-configured: 17g coffee, 250g water, 30s bloom, 1:00 steep, 30s press. Audio cues at every transition.",
});

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer AeroPress Timer",
  url_path: "/kitchen/pour-over-timer/aeropress",
  description:
    "Free AeroPress timer pre-configured with the standard upright recipe: 17g coffee, 250g water at 85°C, medium-fine grind. Bloom, fill, steep, press — full 4-phase sequence with audio cues.",
  features: [
    "Pre-loaded with the AeroPress classic recipe (17g/250g)",
    "Bloom + fill + steep + press phases",
    "Audio cue at every phase transition",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for press timing",
    "Cross-linked to inverted AeroPress recipe",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "aeropress",
  leaf_name: "AeroPress Timer",
});

const faqLd = build_coffee_faq_ld(AEROPRESS_FAQ);
const recipeLd = build_pour_over_recipe_ld(AEROPRESS);

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
