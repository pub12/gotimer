import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { GREEN_TEA } from "@/lib/tea-presets";
import { GREEN_TEA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("green", {
  title: "Green Tea Timer — 1-3 Min at 75-80°C (Sencha, Dragon Well, Gyokuro)",
  description:
    "Free green tea timer with Sencha, Dragon Well, Gyokuro, Bi Luo Chun, Genmaicha and matcha sub-variety timings. 75-80°C, 1-3 min default. No signup.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Green Tea Timer",
  url_path: "/kitchen/tea-timer/green",
  description:
    "Free green tea steeping timer with sub-variety pre-sets for Sencha, Dragon Well (Longjing), Gyokuro, Bi Luo Chun, and Genmaicha. Default 75-80°C, 1-3 minute steep. Audio cue on completion.",
  features: [
    "Pre-loaded with 2-minute default green tea steep",
    "Sub-variety timings for Sencha, Dragon Well, Gyokuro, Bi Luo Chun, Genmaicha",
    "Water temperature reference (75-80°C / 167-176°F)",
    "Leaf-to-water ratio (2g per 8 oz)",
    "Audio cue at steep completion",
    "Wake lock keeps screen on through the brew",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "green",
  leaf_name: "Green Tea Timer",
});

const faqLd = build_tea_faq_ld(GREEN_TEA_FAQ);
const howtoLd = build_tea_howto_ld(GREEN_TEA);

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
