"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrbOverlay, type BrbDefaults } from "@/components/brb/overlay";
import { BrbPresetLanding } from "@/components/brb/preset-landing";
import { STARTING_SOON_FAQ } from "./faq";

const DEFAULTS: BrbDefaults = {
  mins: 5,
  secs: 0,
  label: "Starting Soon",
  color: "#ffd700",
  pulse: true,
  autostart: true,
};

const RELATED = [
  { name: "Be Right Back Timer", href: "/brb/be-right-back", description: "Quick intermission countdown for snack and bio breaks" },
  { name: "Raid Countdown", href: "/brb/raid-countdown", description: "Short, energetic countdown for outgoing raids" },
  { name: "Stream Ending Screen", href: "/brb/stream-over", description: "Calm wind-down countdown for end-of-stream goodbyes" },
  { name: "Configurator (BRB hub)", href: "/brb", description: "Build a custom URL with your own duration, label, and colors" },
];

function Content() {
  const params = useSearchParams();
  if (params.get("embed") === "1") {
    return <BrbOverlay defaults={DEFAULTS} />;
  }
  return (
    <BrbPresetLanding
      preset_path="/brb/starting-soon"
      h1="Stream Starting Soon Countdown"
      lead="A pre-stream countdown overlay for OBS — the gold-on-transparent kind that gives your audience a clean five-minute warm-up before the show actually starts."
      defaults={DEFAULTS}
      faq={STARTING_SOON_FAQ}
      related={RELATED}
    >
      <p>
        Almost every streamer with a regular schedule runs a Starting Soon
        scene. The pattern is the same across Twitch, YouTube, and Kick:
        you go live a few minutes ahead of the announced start time, your
        cover scene shows up with a countdown, your chat starts populating,
        the first ten or twenty viewers drop in, and then — at zero — you
        cut to your main scene and the show begins. The countdown is the
        anchor of the whole sequence. Without it, the cover scene feels
        like dead air. With it, you have a visible, ticking promise that
        the wait has a defined end.
      </p>

      <h2>Why a visible countdown matters more than you&apos;d think</h2>
      <p>
        Viewer retention research from Twitch and from the major
        streamer-tool vendors converges on a counterintuitive finding:
        viewers who arrive during a Starting Soon scene stay <em>longer</em>{" "}
        on average than viewers who arrive after the show has started. The
        explanation is that the countdown sets an expectation, and people
        who tolerate a five-minute wait have already self-selected for
        higher engagement. The corollary is that a countdown without a
        visible timer is much worse than one with: a static &quot;Starting
        soon&quot; image gives the visitor no information about how long
        they need to wait, and a meaningful share of them refresh, scroll
        elsewhere, or leave entirely within thirty seconds. A ticking
        countdown converts the wait from open-ended to bounded.
      </p>

      <h2>How long the countdown should run</h2>
      <p>
        The most defensible default is <strong>five minutes</strong>. It is
        long enough for clip-watchers and notification-followers to drop
        in, short enough that no one feels strung along, and matches the
        rhythm most regular viewers have come to expect. Ten and fifteen
        minute countdowns are appropriate when you have actively promoted
        a stream — a community event, a charity drive, a one-off subject
        you announced earlier in the week. Anything past twenty minutes
        starts to feel like padding, and Twitch&apos;s discovery surfaces
        begin to deprioritize streams that spend extended time in low-content
        scenes.
      </p>

      <p>
        For streamers whose start time slips — and that includes most
        people — run the countdown for a <em>fixed duration</em> that
        begins when you click Start Streaming, not a wall-clock countdown
        to your scheduled time. A wall-clock countdown going into negative
        numbers in front of a new viewer is a much worse experience than a
        clean five-minute fixed countdown that starts when you click go.
        If your start time is reliable, by all means use a wall-clock
        target — but always have the fixed-duration overlay as a fallback.
      </p>

      <h2>What else belongs on the Starting Soon scene</h2>
      <p>
        A complete Starting Soon scene has four elements stacked together.
        The countdown is the focal point — usually upper-center or
        upper-left, large enough to read from a phone. A chat overlay sits
        in the lower third so chat is visible without dominating the
        frame. A &quot;Now Playing&quot; music indicator sits in a corner;
        keep the music low and royalty-free, because Twitch&apos;s VOD
        Watcher will mute the segment if it picks up commercial audio. And
        behind everything sits the cover art — a static image or a slow
        looping video that signals what the stream is about. Skip
        complicated animations on the pre-roll; they distract from the
        countdown and add encoding load before you actually need it.
      </p>

      <h2>Using this overlay specifically</h2>
      <p>
        The URL above is pre-configured: <strong>five minutes</strong>,{" "}
        <strong>&quot;Starting Soon&quot;</strong> label, <strong>gold
        text</strong> on a transparent background, with the pulse
        animation kicking in on the last ten seconds and autostart enabled
        so it begins counting the moment OBS loads the Browser Source.
        Paste it into a Browser Source set to your full canvas size
        (1920×1080 for a standard stream, 2560×1440 for higher resolution)
        and the timer will scale automatically. If you want a different
        duration, color, or label, click through to the{" "}
        <Link href="/brb">configurator on the BRB hub</Link> and rebuild the URL
        — copying out a new one takes maybe forty seconds.
      </p>

      <p>
        For audio cues at zero (so you hear the stream-start moment from
        your headphones without watching the timer), open the{" "}
        <Link href="/brb/sound-cue">companion audio tab</Link> in a second
        browser window and add it as an Audio Output Capture source in
        OBS. The audio tab is muted in OBS by default — the goal is for{" "}
        <em>you</em> to hear the chime, not your viewers.
      </p>
    </BrbPresetLanding>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Content /></Suspense>;
}
