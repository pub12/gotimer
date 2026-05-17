import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { TEA_HUB_FAQ } from "./faq";
import { TeaHubTimer } from "./timer";

export const metadata: Metadata = {
  title: "Free Tea Timer — Steeping Times for Every Tea + Multi-Cup Mode",
  description:
    "Free tea timer with per-type presets (green, oolong, white, pu-erh, herbal, matcha) and multi-cup gongfu mode. Steeping chart included. No signup, no ads.",
  alternates: {
    canonical: "/kitchen/tea-timer",
  },
  openGraph: {
    title: "Free Tea Timer — Per-Type Presets + Multi-Cup Mode",
    description:
      "Free tea timer with per-type presets for green, oolong, white, black, pu-erh, herbal, and matcha. Multi-cup and gongfu modes included.",
    url: "https://gotimer.org/kitchen/tea-timer",
  },
  twitter: {
    card: "summary",
    title: "Tea Timer",
    description:
      "Free tea timer with per-type presets and multi-cup gongfu mode. No signup.",
  },
};

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Tea Timer",
  url_path: "/kitchen/tea-timer",
  description:
    "Free tea steeping timer with seven per-tea-type presets (green, black, oolong, white, pu-erh, herbal, matcha), a gongfu cha multi-infusion timer, and a multi-cup brewing grid for concurrent steeps. Includes a comprehensive steeping-time chart by tea type. Audio cue at finish.",
  features: [
    "Seven per-tea-type presets with steep time and temperature pre-set",
    "Gongfu cha multi-infusion timer (8 infusions auto-progressing)",
    "Multi-cup brewing grid for up to 6 concurrent steeps",
    "Comprehensive steeping-time chart by tea type and sub-variety",
    "Shareable URL — each setup encodes in the link",
    "Audio cue when each timer completes",
    "Wake lock keeps screen on through the brew",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({});

const faqLd = build_tea_faq_ld(TEA_HUB_FAQ);

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
      <TeaHubTimer />
    </>
  );
}
