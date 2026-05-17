import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { WHITE_TEA } from "@/lib/tea-presets";
import { WHITE_TEA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("white", {
  title: "White Tea Timer — 2-5 Min at 75-85°C (Silver Needle, White Peony)",
  description:
    "Free white tea timer with Silver Needle (Bai Hao Yin Zhen), White Peony (Bai Mu Dan), Shou Mei, and aged white tea timings. 75-85°C, 3 min default.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer White Tea Timer",
  url_path: "/kitchen/tea-timer/white",
  description:
    "Free white tea steeping timer with sub-variety pre-sets for Silver Needle (Bai Hao Yin Zhen), White Peony (Bai Mu Dan), Shou Mei, and aged white tea. Default 75-85°C, 3-minute steep.",
  features: [
    "Pre-loaded with 3-minute default white tea steep",
    "Sub-variety timings for Silver Needle, White Peony, Shou Mei, aged white",
    "Water temperature reference (75-85°C / 167-185°F)",
    "Leaf-to-water ratio (3g per 8 oz)",
    "Audio cue at steep completion",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "white",
  leaf_name: "White Tea Timer",
});

const faqLd = build_tea_faq_ld(WHITE_TEA_FAQ);
const howtoLd = build_tea_howto_ld(WHITE_TEA);

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
