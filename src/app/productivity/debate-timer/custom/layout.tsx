import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";

export const metadata: Metadata = build_debate_metadata("custom", {
  title: "Custom Debate Timer — Build Your League&apos;s Round (Shareable URL)",
  description:
    "Build a custom debate timer with any speech sequence. The URL encodes your phases, so coaches can paste a single link into a school club page and the timer loads pre-configured.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Custom Debate Builder",
  url_path: "/productivity/debate-timer/custom",
  description:
    "Free custom debate-format builder. Edit phase names and durations, copy the shareable URL, and run a multi-phase timer with stoplight signals and judge controls.",
  features: [
    "Editable speech-phase list (name + duration in MM:SS)",
    "Shareable URL — phases encoded in the link, no signup required",
    "Multi-step timer with auto-advance",
    "Previous / Next phase controls for judges",
    "Stoplight signals on the final 60 seconds of each phase",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({
  leaf_slug: "custom",
  leaf_name: "Custom Format Builder",
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
      {children}
    </>
  );
}
