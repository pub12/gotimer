"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { GroupGenerator } from "@/components/classroom/group-generator";
import { TEAMS_OF_4_FAQ } from "./faq";

const RELATED = [
  {
    name: "Groups of 3 Generator",
    href: "/classroom/group-generator/teams-of-3",
    description:
      "Triads instead of quads — better for shorter tasks and tighter accountability.",
  },
  {
    name: "Custom Group Generator",
    href: "/classroom/group-generator",
    description:
      "Full controls — any group size, N-groups mode, mixed configurations.",
  },
  {
    name: "Name Picker",
    href: "/classroom/name-picker",
    description:
      "Random cold-call after group work — call on one student per quad to share.",
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
      title="Groups of 4 Generator"
      intro="Random quads from your class list. Paste names, press Shuffle, get balanced groups of 4 — the most-used team size in classrooms."
      crumbs={[
        { name: "Group Generator", href: "/classroom/group-generator" },
        { name: "Teams of 4" },
      ]}
      tool={
        <GroupGenerator
          slug="group-gen-teams-of-4"
          default_mode="by_size"
          default_target={4}
          lock_target
        />
      }
      faq={TEAMS_OF_4_FAQ}
      related={RELATED}
    >
      <h2>Why quads are the default classroom team</h2>
      <p>
        Groups of 4 are the de-facto standard for K-12 collaborative learning
        because they support the most common pedagogical structures
        natively:
      </p>
      <ul>
        <li>
          <strong>Four roles</strong> — timekeeper, recorder, materials
          manager, presenter. Every student has a clear job; nobody can
          coast.
        </li>
        <li>
          <strong>Inner pairs</strong> — within a quad, students can do
          think-pair-share with the partner across from them, then share
          across the quad. Two layers of discussion in one structure.
        </li>
        <li>
          <strong>Pod seating</strong> — four desks pushed together is the
          canonical classroom pod. Groups of 4 map 1:1 to physical seating.
        </li>
        <li>
          <strong>Multi-week project balance</strong> — long enough projects
          benefit from four perspectives; three is occasionally too thin and
          five starts producing free-rider problems.
        </li>
      </ul>

      <h2>Four-role structure for accountability</h2>
      <ol>
        <li>
          <strong>Timekeeper</strong> — Watches the projected{" "}
          <Link href="/productivity/classroom">classroom timer</Link> and
          calls out the 5-minute and 1-minute warnings to the group.
        </li>
        <li>
          <strong>Recorder</strong> — Writes the group&apos;s answer on
          whiteboard, paper, or shared doc.
        </li>
        <li>
          <strong>Materials manager</strong> — Picks up and returns supplies
          for the group; the only student up out of their seat.
        </li>
        <li>
          <strong>Presenter</strong> — Speaks for the group during the share-
          out. Rotate this role each session so it&apos;s not always the same
          student.
        </li>
      </ol>

      <h2>Uneven splits</h2>
      <p>
        Most class sizes don&apos;t divide evenly by 4. Common patterns:
      </p>
      <ul>
        <li>
          <strong>25 students</strong> — six quads + one singleton, OR five
          quads + one quint. Use N-groups mode in the{" "}
          <Link href="/classroom/group-generator">main generator</Link> for
          the second option (6 groups distributes 25 as 4+4+4+4+4+5).
        </li>
        <li>
          <strong>26 students</strong> — six quads + one pair (acceptable for
          short tasks). Or switch to{" "}
          <Link href="/classroom/group-generator/teams-of-3">groups of 3</Link>
          {" "}with one quad, which produces eight triads + one pair.
        </li>
        <li>
          <strong>27 students</strong> — six quads + one triad. The triad
          usually self-organises fine; rotate which group is the triad over
          the unit.
        </li>
        <li>
          <strong>30 students</strong> — seven quads + one pair, or six quads
          + one sextet (acceptable for short discussion but unwieldy for
          project work).
        </li>
      </ul>

      <h2>Pair this with</h2>
      <p>
        After quads finish their task, project the{" "}
        <Link href="/classroom/noise-meter">noise meter</Link> during the
        transition back to whole-class discussion — students self-regulate
        volume as they return to their seats. Then use the{" "}
        <Link href="/classroom/name-picker">name picker</Link> to randomly
        call on one student per quad to share. The whole flow takes 30-45
        minutes for a substantive group task; pace it with the{" "}
        <Link href="/productivity/classroom">classroom timer</Link>.
      </p>
    </ClassroomShell>
  );
}
