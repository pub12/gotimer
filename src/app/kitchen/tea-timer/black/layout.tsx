import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { BLACK_TEA } from "@/lib/tea-presets";
import { BLACK_TEA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("black", {
  title: "Black Tea Timer — 3-5 Min at 90-100°C (Assam, Darjeeling, Earl Grey)",
  description:
    "Free black tea timer with Assam, Darjeeling, Ceylon, English Breakfast, Earl Grey, and Lapsang Souchong sub-variety timings. 90-100°C, 4 min default.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Black Tea Timer",
  url_path: "/kitchen/tea-timer/black",
  description:
    "Free black tea steeping timer with sub-variety pre-sets for English Breakfast, Assam, Darjeeling First Flush, Ceylon, Earl Grey, and Lapsang Souchong. Default 90-100°C, 4-minute steep.",
  features: [
    "Pre-loaded with 4-minute default black tea steep",
    "Sub-variety timings for Assam, Darjeeling, Ceylon, Earl Grey, Lapsang Souchong",
    "Water temperature reference (90-100°C / 194-212°F)",
    "Leaf-to-water ratio (2.5g per 8 oz)",
    "Audio cue at steep completion",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "black",
  leaf_name: "Black Tea Timer",
});

const faqLd = build_tea_faq_ld(BLACK_TEA_FAQ);
const howtoLd = build_tea_howto_ld(BLACK_TEA);

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
