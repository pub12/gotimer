import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { HERBAL_TEA } from "@/lib/tea-presets";
import { HERBAL_TEA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("herbal", {
  title: "Herbal Tea Timer — 5-10 Min at 100°C (Chamomile, Peppermint, Rooibos)",
  description:
    "Free herbal tea (tisane) timer with chamomile, peppermint, rooibos, hibiscus, ginger, lemon balm timings. 100°C, 5-10 min. Caffeine-free.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Herbal Tea Timer",
  url_path: "/kitchen/tea-timer/herbal",
  description:
    "Free herbal tea (tisane) steeping timer for caffeine-free infusions. Pre-loaded with 6-minute default steep at boiling water (100°C). Sub-variety timings for chamomile, peppermint, rooibos, hibiscus, ginger, lemon balm.",
  features: [
    "Pre-loaded with 6-minute default herbal steep",
    "Sub-variety timings for chamomile, peppermint, rooibos, hibiscus, ginger, lemon balm",
    "Water temperature (100°C / 212°F — full boil)",
    "Caffeine-free infusions",
    "Audio cue at steep completion",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "herbal",
  leaf_name: "Herbal Tea Timer",
});

const faqLd = build_tea_faq_ld(HERBAL_TEA_FAQ);
const howtoLd = build_tea_howto_ld(HERBAL_TEA);

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
