import { Metadata } from "next";
import {
  build_debate_faq_ld,
  build_debate_web_app_ld,
  build_toastmasters_breadcrumb_ld,
  build_toastmasters_howto_ld,
  build_toastmasters_metadata,
} from "@/lib/debate-preset-schema";
import { TABLE_TOPICS } from "@/lib/toastmasters-presets";
import { TABLE_TOPICS_FAQ } from "./faq";

export const metadata: Metadata = build_toastmasters_metadata("table-topics", {
  title: "Table Topics Timer — 1:00-2:00 Min Toastmasters Impromptu Cycle",
  description:
    "Free Toastmasters Table Topics timer. 1:00 / 1:30 / 2:00 green/yellow/red signal cycle. Projectable for club meetings and Table Topics contests. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Table Topics Timer",
  url_path: "/productivity/toastmasters-timer/table-topics",
  description:
    "Free Toastmasters Table Topics timer. 1:00 / 1:30 / 2:00 green-yellow-red signal cycle pre-loaded for the impromptu speaking segment of a Toastmasters meeting and the Table Topics Contest at all levels.",
  features: [
    "1:00 / 1:30 / 2:00 signal cycle pre-configured",
    "Stoplight panel with audio cue at each transition",
    "15-second grace window after red light",
    "Projection mode (press F) for in-person meetings",
    "Wake lock keeps screen on through the speech",
    "No signup, ads, or installation required",
  ],
});

const breadcrumbLd = build_toastmasters_breadcrumb_ld({
  leaf_slug: "table-topics",
  leaf_name: "Table Topics",
});

const faqLd = build_debate_faq_ld(TABLE_TOPICS_FAQ);
const howtoLd = build_toastmasters_howto_ld(TABLE_TOPICS);

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
