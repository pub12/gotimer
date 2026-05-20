/**
 * Contrast-therapy preset expander.
 *
 * Pre-expands a cycle-based protocol (N rounds of M named phases) into the
 * flat StepDefinition[] that the multi-step strategy consumes. Optional
 * `end_on` truncates the trailing phases of the last round so the protocol
 * finishes on a specified phase (e.g. the end-on-cold requirement of the
 * 11-minute cold protocol).
 *
 * The shim keeps multi-step.ts agnostic of the cycle concept while letting
 * each preset URL declare its protocol once.
 */
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export interface ContrastPhase {
  name: string;
  duration: number;
}

export interface ContrastConfig {
  phases: ContrastPhase[];
  cycles: number;
  /**
   * If set, drop trailing phases of the final round so the protocol ends on
   * the most-recent occurrence of a phase whose name starts with this string.
   */
  end_on?: string;
}

export function expand_contrast(config: ContrastConfig): StepDefinition[] {
  const steps: StepDefinition[] = [];
  for (let r = 1; r <= config.cycles; r++) {
    for (const phase of config.phases) {
      steps.push({
        name: `${phase.name} — Round ${r}/${config.cycles}`,
        duration: phase.duration,
      });
    }
  }

  if (config.end_on) {
    let last_keep = -1;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].name.startsWith(config.end_on)) last_keep = i;
    }
    if (last_keep >= 0) return steps.slice(0, last_keep + 1);
  }

  return steps;
}

export const ELEVEN_MIN_PRESET: ContrastConfig = {
  phases: [
    { name: "Sauna", duration: 15 * 60 },
    { name: "Plunge", duration: 120 },
    { name: "Rest", duration: 60 },
  ],
  cycles: 3,
  end_on: "Plunge",
};

export const FIFTEEN_THREE_PRESET: ContrastConfig = {
  phases: [
    { name: "Sauna", duration: 15 * 60 },
    { name: "Cold plunge", duration: 3 * 60 },
    { name: "Rest", duration: 60 },
  ],
  cycles: 3,
  end_on: "Cold plunge",
};

export const WIM_HOF_PRESET: ContrastConfig = {
  phases: [
    { name: "Breath work", duration: 3 * 60 },
    { name: "Cold plunge", duration: 120 },
    { name: "Recovery", duration: 90 },
  ],
  cycles: 3,
  end_on: "Cold plunge",
};

export const DEFAULT_CONTRAST_PRESET: ContrastConfig = ELEVEN_MIN_PRESET;
