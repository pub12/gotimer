import { Metadata } from "next";
import {
  build_debate_breadcrumb_ld,
  build_debate_faq_ld,
  build_debate_format_howto_ld,
  build_debate_metadata,
  build_debate_web_app_ld,
} from "@/lib/debate-preset-schema";
import { BRITISH_PARLIAMENTARY } from "@/lib/debate-formats";
import { BRITISH_PARLIAMENTARY_FAQ } from "./faq";

export const metadata: Metadata = build_debate_metadata("british-parliamentary", {
  title: "British Parliamentary Debate Timer — WUDC 8×7 Speeches, POIs",
  description:
    "Free British Parliamentary (BP) debate timer. Eight 7-min speeches across four teams. POIs minute 1-6. Projectable, judge controls, no signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer British Parliamentary Debate Timer",
  url_path: "/productivity/debate-timer/british-parliamentary",
  description:
    "Free British Parliamentary debate timer for the WUDC (World Universities Debating Championships) format. Eight 7-minute speeches across four teams — Opening Government, Opening Opposition, Closing Government, Closing Opposition. POIs allowed minute 1:00 to 6:00.",
  features: [
    "All 8 BP speeches pre-configured (PM, LO, DPM, DLO, MG, MO, GW, OW)",
    "POI window indicator — minute 1:00 to 6:00 of each speech",
    "Judge controls — Previous Phase, Skip, Pause, Reset",
    "Stoplight panel — yellow 60s warning, red 30s warning",
    "Projection mode (press F) for tournament rounds",
    "No signup, no ads, no installation",
  ],
});

const breadcrumbLd = build_debate_breadcrumb_ld({
  leaf_slug: "british-parliamentary",
  leaf_name: "British Parliamentary",
});

const faqLd = build_debate_faq_ld(BRITISH_PARLIAMENTARY_FAQ);
const howtoLd = build_debate_format_howto_ld(BRITISH_PARLIAMENTARY);

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
