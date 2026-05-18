export const GROUP_GEN_FAQ = [
  {
    question: "How does this group generator decide who&apos;s with who?",
    answer:
      "It shuffles the full class list with a uniform-random algorithm (Fisher-Yates) and distributes students round-robin into groups. With the &quot;Avoid repeating last week&apos;s pairs&quot; toggle on, it makes up to ten attempts and keeps the result with the fewest pair repeats from the previous shuffle stored in your browser.",
  },
  {
    question: "What does the seed do?",
    answer:
      "A seed locks in randomness — the same seed + same names + same mode always produces the same groups. Useful for: (a) reproducing the same groups across multiple classes on the same day, (b) sharing groups verbally with a colleague (&quot;use seed period-3-fri&quot;), (c) re-running the same shuffle after a refresh. Leave the seed blank for truly random.",
  },
  {
    question: "Can the generator avoid putting two specific students together?",
    answer:
      "Not directly — there&apos;s no hard exclusion list. The simplest workaround is to remove one of the two names from the input, run the shuffle, then add them manually into the remaining group with the best fit. A built-in &quot;keep separate&quot; constraint is a planned addition; ask if it would block your use.",
  },
  {
    question: "Does it handle uneven groups?",
    answer:
      "Yes. In &quot;groups of K&quot; mode with an uneven class (23 students, groups of 4), you&apos;ll get five groups of 4 plus one group of 3. In &quot;N groups&quot; mode, sizes are as balanced as possible — e.g., 23 students into 6 groups becomes four 4-person groups and two 3-person groups, distributed round-robin so the smaller groups don&apos;t cluster at the end.",
  },
  {
    question: "Where is the &quot;previous pairs&quot; history stored?",
    answer:
      "In your browser&apos;s local storage on this device. It records the pairings (which students were in a group together) from your <em>last</em> shuffle, then uses that to bias the next shuffle. It doesn&apos;t track multiple weeks back. Clear browser storage to reset.",
  },
  {
    question: "Can I print the groups?",
    answer:
      "Use your browser&apos;s File → Print (or Cmd/Ctrl+P) — the group cards print one-per-page-block legibly. We&apos;re tracking demand for a dedicated print-friendly button with name cards / table tents on letter paper.",
  },
  {
    question: "Does the group generator work with 100+ students?",
    answer:
      "Yes, the algorithm handles arbitrary list sizes. UI legibility starts to suffer beyond about 80 names on a single screen — for very large pasted lists, the result grid stays readable but the input textarea needs scrolling.",
  },
  {
    question: "Can two students who were absent last week still be paired together?",
    answer:
      "The avoid-pairs logic only looks at <em>your last shuffle</em>, not at attendance history. If two students who weren&apos;t pair-able last week (one was absent) are pairable this week, the generator may put them together. That&apos;s usually what you want — the avoid-pairs feature is a freshness heuristic, not a strict constraint.",
  },
];
