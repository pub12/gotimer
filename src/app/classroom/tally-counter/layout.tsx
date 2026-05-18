import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { TALLY_FAQ } from "./faq";

export const metadata = build_classroom_metadata("tally-counter", {
  title: "Tally Counter Online — Free Single + Multi-Counter for Classrooms",
  description:
    "Free online tally counter for teachers. Single counter or multi-counter grid. Persists across reloads. Phone, tablet, and desktop. No signup.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Tally Counter",
  url_path: "/classroom/tally-counter",
  description:
    "Free online tally counter with single and multi-counter modes. Tap to count anything: participation tallies, behaviour data, votes, attempts. State persists in local storage across reloads.",
  features: [
    "Single counter and multi-counter grid modes",
    "Paste labels (one per line) for multi-counter setup",
    "State persists in local browser storage",
    "Phone, tablet, and desktop friendly",
    "Large readout for classroom projection",
    "No signup, no ads",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Tally Counter", path: "/classroom/tally-counter" },
]);

const faqLd = build_classroom_faq_ld(TALLY_FAQ);

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
