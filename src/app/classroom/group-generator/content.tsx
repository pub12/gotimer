"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { GroupGenerator } from "@/components/classroom/group-generator";
import { GROUP_GEN_FAQ } from "./faq";

const RELATED = [
  {
    name: "Groups of 3 Generator",
    href: "/classroom/group-generator/teams-of-3",
    description:
      "Same tool with the group size locked to 3 — useful for jigsaw activities.",
  },
  {
    name: "Groups of 4 Generator",
    href: "/classroom/group-generator/teams-of-4",
    description:
      "Same tool with the group size locked to 4 — the most-used team size.",
  },
  {
    name: "Name Picker",
    href: "/classroom/name-picker",
    description:
      "After making groups, randomly call on one student to summarise their group&apos;s thinking.",
  },
  {
    name: "Classroom Timer",
    href: "/productivity/classroom",
    description:
      "Pair with a projected countdown for timed group-work sessions.",
  },
  {
    name: "Toolkit Hub",
    href: "/classroom",
    description: "All four free classroom tools in one place.",
  },
];

export default function GroupGeneratorContent() {
  return (
    <ClassroomShell
      title="Random Group Generator for Teachers"
      intro="Paste your class list, pick a group size or count, get balanced random groups. Optional seed for reproducibility. Avoid repeating last week&apos;s pairs."
      crumbs={[{ name: "Group Generator" }]}
      tool={<GroupGenerator slug="group-gen-default" />}
      faq={GROUP_GEN_FAQ}
      related={RELATED}
    >
      <h2>How the generator works</h2>
      <p>
        It does a uniform-random Fisher-Yates shuffle of your full class list,
        then distributes students round-robin into groups. In{" "}
        <strong>groups of K</strong> mode you choose the size (3, 4, 5…) and
        the number of groups follows from the class size. In{" "}
        <strong>N groups</strong> mode you choose how many groups and the size
        follows. Either way, the algorithm balances sizes — a remainder is
        spread across earlier groups, not bunched at the end.
      </p>

      <h2>Seeding for fairness and reproducibility</h2>
      <p>
        A seed locks in the random draw. Same seed + same names + same mode =
        same groups, every time. Three common uses:
      </p>
      <ul>
        <li>
          <strong>Run the same groups across two periods.</strong> If your 1st
          and 3rd period both have the same project on the same day, use seed
          <code> wed-april-15</code> in both periods to produce parallel
          group structures.
        </li>
        <li>
          <strong>Share groups with a colleague.</strong> Two teachers in
          adjacent classrooms can produce identical groups by agreeing on a
          seed and pasting the same combined list.
        </li>
        <li>
          <strong>Reproduce groups after a refresh.</strong> If you closed the
          browser and need to recreate this morning&apos;s shuffle, type the
          same seed.
        </li>
      </ul>

      <h2>Avoid repeating last week&apos;s pairs</h2>
      <p>
        With this toggle on, the generator stores the pair-ups from your most
        recent shuffle in your browser&apos;s local storage. The next shuffle
        runs up to ten attempts and picks the one with the fewest repeat
        pairs. This isn&apos;t a hard constraint — with very small group sizes
        in a small class, some repeats are unavoidable — but it&apos;s usually
        enough to keep multi-week project groups feeling fresh.
      </p>

      <h2>Pedagogical patterns</h2>
      <ul>
        <li>
          <strong>Jigsaw expert groups</strong> — Use{" "}
          <Link href="/classroom/group-generator/teams-of-4">groups of 4</Link>
          {" "}for the expert phase, then re-shuffle to mixed groups for the
          teach-back phase. The seed feature lets you control which jigsaw a
          student lands in if you have specific reasons for matching.
        </li>
        <li>
          <strong>Think-pair-share</strong> — Use the picker for the
          &quot;share&quot; part. The pair part can be{" "}
          <Link href="/classroom/group-generator/teams-of-3">groups of 3</Link>
          {" "}if you want triads instead of pairs.
        </li>
        <li>
          <strong>Random project groups for the term</strong> — Run one
          shuffle at the start of the unit, save the result (copy to a Google
          Doc), and use those teams across multiple class periods until the
          project completes.
        </li>
        <li>
          <strong>Mixed-ability shuffling</strong> — Generic randomisation
          doesn&apos;t account for ability mix. For deliberately balanced
          mixed-ability groups, sort your list before pasting (highest →
          lowest performer), then groups-of-4 mode pairs row 1 with rows 8,
          15, 22, etc., giving roughly balanced groups by design.
        </li>
      </ul>

      <h2>What this tool doesn&apos;t do</h2>
      <p>
        It doesn&apos;t hard-exclude specific pairings (no &quot;Alice and Bob
        must not be together&quot; constraint), doesn&apos;t balance by
        gender / reading level / IEP, and doesn&apos;t persist multi-week
        history beyond the most recent shuffle. For deliberately balanced
        groupings on multiple axes, manual sorting before pasting is the
        intended workflow.
      </p>
    </ClassroomShell>
  );
}
