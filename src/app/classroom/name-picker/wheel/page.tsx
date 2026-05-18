"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { NamePicker } from "@/components/classroom/name-picker";
import { NAME_WHEEL_FAQ } from "./faq";

const RELATED = [
  {
    name: "Name Picker (default)",
    href: "/classroom/name-picker",
    description: "Same tool, broader long-form copy for cold-call rotations.",
  },
  {
    name: "Name Picker — No Signup",
    href: "/classroom/name-picker/no-signup",
    description:
      "Same wheel, framed for searchers looking specifically for a no-account option.",
  },
  {
    name: "Group Generator",
    href: "/classroom/group-generator",
    description:
      "Random groups from the same class list — paste once, use everywhere.",
  },
  {
    name: "Toolkit Hub",
    href: "/classroom",
    description: "All four free classroom tools in one place.",
  },
];

export default function Page() {
  return (
    <ClassroomShell
      title="Name Picker Wheel"
      intro="A spinning name picker wheel built for classrooms. Paste your class list, spin, get a random student — 60fps on Chromebooks, no signup, no ads."
      crumbs={[
        { name: "Name Picker", href: "/classroom/name-picker" },
        { name: "Wheel" },
      ]}
      tool={<NamePicker slug="name-picker-wheel" />}
      faq={NAME_WHEEL_FAQ}
      related={RELATED}
    >
      <h2>What makes this name picker wheel different</h2>
      <p>
        Most spinning name pickers online are built on HTML Canvas — which
        looks fine on modern desktops but drops frames on the Chromebooks
        actually deployed in classrooms. This wheel uses an SVG rendered once,
        then animated with a single CSS <code>transform: rotate()</code>. The
        browser hands the animation to the GPU and the spin stays smooth even
        on a $200 Celeron Chromebook.
      </p>
      <p>
        Everything else is built for the way teachers really use a name
        wheel: paste your class list once and it&apos;s saved locally; turn
        the &quot;remove after pick&quot; toggle on for fair cold-call
        rotations; project full-screen with high-contrast slice colours
        readable from the back of a classroom.
      </p>

      <h2>Setup in 60 seconds</h2>
      <ol>
        <li>
          <strong>Paste your students.</strong> One name per line, or paste a
          comma-separated list from a spreadsheet. Duplicates are removed.
        </li>
        <li>
          <strong>Spin.</strong> The wheel turns for about five seconds with a
          decelerating ease, lands on a random slice, and shows the selected
          name in a card below.
        </li>
        <li>
          <strong>Bookmark this page.</strong> The list is saved in your
          browser. The next time you open the bookmark, it&apos;s already
          populated.
        </li>
      </ol>

      <h2>When to use a wheel and when to skip it</h2>
      <p>
        Use the wheel when you want the social fairness of a random pick
        <em> and</em> the engagement of a visible process. Skip the wheel when
        you want to call on a specific student for a specific question — the
        wheel is for fairness, not for differentiated questioning. A
        well-designed lesson has both: random cold calls for participation,
        targeted prompts for individual support.
      </p>

      <h2>Accessibility considerations</h2>
      <p>
        The wheel has an ARIA <code>role=&quot;img&quot;</code> with a label,
        and the result card uses <code>aria-live=&quot;polite&quot;</code> so
        screen readers announce the picked name. The colour palette uses
        contrast levels that pass WCAG AA against the wheel labels. If you
        teach a student with vestibular sensitivity, consider switching to the{" "}
        <Link href="/classroom/name-picker">non-wheel name picker</Link> or
        offering a quiet pick (you read the chosen name) rather than
        full-screen projection.
      </p>

      <h2>Embed and projection</h2>
      <p>
        Open the page on the classroom computer, press <code>F11</code>{" "}
        (Windows / ChromeOS) or use the green button (macOS) to enter
        full-screen. The wheel scales to the display. We don&apos;t offer an
        official OBS or iframe embed for the wheel because the input textarea
        doesn&apos;t make sense as an overlay — for streaming, the standalone
        page in a browser window is the right pattern.
      </p>
    </ClassroomShell>
  );
}
