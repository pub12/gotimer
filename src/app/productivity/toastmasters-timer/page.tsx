import { Metadata } from "next";
import {
  build_debate_faq_ld,
  build_debate_web_app_ld,
  build_toastmasters_breadcrumb_ld,
  build_toastmasters_metadata,
} from "@/lib/debate-preset-schema";
import { TOASTMASTERS_HUB_FAQ } from "./faq";
import { ToastmastersHubTimer } from "./timer";

export const metadata: Metadata = build_toastmasters_metadata(null, {
  title: "Toastmasters Timer — Free Green/Yellow/Red Speech Signal Lights",
  description:
    "Free Toastmasters timer with Ice Breaker, prepared speech, Table Topics, and Evaluation cycles pre-loaded. Projectable green/yellow/red signal lights. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Toastmasters Timer",
  url_path: "/productivity/toastmasters-timer",
  description:
    "Free Toastmasters speech timer with green/yellow/red signal lights pre-loaded for the four standard speech types: Ice Breaker (4-5-6), prepared speech (5-6-7), Table Topics (1:00-1:30-2:00), and evaluation (2:00-2:30-3:00). Projectable for club meetings.",
  features: [
    "Four speech-type presets — Ice Breaker, prepared, Table Topics, evaluation",
    "Stoplight panel — green, yellow, red signal cycle with audio cues",
    "Projectable fullscreen mode (press F)",
    "Optional 30-second grace window after red",
    "Wake lock keeps the screen on through the speech",
    "No signup, ads, or installation required",
  ],
});

const breadcrumbLd = build_toastmasters_breadcrumb_ld({});

const faqLd = build_debate_faq_ld(TOASTMASTERS_HUB_FAQ);

export default function Page() {
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
      <ToastmastersHubTimer />
    </>
  );
}
