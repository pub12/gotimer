import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
  build_espresso_recipe_ld,
} from "@/lib/coffee-preset-schema";
import { TWENTY_FIVE_SECOND_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "25-second-shot",
  "espresso",
  {
    title: "25 Second Espresso Timer — Free Classic Shot Timer",
    description:
      "Free 25 second espresso timer with first-drip capture and 25-30s target band locked in. Classic double-shot recipe: 18g in, 36g out, 25-30 seconds. No signup.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer 25-Second Espresso Shot Timer",
  url_path: "/kitchen/espresso-timer/25-second-shot",
  description:
    "Free 25-second espresso shot timer pre-configured for the classic double shot: 18g dose, 36g yield, 25-30 second target window. First-drip capture, audio cues at 25s and 30s, target band colored amber/emerald/rose.",
  features: [
    "Pre-set 25-30 second target band",
    "First-drip button captures pre-infusion duration",
    "Audio cue at 25s (enter target) and 30s (exit target)",
    "Target band turns emerald in range, rose past",
    "Both total time and extraction time visible",
    "Wake lock keeps screen on during the shot",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "espresso",
  leaf_slug: "25-second-shot",
  leaf_name: "25 Second Espresso Timer",
});

const faqLd = build_coffee_faq_ld(TWENTY_FIVE_SECOND_FAQ);

const recipeLd = build_espresso_recipe_ld({
  name: "Classic 25-Second Double Espresso",
  description:
    "Standard double-shot espresso recipe: 18g dose, 36g yield, 25-30 second extraction. The default recipe espresso shots have been dialed to for decades.",
  target_min: 25,
  target_max: 30,
  dose_g: 18,
  yield_g: 36,
});

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
