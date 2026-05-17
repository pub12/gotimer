import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { OOLONG_TEA } from "@/lib/tea-presets";
import { OOLONG_TEA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("oolong", {
  title: "Oolong Tea Timer — 2-4 Min at 85-95°C (Tieguanyin, Da Hong Pao)",
  description:
    "Free oolong tea timer with Tieguanyin, Da Hong Pao, Dong Ding, Milk Oolong, Phoenix Dancong, Oriental Beauty timings. Gongfu-friendly.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Oolong Tea Timer",
  url_path: "/kitchen/tea-timer/oolong",
  description:
    "Free oolong tea steeping timer with sub-variety pre-sets for Tieguanyin, Da Hong Pao, Dong Ding, Milk Oolong (Jin Xuan), Phoenix Dancong, and Oriental Beauty. Default 90°C, 3-minute Western steep. Gongfu-friendly.",
  features: [
    "Pre-loaded with 3-minute Western default steep",
    "Sub-variety timings for Tieguanyin, Da Hong Pao, Dong Ding, Milk Oolong, Dancong, Oriental Beauty",
    "Water temperature reference (85-95°C / 185-203°F)",
    "Leaf-to-water ratio (3g per 8 oz Western; gongfu-friendly)",
    "Direct link to the gongfu timer for multi-infusion brewing",
    "Audio cue at steep completion",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "oolong",
  leaf_name: "Oolong Tea Timer",
});

const faqLd = build_tea_faq_ld(OOLONG_TEA_FAQ);
const howtoLd = build_tea_howto_ld(OOLONG_TEA);

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
