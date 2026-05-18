import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_faq_ld,
  build_debate_format_howto_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";
import { WSDC } from "@/lib/debate-formats";
import { WSDC_FAQ } from "./faq";

export const metadata: Metadata = build_debate_metadata("wsdc", {
  title: "World Schools Debate Timer — WSDC 8-Min Speeches with POIs",
  description:
    "Free WSDC (World Schools Debating Championships) timer. Eight 8-min speeches, two 4-min replies, POIs minute 1-7. Projectable, judge controls. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer World Schools Debate Timer",
  url_path: "/productivity/debate-timer/wsdc",
  description:
    "Free World Schools Debating Championships (WSDC) timer. Six 8-minute constructive speeches followed by two 4-minute reply speeches, POIs allowed minute 1:00 to 7:00 of each constructive. Auto-advances through the 56-minute round.",
  features: [
    "All 8 WSDC phases pre-configured (six 8-min constructives + two 4-min replies)",
    "POI window indicator — minute 1:00 to 7:00 of each 8-min speech",
    "Judge controls — Previous Phase, Skip, Pause, Reset",
    "Stoplight panel — yellow 60s warning, red 30s warning",
    "Projection mode (press F) for tournament rounds",
    "No signup, no ads, no installation",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({
  leaf_slug: "wsdc",
  leaf_name: "World Schools",
});

const faqLd = build_debate_faq_ld(WSDC_FAQ);
const howtoLd = build_debate_format_howto_ld(WSDC);

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
