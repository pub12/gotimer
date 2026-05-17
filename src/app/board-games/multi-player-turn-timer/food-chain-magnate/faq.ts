export const FOOD_CHAIN_FAQ = [
  {
    question: "Should we use time-bank or per-turn mode for Food Chain Magnate?",
    answer:
      "<strong>Time-bank, almost certainly.</strong> FCM&apos;s turn structure is wildly uneven — auction and hiring rounds are short for most players and brutally long for the auction winner; reorganization phases are short; sales phases are mostly mechanical. A per-turn cap punishes the wrong moments. A 25-minute personal bank lets each player spend their time on the phases that actually matter to their strategy.",
  },
  {
    question: "How big should the personal bank be?",
    answer:
      "<strong>25 minutes per player</strong> is the BGG-community recommendation for a 4-player FCM session. A typical FCM game runs 3-4 hours, so 25 minutes per player accounts for ~100 minutes of clock time + setup, transitions, and unmeasured phases. 30 minutes is fine for groups new to the game; 20 minutes for groups that play it weekly.",
  },
  {
    question: "What about the auction phase specifically?",
    answer:
      "The auction is where the time-bank shines. The auction winner gets the milestone, but they also pay the time cost — and that cost shows up on their bank, visible to everyone. Players become more thoughtful about bidding when they can see their bank shrinking, which is mechanically faithful to FCM&apos;s &quot;everything has a cost&quot; design philosophy.",
  },
  {
    question: "Does the timer ruin the design intent?",
    answer:
      "FCM is already a brutal game; the timer just externalizes the time cost. Splotter (the publisher) has commented that FCM&apos;s long sessions are part of the design, but most groups still finish a session in under 4 hours and the time-bank model preserves the design without letting one player&apos;s analysis blow out the night.",
  },
  {
    question: "Can we pause for rules disputes?",
    answer:
      "Yes. The pause button freezes the active player&apos;s bank without losing turn state — use it whenever a rules dispute or rulebook lookup happens. The bank is for decision time, not rules-overhead.",
  },
  {
    question: "How does this differ from a multiplayer chess clock?",
    answer:
      "Functionally, time-bank mode <em>is</em> a multiplayer chess clock. The difference from a traditional 2-player <a href=\"/board-games/chess-clock\">chess clock</a> is that it scales to 5 players and tracks bank-remaining for each. FCM is one of the rare games that genuinely benefits from chess-clock semantics rather than per-turn caps.",
  },
];
