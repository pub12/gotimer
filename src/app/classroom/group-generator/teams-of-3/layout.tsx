import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { TEAMS_OF_3_FAQ } from "./faq";

export const metadata = build_classroom_metadata("group-generator/teams-of-3", {
  title: "Groups of 3 Generator — Free Random Triad Maker for Teachers",
  description:
    "Free random group-of-3 generator for teachers. Paste your class, get balanced triads. Seed for reproducibility, avoid repeating last week's groups.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Groups of 3 Generator",
  url_path: "/classroom/group-generator/teams-of-3",
  description:
    "Free random group generator with the group size pre-set to 3. Paste your class list and shuffle into balanced triads — ideal for jigsaw expert groups, triad discussion protocols, peer review rotations, and lab stations.",
  features: [
    "Group size locked to 3 (triads)",
    "Optional seed for reproducible groups",
    "Avoid repeating last week's pairings",
    "Copy-to-clipboard output",
    "Class list saved locally in your browser",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Group Generator", path: "/classroom/group-generator" },
  { name: "Teams of 3", path: "/classroom/group-generator/teams-of-3" },
]);

const faqLd = build_classroom_faq_ld(TEAMS_OF_3_FAQ);

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
