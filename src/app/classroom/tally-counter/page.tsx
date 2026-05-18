"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { TallyCounter } from "@/components/classroom/tally-counter";
import { TALLY_FAQ } from "./faq";

const RELATED = [
  {
    name: "Name Picker",
    href: "/classroom/name-picker",
    description:
      "Random cold-call — pair with a tally to count which students answered correctly.",
  },
  {
    name: "Group Generator",
    href: "/classroom/group-generator",
    description:
      "Random groups — count points per group during a structured activity.",
  },
  {
    name: "Classroom Timer",
    href: "/productivity/classroom",
    description:
      "Pair with a projected countdown for timed tallying sessions.",
  },
  {
    name: "Noise Meter",
    href: "/classroom/noise-meter",
    description:
      "Project the noise meter alongside a tally counter during quiet-work segments.",
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
      title="Tally Counter for Classrooms"
      intro="A free online tally counter — single or multi-counter. Tap to count anything: participation, behaviour, votes, attempts. Saves automatically."
      crumbs={[{ name: "Tally Counter" }]}
      tool={<TallyCounter slug="tally-default" />}
      faq={TALLY_FAQ}
      related={RELATED}
    >
      <h2>Two modes, one common pattern</h2>
      <p>
        Single mode is the classic mechanical tally — one big number, +/−
        buttons, reset. Multi-counter mode is the same logic per label: paste
        your label list (one per line) and the page renders one counter per
        label in a grid. Both modes save automatically; close the tab and
        the counts are still there tomorrow.
      </p>

      <h2>Classroom uses</h2>
      <ul>
        <li>
          <strong>Participation tallies</strong> — One + per substantive
          student contribution during whole-class discussion. At the end of
          class, you have an honest count for grading or for the &quot;who
          hasn&apos;t spoken yet&quot; question. Pair with the{" "}
          <Link href="/classroom/name-picker">name picker</Link> to randomly
          extend the count to lower-participation students.
        </li>
        <li>
          <strong>Behaviour data for an IEP or 504</strong> — Multi-counter
          mode with one label per target behaviour (e.g., &quot;Hand
          raised&quot;, &quot;Out of seat&quot;, &quot;Self-redirect&quot;).
          The tally produces frequency-per-period data for IEP meetings and
          progress reports.
        </li>
        <li>
          <strong>Quick votes</strong> — Multi-counter with labels Yes / No /
          Maybe (or Agree / Disagree / Unsure). Tap as students raise hands.
          A 30-second classroom poll without an app or extension.
        </li>
        <li>
          <strong>Quiz wrong-answer tracking</strong> — Multi-counter with
          one label per question (Q1, Q2, …, Q10). As you grade, tap the
          question label every time you see a wrong answer. The highest
          tallies tell you which questions need re-teaching tomorrow.
        </li>
        <li>
          <strong>Attempt counting</strong> — Single mode for things students
          do many of (free throws, math fact attempts, fluency reads). The
          large readout works on a phone in your hand while you walk the
          room.
        </li>
        <li>
          <strong>Token economy</strong> — Multi-counter with one label per
          student (or per table). Award tokens visibly; cash out at end of
          period. The persistent storage means tokens carry across the
          period without resetting on reload.
        </li>
      </ul>

      <h2>Why &quot;saves automatically&quot; matters</h2>
      <p>
        Most browser-based tally counters lose state on reload, which is
        fine for one-off tally sessions but useless for in-period running
        totals. This counter writes to local storage after every tap, so:
      </p>
      <ul>
        <li>
          A tab that crashes mid-period doesn&apos;t cost you the morning&apos;s
          data.
        </li>
        <li>
          You can step away from the laptop, do something else, and come
          back to the same counter state.
        </li>
        <li>
          Across multiple sessions of the same activity (e.g., week-long
          behaviour-tracking experiment), the counter persists as long as
          you don&apos;t reset.
        </li>
      </ul>

      <h2>Phone-first design</h2>
      <p>
        The +/− buttons are sized for thumb taps and the readout scales down
        cleanly to phone screens. Practical use: open the page on your phone
        before class starts, log the URL, walk the room while tallying, and
        when you return to your desk, the same state is on the desktop too —
        as long as you&apos;re on the same browser profile. (Cross-device
        sync isn&apos;t supported because nothing is uploaded; the tally is
        local to each device.)
      </p>

      <h2>What this isn&apos;t</h2>
      <p>
        It&apos;s not a behaviour-management system like ClassDojo — there
        are no student-facing profiles, no parent-facing reports, no
        gamification. Use this when you want a simple, fast, private,
        signup-free tally counter and you&apos;ll record the data
        elsewhere. If you want full behaviour-management infrastructure,
        you&apos;ll outgrow this tool quickly.
      </p>
    </ClassroomShell>
  );
}
