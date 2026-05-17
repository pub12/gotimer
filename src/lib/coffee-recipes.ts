/**
 * Pour-over recipe shim.
 *
 * Defines named pour-over recipes as ordered pour stages (bloom → pours →
 * drawdown) and expands each one into a flat StepDefinition[] for the
 * multi-step strategy. Same pattern as `src/lib/contrast-therapy.ts` — keeps
 * multi-step.ts agnostic of brewing concepts while letting each recipe URL
 * declare its sequence once.
 *
 * Each pour stage carries the cumulative water target so the UI can render a
 * pour-by-pour weight schedule alongside the timer.
 */
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export interface PourStage {
  /** Phase name (e.g., "Bloom", "Pour 1", "Drawdown") */
  name: string;
  /** Duration of this stage in seconds */
  duration: number;
  /** Cumulative water weight target at the end of this stage (grams) */
  cumulative_g: number;
  /** Pour amount for this stage (grams added during this stage) */
  pour_g: number;
  /** Optional pour-technique note ("center spiral", "stir gently", etc.) */
  note?: string;
}

export interface PourOverRecipe {
  slug: string;
  name: string;
  method: string;
  source: string;
  source_url?: string;
  /** Total coffee dose in grams */
  coffee_g: number;
  /** Total water in grams */
  water_g: number;
  /** Recommended grind ("medium-fine", "medium-coarse", etc.) */
  grind: string;
  /** Water temperature in Celsius */
  temp_c: number;
  /** Brew ratio shorthand (e.g., "1:15") */
  ratio: string;
  /** Ordered pour stages */
  stages: PourStage[];
}

/** Expand a recipe's pour stages into flat StepDefinition[] for the multi-step strategy */
export function expand_recipe(recipe: PourOverRecipe): StepDefinition[] {
  return recipe.stages.map((s) => ({
    name: `${s.name} — ${s.cumulative_g}g total`,
    duration: s.duration,
  }));
}

/** Total brew time in seconds */
export function total_time(recipe: PourOverRecipe): number {
  return recipe.stages.reduce((sum, s) => sum + s.duration, 0);
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

/**
 * James Hoffmann V60 — "The Ultimate V60 Technique" (2021).
 * Source: https://www.youtube.com/watch?v=AI4ynXzkSQo
 * 15g coffee : 250g water, medium-fine, 93°C. 4 pours, 2:30 finish.
 */
export const HOFFMANN_V60: PourOverRecipe = {
  slug: "hoffmann-v60",
  name: "Hoffmann V60",
  method: "v60",
  source: "James Hoffmann",
  source_url: "https://www.youtube.com/watch?v=AI4ynXzkSQo",
  coffee_g: 15,
  water_g: 250,
  grind: "medium-fine",
  temp_c: 93,
  ratio: "1:16.6",
  stages: [
    { name: "Bloom", duration: 45, cumulative_g: 50, pour_g: 50, note: "Wet all grounds. Stir or swirl once." },
    { name: "Pour 1", duration: 15, cumulative_g: 100, pour_g: 50, note: "Center pour to 100g." },
    { name: "Wait", duration: 30, cumulative_g: 100, pour_g: 0 },
    { name: "Pour 2", duration: 15, cumulative_g: 150, pour_g: 50, note: "Center pour to 150g." },
    { name: "Wait", duration: 30, cumulative_g: 150, pour_g: 0 },
    { name: "Pour 3", duration: 15, cumulative_g: 200, pour_g: 50, note: "Center pour to 200g." },
    { name: "Pour 4", duration: 10, cumulative_g: 250, pour_g: 50, note: "Final pour. Swirl to flatten bed." },
    { name: "Drawdown", duration: 60, cumulative_g: 250, pour_g: 0, note: "Wait for the cup to drain. Aim for 3:30 total." },
  ],
};

/**
 * Classic V60 (one-cup, four-pour). Generic method preset for users who
 * don't want a named recipe — sane defaults from Hario's published guide.
 */
export const V60_CLASSIC: PourOverRecipe = {
  slug: "v60",
  name: "V60 Classic",
  method: "v60",
  source: "Hario (generic four-pour)",
  coffee_g: 15,
  water_g: 240,
  grind: "medium-fine",
  temp_c: 92,
  ratio: "1:16",
  stages: [
    { name: "Bloom", duration: 30, cumulative_g: 40, pour_g: 40, note: "Wet all grounds and swirl." },
    { name: "Pour 1", duration: 20, cumulative_g: 100, pour_g: 60, note: "Slow center spiral to 100g." },
    { name: "Pour 2", duration: 20, cumulative_g: 160, pour_g: 60 },
    { name: "Pour 3", duration: 20, cumulative_g: 220, pour_g: 60 },
    { name: "Pour 4", duration: 15, cumulative_g: 240, pour_g: 20, note: "Final top-up; swirl to flatten." },
    { name: "Drawdown", duration: 75, cumulative_g: 240, pour_g: 0 },
  ],
};

/**
 * Chemex (3-cup, ~500g brew). Slower, cleaner cup; coarser grind, longer
 * drawdown. Adapted from the standard Chemex Coffeemakers brewing guide.
 */
export const CHEMEX: PourOverRecipe = {
  slug: "chemex",
  name: "Chemex",
  method: "chemex",
  source: "Chemex Coffeemakers official brewing guide",
  coffee_g: 30,
  water_g: 500,
  grind: "medium-coarse",
  temp_c: 94,
  ratio: "1:16.7",
  stages: [
    { name: "Bloom", duration: 45, cumulative_g: 60, pour_g: 60, note: "Wet all grounds, swirl, wait." },
    { name: "Pour 1", duration: 30, cumulative_g: 200, pour_g: 140, note: "Slow center spiral." },
    { name: "Wait", duration: 30, cumulative_g: 200, pour_g: 0 },
    { name: "Pour 2", duration: 30, cumulative_g: 350, pour_g: 150 },
    { name: "Wait", duration: 30, cumulative_g: 350, pour_g: 0 },
    { name: "Pour 3", duration: 30, cumulative_g: 500, pour_g: 150, note: "Final pour; swirl decanter to flatten bed." },
    { name: "Drawdown", duration: 120, cumulative_g: 500, pour_g: 0, note: "Long drawdown. Aim for 5:00-5:30 total." },
  ],
};

/**
 * Tetsu Kasuya 4:6 method (2016 World Brewers Cup winning recipe).
 * 20g coffee : 300g water. First 40% controls sweetness/acidity (two pours),
 * remaining 60% controls strength (three pours).
 * Source: https://philocoffea.com/blogs/4-6-method
 */
export const TETSU_KASUYA: PourOverRecipe = {
  slug: "tetsu-kasuya-4-6",
  name: "Tetsu Kasuya 4:6",
  method: "v60",
  source: "Tetsu Kasuya (2016 World Brewers Cup)",
  source_url: "https://philocoffea.com/blogs/4-6-method",
  coffee_g: 20,
  water_g: 300,
  grind: "coarse",
  temp_c: 92,
  ratio: "1:15",
  stages: [
    { name: "Pour 1 (sweetness)", duration: 45, cumulative_g: 50, pour_g: 50, note: "First 40% — lower amount = sweeter. Bloom + first pour combined." },
    { name: "Pour 2 (acidity)", duration: 45, cumulative_g: 120, pour_g: 70, note: "Larger pour than #1 = balanced acidity." },
    { name: "Pour 3 (strength)", duration: 30, cumulative_g: 180, pour_g: 60, note: "First of three strength pours." },
    { name: "Pour 4 (strength)", duration: 30, cumulative_g: 240, pour_g: 60 },
    { name: "Pour 5 (strength)", duration: 30, cumulative_g: 300, pour_g: 60, note: "Final pour. Three strength pours = medium body." },
    { name: "Drawdown", duration: 60, cumulative_g: 300, pour_g: 0, note: "Total target 3:30." },
  ],
};

/**
 * Kalita Wave 185 (two-cup, flat-bottom dripper).
 * 22g coffee : 350g water. Steady, multi-pour technique optimized for the
 * flat bed and three drainage holes.
 */
export const KALITA_WAVE: PourOverRecipe = {
  slug: "kalita-wave",
  name: "Kalita Wave 185",
  method: "kalita-wave",
  source: "Kalita Co. brewing guide",
  coffee_g: 22,
  water_g: 350,
  grind: "medium",
  temp_c: 93,
  ratio: "1:16",
  stages: [
    { name: "Bloom", duration: 45, cumulative_g: 50, pour_g: 50, note: "Wet all grounds; let CO2 escape." },
    { name: "Pour 1", duration: 20, cumulative_g: 150, pour_g: 100, note: "Steady center spiral. Keep bed level." },
    { name: "Wait", duration: 20, cumulative_g: 150, pour_g: 0 },
    { name: "Pour 2", duration: 20, cumulative_g: 250, pour_g: 100 },
    { name: "Wait", duration: 20, cumulative_g: 250, pour_g: 0 },
    { name: "Pour 3", duration: 20, cumulative_g: 350, pour_g: 100, note: "Final pour. Bed should flatten naturally." },
    { name: "Drawdown", duration: 90, cumulative_g: 350, pour_g: 0, note: "Aim for ~4:00 total." },
  ],
};

/**
 * AeroPress (standard / upright orientation). Inspired by World AeroPress
 * Championship-style "inverted-leaning" upright recipes.
 */
export const AEROPRESS: PourOverRecipe = {
  slug: "aeropress",
  name: "AeroPress (Standard)",
  method: "aeropress",
  source: "AeroPress Inc. classic recipe",
  coffee_g: 17,
  water_g: 250,
  grind: "medium-fine",
  temp_c: 85,
  ratio: "1:14.7",
  stages: [
    { name: "Bloom", duration: 30, cumulative_g: 50, pour_g: 50, note: "Pour 50g and stir 5 times." },
    { name: "Fill", duration: 15, cumulative_g: 250, pour_g: 200, note: "Top up to 250g. Stir twice." },
    { name: "Steep", duration: 60, cumulative_g: 250, pour_g: 0, note: "Cap with filter and steep." },
    { name: "Press", duration: 30, cumulative_g: 250, pour_g: 0, note: "Press slowly — aim for 30 seconds of even pressure." },
  ],
};

/**
 * AeroPress Inverted. Plunger inserted partially, brewer flipped upside down
 * so water steeps without dripping prematurely. Popular for fuller-body cups
 * and recipes from the World AeroPress Championship era.
 */
export const AEROPRESS_INVERTED: PourOverRecipe = {
  slug: "aeropress-inverted",
  name: "AeroPress (Inverted)",
  method: "aeropress",
  source: "World AeroPress Championship community",
  coffee_g: 18,
  water_g: 220,
  grind: "medium-fine",
  temp_c: 82,
  ratio: "1:12",
  stages: [
    { name: "Bloom", duration: 30, cumulative_g: 50, pour_g: 50, note: "Pour, stir 3 times." },
    { name: "Fill", duration: 20, cumulative_g: 220, pour_g: 170, note: "Top up to 220g." },
    { name: "Steep", duration: 75, cumulative_g: 220, pour_g: 0, note: "Steep 1:15. Cap with filter." },
    { name: "Flip + Press", duration: 30, cumulative_g: 220, pour_g: 0, note: "Flip onto carafe and press 25-30 seconds." },
  ],
};

/**
 * French press — Hoffmann's "The Best French Press Technique" recipe.
 * 30g coffee : 500g water, coarse grind, no aggressive press.
 * Source: https://www.youtube.com/watch?v=st571DYYTR8
 */
export const HOFFMANN_FRENCH_PRESS: PourOverRecipe = {
  slug: "hoffmann-french-press",
  name: "Hoffmann French Press",
  method: "french-press",
  source: "James Hoffmann",
  source_url: "https://www.youtube.com/watch?v=st571DYYTR8",
  coffee_g: 30,
  water_g: 500,
  grind: "coarse",
  temp_c: 94,
  ratio: "1:16.7",
  stages: [
    { name: "Pour", duration: 30, cumulative_g: 500, pour_g: 500, note: "Pour all water in one steady stream." },
    { name: "Steep", duration: 240, cumulative_g: 500, pour_g: 0, note: "Steep undisturbed for 4 minutes." },
    { name: "Break crust", duration: 30, cumulative_g: 500, pour_g: 0, note: "Stir crust 3 times with a spoon, then skim foam and floating grounds off." },
    { name: "Rest", duration: 300, cumulative_g: 500, pour_g: 0, note: "Rest 5 more minutes — no plunger." },
    { name: "Pour-off", duration: 30, cumulative_g: 500, pour_g: 0, note: "Insert plunger gently. Pour from the press." },
  ],
};

/**
 * Generic French press (standard 4-minute method). Use for users who don't
 * want Hoffmann's longer rest protocol.
 */
export const FRENCH_PRESS: PourOverRecipe = {
  slug: "french-press",
  name: "French Press (Classic)",
  method: "french-press",
  source: "Standard 4-minute method",
  coffee_g: 30,
  water_g: 500,
  grind: "coarse",
  temp_c: 94,
  ratio: "1:16.7",
  stages: [
    { name: "Pour", duration: 30, cumulative_g: 500, pour_g: 500, note: "Pour all water." },
    { name: "Steep", duration: 240, cumulative_g: 500, pour_g: 0, note: "Steep 4 minutes." },
    { name: "Plunge", duration: 20, cumulative_g: 500, pour_g: 0, note: "Press plunger down slowly and evenly." },
    { name: "Pour-off", duration: 20, cumulative_g: 500, pour_g: 0, note: "Decant immediately — don't leave coffee on the grounds." },
  ],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const POUR_OVER_RECIPES: Record<string, PourOverRecipe> = {
  v60: V60_CLASSIC,
  chemex: CHEMEX,
  aeropress: AEROPRESS,
  "aeropress-inverted": AEROPRESS_INVERTED,
  "french-press": FRENCH_PRESS,
  "hoffmann-v60": HOFFMANN_V60,
  "hoffmann-french-press": HOFFMANN_FRENCH_PRESS,
  "tetsu-kasuya-4-6": TETSU_KASUYA,
  "kalita-wave": KALITA_WAVE,
};

export const DEFAULT_POUR_OVER_RECIPE: PourOverRecipe = HOFFMANN_V60;
