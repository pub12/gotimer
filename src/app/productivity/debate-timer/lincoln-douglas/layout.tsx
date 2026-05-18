import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_faq_ld,
  build_debate_format_howto_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";
import { LINCOLN_DOUGLAS } from "@/lib/debate-formats";
import { LINCOLN_DOUGLAS_FAQ } from "./faq";

export const metadata: Metadata = build_debate_metadata("lincoln-douglas", {
  title: "Lincoln-Douglas Debate Timer — NSDA 6-3-7-3-4-6-3 Speech Clock",
  description:
    "Free Lincoln-Douglas debate timer with NSDA speech times pre-configured. Two cross-examinations, judge controls, stoplight signals, projection mode. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Lincoln-Douglas Debate Timer",
  url_path: "/productivity/debate-timer/lincoln-douglas",
  description:
    "Free Lincoln-Douglas debate timer. NSDA standard speech times — 6-3-7-3-4-6-3 minutes — pre-loaded across all 7 phases including both 3-minute cross-examinations. Auto-advances with judge Previous/Skip controls.",
  features: [
    "All 7 NSDA Lincoln-Douglas phases pre-configured",
    "Auto-advances through AC, CX, NC, CX, 1AR, NR, 2AR",
    "Judge controls — Previous Phase, Skip, Pause, Reset",
    "Stoplight panel — yellow 60s warning, red 30s warning",
    "Projection mode (press F) for in-person rounds",
    "No signup, no ads, no installation",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({
  leaf_slug: "lincoln-douglas",
  leaf_name: "Lincoln-Douglas",
});

const faqLd = build_debate_faq_ld(LINCOLN_DOUGLAS_FAQ);
const howtoLd = build_debate_format_howto_ld(LINCOLN_DOUGLAS);

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
