import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { AEROPRESS_INVERTED } from "@/lib/coffee-recipes";
import { AEROPRESS_INVERTED_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "aeropress-inverted",
  "pour-over",
  {
    title: "Inverted AeroPress Timer — Free Upside-Down Brewing Timer",
    description:
      "Free inverted AeroPress timer with the 1:12 recipe pre-configured: 18g coffee, 220g water, 30s bloom, 1:15 steep, flip-and-press 30s. Stronger, fuller body than standard.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Inverted AeroPress Timer",
  url_path: "/kitchen/pour-over-timer/aeropress-inverted",
  description:
    "Free inverted AeroPress timer pre-configured with the World AeroPress Championship-style upside-down recipe. 18g coffee, 220g water at 82°C, medium-fine grind. Bloom + fill + steep + flip-press sequence.",
  features: [
    "Pre-loaded with the 1:12 inverted AeroPress recipe (18g/220g)",
    "Bloom + fill + steep + flip-press phases",
    "Audio cue at every phase transition",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for press timing",
    "Cross-linked to standard upright AeroPress recipe",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "aeropress-inverted",
  leaf_name: "Inverted AeroPress Timer",
});

const faqLd = build_coffee_faq_ld(AEROPRESS_INVERTED_FAQ);
const recipeLd = build_pour_over_recipe_ld(AEROPRESS_INVERTED);

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
