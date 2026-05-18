export const NAME_WHEEL_FAQ = [
  {
    question: "Is this name picker wheel free?",
    answer:
      "Yes, completely. No signup, no email, no ads, no watermark on the wheel. The page is hosted as part of GoTimer&apos;s free classroom toolkit and will stay free.",
  },
  {
    question: "How does this name picker wheel differ from wheelofnames.com?",
    answer:
      "Functionally similar — both produce a uniform-random pick. Differences: this wheel is integrated with the rest of the classroom toolkit (group generator, noise meter, tally) under one bookmark, uses SVG + CSS transforms for 60fps on low-spec Chromebooks, and saves your class list locally without an account. wheelofnames.com has a longer feature list (skins, sounds, history) and a much larger brand presence.",
  },
  {
    question: "Does the wheel run at 60fps on a Chromebook?",
    answer:
      "Yes. The spin animation is a CSS transform on an SVG element — the browser hands it off to the GPU, so even an Intel Celeron N4020 Chromebook runs the rotation smoothly. We deliberately chose SVG + CSS over Canvas for this reason.",
  },
  {
    question: "Can I customise the wheel colours?",
    answer:
      "The wheel cycles through a fixed 10-colour palette chosen for high-contrast visibility from the back of a classroom. Per-slice custom colours are a planned addition; let us know if it&apos;s a blocker for your use.",
  },
  {
    question: "What happens after the wheel lands on a name?",
    answer:
      "The winning name displays in a highlighted card below the wheel. If &quot;Remove name after spin&quot; is on (default), that name disappears from the wheel for the next spin. If off, the wheel stays the same and the next spin could land on the same student.",
  },
  {
    question: "Can students see the wheel from the back of the room?",
    answer:
      "Yes — the wheel is sized to be readable on a 1080p projector from 20 feet away. For very small slices (40+ names), the label font shrinks; if names are hard to read in that case, switch to first-names-only or numbered placeholders.",
  },
  {
    question: "Can I save multiple wheels for different classes?",
    answer:
      "Yes, by URL. Bookmark the page with a different browser profile per class, or visit the page in incognito for a one-off wheel. A built-in &quot;classes&quot; feature with named profiles is on the roadmap; ask if you&apos;d use it.",
  },
  {
    question: "Does the wheel sound or vibrate when it stops?",
    answer:
      "No. The wheel is intentionally silent so it can run on a classroom projector without surprise audio. A click-tick during the spin and a soft chime at the end are planned options. Let us know if silence vs. cues matters for your classroom.",
  },
];
