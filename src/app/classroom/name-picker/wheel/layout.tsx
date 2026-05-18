import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { NAME_WHEEL_FAQ } from "./faq";

export const metadata = build_classroom_metadata("name-picker/wheel", {
  title: "Name Picker Wheel — Free Spinning Wheel for Classrooms",
  description:
    "Free spinning name picker wheel for teachers. SVG-based, 60fps on Chromebooks. Save your class list locally. No signup, no ads.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Name Picker Wheel",
  url_path: "/classroom/name-picker/wheel",
  description:
    "Free spinning name picker wheel for the classroom. SVG rendering with CSS transforms for smooth animation on low-spec Chromebooks. Save your class list in your browser; no account, no upload.",
  features: [
    "Spinning SVG wheel — GPU-accelerated CSS transform",
    "10-colour palette for high-contrast classroom display",
    "Remove-after-pick toggle for fair rotation",
    "Class list saved locally, never uploaded",
    "Reads cleanly on a 1080p projector",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Name Picker", path: "/classroom/name-picker" },
  { name: "Wheel", path: "/classroom/name-picker/wheel" },
]);

const faqLd = build_classroom_faq_ld(NAME_WHEEL_FAQ);

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
