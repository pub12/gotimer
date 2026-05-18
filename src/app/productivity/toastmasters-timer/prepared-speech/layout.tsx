import { Metadata } from "next";
import {
  build_debate_faq_ld,
  build_debate_web_app_ld,
  build_toastmasters_breadcrumb_ld,
  build_toastmasters_howto_ld,
  build_toastmasters_metadata,
} from "@/lib/debate-preset-schema";
import { PREPARED_SPEECH } from "@/lib/toastmasters-presets";
import { PREPARED_SPEECH_FAQ } from "./faq";

export const metadata: Metadata = build_toastmasters_metadata("prepared-speech", {
  title: "Toastmasters Prepared Speech Timer — Classic 5-6-7 Min Cycle",
  description:
    "Free Toastmasters prepared speech timer with the standard 5-6-7 signal cycle. Green at 5:00, yellow at 6:00, red at 7:00. Projectable, audio cues, no signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Toastmasters Prepared Speech Timer",
  url_path: "/productivity/toastmasters-timer/prepared-speech",
  description:
    "Free Toastmasters prepared speech timer with the classic 5-6-7 signal cycle pre-loaded. Green at 5:00, yellow at 6:00, red at 7:00 — used for most Pathways prepared-speech projects and the International Speech Contest at every level.",
  features: [
    "5-6-7 signal cycle pre-configured (green/yellow/red)",
    "Stoplight panel with audio cue at each transition",
    "30-second grace window after red light",
    "Projection mode (press F) for in-person meetings",
    "Wake lock keeps screen on through the speech",
    "No signup, ads, or installation required",
  ],
});

const breadcrumbLd = build_toastmasters_breadcrumb_ld({
  leaf_slug: "prepared-speech",
  leaf_name: "Prepared Speech",
});

const faqLd = build_debate_faq_ld(PREPARED_SPEECH_FAQ);
const howtoLd = build_toastmasters_howto_ld(PREPARED_SPEECH);

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
