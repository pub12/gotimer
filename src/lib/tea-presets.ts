/**
 * Tea preset shim.
 *
 * Defines per-tea-type steeping data (temperature, time range, leaf ratio,
 * common sub-varieties) plus a gongfu multi-infusion progression curve that
 * expands into the multi-step strategy. Same shape as `src/lib/coffee-recipes.ts`
 * and `src/lib/contrast-therapy.ts` — keeps the strategies agnostic of tea
 * while letting each tea URL declare its data once.
 *
 * Steeping ranges are calibrated to the consensus of Adagio Teas, MeiLeaf,
 * Tea Drunk, and Harney & Sons published guidance. They are starting points;
 * individual leaves vary.
 */
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export interface TeaSubVariety {
  /** Sub-variety name (e.g., "Sencha", "Dragon Well") */
  name: string;
  /** Recommended steep time in seconds */
  steep_seconds: number;
  /** Optional note ("Japanese steamed", "Chinese pan-fired", etc.) */
  note?: string;
}

export interface TeaPreset {
  /** URL slug */
  slug: string;
  /** Display name */
  name: string;
  /** Default steep time for the timer (seconds) */
  steep_seconds: number;
  /** Steep range low end (seconds) */
  steep_min: number;
  /** Steep range high end (seconds) */
  steep_max: number;
  /** Recommended water temperature in Celsius */
  temp_c: number;
  /** Recommended water temperature in Fahrenheit */
  temp_f: number;
  /** Leaf-to-water ratio shorthand (e.g., "2g/8oz") */
  ratio: string;
  /** Theme accent color name (semantic only — informational) */
  accent: string;
  /** One-line short description used in cross-link cards */
  tagline: string;
  /** Common sub-varieties for the in-page reference table */
  sub_varieties: TeaSubVariety[];
}

// ---------------------------------------------------------------------------
// Per-tea-type presets
// ---------------------------------------------------------------------------

export const GREEN_TEA: TeaPreset = {
  slug: "green",
  name: "Green Tea",
  steep_seconds: 120,
  steep_min: 60,
  steep_max: 180,
  temp_c: 80,
  temp_f: 176,
  ratio: "2g per 8 oz (235 ml)",
  accent: "green",
  tagline: "1-3 minutes at 75-80°C — grassy, fresh, low astringency",
  sub_varieties: [
    { name: "Sencha", steep_seconds: 60, note: "Japanese steamed — short, hot-ish" },
    { name: "Dragon Well (Longjing)", steep_seconds: 120, note: "Chinese pan-fired" },
    { name: "Gyokuro", steep_seconds: 90, note: "Shade-grown — use cooler water (60-65°C)" },
    { name: "Bi Luo Chun", steep_seconds: 90, note: "Delicate — under-steep rather than over" },
    { name: "Genmaicha", steep_seconds: 120, note: "Toasted rice blend" },
    { name: "Matcha (whisked)", steep_seconds: 30, note: "Whisk, do not steep" },
  ],
};

export const BLACK_TEA: TeaPreset = {
  slug: "black",
  name: "Black Tea",
  steep_seconds: 240,
  steep_min: 180,
  steep_max: 300,
  temp_c: 95,
  temp_f: 203,
  ratio: "2.5g per 8 oz (235 ml)",
  accent: "amber",
  tagline: "3-5 minutes at 90-100°C — bold, malty, fully oxidised",
  sub_varieties: [
    { name: "English Breakfast", steep_seconds: 240, note: "Blend — milk friendly" },
    { name: "Assam", steep_seconds: 240, note: "Malty, full-bodied" },
    { name: "Darjeeling First Flush", steep_seconds: 180, note: "Lighter, muscatel" },
    { name: "Ceylon", steep_seconds: 240, note: "Bright and citrusy" },
    { name: "Earl Grey", steep_seconds: 240, note: "Bergamot-scented blend" },
    { name: "Lapsang Souchong", steep_seconds: 300, note: "Pine-smoked" },
  ],
};

export const OOLONG_TEA: TeaPreset = {
  slug: "oolong",
  name: "Oolong Tea",
  steep_seconds: 180,
  steep_min: 120,
  steep_max: 240,
  temp_c: 90,
  temp_f: 194,
  ratio: "3g per 8 oz (235 ml)",
  accent: "amber",
  tagline: "2-4 minutes at 85-95°C — partially oxidised, multi-infusion friendly",
  sub_varieties: [
    { name: "Tieguanyin (Iron Goddess)", steep_seconds: 180, note: "Lightly oxidised — floral" },
    { name: "Da Hong Pao (Big Red Robe)", steep_seconds: 180, note: "Heavily roasted, mineral" },
    { name: "Dong Ding", steep_seconds: 180, note: "Taiwanese roasted oolong" },
    { name: "Milk Oolong (Jin Xuan)", steep_seconds: 150, note: "Creamy, lightly oxidised" },
    { name: "Phoenix Dancong", steep_seconds: 180, note: "Single-bush — aromatic" },
    { name: "Oriental Beauty", steep_seconds: 180, note: "Bug-bitten — honey notes" },
  ],
};

export const WHITE_TEA: TeaPreset = {
  slug: "white",
  name: "White Tea",
  steep_seconds: 180,
  steep_min: 120,
  steep_max: 300,
  temp_c: 80,
  temp_f: 176,
  ratio: "3g per 8 oz (235 ml)",
  accent: "ivory",
  tagline: "2-5 minutes at 75-85°C — minimally processed, delicate",
  sub_varieties: [
    { name: "Silver Needle (Bai Hao Yin Zhen)", steep_seconds: 240, note: "Pure buds — most delicate" },
    { name: "White Peony (Bai Mu Dan)", steep_seconds: 180, note: "Buds + young leaves" },
    { name: "Shou Mei", steep_seconds: 240, note: "Mature leaves — stronger" },
    { name: "Aged White (3+ years)", steep_seconds: 300, note: "Honey-like, gongfu-friendly" },
  ],
};

export const PU_ERH_TEA: TeaPreset = {
  slug: "pu-erh",
  name: "Pu-Erh Tea",
  steep_seconds: 180,
  steep_min: 60,
  steep_max: 300,
  temp_c: 95,
  temp_f: 203,
  ratio: "5g per 4 oz (120 ml) for gongfu; 3g per 8 oz Western",
  accent: "umber",
  tagline: "Fermented Chinese tea — typically brewed gongfu, 8-12 infusions",
  sub_varieties: [
    { name: "Sheng (raw) — young", steep_seconds: 30, note: "Gongfu: 10-15s rinse, then 10-20s starts" },
    { name: "Sheng (raw) — aged 10+ years", steep_seconds: 30, note: "Smooth, no rinse needed for some" },
    { name: "Shou (ripe / cooked)", steep_seconds: 30, note: "Gongfu: 10s rinse + 10s starts" },
    { name: "Pu-erh tuocha (compressed)", steep_seconds: 240, note: "Western: 3-5 min, repeat 2-3x" },
  ],
};

export const HERBAL_TEA: TeaPreset = {
  slug: "herbal",
  name: "Herbal Tea (Tisane)",
  steep_seconds: 360,
  steep_min: 300,
  steep_max: 600,
  temp_c: 100,
  temp_f: 212,
  ratio: "1 tea bag or 2g per 8 oz (235 ml)",
  accent: "rose",
  tagline: "5-10 minutes at 100°C — no caffeine, no over-steep risk",
  sub_varieties: [
    { name: "Chamomile", steep_seconds: 300, note: "Soothing, sleep-friendly" },
    { name: "Peppermint", steep_seconds: 360, note: "Digestion — strong at 6+ min" },
    { name: "Rooibos", steep_seconds: 420, note: "South African — can steep 7+ min" },
    { name: "Hibiscus", steep_seconds: 360, note: "Tart, ruby-red" },
    { name: "Ginger", steep_seconds: 600, note: "Use fresh slices — 10+ min for full kick" },
    { name: "Lemon balm", steep_seconds: 300, note: "Calming, citrusy" },
  ],
};

export const MATCHA: TeaPreset = {
  slug: "matcha",
  name: "Matcha",
  steep_seconds: 30,
  steep_min: 15,
  steep_max: 60,
  temp_c: 75,
  temp_f: 167,
  ratio: "2g (1 tsp) per 2 oz (60 ml) water for usucha; 4g for koicha",
  accent: "jade",
  tagline: "Whisked, not steeped — 30 seconds of fast zigzag with a chasen",
  sub_varieties: [
    { name: "Ceremonial usucha (thin)", steep_seconds: 30, note: "2g + 60ml — whisk to froth" },
    { name: "Ceremonial koicha (thick)", steep_seconds: 45, note: "4g + 30ml — kneading whisk" },
    { name: "Culinary grade (latte)", steep_seconds: 30, note: "Mix into hot milk after whisking" },
  ],
};

// ---------------------------------------------------------------------------
// Registry of per-type presets
// ---------------------------------------------------------------------------

export const TEA_PRESETS: Record<string, TeaPreset> = {
  green: GREEN_TEA,
  black: BLACK_TEA,
  oolong: OOLONG_TEA,
  white: WHITE_TEA,
  "pu-erh": PU_ERH_TEA,
  herbal: HERBAL_TEA,
  matcha: MATCHA,
};

export const DEFAULT_TEA_PRESET: TeaPreset = GREEN_TEA;

// ---------------------------------------------------------------------------
// Gongfu multi-infusion progression
// ---------------------------------------------------------------------------

/**
 * Standard gongfu progression curve. Used for oolong, pu-erh, and aged white
 * teas brewed in a small (100-150ml) gaiwan with a high leaf ratio (5g+/100ml).
 * Each infusion is short; later infusions get longer as the leaves spend.
 *
 * Defaults assume a 10-second rinse (optional) + 8 brewing infusions.
 */
export interface GongfuConfig {
  /** Optional rinse before infusion 1 (set 0 to skip) */
  rinse_seconds: number;
  /** Ordered durations for infusions 1..N (seconds) */
  infusions: number[];
}

export const STANDARD_GONGFU: GongfuConfig = {
  rinse_seconds: 10,
  infusions: [10, 15, 20, 30, 45, 60, 90, 120],
};

/** Expand a gongfu config into flat StepDefinition[] for the multi-step strategy */
export function expand_gongfu(config: GongfuConfig): StepDefinition[] {
  const steps: StepDefinition[] = [];
  if (config.rinse_seconds > 0) {
    steps.push({
      name: "Rinse (discard first water)",
      duration: config.rinse_seconds,
    });
  }
  config.infusions.forEach((duration, idx) => {
    steps.push({
      name: `Infusion ${idx + 1} of ${config.infusions.length}`,
      duration,
    });
  });
  return steps;
}

/** Total gongfu session time in seconds (rinse + all infusions) */
export function total_gongfu_seconds(config: GongfuConfig): number {
  return config.rinse_seconds + config.infusions.reduce((sum, n) => sum + n, 0);
}

// ---------------------------------------------------------------------------
// Multi-cup default
// ---------------------------------------------------------------------------

/**
 * Default 3-cup tea-party config for the multi-cup leaf.
 * Three common teas with their default steep times pre-baked.
 */
export const DEFAULT_TEA_CUPS = [
  { id: "cup-green", name: "Green tea", duration: 120 },
  { id: "cup-oolong", name: "Oolong", duration: 180 },
  { id: "cup-black", name: "Black tea", duration: 240 },
];
