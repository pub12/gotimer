export const NAME_PICKER_FAQ = [
  {
    question: "Does this name picker save my class list?",
    answer:
      "Yes. The list you paste into the box is saved in this browser&apos;s local storage and re-loads automatically the next time you visit the page. The list never leaves your computer — it&apos;s not sent to any server. Use a different browser profile or clear local storage to reset it.",
  },
  {
    question: "How do I keep the wheel from picking the same student twice?",
    answer:
      "Turn on the <strong>Remove name after spin</strong> toggle. The picked name disappears from the wheel until you re-paste the list (or refresh the page if you haven&apos;t edited it). This is the standard cold-call rotation pattern — every student gets called once before any repeat.",
  },
  {
    question: "Can I share a wheel with a colleague?",
    answer:
      "Bookmark the page after pasting your list — the list is in <em>your</em> browser only, so the bookmark just opens the wheel. To share a class list with a colleague, copy the names from the textarea and email them; they paste into their own browser and the wheel populates.",
  },
  {
    question: "Why a wheel instead of just flashing names?",
    answer:
      "Either works for fairness — both produce uniformly random picks. The wheel adds visible suspense (good for elementary engagement) and gives students a clear &quot;process is happening&quot; signal that flash-name lacks. If you prefer minimal animation, sit on the start screen and the result is functionally a random pick when you press Spin.",
  },
  {
    question: "Will the wheel work on my old Chromebook?",
    answer:
      "Yes. The wheel is rendered as an SVG and animated using a CSS transform — the GPU handles the rotation, so even an Intel Celeron N4020 Chromebook runs the spin at 60fps. Canvas-based wheels (which some competitor sites use) drop frames on the same hardware.",
  },
  {
    question: "Is there a limit to how many names I can add?",
    answer:
      "Practically, 60 names is the readable upper limit on a 13&quot; classroom Chromebook screen — beyond that, names start being truncated in the wheel slices. The data structure itself has no fixed cap, so 100+ works if you only need the spin animation rather than legible labels.",
  },
  {
    question: "Can I use nicknames or numbers instead of last names?",
    answer:
      "Yes. The picker treats whatever you paste as opaque labels. First names, nicknames, student numbers, table numbers, or any combination work fine. For privacy in a publicly-projected setting, first-name-only or numbered placeholders (Student 1, Student 2…) keep last names off the screen.",
  },
  {
    question: "Does this work offline?",
    answer:
      "Once the page loads, the picker runs entirely in your browser — no internet required for the spin itself. You do need internet for the initial page load. To use truly offline, load the page once on the classroom computer while connected, then the browser cache will serve subsequent visits.",
  },
];
