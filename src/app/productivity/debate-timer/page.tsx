import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_faq_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";
import { DEBATE_HUB_FAQ } from "./faq";
import { DebateHubTimer } from "./timer";

export const metadata: Metadata = build_debate_metadata(null, {
  title: "Debate Timer — Free PF, LD, Policy, WSDC, Parli Round Clock",
  description:
    "Free debate timer with pre-loaded Public Forum, Lincoln-Douglas, Policy, World Schools, and British Parliamentary speech times. Projectable, no signup, judge controls.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Debate Timer",
  url_path: "/productivity/debate-timer",
  description:
    "Free debate timer covering five major formats: NSDA Public Forum, Lincoln-Douglas, Policy, World Schools (WSDC), and British Parliamentary. Phases auto-advance, judges can rewind or skip, stoplight signals warn the speaker. Projectable at 1920×1080. No signup, no ads.",
  features: [
    "Five format presets — Public Forum, Lincoln-Douglas, Policy, WSDC, British Parliamentary",
    "Multi-step auto-advance through the full round",
    "Judge controls — Previous, Next/Skip, Pause, Reset",
    "Stoplight signal panel — green / yellow / red with audio cues",
    "Fullscreen / projection mode (press F)",
    "Custom format builder with shareable URL for state and invitational variants",
    "Audio cue on each phase transition",
    "No signup, ads, or installation required",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({});

const faqLd = build_debate_faq_ld(DEBATE_HUB_FAQ);

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
      <DebateHubTimer />
    </>
  );
}
