import { Metadata } from "next";
import {
  build_debate_faq_ld,
  build_debate_web_app_ld,
  build_toastmasters_breadcrumb_ld,
  build_toastmasters_howto_ld,
  build_toastmasters_metadata,
} from "@/lib/debate-preset-schema";
import { ICE_BREAKER } from "@/lib/toastmasters-presets";
import { ICE_BREAKER_FAQ } from "./faq";

export const metadata: Metadata = build_toastmasters_metadata("ice-breaker", {
  title: "Toastmasters Ice Breaker Timer — 4-5-6 Min Green/Yellow/Red",
  description:
    "Free Toastmasters Ice Breaker speech timer. 4-5-6 signal cycle pre-configured. Projectable green/yellow/red lights, audio cues. No signup, no download.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Toastmasters Ice Breaker Timer",
  url_path: "/productivity/toastmasters-timer/ice-breaker",
  description:
    "Free Toastmasters Ice Breaker speech timer with the 4-5-6 signal cycle pre-loaded. Green at 4:00, yellow at 5:00, red at 6:00 — the standard qualifying window for Pathways Level 1 Project 1. Includes a 30-second grace window after red.",
  features: [
    "4-5-6 signal cycle pre-configured (green/yellow/red)",
    "Stoplight panel with audio cue at each transition",
    "30-second grace window after red light",
    "Projection mode (press F) for in-person meetings",
    "Wake lock keeps screen on through the speech",
    "No signup, ads, or installation required",
  ],
});

const breadcrumbLd = build_toastmasters_breadcrumb_ld({
  leaf_slug: "ice-breaker",
  leaf_name: "Ice Breaker",
});

const faqLd = build_debate_faq_ld(ICE_BREAKER_FAQ);
const howtoLd = build_toastmasters_howto_ld(ICE_BREAKER);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howtoLd) }}
      />
      {children}
    </>
  );
}
