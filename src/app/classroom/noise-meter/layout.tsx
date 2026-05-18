import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { NOISE_METER_FAQ } from "./faq";

export const metadata = build_classroom_metadata("noise-meter", {
  title: "Classroom Noise Meter — Free, Mic-Based, No Audio Recorded",
  description:
    "Free classroom noise meter using your microphone. Bouncy-ball, bar, and color modes. No audio recorded or transmitted. Smartboard-friendly. No signup.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Classroom Noise Meter",
  url_path: "/classroom/noise-meter",
  description:
    "Free microphone-based noise meter for the classroom. Three visualizations (bouncy balls, animated bars, color-only) with a configurable threshold line. The browser reads microphone amplitude in real time — no audio is recorded, stored, or transmitted.",
  features: [
    "Three modes: bouncy balls, bars, color-only (accessibility)",
    "Configurable too-loud threshold",
    "Explicit microphone permission with clear privacy disclosure",
    "No audio recorded, stored, or transmitted",
    "Canvas animation runs at 60fps on Chromebooks",
    "Smartboard and projector friendly",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Noise Meter", path: "/classroom/noise-meter" },
]);

const faqLd = build_classroom_faq_ld(NOISE_METER_FAQ);

export default function Layout({ children }: { children: React.ReactNode }) {
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
      {children}
    </>
  );
}
