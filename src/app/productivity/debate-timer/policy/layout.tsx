import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_faq_ld,
  build_debate_format_howto_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";
import { POLICY } from "@/lib/debate-formats";
import { POLICY_FAQ } from "./faq";

export const metadata: Metadata = build_debate_metadata("policy", {
  title: "Policy Debate Timer — NSDA Cross-X 8-3 Block, Free + Projectable",
  description:
    "Free Policy debate timer with NSDA cross-examination speech times pre-configured. 12 phases, 64-minute round, judge controls, stoplight signals. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Policy Debate Timer",
  url_path: "/productivity/debate-timer/policy",
  description:
    "Free Policy / Cross-Examination debate timer. NSDA standard speech times — four 8-minute constructives + four 3-minute CX periods + four 5-minute rebuttals — pre-loaded across 12 phases. Auto-advances with judge Previous/Skip controls.",
  features: [
    "All 12 NSDA Policy phases pre-configured (1AC, CX, 1NC, CX, 2AC, CX, 2NC, CX, 1NR, 1AR, 2NR, 2AR)",
    "Auto-advances through the full 64-minute round",
    "Judge controls — Previous Phase, Skip, Pause, Reset",
    "Stoplight panel — yellow 60s warning, red 30s warning",
    "Projection mode (press F) for in-person rounds",
    "No signup, no ads, no installation",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({
  leaf_slug: "policy",
  leaf_name: "Policy",
});

const faqLd = build_debate_faq_ld(POLICY_FAQ);
const howtoLd = build_debate_format_howto_ld(POLICY);

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
