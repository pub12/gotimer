import React from "react";
import {
  build_classroom_breadcrumb_ld,
  build_classroom_faq_ld,
  build_classroom_metadata,
  build_classroom_web_app_ld,
} from "@/lib/classroom-tool-schema";
import { NO_SIGNUP_FAQ } from "./faq";

export const metadata = build_classroom_metadata("name-picker/no-signup", {
  title: "Name Picker — No Signup, No Account, No Email Required",
  description:
    "Free no-signup name picker for teachers. Class list saved in your browser only — never uploaded. No account, no email gate, no ads. FERPA-safe.",
});

const webAppLd = build_classroom_web_app_ld({
  name: "GoTimer Name Picker — No Signup",
  url_path: "/classroom/name-picker/no-signup",
  description:
    "Free name picker for teachers with strict no-account, no-upload, no-email policy. Class lists are saved in the browser only; nothing is sent to any server. Designed for district privacy reviews.",
  features: [
    "No signup, no email, no account",
    "Class list saved in local browser storage only",
    "Nothing uploaded — no server-side data",
    "Designed to pass district privacy reviews",
    "Smartboard and Chromebook friendly",
  ],
});

const breadcrumbLd = build_classroom_breadcrumb_ld([
  { name: "Name Picker", path: "/classroom/name-picker" },
  { name: "No Signup", path: "/classroom/name-picker/no-signup" },
]);

const faqLd = build_classroom_faq_ld(NO_SIGNUP_FAQ);

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
