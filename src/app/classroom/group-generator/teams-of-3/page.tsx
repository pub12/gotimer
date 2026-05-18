"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { GroupGenerator } from "@/components/classroom/group-generator";
import { TEAMS_OF_3_FAQ } from "./faq";

const RELATED = [
  {
    name: "Groups of 4 Generator",
    href: "/classroom/group-generator/teams-of-4",
    description:
      "Quads instead of triads — the most-used team size in K-12 classrooms.",
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
      "After making triads, randomly pick a student to share their group&apos;s answer.",
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
      title="Groups of 3 Generator"
      intro="Random triads from your class list. Paste names, press Shuffle, get balanced groups of 3. Seed for reproducibility."
      crumbs={[
        { name: "Group Generator", href: "/classroom/group-generator" },
        { name: "Teams of 3" },
      ]}
      tool={
        <GroupGenerator
          slug="group-gen-teams-of-3"
          default_mode="by_size"
          default_target={3}
          lock_target
        />
      }
      faq={TEAMS_OF_3_FAQ}
      related={RELATED}
    >
      <h2>Why triads work in the classroom</h2>
      <p>
        A group of 3 hits a sweet spot — large enough that one student
        can&apos;t coast through silently the way they might in a pair, but
        small enough that everyone has a clear share of the work. Research on
        cooperative learning consistently flags 3-person groups as the
        most-balanced size for short tasks (10-20 minutes of group work);
        4-person groups become more useful for longer projects with
        differentiated roles.
      </p>

      <h2>Pedagogical patterns that suit triads</h2>
      <ul>
        <li>
          <strong>Jigsaw expert groups</strong> — Three students each become
          expert on one section, then re-form into new groups to teach each
          other. Easier to manage with triads than quads because each expert
          has a clear domain.
        </li>
        <li>
          <strong>Think-Triad-Share</strong> — A variant on Think-Pair-Share
          where the pair becomes a trio. The third voice adds variance: if two
          students agree, the third&apos;s different perspective surfaces;
          if they disagree, the third casts a deciding voice.
        </li>
        <li>
          <strong>Reciprocal teaching</strong> — One student summarises, one
          questions, one predicts — a triad fits the three-role structure
          natively.
        </li>
        <li>
          <strong>Lab station rotation</strong> — Three students per station
          let one observe, one record, one manipulate. Quads create one
          observer-too-many.
        </li>
        <li>
          <strong>Peer review writing</strong> — Three reviewers per piece
          provides triangulation. Two reviewers can collapse into the same
          opinion; three reviewers more reliably surface disagreement.
        </li>
      </ul>

      <h2>What to do with an uneven class</h2>
      <p>
        Classes divisible by 3 (24, 27, 30) — easy. For classes with a
        remainder of 1 or 2:
      </p>
      <ul>
        <li>
          <strong>Remainder of 1</strong> (e.g., 22 students): switch to{" "}
          <Link href="/classroom/group-generator">N-groups mode</Link> with 7
          groups, producing one group of 4 and six groups of 3.
        </li>
        <li>
          <strong>Remainder of 2</strong> (e.g., 23 students): same N-groups
          approach with 7 groups, producing two groups of 4 and five groups of
          3 (15 + 8 = 23). Or accept one group of 2 (a pair) — fine for shorter
          tasks.
        </li>
      </ul>

      <h2>Pair with cold-call rotation</h2>
      <p>
        After triads complete their group task, use the{" "}
        <Link href="/classroom/name-picker">name picker</Link> to randomly
        select one student from each triad to share their group&apos;s
        thinking with the class. The randomness keeps every student
        accountable — no one knows in advance which voice will represent the
        group.
      </p>
    </ClassroomShell>
  );
}
