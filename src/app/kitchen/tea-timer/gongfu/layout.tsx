import { Metadata } from "next";
import {
  build_gongfu_howto_ld,
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { STANDARD_GONGFU, total_gongfu_seconds } from "@/lib/tea-presets";
import { GONGFU_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("gongfu", {
  title: "Gongfu Cha Timer — Auto-Progressing Multi-Infusion Tea Timer",
  description:
    "Free gongfu cha tea timer with auto-progressing infusion ladder (10-15-20-30-45-60-90-120s). For oolong, pu-erh, aged white. No signup.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Gongfu Cha Timer",
  url_path: "/kitchen/tea-timer/gongfu",
  description:
    "Free gongfu cha multi-infusion tea timer. Auto-progresses through a 10-second rinse plus 8 infusions (10s, 15s, 20s, 30s, 45s, 60s, 90s, 120s). For oolong, pu-erh, aged white, and Yunnan black tea brewed in a small gaiwan with a high leaf ratio.",
  features: [
    "Auto-progressing 8-infusion ladder (10s through 120s)",
    "Optional rinse step before infusion 1",
    "Per-infusion duration shown beside the timer",
    "Skip-step button for sessions that go faster than the curve",
    "Audio cue at every infusion transition",
    "Wake lock keeps screen on through the session",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "gongfu",
  leaf_name: "Gongfu Cha Timer",
});

const faqLd = build_tea_faq_ld(GONGFU_FAQ);

const total_minutes = Math.round(total_gongfu_seconds(STANDARD_GONGFU) / 60);
const howtoLd = build_gongfu_howto_ld({
  total_minutes,
  infusion_count: STANDARD_GONGFU.infusions.length,
  rinse_seconds: STANDARD_GONGFU.rinse_seconds,
  infusion_seconds: STANDARD_GONGFU.infusions,
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
