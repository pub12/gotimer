import React from "react";
import {
  build_embed_breadcrumb_ld,
  build_embed_faq_ld,
  build_embed_metadata,
  build_embed_web_app_ld,
} from "@/lib/embed-schema";
import EmbedHubContent from "./content";
import { EMBED_HUB_FAQ } from "./faq";

export const metadata = build_embed_metadata(null, {
  title: "Embed a Free Countdown Timer on Your Website — No Signup",
  description:
    "Free embeddable countdown timer, event widget, Pomodoro, and round timer for any website. WordPress, Shopify, Notion, Webflow. Paste an iframe — no signup, no watermark removal needed.",
});

const webAppLd = build_embed_web_app_ld({
  name: "GoTimer Embed Widget",
  url_path: "/embed",
  description:
    "Free iframe embed for countdown timers, event widgets, Pomodoro intervals, chess clocks, and round timers. Works on any HTML page — WordPress, Shopify, Notion, Webflow, Squarespace, Wix, Ghost, plain HTML. No signup, no account, customisable colors and themes.",
  features: [
    "Free iframe embed for every GoTimer",
    "Custom theme (light, dark, auto) and accent color",
    "Custom Google Font via URL parameter",
    "Auto-start, controls, and message customisation",
    "Live preview while configuring",
    "Works in WordPress, Shopify, Notion, Webflow, Squarespace, Wix, Ghost",
    "No signup, no account, no analytics on the embed iframe itself",
  ],
});

const breadcrumbLd = build_embed_breadcrumb_ld([]);
const faqLd = build_embed_faq_ld(EMBED_HUB_FAQ);

export default function Page() {
  const ld_blocks = [webAppLd, breadcrumbLd, faqLd];
  return (
    <>
      {ld_blocks.map((block, i) => (
        <script
          key={`ld-${i}`}
          type="application/ld+json"
          // Static, sanitized JSON-LD object — safe to inline.
          // skipcq: JS-0440
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <EmbedHubContent />
    </>
  );
}
