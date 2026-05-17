/**
 * Canonical FAQ for the 20-20-20 / eye-strain / screen-break-reminder
 * pages. Used by:
 *   - layout.tsx — to emit FAQPage JSON-LD
 *   - page.tsx   — to render the on-page FAQ accordion
 *
 * Keep answers HTML-flavored (the rendering component supports inline
 * tags); the schema emitter strips tags before serialising.
 */
export const EYE_STRAIN_FAQ = [
  {
    question: "What is the 20-20-20 rule?",
    answer:
      "Coined by California optometrist Dr. Jeffrey Anshel, the 20-20-20 rule says that every <strong>20 minutes</strong> of screen use, you should look at something <strong>20 feet away</strong> for at least <strong>20 seconds</strong>. The brief gaze break relaxes the ciliary muscles that control near focus, gives your blink reflex a chance to fully reset, and reduces the most common symptoms of digital eye strain — dryness, blurring, headaches, and that gritty feeling at the end of a long workday. It is endorsed by the <a href=\"https://www.aao.org/eye-health/tips-prevention/computer-usage\" rel=\"noopener nofollow\" target=\"_blank\">American Academy of Ophthalmology</a> as a baseline ergonomic habit for anyone who uses a screen for more than two hours per day.",
  },
  {
    question: "Does the 20-20-20 rule actually work?",
    answer:
      "Several small clinical trials, including a 2020 study in the journal <em>Contact Lens and Anterior Eye</em>, have shown measurable reductions in self-reported eye strain when office workers follow a 20-minute break schedule. The improvements are not dramatic — eye strain is multi-factorial — but the intervention has effectively zero downside and the cost is one short interruption every twenty minutes. The dose-response is consistent: people who follow the rule rigorously report less end-of-day eye fatigue than people who do not.",
  },
  {
    question: "Why 20 feet specifically?",
    answer:
      "Twenty feet (about six metres) is the threshold beyond which the human eye treats incoming light as effectively parallel. At that distance the ciliary muscles fully relax — the same way they would when gazing at the horizon. Looking at anything closer keeps the muscles partially contracted, so the break is less restorative. In a typical office or living room, the far end of the room, a window overlooking the street, or a hallway are good targets. If you cannot find a 20-foot sightline, anything past 10 feet still helps; the rule is a guideline, not a medical prescription.",
  },
  {
    question: "How does this timer work in a background tab?",
    answer:
      "The timer continues counting even when you switch to a different browser tab — modern browsers throttle background scripts but allow them to keep ticking once per second, which is plenty for a 20-minute cadence. When the cycle expires, the tab title updates with a live countdown and, if you enable browser notifications, you also get a system-level alert. If you accidentally close the tab the timer resets, so pin the tab if you want it to survive a browser restart.",
  },
  {
    question: "Is this safer for contact lens wearers?",
    answer:
      "Contact lens wearers blink up to <strong>50% less</strong> while staring at a screen, which dries out the lens and the corneal surface beneath it. The 20-second look-away is also a natural opportunity to do a couple of deliberate full blinks — push your eyelids gently together to redistribute the tear film. If you wear daily disposables, this small habit can extend comfortable wear time by an hour or two. If you are using monthly or extended-wear lenses, talk to your optometrist about lubricating drops; the 20-20-20 rule is complementary, not a substitute.",
  },
  {
    question: "Does blue light from screens damage my eyes?",
    answer:
      "The blue-light scare has been largely overstated. The American Academy of Ophthalmology has explicitly stated that screen blue light does not cause eye disease and that there is no compelling evidence supporting routine use of blue-light-blocking lenses. What screens <em>do</em> cause is reduced blink rate, sustained near-focus strain, and disturbed sleep when used close to bedtime. The 20-20-20 rule addresses the first two; for the third, prefer night-mode display settings and stop screen use an hour before bed.",
  },
  {
    question: "How is this different from a browser extension?",
    answer:
      "Browser extensions need to be installed, request broad permissions, and can break across browsers or device changes. This is a plain web page — open it once in any browser, and it works. There is nothing to install, no account, and no tracking beyond the basic analytics every website uses. If you mainly work on a single laptop, an extension and a web timer are roughly equivalent; if you bounce between desktop, laptop, and tablet, a URL that works on all of them tends to be lower friction.",
  },
  {
    question: "Can I adjust the 20-minute interval?",
    answer:
      "Yes. The dropdown lets you pick 10, 20, 30, 45, or 60-minute reminders. Twenty minutes is the research-backed default. People with mild symptoms sometimes prefer 30 or 45 minutes to interrupt focus less often; people with more severe digital eye strain often go down to 10 minutes during peak screen sessions. The look-away duration stays at 20 seconds regardless — that is the minimum needed for the ciliary muscles to actually relax.",
  },
];
