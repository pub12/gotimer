"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrbOverlay, type BrbDefaults } from "@/components/brb/overlay";
import { BrbPresetLanding } from "@/components/brb/preset-landing";
import { STREAM_OVER_FAQ } from "./faq";

const DEFAULTS: BrbDefaults = {
  mins: 2,
  secs: 0,
  label: "Thanks for watching",
  color: "#ffffff",
  pulse: false,
  autostart: true,
};

const RELATED = [
  { name: "Raid Countdown", href: "/brb/raid-countdown", description: "Shorter, more energetic countdown for outgoing raids" },
  { name: "Stream Starting Soon", href: "/brb/starting-soon", description: "Pre-stream countdown for the cover scene" },
  { name: "Be Right Back Timer", href: "/brb/be-right-back", description: "Quick intermission countdown for bio breaks" },
  { name: "Configurator (BRB hub)", href: "/brb", description: "Build a custom URL with your own duration, label, and colors" },
];

function Content() {
  const params = useSearchParams();
  if (params.get("embed") === "1") {
    return <BrbOverlay defaults={DEFAULTS} />;
  }
  return (
    <BrbPresetLanding
      preset_path="/brb/stream-over"
      h1="Stream Ending Countdown Screen"
      lead="A calm two-minute wind-down countdown for the end of a stream — for goodbyes, raid handoffs, and the last few chat messages before you click End Stream."
      defaults={DEFAULTS}
      faq={STREAM_OVER_FAQ}
      related={RELATED}
    >
      <p>
        The ending scene is the moment of the stream most streamers
        under-invest in, and the moment that determines whether a casual
        viewer comes back next time. A clean two-minute wind-down with a
        visible countdown gives the audience a graceful exit ramp:
        time to drop a final &quot;gg&quot;, follow you on a second
        platform, or pop over to whoever you&apos;re raiding. A stream
        that simply cuts to black at the end of the main content feels
        abrupt — the equivalent of a podcast that ends mid-sentence —
        and a meaningful share of those viewers will skip the channel
        next time.
      </p>

      <h2>The shape of a good goodbye</h2>
      <p>
        Two minutes is the sweet spot. In that window you can: read out
        the last batch of chat messages by name, thank the night&apos;s
        subscribers and bit-cheerers individually, announce when
        you&apos;ll be back and what you&apos;ll be playing, mention
        anything coming up on the schedule, and (if you raid) introduce
        the raid target with a quick &quot;they&apos;re streaming X if
        anyone wants to come along.&quot; A minute is too rushed for
        all of that; three minutes drifts into the audience checking
        the clock.
      </p>

      <h2>Coordinating with the raid</h2>
      <p>
        If you&apos;re raiding, the cleanest workflow is to run the{" "}
        <code>/raid</code> command in the final ten to fifteen seconds
        of the countdown. Twitch&apos;s raid prompt gives viewers a
        ten-second window before the raid executes, so a well-timed{" "}
        <code>/raid</code> at the 0:12 mark of your countdown produces
        a synchronized handoff: the timer hits zero, the raid prompt
        appears, viewers click the button, everyone arrives at the new
        channel together. Sending the raid earlier creates an awkward
        gap where the raid prompt sits alongside the still-counting
        timer, and viewers start clicking it before you&apos;re done
        saying goodbye.
      </p>

      <h2>What else belongs on the ending scene</h2>
      <p>
        Around the countdown: a list of the night&apos;s subs and bits
        as static text or a slow ticker (recognize people by name where
        you can), your handles on Discord, YouTube, and any secondary
        account (Twitter or Bluesky if you maintain one), a single-line
        teaser for the next stream, and the raid target if applicable.
        Skip moving video backgrounds and noisy animations — the
        audience is in wrap-up mode, not entertainment mode. A static
        cover image and a clean countdown is plenty.
      </p>

      <h2>The chat-mode trick</h2>
      <p>
        If you ran the main stream with Sub-Only Mode or Slow Mode on,
        consider relaxing those for the goodbye. The end of the stream
        is when free-account viewers most want to drop a final message,
        and a chat that&apos;s locked in slow mode at the end of a
        two-hour stream tends to dampen the energy of the goodbye. A
        common pattern is to bind the ending scene to a chat-bot
        command (via Nightbot or StreamElements) that simultaneously
        switches the scene <em>and</em> resets chat to a permissive
        mode.
      </p>

      <h2>Using this overlay specifically</h2>
      <p>
        The URL above is configured for a <strong>two-minute,
        white-on-transparent goodbye</strong> with the &quot;Thanks for
        watching&quot; label and pulse disabled (the goodbye is a calm
        moment, not a high-energy one). Paste it into a Browser Source
        in OBS at your canvas size and you have a working ending scene.
        For a longer or shorter duration, or to swap the label, use the{" "}
        <Link href="/brb">configurator on the BRB hub</Link>. If you&apos;re
        building a raid scene specifically, the{" "}
        <Link href="/brb/raid-countdown">raid countdown variant</Link> is
        tuned for a shorter, more energetic moment.
      </p>
    </BrbPresetLanding>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Content /></Suspense>;
}
