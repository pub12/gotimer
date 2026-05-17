import { Metadata } from "next";
import {
  build_tea_breadcrumb_ld,
  build_tea_faq_ld,
  build_tea_metadata,
  build_tea_web_app_ld,
} from "@/lib/tea-preset-schema";
import { MULTI_CUP_FAQ } from "./faq";

export const metadata: Metadata = build_tea_metadata("multi-cup", {
  title: "Multi-Cup Tea Timer — Brew Up to 6 Teas at Once",
  description:
    "Free multi-cup tea timer for up to 6 concurrent steeps. Each cup has its own tea-type dropdown with the right steep time pre-set. No signup.",
});

const webAppLd = build_tea_web_app_ld({
  name: "GoTimer Multi-Cup Tea Timer",
  url_path: "/kitchen/tea-timer/multi-cup",
  description:
    "Free multi-cup tea timer for brewing up to six teas at once. Each cup has its own tea-type dropdown with the right steep time pre-loaded. Per-cup start, pause, and reset; shareable URL encodes the full set.",
  features: [
    "Up to 6 concurrent tea cups with independent countdowns",
    "Per-cup tea-type dropdown auto-sets the right steep time",
    "Per-cup start, pause, and reset controls",
    "Start All and Reset All bulk actions",
    "Shareable URL encodes the full cup set",
    "Audio cue when each cup finishes",
    "Mobile-friendly grid (single column on phones, 2-3 columns on desktop)",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_tea_breadcrumb_ld({
  leaf_slug: "multi-cup",
  leaf_name: "Multi-Cup Tea Timer",
});

const faqLd = build_tea_faq_ld(MULTI_CUP_FAQ);

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
      {children}
    </>
  );
}
