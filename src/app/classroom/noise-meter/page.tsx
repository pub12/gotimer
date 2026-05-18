"use client";

import React from "react";
import Link from "next/link";
import { ClassroomShell } from "@/components/classroom/classroom-shell";
import { NoiseMeter } from "@/components/classroom/noise-meter";
import { NOISE_METER_FAQ } from "./faq";

const RELATED = [
  {
    name: "Name Picker",
    href: "/classroom/name-picker",
    description:
      "Random cold-call during whole-class discussion after a quiet-work session.",
  },
  {
    name: "Group Generator",
    href: "/classroom/group-generator",
    description: "Pair the noise meter with random groups for collaborative work.",
  },
  {
    name: "Classroom Timer",
    href: "/productivity/classroom",
    description:
      "Project a countdown alongside the noise meter to time quiet-work segments.",
  },
  {
    name: "Tally Counter",
    href: "/classroom/tally-counter",
    description:
      "Count students who returned to quiet within 30 seconds of a too-loud warning.",
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
      title="Classroom Noise Meter"
      intro="A free microphone-based noise meter for classrooms. Project it during seatwork; students self-regulate volume without your voice rising. No audio is recorded."
      crumbs={[{ name: "Noise Meter" }]}
      tool={<NoiseMeter />}
      faq={NOISE_METER_FAQ}
      related={RELATED}
    >
      <h2>Privacy: what this tool does and doesn&apos;t do</h2>
      <p>
        The noise meter uses the Web Audio API to read amplitude — a single
        number per audio frame — from your microphone. The audio itself is
        never recorded, stored, or transmitted. There is no recording buffer,
        no upload, no cloud processing. Open your browser&apos;s developer
        tools, switch to the Network tab, and you&apos;ll see no audio data
        ever leaving the page.
      </p>
      <p>
        We chose this implementation deliberately: classroom noise meters
        often have legitimate privacy concerns (students&apos; voices, side
        conversations, IEP-related vocalisations). The right answer is to do
        the audio analysis on the device only, never persist it, and surface
        only the amplitude reading. That&apos;s what this tool does.
      </p>

      <h2>How to start</h2>
      <ol>
        <li>
          <strong>Tap &quot;Enable microphone&quot;.</strong> Your browser
          asks for permission — say yes. The page reads the microphone&apos;s
          amplitude after that.
        </li>
        <li>
          <strong>Choose a visualisation.</strong> Bouncy balls for
          engagement, bars for a more clinical look, color-only for the
          accessibility / quiet option.
        </li>
        <li>
          <strong>Tune the threshold</strong> using the slider below the
          meter. Default 18% works for most classrooms.
        </li>
        <li>
          <strong>Project it</strong> by pressing <code>F11</code> for
          browser full-screen.
        </li>
        <li>
          <strong>Turn the microphone off</strong> when you&apos;re done — tap
          &quot;Turn off microphone&quot; below the meter, or close the tab.
          The browser indicator (red dot, microphone icon) clears
          immediately.
        </li>
      </ol>

      <h2>Classroom routines that work with a noise meter</h2>
      <ul>
        <li>
          <strong>Quiet-work mode</strong> — Project during silent reading,
          quizzes, or independent writing. The meter is the social cue;
          you don&apos;t need to shush. Some teachers display a smiley
          face when the meter stays green for the full work block.
        </li>
        <li>
          <strong>Volume zero / one / two</strong> — Use the threshold
          settings to match teacher-defined volume levels. Project zero
          (silent) for tests, one (whisper) for partner work, two (group
          discussion) for collaborative tasks. Update the threshold per
          activity.
        </li>
        <li>
          <strong>Self-monitored transitions</strong> — Show the meter during
          transitions between activities (e.g., putting materials away). The
          goal: stay green while moving. Students internalise the volume
          target across multiple transitions.
        </li>
        <li>
          <strong>Group-work check-ins</strong> — Project the meter while
          students work in <Link href="/classroom/group-generator">groups</Link>
          {" "}— if it spikes too high, that&apos;s your cue to pause and
          re-set expectations rather than waiting for it to escalate.
        </li>
      </ul>

      <h2>What the three modes are for</h2>
      <ul>
        <li>
          <strong>Bouncy balls</strong> — Engaging for elementary classes.
          The balls float higher when the room is louder; they fall when
          students quiet down. The visual reward of seeing the balls settle
          motivates students to lower volume.
        </li>
        <li>
          <strong>Bars</strong> — Cleaner, more clinical visual for middle
          school and up. Bars near the threshold turn red, communicating
          the threshold violation directly.
        </li>
        <li>
          <strong>Color-only</strong> — Accessibility-first option. Large
          green or red panel switches when the threshold is crossed, with
          big-text &quot;Quiet&quot; or &quot;Too loud&quot; labels. No
          animation — useful for students with motion sensitivity or
          ADHD-related visual overload.
        </li>
      </ul>

      <h2>Calibrating the threshold</h2>
      <p>
        Microphones differ. The default 18% threshold is a starting point —
        not a calibrated decibel level. Spend a minute tuning before you
        first project the meter for students:
      </p>
      <ol>
        <li>Open the page with the room at its normal quiet-work volume.</li>
        <li>
          The meter should stay green. If it&apos;s already too noisy, raise
          the threshold to about 5-10% above the current reading.
        </li>
        <li>
          Try a short loud burst (clap, snap fingers near the mic). The
          meter should flip to red. If it doesn&apos;t, lower the threshold.
        </li>
        <li>
          When students enter the room, observe their natural volume against
          the calibrated threshold. Adjust if needed.
        </li>
      </ol>

      <h2>If permission is denied</h2>
      <p>
        If a student or admin accidentally denied microphone access, the
        page shows a &quot;Try again&quot; CTA with retry instructions. To
        re-grant: click the lock icon in the address bar → set Microphone to
        Allow → reload the page → tap Enable microphone. On Chromebooks
        managed by a district, IT may need to allow microphone access to
        gotimer.org in the device policy — usually a one-line addition.
      </p>
    </ClassroomShell>
  );
}
