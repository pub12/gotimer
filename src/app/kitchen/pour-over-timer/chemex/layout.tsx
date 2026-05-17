import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { CHEMEX } from "@/lib/coffee-recipes";
import { CHEMEX_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata("chemex", "pour-over", {
  title: "Chemex Timer — Free Pour-Over Timer for Chemex Brewers",
  description:
    "Free Chemex pour-over timer with the standard 30g/500g recipe pre-configured. Medium-coarse grind, three pours, 5:00-5:30 drawdown. Audio cues at every transition.",
});

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Chemex Pour-Over Timer",
  url_path: "/kitchen/pour-over-timer/chemex",
  description:
    "Free Chemex pour-over timer pre-configured with the standard 3-cup recipe: 30g coffee, 500g water at 94°C, medium-coarse grind. Bloom plus three pours, with a long 2-minute drawdown for the thick bonded filter.",
  features: [
    "Pre-loaded with the standard Chemex 3-cup recipe (30g/500g)",
    "Pour-by-pour water target display (60g → 200g → 350g → 500g)",
    "Audio cue at every pour transition",
    "5-minute drawdown phase built into the recipe",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for faster drawdowns",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "chemex",
  leaf_name: "Chemex Timer",
});

const faqLd = build_coffee_faq_ld(CHEMEX_FAQ);
const recipeLd = build_pour_over_recipe_ld(CHEMEX);

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
