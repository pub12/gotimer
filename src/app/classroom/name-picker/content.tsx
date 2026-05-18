"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { NamePicker } from "@/components/classroom/name-picker";
import { NAME_PICKER_FAQ } from "./faq";

const RELATED = [
  {
    name: "Group Generator",
    href: "/classroom/group-generator",
    description:
      "After picking individuals, generate random groups from the same class list.",
  },
  {
    name: "Classroom Noise Meter",
    href: "/classroom/noise-meter",
    description:
      "Project a noise meter during quiet-work transitions after a cold call.",
  },
  {
    name: "Tally Counter",
    href: "/classroom/tally-counter",
    description:
      "Keep a tally of which students answered correctly during cold calling.",
  },
  {
    name: "Classroom Timer",
    href: "/productivity/classroom",
    description:
      "Projectable countdown for transitions, tests, and group work.",
  },
  {
    name: "Toolkit Hub",
    href: "/classroom",
    description: "All four free classroom tools in one place.",
  },
];

export default function NamePickerContent() {
  return (
    <ClassroomShell
      title="Random Name Picker for Classrooms"
      intro="Paste your class list, press Spin, get a random student. The list is saved in this browser only — no account, no upload."
      crumbs={[{ name: "Name Picker" }]}
      tool={<NamePicker slug="name-picker-default" />}
      faq={NAME_PICKER_FAQ}
      related={RELATED}
    >
      <h2>How to use this classroom name picker</h2>
      <ol>
        <li>
          <strong>Paste your class list</strong> into the textarea — one name
          per line, or comma-separated from a spreadsheet column. Duplicates
          are removed automatically.
        </li>
        <li>
          <strong>Press Spin.</strong> The wheel turns for about five seconds
          and lands on a random student.
        </li>
        <li>
          <strong>Repeat for the next question.</strong> If the &quot;Remove
          name after spin&quot; toggle is on (default), the picked student is
          dropped from the wheel — useful for cold-call rotations where every
          student gets called once.
        </li>
        <li>
          <strong>Close the tab when you&apos;re done.</strong> Your class list
          is saved in your browser; come back tomorrow and it&apos;s still
          there. Clear it with the Clear button or by emptying the textarea.
        </li>
      </ol>

      <h2>Why teachers use a wheel instead of mental random</h2>
      <p>
        Teachers calling on students from memory unintentionally bias toward
        the same five or six high-confidence kids per class. A randomised
        picker breaks this pattern. Research summarised in Doug Lemov&apos;s{" "}
        <em>Teach Like a Champion</em> found that <strong>cold-call rotations
        increase participation</strong> for previously-quiet students and that
        the social cost of being called on falls when every student knows the
        call is random rather than directed at them.
      </p>

      <h2>Cold-call best practices</h2>
      <ul>
        <li>
          <strong>Pose the question first, then spin.</strong> Every student
          must process the question. The wheel selects who answers, not who
          thinks.
        </li>
        <li>
          <strong>Use wait time after the pick.</strong> Three to five seconds
          of silence after the name lands lets the chosen student gather their
          thought. Avoid jumping in to rephrase.
        </li>
        <li>
          <strong>No gotcha.</strong> A wrong answer is feedback. Move on, but
          come back to the same student later that period with a related,
          slightly easier question so they end on a win.
        </li>
        <li>
          <strong>Reset the list each period or unit.</strong> Re-paste the
          full class list to start a fresh rotation. Some teachers keep
          separate rotations per period using browser bookmarks with different
          names.
        </li>
        <li>
          <strong>Pair with random groups.</strong> After a cold-call session,
          shift to{" "}
          <Link href="/classroom/group-generator">random groups</Link> for the
          collaborative portion of the lesson — the same shuffling principle
          applies.
        </li>
      </ul>

      <h2>Privacy and what we don&apos;t do</h2>
      <p>
        Your class list is stored in your browser&apos;s local storage on this
        device only. It is not sent to a server, not synchronised across
        devices, and not visible to anyone but you. We do not require a Google
        Classroom or other roster sync. We do not store student PII. If you
        clear browser data or use a different machine, the list resets.
      </p>

      <h2>For substitute teachers and shared computers</h2>
      <p>
        Save the regular teacher&apos;s class list on the classroom computer
        and a substitute can use the wheel the same way without re-typing
        anything. Different browser profiles (or incognito mode) keep separate
        lists, so shared-computer setups don&apos;t leak rosters between
        teachers.
      </p>
    </ClassroomShell>
  );
}
