import { Metadata } from "next";
import {
  build_debate_faq_ld,
  build_debate_web_app_ld,
  build_toastmasters_breadcrumb_ld,
  build_toastmasters_howto_ld,
  build_toastmasters_metadata,
} from "@/lib/debate-preset-schema";
import { EVALUATION } from "@/lib/toastmasters-presets";
import { EVALUATION_FAQ } from "./faq";

export const metadata: Metadata = build_toastmasters_metadata("evaluation", {
  title: "Toastmasters Evaluation Timer — 2:00-3:00 Min for Speech Evaluators",
  description:
    "Free Toastmasters evaluation timer with 2:00 / 2:30 / 3:00 signal cycle. For speech evaluators in club meetings and the Evaluation Contest. No signup.",
});

const webAppLd = build_debate_web_app_ld({
  name: "GoTimer Toastmasters Evaluation Timer",
  url_path: "/productivity/toastmasters-timer/evaluation",
  description:
    "Free Toastmasters speech-evaluation timer with the 2:00 / 2:30 / 3:00 signal cycle pre-loaded. Used by speech evaluators in club meetings and at the Toastmasters Evaluation Contest from Club through District level.",
  features: [
    "2:00 / 2:30 / 3:00 signal cycle pre-configured",
    "Stoplight panel with audio cue at each transition",
    "30-second grace window after red light",
    "Projection mode (press F) for in-person meetings",
    "Wake lock keeps screen on through the evaluation",
    "No signup, ads, or installation required",
  ],
});

const breadcrumbLd = build_toastmasters_breadcrumb_ld({
  leaf_slug: "evaluation",
  leaf_name: "Evaluation",
});

const faqLd = build_debate_faq_ld(EVALUATION_FAQ);
const howtoLd = build_toastmasters_howto_ld(EVALUATION);

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
