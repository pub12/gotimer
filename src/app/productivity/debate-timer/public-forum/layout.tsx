import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_faq_ld,
  build_debate_format_howto_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";
import { PUBLIC_FORUM } from "@/lib/debate-formats";
import { PUBLIC_FORUM_FAQ } from "./faq";

export const metadata: Metadata = build_debate_metadata("public-forum", {
  title: "Public Forum Debate Timer — NSDA Speech Times, Projectable",
  description:
    "Free Public Forum debate timer with NSDA 4-4-3-4-4-3-3-3-3-2-2 speech times pre-configured. 11-phase auto-advance, judge controls, stoplight signals. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Public Forum Debate Timer",
  url_path: "/productivity/debate-timer/public-forum",
  description:
    "Free Public Forum debate timer. NSDA standard speech times — 4-4-3-4-4-3-3-3-3-2-2 minutes — pre-loaded across 11 phases including three crossfires. Multi-step auto-advance with Previous and Skip controls for judges.",
  features: [
    "All 11 NSDA Public Forum phases pre-configured",
    "Auto-advances through constructives, crossfires, rebuttals, summaries, Grand Crossfire, final focus",
    "Judge controls — Previous Phase, Skip, Pause, Reset",
    "Stoplight panel — yellow 60s warning, red 30s warning, audio cue at zero",
    "Projection mode (press F) — readable to back of classroom at 1920×1080",
    "No signup, no ads, no installation",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({
  leaf_slug: "public-forum",
  leaf_name: "Public Forum",
});

const faqLd = build_debate_faq_ld(PUBLIC_FORUM_FAQ);
const howtoLd = build_debate_format_howto_ld(PUBLIC_FORUM);

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
