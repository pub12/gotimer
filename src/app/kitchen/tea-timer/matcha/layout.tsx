import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_howto_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { MATCHA } from "@/lib/tea-presets";
import { MATCHA_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("matcha", {
  title: "Matcha Timer — 30-Second Whisk for Usucha and Koicha",
  description:
    "Free matcha timer for ceremonial whisking. 30-second usucha cycle and 45-second koicha kneading. Bamboo chasen technique tips included.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Matcha Timer",
  url_path: "/kitchen/tea-timer/matcha",
  description:
    "Free matcha whisking timer for ceremonial usucha (thin tea — 2g, 60ml, 30s whisk) and koicha (thick tea — 4g, 30ml, 45s knead). Bamboo chasen technique notes inline.",
  features: [
    "Pre-loaded with 30-second usucha whisk cycle",
    "Sub-variety timings for usucha (thin), koicha (thick), culinary",
    "Water temperature reference (70-80°C / 158-176°F)",
    "Bamboo chasen + chawan technique notes",
    "Audio cue when whisking is complete",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "matcha",
  leaf_name: "Matcha Timer",
});

const faqLd = build_tea_faq_ld(MATCHA_FAQ);
const howtoLd = build_tea_howto_ld(MATCHA);

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
