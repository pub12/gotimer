import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { GROUP_GEN_FAQ } from "./faq";
import GroupGeneratorContent from "./content";

export const metadata = build_classroom_metadata("group-generator", {
  title: "Group Generator for Teachers — Free Random Group Maker",
  description:
    "Free random group generator for teachers. Paste your class list, pick group size or count, get balanced random groups. Seed for reproducibility. Avoid repeating last week's pairs.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Random Group Generator",
  url_path: "/classroom/group-generator",
  description:
    "Free random group generator for teachers. Paste a class list, choose groups-of-N or N-groups mode, and shuffle. Seedable for reproducibility, with a built-in heuristic that biases against repeating last week's pair-ups.",
  features: [
    "Two modes: groups of K or N groups",
    "Optional seed for reproducible groups",
    "Avoid repeating last week's pairs (browser-local history)",
    "Copy-to-clipboard output",
    "Class list saved in local browser storage",
    "Handles 1-200 names",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Group Generator", path: "/classroom/group-generator" },
]);

const faqLd = build_classroom_faq_ld(GROUP_GEN_FAQ);

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
      <GroupGeneratorContent />
    </>
  );
}
