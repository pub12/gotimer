import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { PU_ERH_TEA } from "@/lib/tea-presets";
import { PU_ERH_TEA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("pu-erh", {
  title: "Pu-Erh Tea Timer — Gongfu (10-90s) and Western (3-5 Min) Modes",
  description:
    "Free pu-erh tea timer for sheng (raw) and shou (ripe) pu-erh. Gongfu 8-infusion auto-progress (10-15-20-30-45-60-90s) or Western 3-5 min default.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Pu-Erh Tea Timer",
  url_path: "/kitchen/tea-timer/pu-erh",
  description:
    "Free pu-erh tea steeping timer for fermented Chinese tea. Supports both gongfu (high-leaf, 8-15 short infusions) and Western (3g per 8oz, 3-5 minute steep). Defaults to 3-minute Western steep at 95-100°C.",
  features: [
    "Pre-loaded with 3-minute Western default steep",
    "Sheng (raw / green) and shou (ripe / cooked) sub-variety timings",
    "Water temperature reference (95-100°C / 203-212°F)",
    "Direct link to the gongfu timer for traditional multi-infusion brewing",
    "Audio cue at steep completion",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "pu-erh",
  leaf_name: "Pu-Erh Tea Timer",
});

const faqLd = build_tea_faq_ld(PU_ERH_TEA_FAQ);
const howtoLd = build_tea_howto_ld(PU_ERH_TEA);

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
