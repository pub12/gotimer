export const STARTING_SOON_FAQ = [
  {
    question: "How long should my 'Starting Soon' countdown be?",
    answer:
      "The most common pre-stream durations are <strong>5, 10, and 15 minutes</strong>. Five minutes is the standard for established channels with regular schedules — your viewers already know when you go live, so the countdown is a courtesy not a recruitment tool. Ten to fifteen minutes makes sense for growing channels and for any stream you've promoted in advance (a community event, a charity stream, a one-off subject); the longer pre-roll gives clip-watchers and notification-followers time to drop in before the main content starts. Avoid anything over twenty minutes — Twitch's homepage promotion penalty for low-content scenes kicks in quickly and a long Starting Soon scene shows up to algorithm probes as a dead stream.",
  },
  {
    question: "Does Twitch count the Starting Soon scene as airtime?",
    answer:
      "Yes — Twitch starts the stream clock the moment you click Start Streaming in OBS, regardless of which scene is showing. Your Starting Soon scene contributes to total stream duration, peak viewer count, and average viewer count. This is one reason chat-engaged BRB and Starting Soon scenes do better than silent ones: a thirty-second clip of you waving at chat during the countdown still counts toward the metrics that Twitch uses to weigh you for category and homepage placement.",
  },
  {
    question: "Should the countdown match the schedule, or always run for the same duration?",
    answer:
      "If your stream start time slips routinely, run the countdown for a <em>fixed duration</em> that begins when you go live in OBS, not a wall-clock countdown to your scheduled time. A wall-clock countdown going negative ('-3:14') in front of new viewers is a worse experience than a five-minute fixed countdown that simply starts when you click Start Streaming. If your start time is rock solid, a wall-clock countdown is fine — but build a fallback: a streamer who's been around the block always has the fixed-duration overlay ready to swap in for nights when the cat unplugs the modem.",
  },
  {
    question: "What should be on the Starting Soon scene besides the countdown?",
    answer:
      "A typical pre-stream scene has four elements: the countdown timer, a chat overlay (so chat is visible and you can react to it), a 'Now Playing' music indicator, and a static or looping image that signals what the stream will be about (game art, a webcam still, your branding). Keep the music low and the energy a touch above your normal stream voice — pre-stream is a transition zone where the audience is arriving and the chat is warming up. The countdown anchors the whole scene; everything else fills the negative space.",
  },
  {
    question: "Can I use the same Starting Soon countdown for every stream?",
    answer:
      "Yes — once you've added the Browser Source to OBS, it persists across sessions. Set <code>autostart=1</code> in the URL and the countdown starts the moment the Starting Soon scene becomes active. Many streamers go further and put the entire pre-stream scene on a hotkey, so they can hit one button while waiting for their game to load and the scene plus countdown go live in lockstep.",
  },
  {
    question: "What's the difference between this and the StreamElements Starting Soon widget?",
    answer:
      "StreamElements gives you a drag-and-drop editor with custom fonts and animations, but requires an account linked to your Twitch and stores your overlay on their servers. This countdown is a single URL with no account — paste it into OBS and it works forever, even if our site goes down (the URL has all the configuration baked in). If you want bespoke visuals, StreamElements is the better tool; if you want something that just works and never asks you to log in, use this.",
  },
];
