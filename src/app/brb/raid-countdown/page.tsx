"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrbOverlay, type BrbDefaults } from "@/components/brb/overlay";
import { BrbPresetLanding } from "@/components/brb/preset-landing";
import { RAID_COUNTDOWN_FAQ } from "./faq";

const DEFAULTS: BrbDefaults = {
  mins: 1,
  secs: 0,
  label: "Raid in",
  color: "#ff4444",
  pulse: true,
  autostart: true,
};

const RELATED = [
  { name: "Stream Ending Countdown", href: "/brb/stream-over", description: "Calmer 2-minute wind-down countdown for non-raid goodbyes" },
  { name: "Stream Starting Soon", href: "/brb/starting-soon", description: "Pre-stream warm-up countdown" },
  { name: "Be Right Back Timer", href: "/brb/be-right-back", description: "Mid-stream intermission countdown" },
  { name: "Configurator (BRB hub)", href: "/brb", description: "Build a custom URL with your own duration and target name" },
];

function Content() {
  const params = useSearchParams();
  if (params.get("embed") === "1") {
    return <BrbOverlay defaults={DEFAULTS} />;
  }
  return (
    <BrbPresetLanding
      preset_path="/brb/raid-countdown"
      h1="Twitch Raid Countdown Timer"
      lead="A short, high-energy one-minute countdown for outgoing raids — red-on-transparent, with a pulse animation in the final ten seconds to time perfectly with the Twitch /raid confirmation window."
      defaults={DEFAULTS}
      faq={RAID_COUNTDOWN_FAQ}
      related={RELATED}
    >
      <p>
        Raids are one of the genuinely-good mechanics Twitch has built
        into the platform. At the end of a stream you can send your
        audience over to another live channel with the{" "}
        <code>/raid &lt;channel&gt;</code> chat command — your viewers
        get a ten-second confirmation prompt, the raid executes, and
        everyone arrives at the new channel at once. A good raid feels
        ceremonial: it&apos;s a hand-off, a public endorsement of
        another creator, and a visible moment of community in a
        platform that often feels atomized.
      </p>

      <h2>How the raid countdown works</h2>
      <p>
        The countdown overlay you&apos;re looking at is designed to
        line up cleanly with the Twitch raid mechanism. Start the
        countdown when you switch to your ending scene. At the
        fifty-second mark, run <code>/raid &lt;channel&gt;</code> in
        chat (most streamers bind this to a hotkey or a Stream Deck
        button so they don&apos;t have to type during the goodbye).
        Twitch&apos;s ten-second raid confirmation prompt then appears
        alongside the still-counting timer. As the timer hits zero,
        the raid executes — your viewers click the raid button and
        arrive at the target channel essentially together.
      </p>

      <h2>Picking the right target</h2>
      <p>
        Three rules of thumb. <strong>First</strong>, pick someone
        playing something <em>similar</em> to what you ended on — the
        audience transition feels natural and the target channel
        keeps the viewers who arrived rather than seeing them bounce.{" "}
        <strong>Second</strong>, pick a channel with a viewer count
        similar to yours or slightly smaller. Raiding into a
        much-larger channel buries your raiders in chat; raiding into
        a much-smaller channel can feel like charity for the recipient
        and overwhelms their tiny audience.{" "}
        <strong>Third</strong>, verify the target is actually live
        before you start the countdown — raiding an offline channel
        is one of the most awkward moments in streaming and the
        countdown gives you exactly zero outs.
      </p>

      <p>
        A useful habit: maintain a running list of mutuals in a
        Discord channel or a private notes app, refreshed weekly. When
        you&apos;re winding down and need to pick a raid target, you
        scan the list, check the two or three you like best for
        live-status, and pick. The alternative — frantically scrolling
        the directory page in the last five minutes of your stream —
        is how you end up raiding the wrong person or the same person
        for the third time in a row.
      </p>

      <h2>Why the red, why the pulse</h2>
      <p>
        The default styling for this preset is <strong>red text</strong>{" "}
        and <strong>pulse animation</strong>. Red signals high energy
        and contrasts cleanly against most ending-scene background
        art; the pulse animation kicks in on the last ten seconds and
        visually synchronizes with the Twitch raid prompt&apos;s own
        ten-second confirmation window. Together they give the moment
        a sense of building anticipation that a flat-white static
        countdown doesn&apos;t. If your brand calls for a different
        color or a calmer animation, swap them via the{" "}
        <Link href="/brb">configurator on the BRB hub</Link>.
      </p>

      <h2>The raid-target label trick</h2>
      <p>
        You can use the <code>label</code> parameter to display the
        raid target&apos;s name on the overlay itself: e.g.{" "}
        <code>?label=Raid+to+lirik</code>. This is useful for
        scheduled raids where you know the target ahead of time and
        want viewers to read the name as they decide whether to come
        along. For impromptu raids picked in the last few minutes of
        the stream, a generic &quot;Raid in&quot; label is fine — the
        target is announced verbally and the prompt itself shows the
        target name.
      </p>

      <h2>For viewers who don&apos;t raid</h2>
      <p>
        Roughly half of any given audience won&apos;t click the raid
        button — they&apos;ll let the timer hit zero and either close
        the tab or flip to something else. That&apos;s fine and
        expected; raids are an opt-in mechanic. The countdown is
        valuable for them too, though: it converts the ending from
        open-ended (&quot;is the stream over?&quot;) into bounded
        (&quot;one minute and we&apos;re done&quot;), which is a
        meaningfully better experience than a stream that drifts to a
        stop without a clear exit point.
      </p>
    </BrbPresetLanding>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Content /></Suspense>;
}
