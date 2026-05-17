export const STREAM_OVER_FAQ = [
  {
    question: "How long should the stream-ending countdown run?",
    answer:
      "The standard is <strong>one to three minutes</strong>. Less than a minute feels rushed — viewers don&apos;t have time to drop their final messages or to switch over to the raid target. More than three minutes turns into a goodbye that overstays. Two minutes is the sweet spot for most streams: long enough to read out the last few chat messages, thank the night&apos;s subs and bits, mention what you&apos;ll be playing next time, and announce the raid target without it feeling like padding.",
  },
  {
    question: "Should I raid before or after the countdown ends?",
    answer:
      "Most streamers run the <code>/raid</code> command in the final ten to fifteen seconds of the countdown. The Twitch raid prompt itself gives viewers a ten-second window before the raid executes, so timing <code>/raid</code> right before the countdown hits zero produces a clean handoff: the timer hits zero, the raid prompt appears, your viewers click the raid button and arrive at the new channel essentially together. Sending the raid earlier (say at the one-minute mark) is fine but creates an awkward gap where the raid prompt is visible alongside the still-counting timer.",
  },
  {
    question: "What should be visible on the stream-ending scene?",
    answer:
      "The countdown timer is the focal point. Around it you want: a list of the night&apos;s subs and bits as static text or a slow-scrolling ticker, your social handles (Discord, YouTube, second account), a one-line teaser for the next stream (&quot;back Thursday for chapter 7&quot;), and the raid target if you&apos;re raiding. Skip moving video backgrounds — they distract from the goodbye. A calm static cover image and a clean countdown is plenty.",
  },
  {
    question: "Will Twitch keep my chat in slow mode during the countdown?",
    answer:
      "Whatever moderation settings were active when you went into the ending scene stay active. If you turned on Sub-Only Mode for the host segment, you&apos;ll need to turn it off manually if you want everyone to be able to drop a goodbye. A common pattern is to bind the ending scene to a chat-bot command (via Nightbot, StreamElements, or Fossabot) that simultaneously switches the scene <em>and</em> resets chat to a permissive mode for the goodbyes.",
  },
  {
    question: "Can I run the goodbye countdown without raiding?",
    answer:
      "Of course. Affiliate and Partner streamers tend to raid because it spreads viewers across the platform and earns mutual-raid goodwill. But not every stream needs to end with a raid — a casual stream, a stream where the raid target isn&apos;t live, or a stream where you&apos;re tired and just want to close out are all fine cases to just say goodbye and click End Stream when the timer hits zero. The countdown still serves its purpose: giving viewers a fixed end-point.",
  },
];
