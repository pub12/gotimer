import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_metadata,
  build_coffee_web_app_ld,
} from "@/lib/coffee-preset-schema";
import { PRE_INFUSION_FAQ } from "./faq";

export const metadata: Metadata = build_coffee_metadata(
  "pre-infusion",
  "espresso",
  {
    title: "Espresso Pre-Infusion Timer — Tracks Bloom and First Drip",
    description:
      "Free espresso timer with pre-infusion phase + first-drip split. Tracks total extraction and post-first-drip time separately. No signup.",
  },
);

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Espresso Pre-Infusion Timer",
  url_path: "/kitchen/espresso-timer/pre-infusion",
  description:
    "Free espresso pre-infusion timer. Captures the time between pump-on and first drip (the pre-infusion phase) and tracks extraction time separately. Built for dialing in pre-infusion duration on machines with or without controlled pre-infusion.",
  features: [
    "First-drip button captures pre-infusion duration",
    "Both pre-infusion and extraction time visible",
    "Target band signals 25-30 second extraction window",
    "Audio cue at 25s and 30s",
    "Wake lock keeps screen on during the shot",
    "Works with any espresso machine — no API or IoT required",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({
  kind: "espresso",
  leaf_slug: "pre-infusion",
  leaf_name: "Espresso Pre-Infusion Timer",
});

const faqLd = build_coffee_faq_ld(PRE_INFUSION_FAQ);

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
      {children}
    </>
  );
}
