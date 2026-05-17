export const PRE_INFUSION_FAQ = [
  {
    question: "What is espresso pre-infusion?",
    answer:
      "Pre-infusion is the brief phase at the start of an espresso shot when water saturates the coffee puck before full extraction pressure builds. It happens between when the pump engages and when coffee first drips from the portafilter — typically <strong>4 to 8 seconds</strong> on a home machine, longer (10-20s) on machines with pressure profiling. A consistent pre-infusion duration is one of the strongest signals of shot consistency; this timer is built specifically to track it.",
  },
  {
    question: "Why does pre-infusion matter?",
    answer:
      "Three reasons: (1) <strong>even saturation</strong> — pre-infusion wets the puck before full pressure, which prevents channeling (water finding a path of least resistance through cracks in the puck); (2) <strong>CO₂ degassing</strong> — fresh coffee releases CO₂ that interferes with extraction; the low-pressure pre-infusion phase lets some of that gas escape; (3) <strong>consistency</strong> — if your pre-infusion duration varies shot-to-shot, your extraction will too. Track it and you can adjust grind, dose, or tamp to bring it into a target window.",
  },
  {
    question: "What pre-infusion duration should I target?",
    answer:
      "Depends on your machine. Most home machines (Breville Bambino, Gaggia Classic Pro, Rancilio Silvia) have <strong>no controlled pre-infusion</strong> — the pump runs at full pressure from the start and you get 4-6 seconds of natural pre-infusion as the boiler fills the group head. Machines with controlled pre-infusion (La Marzocco Linea Mini, ECM Synchronika, Decent DE1) can run 10-20 seconds. Aim for <strong>consistency</strong> first — whatever number you hit, hit it the same way every time.",
  },
  {
    question: "How do I increase or decrease pre-infusion time?",
    answer:
      "On machines without controlled pre-infusion: <strong>finer grind = longer pre-infusion</strong> (more resistance, slower fill); <strong>tighter tamp = longer pre-infusion</strong>; <strong>fresher coffee = longer pre-infusion</strong> (more CO₂ resistance). On machines with controlled pre-infusion, set it explicitly via the machine&apos;s software (Decent app), paddle (Linea Mini), or pre-infusion knob (some ECM models).",
  },
  {
    question: "Does this timer connect to my espresso machine?",
    answer:
      "No — it&apos;s a manual, browser-based timer. Start it when you press the brew button on the machine; tap First Drip when coffee appears at the spouts. There&apos;s no Bluetooth, no IoT integration, no machine API. The advantage of a manual timer is that it works with any machine, including the dumbest single-boiler Gaggia. For home use this is what most coffee pros actually do — phone next to the machine.",
  },
  {
    question: "Is pre-infusion the same as bloom (in pour-over)?",
    answer:
      "Conceptually similar but mechanically different. <strong>Bloom in pour-over</strong> wets the grounds with a small amount of water at atmospheric pressure for 30-45 seconds, letting CO₂ escape before the main pour begins. <strong>Pre-infusion in espresso</strong> wets the puck at low pressure for 4-20 seconds before full 9-bar pressure builds. Both serve the same purpose (CO₂ release + even saturation) but at very different timescales. If you brew pour-over, see our <a href=\"/kitchen/pour-over-timer\">pour-over timer hub</a>.",
  },
];
