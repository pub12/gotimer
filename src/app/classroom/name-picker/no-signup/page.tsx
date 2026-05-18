"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { NamePicker } from "@/components/classroom/name-picker";
import { NO_SIGNUP_FAQ } from "./faq";

const RELATED = [
  {
    name: "Name Picker (default)",
    href: "/classroom/name-picker",
    description: "Same tool, longer guidance on cold-call rotations.",
  },
  {
    name: "Name Picker Wheel",
    href: "/classroom/name-picker/wheel",
    description:
      "Same tool, framed for searches like &apos;name picker wheel&apos;.",
  },
  {
    name: "Group Generator",
    href: "/classroom/group-generator",
    description:
      "Same no-signup, no-upload policy applied to random groups.",
  },
  {
    name: "Toolkit Hub",
    href: "/classroom",
    description: "All four free, no-signup classroom tools.",
  },
];

export default function Page() {
  return (
    <ClassroomShell
      title="Name Picker — No Signup Required"
      intro="A random name picker for teachers with zero account creation, zero email gate, zero upload. Your class list stays in this browser only."
      crumbs={[
        { name: "Name Picker", href: "/classroom/name-picker" },
        { name: "No Signup" },
      ]}
      tool={<NamePicker slug="name-picker-no-signup" />}
      faq={NO_SIGNUP_FAQ}
      related={RELATED}
    >
      <h2>Three things we don&apos;t ask for</h2>
      <ul>
        <li>
          <strong>No email.</strong> No newsletter signup, no &quot;enter your
          email to continue&quot; gate, no email-required password reset
          because there&apos;s no password.
        </li>
        <li>
          <strong>No account.</strong> No Google Classroom sync, no Apple ID,
          no Microsoft 365 sign-in. The tool runs anonymously.
        </li>
        <li>
          <strong>No upload.</strong> The class list you paste is saved in
          your browser&apos;s local storage on this device. It is never sent
          to our server, never synced to a cloud, never visible to us.
        </li>
      </ul>

      <h2>What that means for privacy reviews</h2>
      <p>
        District technology directors evaluating new classroom tools usually
        run them through a privacy review: what data is collected, who
        processes it, where is it stored, who has access. For this tool, the
        answers are short — <strong>no student data is collected,
        processed, stored, or accessible by anyone but the teacher on the
        teacher&apos;s own device</strong>. There is no third-party data
        processor to evaluate, no PII transfer to document, no breach surface
        beyond the teacher&apos;s laptop.
      </p>
      <p>
        This pattern usually passes a privacy review on first pass. We can&apos;t
        sign a vendor data-processing addendum because we don&apos;t process
        the data — there&apos;s nothing for us to be accountable for.
      </p>

      <h2>How we make money if we&apos;re free</h2>
      <p>
        The classroom toolkit is built and maintained as part of GoTimer, a
        broader timer site supported by occasional small donations and our
        own labour. We don&apos;t run ads on the toolkit pages. We don&apos;t
        sell teacher email addresses. We don&apos;t upsell to a &quot;pro&quot;
        tier with locked features. The classroom toolkit is a public-good
        contribution from the GoTimer maintainers, and the rest of the site
        helps cover hosting.
      </p>

      <h2>If you&apos;d like to support us</h2>
      <p>
        The most useful thing teachers can do is link to this page from
        a school blog or share it with a colleague. Listicle and blog
        backlinks help this page rank for &quot;classroom name picker no
        signup&quot; searches and reach more teachers who&apos;d benefit. If
        you write for a teaching publication, an honest mention in a
        &quot;tools we use&quot; round-up means a lot.
      </p>

      <h2>Looking for more no-signup classroom tools?</h2>
      <p>
        The same policy applies across the whole{" "}
        <Link href="/classroom">classroom toolkit</Link>: the{" "}
        <Link href="/classroom/group-generator">group generator</Link>,{" "}
        <Link href="/classroom/noise-meter">noise meter</Link>, and{" "}
        <Link href="/classroom/tally-counter">tally counter</Link> all run
        without an account and without any data leaving your device. Bookmark
        the hub and you have all four under one URL.
      </p>
    </ClassroomShell>
  );
}
