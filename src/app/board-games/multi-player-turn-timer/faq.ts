export const MULTI_PLAYER_TURN_TIMER_FAQ = [
  {
    question: "How many players does the multi-player turn timer support?",
    answer:
      "<strong>2 to 8 players.</strong> The configurator lets you add and rename players, and every player&apos;s clock is tracked independently. Player names are encoded in the URL so a single link round-trips the whole table — paste it into your group chat and everyone opens the same setup.",
  },
  {
    question: "What is the difference between per-turn, time-bank, and hybrid modes?",
    answer:
      "<strong>Per-turn</strong> mode resets the clock for every player&apos;s turn (e.g. 90 seconds each). <strong>Time-bank</strong> mode gives every player a personal time budget that drains while it is their turn — the multiplayer equivalent of a chess clock. <strong>Hybrid</strong> drains the per-turn cap first, then starts eating the personal bank, which is the right model for games with both pacing and total-time concerns (Twilight Imperium, Mage Knight).",
  },
  {
    question: "Is this a chess clock for board games?",
    answer:
      "In <strong>time-bank</strong> mode, yes — it is a multiplayer chess clock that scales beyond two players. The classic 2-player <a href=\"/board-games/chess-clock\">chess clock</a> is still available for traditional chess, shogi, or 2-player abstract games. The multi-player turn timer is purpose-built for 3-8 players, with per-turn and hybrid modes as well as the chess-clock-style time bank.",
  },
  {
    question: "Can I share the timer URL with my group?",
    answer:
      "Yes. Every change to player names, mode, or time settings is written into the URL with <code>history.replaceState</code>, so the address bar always reflects the current configuration. Bookmark it, paste it into Discord, or share it from your phone — everyone who opens the link sees the same configured timer with the same player names baked in.",
  },
  {
    question: "What happens when a turn timer runs out?",
    answer:
      "In per-turn mode, the timer plays a chime, advances to the next player, and resets the per-turn cap. In time-bank mode, the player whose bank hits zero stops the active clock but the game continues — house rules typically award the loss or impose a penalty. In hybrid mode, the per-turn cap counts to zero and then the player&apos;s personal bank starts draining until they tap &quot;Next Player&quot; or you switch them manually.",
  },
  {
    question: "Does the timer work on a tablet placed in the middle of the table?",
    answer:
      "Yes. The display is big, the player roster is legible from across the table, and the &quot;Next Player&quot; button is the largest interactive element after the timer ring itself. The timer also acquires the browser&apos;s wake lock while running so the screen will not sleep during a long session.",
  },
  {
    question: "Will my long session drain a tablet battery quickly?",
    answer:
      "The display uses CSS-only animation (no Canvas, no continuous GPU loop) to stay light on power for marathon sessions. We measured roughly 6-8% battery per hour on a modern iPad with wake lock active — fine for a 5-hour Twilight Imperium session on a charged tablet, but consider plugging in for longer games.",
  },
];
