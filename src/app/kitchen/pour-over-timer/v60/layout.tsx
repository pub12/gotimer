import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_pour_over_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { V60_CLASSIC } from "@/lib/coffee-recipes";
import { V60_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata("v60", "pour-over", {
  title: "V60 Timer — Free Pour-Over Timer for Hario V60",
  description:
    "Free Hario V60 pour-over timer with the classic four-pour recipe pre-configured. 15g coffee, 240g water, medium-fine grind. Audio cues at every pour. No signup.",
});

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer V60 Pour-Over Timer",
  url_path: "/kitchen/pour-over-timer/v60",
  description:
    "Free V60 pour-over timer with the generic four-pour technique pre-configured: 15g coffee, 240g water at 92°C, medium-fine grind. Bloom plus four pours, finishing the drawdown around 3:00-3:30.",
  features: [
    "Pre-loaded generic four-pour V60 recipe (15g/240g)",
    "Pour-by-pour water target display",
    "Audio cue at every pour transition",
    "Wake lock keeps screen on through the brew",
    "Skip-stage button for fast drawdowns",
    "Cross-linked to named V60 recipes (Hoffmann, Kasuya)",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "pour-over",
  leaf_slug: "v60",
  leaf_name: "V60 Timer",
});

const faqLd = build_coffee_faq_ld(V60_FAQ);
const recipeLd = build_pour_over_recipe_ld(V60_CLASSIC);

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
