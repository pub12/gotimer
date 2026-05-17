export const MULTI_CUP_FAQ = [
  {
    question: "When would I need a multi-cup tea timer?",
    answer:
      "Three common situations. <strong>Tea parties:</strong> different guests want different teas, and you need to brew them concurrently so everyone&apos;s cup is ready at the same time. <strong>Side-by-side tastings:</strong> comparing two oolongs, three pu-erhs, or a tea-to-tea-pairing without one going stale while you brew another. <strong>Mixed-household needs:</strong> one strong black tea for breakfast and one chamomile for kids, brewed at the same time so the morning runs on schedule.",
  },
  {
    question: "How many cups can I brew at once?",
    answer:
      "<strong>Up to six concurrent cups.</strong> The default loads three (green / oolong / black) — tap &quot;Add cup&quot; to add more. On mobile the grid switches to a single column for readability; on desktop the cups display in a 2 or 3-column grid. Each cup has its own start, pause, and reset button.",
  },
  {
    question: "Does each cup remember its tea type?",
    answer:
      "<strong>Yes.</strong> Each cup has a dropdown selector for the tea type. Changing the type resets the duration to that tea&apos;s default steep time (green 2 min, oolong 3 min, black 4 min, white 3 min, pu-erh 3 min, herbal 6 min, matcha 30s). The full set of cups and their selected types are encoded in the URL — copy the URL to recreate the same setup later or share it with someone.",
  },
  {
    question: "What happens when a cup finishes?",
    answer:
      "The cup card turns green, displays &quot;Done!&quot;, and triggers an audio chime (if audio is enabled). Other cups continue running independently — they don&apos;t pause. Reset just the finished cup with its Reset button to brew a second infusion, or use Reset All to start the whole set over.",
  },
  {
    question: "Can I run multiple gongfu sessions in parallel?",
    answer:
      "<strong>Not on this page directly</strong> — for the auto-progressing gongfu ladder you want the dedicated <a href=\"/kitchen/tea-timer/gongfu\">gongfu timer</a>, which steps through 8 named infusions. The multi-cup page is for parallel Western-style cups, where each cup is one steep. If you want to gongfu-brew two oolongs side-by-side, open the gongfu timer in two browser tabs.",
  },
  {
    question: "Is there a save / favorites option?",
    answer:
      "Not yet — but the URL encoding works as a poor-man&apos;s save. After adding the cups you want, copy the link from the bottom-right toolbar (the link icon flashes a checkmark when copied). Paste it into a notes app or bookmark it. Opening the link recreates the exact same set of cups with the exact same durations.",
  },
];
