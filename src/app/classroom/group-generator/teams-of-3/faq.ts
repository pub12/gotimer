export const TEAMS_OF_3_FAQ = [
  {
    question: "Why groups of 3 specifically?",
    answer:
      "Threes are the classroom sweet spot for many collaborative structures: jigsaw expert groups, triad discussion protocols, peer-review rotations, and lab-station rotations. Three is large enough that one quiet student isn&apos;t carrying a silent pair, and small enough that nobody can fully disengage.",
  },
  {
    question: "What if my class doesn&apos;t divide evenly by 3?",
    answer:
      "The generator handles uneven splits automatically. A class of 28 → nine groups of 3 plus one group of 1; the algorithm bumps the leftovers into earlier groups, producing six groups of 3 + three groups of 4 + one group of 4… actually, more precisely: 28÷3 = 9 remainder 1, so you get 9 groups of 3 and 1 group of 1. To avoid the singleton, switch to <a href=\"/classroom/group-generator/teams-of-4\">groups of 4</a> or use the main <a href=\"/classroom/group-generator\">group generator</a> in N-groups mode.",
  },
  {
    question: "Can I generate the same groups for two different periods?",
    answer:
      "Yes. Enter the same seed in both periods (e.g., <code>2026-04-15-jigsaw</code>) — the same names + same seed always produces the same groups. Useful if you want parallel structure across multiple sections of the same course.",
  },
  {
    question: "How is this different from the main group generator?",
    answer:
      "Same tool, but the group size is locked to 3 and the controls are simplified — paste names, press Shuffle, get triads. Use the <a href=\"/classroom/group-generator\">main group generator</a> for full control over size and mode.",
  },
  {
    question: "Does this avoid repeating last week&apos;s triads?",
    answer:
      "Yes — same avoid-pairs heuristic as the main generator. The pair-ups from your last shuffle are stored in your browser&apos;s local storage and the next shuffle biases against repeating them.",
  },
  {
    question: "Can I rearrange a triad after the shuffle?",
    answer:
      "Edit your input list to move names between triads, or run another shuffle for a new arrangement. The result is plain text below the cards — copy it, edit manually in any text editor, and that&apos;s your finalised groups.",
  },
];
