export const BRB_PRESET_FAQ = [
  {
    question: "How long is too long for a BRB break?",
    answer:
      "Most viewers comfortably wait <strong>three to seven minutes</strong> for a BRB without disengaging. Past ten minutes, the live audience begins to thin and you start losing watch-time credit toward Twitch&apos;s discovery surfaces. If you need longer than ten minutes — say you have a delivery at the door or a tech problem you&apos;re actively debugging — say so out loud before you leave, or have a moderator post a chat message explaining. Transparency converts a long wait from rude to acceptable; silence converts it from acceptable to rude.",
  },
  {
    question: "Should I keep my microphone live during the BRB?",
    answer:
      "No. Cut your microphone the moment you switch to the BRB scene, both as a courtesy to viewers (no incidental background noise) and as a privacy measure for whoever else is in your house. The cleanest workflow is to bind a hotkey to a scene switch that simultaneously mutes the mic source — OBS will do this with a single scene-level audio filter if you set the BRB scene&apos;s mic-audio level to -100 dB.",
  },
  {
    question: "What goes on a BRB scene besides the timer?",
    answer:
      "The bare minimum is a chat overlay and a static image or looping video that says &quot;Be Right Back.&quot; A live music indicator helps fill the silence and gives chat something to talk about. Some streamers add a recent-clip carousel so viewers can rewatch highlights from earlier in the stream — that&apos;s a meaningful boost to retention during long breaks, because viewers stick around for the clips instead of tabbing away. Skip elaborate animations; the audience is in waiting mode, not entertainment mode.",
  },
  {
    question: "Does Twitch auto-clip during a BRB scene?",
    answer:
      "Twitch will not generate auto-clips from low-engagement segments, so a quiet BRB scene with a static image won&apos;t produce auto-clips. However, a viewer can still manually create a clip of your BRB scene — which is occasionally embarrassing if the timer hits zero and you haven&apos;t come back yet. The fix is to keep the BRB cycle shorter than your typical actual-break length, so the visual state at any given moment is &quot;timer counting down&quot; rather than &quot;timer expired and host still missing.&quot;",
  },
  {
    question: "Can my mods extend the timer if I&apos;m taking longer than expected?",
    answer:
      "Not from chat with this overlay specifically — there&apos;s no in-band command for moderators to push a new duration to the timer. The cleanest workaround is to put two BRB scenes in OBS: a five-minute scene and a ten-minute scene. A trusted moderator with OBS WebSocket access can switch you to the longer scene if you go quiet. For a more elaborate setup, build a chat-command bot that swaps an OBS Browser Source URL on a moderator command — but that&apos;s an integration project, not a feature of this overlay.",
  },
  {
    question: "Will the timer continue if I switch back to the gameplay scene?",
    answer:
      "By default, yes — OBS Browser Sources stay alive across scene switches unless you check the &quot;Shutdown source when not visible&quot; option in the source properties. Leave that option <em>unchecked</em> and the BRB countdown will keep running even when you&apos;ve cut back to your main scene; switch back to BRB and the timer will be wherever it should be on the schedule. This matters when you cut to BRB, realize you forgot something, cut back briefly, then return to BRB — the timer doesn&apos;t reset.",
  },
];
