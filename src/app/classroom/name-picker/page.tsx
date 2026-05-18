import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { NAME_PICKER_FAQ } from "./faq";
import NamePickerContent from "./content";

export const metadata = build_classroom_metadata("name-picker", {
  title: "Classroom Name Picker — Free, No Signup, Save Your Class List",
  description:
    "Free random student name picker for teachers. Save your class list, remove names after picking, spinning wheel. No signup, no ads. Works on smartboards.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Classroom Name Picker",
  url_path: "/classroom/name-picker",
  description:
    "Free random name picker for the classroom. Paste your class list once and spin to call on a random student. Remove-after-pick toggle, class-list saved in the browser, no account required.",
  features: [
    "Spinning SVG wheel — 60fps on low-spec Chromebooks",
    "Class list saved in local browser storage",
    "Remove-after-pick toggle for fair cold-call rotation",
    "Paste from a CSV, comma-separated list, or one-per-line",
    "Smartboard and projector friendly",
    "No signup, no ads, no upload",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Name Picker", path: "/classroom/name-picker" },
]);

const faqLd = build_classroom_faq_ld(NAME_PICKER_FAQ);

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
      <NamePickerContent />
    </>
  );
}
