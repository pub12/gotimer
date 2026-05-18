export const TEAMS_OF_4_FAQ = [
  {
    question: "Why groups of 4?",
    answer:
      "Four is the most-used team size in K-12 classrooms — it allows pairs within a group (think-pair-share at the table), supports the four-role structure (timekeeper, recorder, materials manager, presenter), and divides cleanly into pairs for round-robin protocols. It&apos;s also the typical cluster size for desks arranged in pods.",
  },
  {
    question: "What if my class isn&apos;t divisible by 4?",
    answer:
      "The generator distributes the remainder across earlier groups. A class of 25 → six groups of 4 plus one group of 1; the algorithm bumps the leftover so you get more practical sizes like five groups of 4 plus one group of 5 (or six groups of 4 plus one group of 1 if you accept a singleton). For perfect control, switch to <a href=\"/classroom/group-generator\">N-groups mode</a>.",
  },
  {
    question: "How does this compare to the main group generator?",
    answer:
      "Same engine — just with group size locked to 4 and the controls hidden so paste-and-go is faster. Use the <a href=\"/classroom/group-generator\">main generator</a> if you want flexible group sizes or N-groups mode.",
  },
  {
    question: "Does it avoid repeating pairs from last week?",
    answer:
      "Yes. The avoid-pairs toggle (on by default) stores the pair-ups from your last shuffle in your browser&apos;s local storage. The next shuffle runs up to ten attempts and picks the result with the fewest repeats from last week.",
  },
  {
    question: "Can I assign group roles automatically?",
    answer:
      "Not directly — the generator outputs names only. To assign roles, copy the result into a doc and use the standard four roles (timekeeper, recorder, materials manager, presenter) or have students self-assign within their groups. Auto-role-assignment is on the roadmap.",
  },
  {
    question: "Is there a print-friendly version?",
    answer:
      "Use your browser&apos;s File → Print or Cmd/Ctrl+P. The group cards reflow onto letter paper legibly. A dedicated &quot;print as table tents&quot; option is planned.",
  },
];
