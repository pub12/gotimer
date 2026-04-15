import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

/** Process presets for film development */
export interface FilmDevProcess {
  id: string;
  name: string;
  steps: StepDefinition[];
}

export const FILM_DEV_PROCESSES: FilmDevProcess[] = [
  {
    id: "bw-standard",
    name: "B&W Standard",
    steps: [
      { name: "Pre-soak", duration: 60, agitation: { initial_seconds: 60, interval_seconds: 0, duration_seconds: 0 } },
      { name: "Developer", duration: 450, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Stop Bath", duration: 60, agitation: { initial_seconds: 60, interval_seconds: 0, duration_seconds: 0 } },
      { name: "Fixer", duration: 300, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 300 },
      { name: "Rinse Aid", duration: 60 },
    ],
  },
  {
    id: "bw-minimal",
    name: "B&W Minimal",
    steps: [
      { name: "Developer", duration: 450, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Stop Bath", duration: 60, agitation: { initial_seconds: 60, interval_seconds: 0, duration_seconds: 0 } },
      { name: "Fixer", duration: 300, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 300 },
    ],
  },
  {
    id: "c41",
    name: "C-41 Color",
    steps: [
      { name: "Pre-heat", duration: 60 },
      { name: "Developer", duration: 195, agitation: { initial_seconds: 15, interval_seconds: 30, duration_seconds: 5 } },
      { name: "Bleach", duration: 390, agitation: { initial_seconds: 15, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 180 },
      { name: "Fixer", duration: 390, agitation: { initial_seconds: 15, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 180 },
      { name: "Stabilizer", duration: 60 },
    ],
  },
  {
    id: "e6",
    name: "E-6 Slide",
    steps: [
      { name: "First Dev", duration: 360, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 120 },
      { name: "Reversal", duration: 120 },
      { name: "Color Dev", duration: 360, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 120 },
      { name: "Bleach", duration: 420, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Fixer", duration: 240, agitation: { initial_seconds: 30, interval_seconds: 60, duration_seconds: 10 } },
      { name: "Wash", duration: 180 },
      { name: "Stabilizer", duration: 60 },
    ],
  },
];

/** Recipe database: common film + developer combinations */
export interface FilmRecipe {
  film: string;
  developer: string;
  dilution: string;
  time_seconds: number;
  source: string;
}

export const FILM_RECIPES: FilmRecipe[] = [
  { film: "Ilford HP5+", developer: "Ilfosol 3", dilution: "1+9", time_seconds: 390, source: "Ilford datasheet" },
  { film: "Ilford HP5+", developer: "ID-11 / D-76", dilution: "Stock", time_seconds: 450, source: "Ilford datasheet" },
  { film: "Ilford HP5+", developer: "HC-110", dilution: "Dilution B", time_seconds: 300, source: "Kodak datasheet" },
  { film: "Ilford HP5+", developer: "Rodinal", dilution: "1:50", time_seconds: 780, source: "Community verified" },
  { film: "Ilford FP4+", developer: "ID-11 / D-76", dilution: "Stock", time_seconds: 420, source: "Ilford datasheet" },
  { film: "Ilford Delta 100", developer: "ID-11 / D-76", dilution: "Stock", time_seconds: 480, source: "Ilford datasheet" },
  { film: "Kodak Tri-X 400", developer: "D-76", dilution: "Stock", time_seconds: 405, source: "Kodak datasheet" },
  { film: "Kodak Tri-X 400", developer: "HC-110", dilution: "Dilution B", time_seconds: 330, source: "Kodak datasheet" },
  { film: "Kodak T-Max 400", developer: "D-76", dilution: "Stock", time_seconds: 360, source: "Kodak datasheet" },
  { film: "Kodak T-Max 100", developer: "D-76", dilution: "Stock", time_seconds: 420, source: "Kodak datasheet" },
  { film: "Fomapan 100", developer: "Rodinal", dilution: "1:50", time_seconds: 660, source: "Foma datasheet" },
  { film: "Fomapan 400", developer: "Rodinal", dilution: "1:50", time_seconds: 900, source: "Community verified" },
  { film: "Fuji Acros 100 II", developer: "D-76", dilution: "Stock", time_seconds: 405, source: "Fuji datasheet" },
];

/** Push/pull time multipliers */
export const PUSH_PULL_MULTIPLIERS: Record<string, number> = {
  "-2": 0.65,
  "-1": 0.85,
  "0": 1.0,
  "+1": 1.4,
  "+2": 1.75,
  "+3": 2.2,
};

/** Temperature compensation: for each 1°C above 20°C, reduce time by ~10% */
export function adjust_for_temperature(time_seconds: number, temp_c: number): number {
  const diff = temp_c - 20;
  if (diff === 0) return time_seconds;
  const factor = Math.pow(0.9, diff);
  return Math.round(time_seconds * factor);
}
