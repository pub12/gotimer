/**
 * Toastmasters speech-preset shim.
 *
 * Each preset encodes the standard green/yellow/red signal milestones for a
 * Toastmasters speech type. The timer renders them as multi-step phases so
 * the stoplight component can key off `current_step` to show the right
 * coloured signal — the actual speaker-visible total is the sum of phase
 * durations, but each phase transition fires the audio cue plus updates the
 * signal indicator.
 *
 * Signal times follow Toastmasters International Pathways guidance.
 */
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export type SignalColor = "off" | "green" | "yellow" | "red";

export interface ToastmastersPreset {
  /** URL slug (e.g., "ice-breaker") */
  slug: string;
  /** Display name */
  name: string;
  /** Standard project description ("Project 1 — Ice Breaker", "Table Topics", etc.) */
  project: string;
  /** Green light time in seconds (minimum qualifying speech length) */
  green_seconds: number;
  /** Yellow light time in seconds */
  yellow_seconds: number;
  /** Red light time in seconds (maximum qualifying speech length) */
  red_seconds: number;
  /** Optional grace period in seconds added after red as a final phase */
  grace_seconds: number;
  /** Headline summary for the hero ("4-5-6 minutes — green at 4:00, yellow at 5:00, red at 6:00") */
  tagline: string;
  /** Steps expanded into multi-step form */
  steps: StepDefinition[];
  /** Per-step signal colour, parallel to steps */
  signal_colors: SignalColor[];
  /** Spoken summary line for SEO content */
  summary: string;
}

function build_steps(
  green_seconds: number,
  yellow_seconds: number,
  red_seconds: number,
  grace_seconds: number,
): { steps: StepDefinition[]; signal_colors: SignalColor[] } {
  const steps: StepDefinition[] = [
    {
      name: "Speaking — below green",
      duration: green_seconds,
    },
    {
      name: "Green signal — qualifying window open",
      duration: yellow_seconds - green_seconds,
    },
    {
      name: "Yellow signal — wrap up soon",
      duration: red_seconds - yellow_seconds,
    },
  ];
  const signal_colors: SignalColor[] = ["off", "green", "yellow"];
  if (grace_seconds > 0) {
    steps.push({
      name: "Red signal — over time",
      duration: grace_seconds,
    });
    signal_colors.push("red");
  }
  return { steps, signal_colors };
}

const ICE_BREAKER_BUILD = build_steps(4 * 60, 5 * 60, 6 * 60, 30);
export const ICE_BREAKER: ToastmastersPreset = {
  slug: "ice-breaker",
  name: "Ice Breaker Speech",
  project: "Pathways Level 1 Project 1 — Ice Breaker",
  green_seconds: 4 * 60,
  yellow_seconds: 5 * 60,
  red_seconds: 6 * 60,
  grace_seconds: 30,
  tagline: "4-5-6 minutes — green at 4:00, yellow at 5:00, red at 6:00",
  summary: "Ice Breaker speeches qualify for evaluation between 4:00 and 6:00.",
  ...ICE_BREAKER_BUILD,
};

const PREPARED_SPEECH_BUILD = build_steps(5 * 60, 6 * 60, 7 * 60, 30);
export const PREPARED_SPEECH: ToastmastersPreset = {
  slug: "prepared-speech",
  name: "Prepared Speech",
  project: "Most Pathways prepared-speech projects (Levels 1-5)",
  green_seconds: 5 * 60,
  yellow_seconds: 6 * 60,
  red_seconds: 7 * 60,
  grace_seconds: 30,
  tagline: "5-6-7 minutes — green at 5:00, yellow at 6:00, red at 7:00",
  summary:
    "Most Toastmasters prepared speeches qualify between 5:00 and 7:00, the classic 5-6-7 light cycle.",
  ...PREPARED_SPEECH_BUILD,
};

const TABLE_TOPICS_BUILD = build_steps(60, 90, 120, 15);
export const TABLE_TOPICS: ToastmastersPreset = {
  slug: "table-topics",
  name: "Table Topics",
  project: "Toastmasters Table Topics (impromptu)",
  green_seconds: 60,
  yellow_seconds: 90,
  red_seconds: 120,
  grace_seconds: 15,
  tagline: "1:00-1:30-2:00 — green at 1:00, yellow at 1:30, red at 2:00",
  summary:
    "Table Topics qualifying window is 1:00 to 2:00. Speakers who finish under 1:00 or over 2:00 are disqualified at contest level.",
  ...TABLE_TOPICS_BUILD,
};

const EVALUATION_BUILD = build_steps(2 * 60, 150, 3 * 60, 30);
export const EVALUATION: ToastmastersPreset = {
  slug: "evaluation",
  name: "Speech Evaluation",
  project: "Toastmasters Evaluation contest / club evaluations",
  green_seconds: 2 * 60,
  yellow_seconds: 150,
  red_seconds: 3 * 60,
  grace_seconds: 30,
  tagline: "2:00-2:30-3:00 — green at 2:00, yellow at 2:30, red at 3:00",
  summary:
    "Evaluations qualify between 2:00 and 3:00 — half the speaking time of the speech being evaluated.",
  ...EVALUATION_BUILD,
};

export const TOASTMASTERS_PRESETS: Record<string, ToastmastersPreset> = {
  "ice-breaker": ICE_BREAKER,
  "prepared-speech": PREPARED_SPEECH,
  "table-topics": TABLE_TOPICS,
  evaluation: EVALUATION,
};

export const DEFAULT_TOASTMASTERS_PRESET: ToastmastersPreset = PREPARED_SPEECH;

export const TOASTMASTERS_PRESET_ORDER: string[] = [
  "ice-breaker",
  "prepared-speech",
  "table-topics",
  "evaluation",
];

/** Format a seconds value as M:SS */
export function format_mmss(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
