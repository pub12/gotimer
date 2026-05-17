export const RAID_COUNTDOWN_FAQ = [
  {
    question: "What duration should a raid countdown be?",
    answer:
      "<strong>Sixty to ninety seconds</strong> is the standard window. Less than a minute is too short — viewers need time to see the raid target, decide if they want to come along, and orient themselves. More than two minutes drags the energy down and you lose the &quot;everyone go together&quot; effect that makes raids feel ceremonial. The default in this overlay is one minute, which lines up cleanly with running the <code>/raid</code> command at the fifty-second mark — Twitch&apos;s ten-second confirmation window then executes right at zero.",
  },
  {
    question: "When in the countdown should I run /raid?",
    answer:
      "Run <code>/raid &lt;channel&gt;</code> at the <strong>fifty-second mark of a one-minute countdown</strong> (or the ten-seconds-remaining mark of whatever duration you choose). Twitch&apos;s raid prompt gives viewers ten seconds to click before executing automatically, so timing <code>/raid</code> at T-minus ten lines up the prompt with the countdown reaching zero. Viewers see the timer hit 0:00 and the raid execute at the same moment — the cleanest possible handoff.",
  },
  {
    question: "How do I pick a raid target?",
    answer:
      "Three rules of thumb. (1) Pick someone playing something <em>similar</em> to what you ended on, so the audience transition feels natural. (2) Pick someone with a viewer count similar to or slightly smaller than yours — raiding into a much bigger channel gets your viewers lost in chat, and raiding a much smaller channel can feel like charity. (3) Pick someone who is genuinely live — check the channel before you start the countdown, because raiding an offline channel is one of the most awkward streamer experiences. Many streamers maintain a running list of mutuals to pick from, refreshed weekly.",
  },
  {
    question: "What if I don&apos;t want to raid but still want a goodbye countdown?",
    answer:
      "Use the <a href=\"/brb/stream-over\">Stream Ending Countdown</a> instead — it&apos;s designed for the no-raid goodbye case, with a calmer style and a slightly longer default duration. The raid countdown is shorter, faster, and uses red text because raids are a high-energy moment; the ending countdown is white-on-transparent because goodbyes without raids tend to be calmer.",
  },
  {
    question: "Can I see the raid target on the overlay itself?",
    answer:
      "Not as a baked-in feature — the overlay shows a single configurable label and the countdown, not external channel information. You can use the label parameter for the raid target&apos;s name (e.g. <code>?label=Raid+to+lirik</code>) but the overlay can&apos;t fetch live data about who&apos;s streaming. For richer integrations (auto-target selection, chat-command-driven raid setup, etc.), the StreamElements raid widget is a better fit despite the account requirement.",
  },
];
