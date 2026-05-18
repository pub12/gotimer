import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { TEAMS_OF_4_FAQ } from "./faq";

export const metadata = build_classroom_metadata("group-generator/teams-of-4", {
  title: "Groups of 4 Generator — Free Random Quad Maker for Teachers",
  description:
    "Free random group-of-4 generator. Paste your class, get balanced quads. Seed for reproducibility, avoid repeating last week's groups. Smartboard-friendly.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Groups of 4 Generator",
  url_path: "/classroom/group-generator/teams-of-4",
  description:
    "Free random group generator with group size pre-set to 4 — the most-used team size in K-12 classrooms. Supports four-role structures, paired sub-tasks, and pod-style seating arrangements.",
  features: [
    "Group size locked to 4",
    "Optional seed for reproducible groups",
    "Avoid repeating last week's pair-ups",
    "Copy-to-clipboard output",
    "Class list saved locally",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Group Generator", path: "/classroom/group-generator" },
  { name: "Teams of 4", path: "/classroom/group-generator/teams-of-4" },
]);

const faqLd = build_classroom_faq_ld(TEAMS_OF_4_FAQ);

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
