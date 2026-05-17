"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrbOverlay, type BrbDefaults } from "@/components/brb/overlay";
import { BrbPresetLanding } from "@/components/brb/preset-landing";
import { BRB_PRESET_FAQ } from "./faq";

const DEFAULTS: BrbDefaults = {
  mins: 5,
  secs: 0,
  label: "Be Right Back",
  color: "#ffffff",
  pulse: true,
  autostart: true,
};

const RELATED = [
  { name: "Stream Starting Soon Countdown", href: "/brb/starting-soon", description: "Pre-stream warm-up countdown for the cover scene" },
  { name: "Stream Ending Screen", href: "/brb/stream-over", description: "Calm wind-down countdown for end-of-stream goodbyes" },
  { name: "Raid Countdown", href: "/brb/raid-countdown", description: "Short, energetic countdown for outgoing raids" },
  { name: "Configurator (BRB hub)", href: "/brb", description: "Build a custom URL with your own duration, label, and colors" },
];

function Content() {
  const params = useSearchParams();
  if (params.get("embed") === "1") {
    return <BrbOverlay defaults={DEFAULTS} />;
  }
  return (
    <BrbPresetLanding
      preset_path="/brb/be-right-back"
      h1="Twitch BRB / Be Right Back Timer"
      lead="A clean five-minute intermission countdown for OBS — for bio breaks, snack runs, and the times you need to disappear for a few minutes without leaving your stream looking dead."
      defaults={DEFAULTS}
      faq={BRB_PRESET_FAQ}
      related={RELATED}
    >
      <p>
        The BRB scene is one of the unsung mechanics of regular streaming.
        Every streamer with a multi-hour schedule needs to step away
        occasionally — for a glass of water, a quick stretch, a bathroom
        break, a delivery at the door — and how those breaks are handled
        is the difference between a stream that feels professional and
        one that feels chaotic. The countdown is the most important
        element of the BRB scene because it answers the implicit
        question every viewer has the moment your camera cuts: &quot;am I
        about to lose ten seconds or ten minutes of my evening?&quot; A
        visible timer answers that immediately and lets the viewer make
        an informed choice about whether to wait.
      </p>

      <h2>How long is too long?</h2>
      <p>
        For most streamers, the comfortable BRB envelope is <strong>three
        to seven minutes</strong>. Under three minutes, the cut to a
        cover scene feels disruptive — better to just say &quot;hang on,
        one moment&quot; and keep your main scene up. Past seven minutes,
        you start to lose the casual viewer; past ten, your live count
        will visibly thin out, and Twitch&apos;s discovery surfaces will
        deprioritize the stream for the duration of the break. If you
        need longer than ten minutes for something unexpected, the
        cleanest move is to switch to a longer-duration BRB scene with a
        moderator-posted chat message explaining what&apos;s going on.
      </p>

      <h2>BRB scene composition</h2>
      <p>
        A well-composed BRB scene is quieter than your main scene by
        design. The countdown sits center-stage, large enough to read
        from a phone. A chat overlay anchors the lower third so the
        audience can keep talking to each other. A muted music track
        plays softly underneath — keep it royalty-free or use{" "}
        <a href="https://soundtrack.bytwitch.tv" target="_blank" rel="noopener noreferrer">
          Twitch Soundtrack
        </a>{" "}
        to avoid the DMCA risk. Behind it all sits a static cover image
        or a slow looping video that signals what the stream is about.
        Some streamers add a clip carousel of highlights from earlier in
        the stream — those genuinely help retention during long breaks
        because viewers stick around for the clips instead of tabbing
        away.
      </p>

      <h2>The transparent-background advantage</h2>
      <p>
        The countdown overlay you&apos;re looking at uses a transparent
        background, which means you can layer it cleanly over whatever
        artwork or video your BRB scene already uses. Drop the Browser
        Source above your background image and the countdown sits
        directly over it, with the existing artwork showing through
        wherever the digits aren&apos;t. There&apos;s no fiddly green-screen
        or chroma-key step — OBS composites the transparent regions of
        the Browser Source natively.
      </p>

      <h2>Cutting the microphone</h2>
      <p>
        Cut your microphone the moment you switch to the BRB scene.
        This is partly a courtesy to viewers (no incidental household
        noise) and partly a privacy measure for the rest of your
        household. The cleanest workflow is a scene-level audio filter
        that mutes the mic source whenever the BRB scene is active —
        OBS supports this natively. Alternatively, bind the scene
        switch to a hotkey that also toggles a global mic mute, so a
        single keypress handles both.
      </p>

      <h2>The shorter-than-actual trick</h2>
      <p>
        Counter-intuitive but useful: set the BRB countdown to a
        duration <em>shorter</em> than your typical break. If your
        actual breaks usually run six minutes, set the timer to five.
        The countdown will hit zero and the &quot;pulse&quot; animation
        will kick in just as you&apos;re about to come back, and your
        viewers see a freshly-expired timer when you cut back to the
        main scene — which reads as a successfully-completed wait
        rather than as a timer that ran out without you. The reverse —
        setting the timer for longer than you need and coming back
        early — reads as unprofessional in a way that&apos;s hard to
        name but easy to feel.
      </p>

      <h2>Using this overlay specifically</h2>
      <p>
        The URL above is configured for a <strong>five-minute,
        white-on-transparent BRB</strong> with the &quot;Be Right
        Back&quot; label and a pulse animation on the last ten seconds.
        Paste it into a Browser Source set to your canvas size and you
        have a working BRB scene. To change the duration, color, or
        label, hop over to the <Link href="/brb">configurator on the BRB
        hub</Link>.
      </p>
    </BrbPresetLanding>
  );
}

export default function Page() {
  return <Suspense fallback={null}><Content /></Suspense>;
}
