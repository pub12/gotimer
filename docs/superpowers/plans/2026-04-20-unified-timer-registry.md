# Unified Timer Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a single timer registry file that all consumers (API, MCP, sitemap, categories, admin) read from, replacing scattered hardcoded definitions.

**Architecture:** A new `src/lib/timer-registry.ts` exports three arrays (`TIMER_STRATEGIES`, `TIMER_PRESETS`, `TIMER_CATEGORIES`) plus lookup helpers. Existing consumers are updated to import from the registry. A validator checks for drift at dev startup and in an admin health page.

**Tech Stack:** TypeScript, Next.js App Router, Node.js MCP SDK

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/timer-registry.ts` | Create | Central registry: strategies, presets, categories, helpers |
| `src/lib/timer-registry-validator.ts` | Create | Validates registry against STRATEGY_REGISTRY and route dirs |
| `src/app/api/v1/timers/route.ts` | Modify | Read strategies from registry instead of hardcoded array |
| `src/app/api/v1/timer-presets/route.ts` | Create | New endpoint returning presets, filterable by category |
| `src/app/api/v1/timer-url/route.ts` | Modify | Resolve preset IDs to strategy + config |
| `src/app/api/v1/timer-url/embed/route.ts` | Modify | Resolve preset IDs to strategy + config |
| `src/app/sitemap.ts` | Modify | Generate timer/category URLs from registry |
| `src/lib/site-categories.ts` | Modify | Re-export from registry for backward compat |
| `src/app/admin/timer-health/page.tsx` | Create | Visual health dashboard for timer registration status |
| `src/components/admin/sidebar.tsx` | Modify | Add Timer Health nav link |
| `gotimer-mcp/index.js` | Modify | Add list_timer_presets tool, update create_timer |
| `gotimer-mcp/README.md` | Modify | Document new tool |

---

### Task 1: Create the Timer Registry

**Files:**
- Create: `src/lib/timer-registry.ts`

- [ ] **Step 1: Create the registry file with type definitions**

Create `src/lib/timer-registry.ts`:

```typescript
import type { LucideIcon } from "lucide-react";
import {
  Dice5, Camera, Dumbbell, Heart, Target, CookingPot,
} from "lucide-react";

// --- Type Definitions ---

export interface StrategyDefinition {
  id: string;
  name: string;
  description: string;
  defaultConfig: Record<string, number | string | boolean>;
  supportedParams: string[];
  route: string;
  setupRoute?: string;
  embedRoute?: string;
  sitemapPriority: number;
}

export interface PresetDefinition {
  id: string;
  name: string;
  description: string;
  strategy: string;
  defaultConfig: Record<string, number | string | boolean>;
  category: string;
  route: string;
  sitemapPriority: number;
}

export interface CategoryDefinition {
  slug: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  heading: string;
  description: string;
  heroCta: string;
  heroCtaHref: string;
  gridHeading: string;
  featuredTimers: string[];
  accent?: string;
  faq?: Array<{ question: string; answer: string }>;
}
```

- [ ] **Step 2: Add strategy definitions**

Add to `src/lib/timer-registry.ts` after the types:

```typescript
// --- Strategy Definitions ---

export const TIMER_STRATEGIES: StrategyDefinition[] = [
  {
    id: "countdown",
    name: "Countdown Timer",
    description: "A simple countdown timer that counts down from a set duration.",
    defaultConfig: { duration: 300, alert_at: 60 },
    supportedParams: ["duration", "label"],
    route: "/countdown",
    setupRoute: "/countdown-setup",
    embedRoute: "/embed/countdown",
    sitemapPriority: 0.8,
  },
  {
    id: "chess-clock",
    name: "Chess Clock",
    description: "A two-player chess clock where each player has their own time bank.",
    defaultConfig: { duration_per_player: 600, increment: 0 },
    supportedParams: ["duration", "label"],
    route: "/chess-clock",
    setupRoute: "/chess-clock-setup",
    embedRoute: "/embed/chess-clock",
    sitemapPriority: 0.8,
  },
  {
    id: "round-timer",
    name: "Round Timer",
    description: "A round-based timer for sports and combat games with work and rest periods.",
    defaultConfig: { round_duration: 180, rest_duration: 60, rounds: 3 },
    supportedParams: ["duration", "label"],
    route: "/round-timer",
    setupRoute: "/round-timer-setup",
    embedRoute: "/embed/round-timer",
    sitemapPriority: 0.8,
  },
  {
    id: "interval",
    name: "Interval Timer",
    description: "A work/rest interval timer, perfect for Pomodoro technique, HIIT workouts, and timed study sessions.",
    defaultConfig: { work: 1500, rest: 300, rounds: 4 },
    supportedParams: ["work", "rest", "rounds", "label"],
    route: "/countdown",
    embedRoute: "/embed/countdown",
    sitemapPriority: 0.7,
  },
  {
    id: "multi-step",
    name: "Multi-Step Timer",
    description: "Sequential step-based timer for multi-stage processes like film development or cooking recipes.",
    defaultConfig: {},
    supportedParams: ["label"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },
  {
    id: "ambient",
    name: "Ambient Timer",
    description: "Long-form ambient countdown for processes that run unattended, like stand development in photography.",
    defaultConfig: { duration: 3600 },
    supportedParams: ["duration", "label"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },
  {
    id: "calculator-timer",
    name: "Calculator Timer",
    description: "Reciprocity calculator timer for long exposure photography with automatic correction.",
    defaultConfig: {},
    supportedParams: ["label"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },
  {
    id: "multi-timer",
    name: "Multi-Timer",
    description: "Run multiple simultaneous timers, perfect for kitchen cooking or managing parallel tasks.",
    defaultConfig: {},
    supportedParams: ["label"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },
  {
    id: "turn-timer",
    name: "Turn Timer",
    description: "Multi-player turn countdown for board games supporting 2-8 players with per-player time banks.",
    defaultConfig: { duration_per_player: 60, players: 2 },
    supportedParams: ["duration", "label"],
    route: "/countdown",
    sitemapPriority: 0.7,
  },
  {
    id: "enlarger",
    name: "Enlarger Timer",
    description: "Photography darkroom enlarger timer with f-stop timing and test strip modes.",
    defaultConfig: {},
    supportedParams: ["label"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },
];
```

- [ ] **Step 3: Add preset definitions**

Add to `src/lib/timer-registry.ts`:

```typescript
// --- Preset Definitions ---

export const TIMER_PRESETS: PresetDefinition[] = [
  // Board Games
  { id: "board-countdown", name: "Countdown Timer", description: "Set a time limit for turns or rounds", strategy: "countdown", defaultConfig: { duration: 300 }, category: "board-games", route: "/board-games/countdown", sitemapPriority: 0.7 },
  { id: "board-chess-clock", name: "Chess Clock", description: "Two-player time control for competitive games", strategy: "chess-clock", defaultConfig: { duration_per_player: 600 }, category: "board-games", route: "/board-games/chess-clock", sitemapPriority: 0.7 },
  { id: "board-round-timer", name: "Round Timer", description: "Track rounds and total game time", strategy: "round-timer", defaultConfig: { round_duration: 180, rest_duration: 60, rounds: 3 }, category: "board-games", route: "/board-games/round-timer", sitemapPriority: 0.7 },
  { id: "turn-timer", name: "Turn Timer", description: "Per-player turn countdown for 2-8 players", strategy: "turn-timer", defaultConfig: { duration_per_player: 60, players: 4 }, category: "board-games", route: "/board-games/turn-timer", sitemapPriority: 0.7 },

  // Photography
  { id: "film-development", name: "Film Development Timer", description: "Multi-step sequential timer for B&W, C-41, and E-6 processes", strategy: "multi-step", defaultConfig: {}, category: "photography", route: "/photography/film-development", sitemapPriority: 0.8 },
  { id: "long-exposure-calculator", name: "Long Exposure Calculator", description: "Reciprocity failure correction for film photography", strategy: "calculator-timer", defaultConfig: {}, category: "photography", route: "/photography/long-exposure-calculator", sitemapPriority: 0.8 },
  { id: "stand-development", name: "Stand Development Timer", description: "Long-form ambient timer for stand and semi-stand development", strategy: "ambient", defaultConfig: { duration: 3600 }, category: "photography", route: "/photography/stand-development", sitemapPriority: 0.8 },
  { id: "enlarger-timer", name: "Enlarger Timer", description: "F-stop timing and test strip mode for darkroom printing", strategy: "enlarger", defaultConfig: {}, category: "photography", route: "/photography/enlarger-timer", sitemapPriority: 0.7 },
  { id: "cyanotype", name: "Cyanotype Timer", description: "UV exposure timer for alternative processes", strategy: "countdown", defaultConfig: { duration: 900 }, category: "photography", route: "/photography/cyanotype", sitemapPriority: 0.7 },
  { id: "photo-walk", name: "Photo Walk Timer", description: "Timed photo challenges and sprint sessions", strategy: "interval", defaultConfig: { work: 600, rest: 120, rounds: 3 }, category: "photography", route: "/photography/photo-walk", sitemapPriority: 0.7 },

  // Fitness
  { id: "hiit", name: "HIIT Timer", description: "Configurable high-intensity interval training", strategy: "interval", defaultConfig: { work: 30, rest: 15, rounds: 8 }, category: "fitness", route: "/fitness/hiit", sitemapPriority: 0.7 },
  { id: "tabata", name: "Tabata Timer", description: "Classic 20/10 protocol — 8 rounds, 4 minutes", strategy: "interval", defaultConfig: { work: 20, rest: 10, rounds: 8 }, category: "fitness", route: "/fitness/tabata", sitemapPriority: 0.7 },
  { id: "stretching", name: "Stretching Timer", description: "Hold timer with exercise sequences", strategy: "interval", defaultConfig: { work: 30, rest: 10, rounds: 10 }, category: "fitness", route: "/fitness/stretching", sitemapPriority: 0.7 },
  { id: "emom", name: "EMOM Timer", description: "Every Minute On the Minute workout timer", strategy: "interval", defaultConfig: { work: 60, rest: 0, rounds: 10 }, category: "fitness", route: "/fitness/emom", sitemapPriority: 0.7 },
  { id: "rest-timer", name: "Rest Timer", description: "Quick countdown between sets", strategy: "countdown", defaultConfig: { duration: 90 }, category: "fitness", route: "/fitness/rest-timer", sitemapPriority: 0.7 },

  // Wellness
  { id: "meditation", name: "Meditation Timer", description: "Guided mindfulness with interval bells", strategy: "interval", defaultConfig: { work: 600, rest: 0, rounds: 1 }, category: "wellness", route: "/wellness/meditation", sitemapPriority: 0.7 },
  { id: "breathing", name: "Breathing Timer", description: "Box breathing, 4-7-8, and Wim Hof exercises", strategy: "interval", defaultConfig: { work: 4, rest: 4, rounds: 10 }, category: "wellness", route: "/wellness/breathing", sitemapPriority: 0.7 },
  { id: "sleep", name: "Sleep Timer", description: "Gentle countdown for wind-down routines", strategy: "countdown", defaultConfig: { duration: 1800 }, category: "wellness", route: "/wellness/sleep", sitemapPriority: 0.7 },
  { id: "fasting", name: "Fasting Timer", description: "Track intermittent fasting windows", strategy: "countdown", defaultConfig: { duration: 57600 }, category: "wellness", route: "/wellness/fasting", sitemapPriority: 0.7 },

  // Productivity
  { id: "pomodoro", name: "Pomodoro Timer", description: "25-minute focus sessions with 5-minute breaks", strategy: "interval", defaultConfig: { work: 1500, rest: 300, rounds: 4 }, category: "productivity", route: "/productivity/pomodoro", sitemapPriority: 0.7 },
  { id: "study", name: "Study Timer", description: "Timed study blocks with break reminders", strategy: "interval", defaultConfig: { work: 2700, rest: 600, rounds: 3 }, category: "productivity", route: "/productivity/study", sitemapPriority: 0.7 },
  { id: "adhd-focus", name: "ADHD Focus Timer", description: "Low-distraction timer with shorter intervals", strategy: "interval", defaultConfig: { work: 900, rest: 300, rounds: 4 }, category: "productivity", route: "/productivity/adhd-focus", sitemapPriority: 0.7 },
  { id: "classroom", name: "Classroom Timer", description: "Large display activity timers for teachers", strategy: "countdown", defaultConfig: { duration: 600 }, category: "productivity", route: "/productivity/classroom", sitemapPriority: 0.7 },
  { id: "presentation", name: "Presentation Timer", description: "Keep talks and meetings on schedule", strategy: "countdown", defaultConfig: { duration: 1800 }, category: "productivity", route: "/productivity/presentation", sitemapPriority: 0.7 },

  // Kitchen
  { id: "cooking", name: "Cooking Timer", description: "General cooking timer with preset durations", strategy: "countdown", defaultConfig: { duration: 600 }, category: "kitchen", route: "/kitchen/cooking", sitemapPriority: 0.7 },
  { id: "eggs", name: "Egg Timer", description: "Perfect soft, medium, and hard boiled eggs every time", strategy: "countdown", defaultConfig: { duration: 420 }, category: "kitchen", route: "/kitchen/eggs", sitemapPriority: 0.7 },
  { id: "kitchen-multi-timer", name: "Multi-Timer", description: "Run multiple simultaneous timers for different dishes", strategy: "multi-timer", defaultConfig: {}, category: "kitchen", route: "/kitchen/multi-timer", sitemapPriority: 0.7 },
  { id: "bread-proofing", name: "Bread Proofing Timer", description: "Long-form rise timer with temperature notes", strategy: "ambient", defaultConfig: { duration: 3600 }, category: "kitchen", route: "/kitchen/bread-proofing", sitemapPriority: 0.7 },
];
```

- [ ] **Step 4: Add category definitions**

Add to `src/lib/timer-registry.ts`:

```typescript
// --- Category Definitions ---

export const TIMER_CATEGORIES: CategoryDefinition[] = [
  {
    slug: "board-games",
    name: "Board Games",
    emoji: "🎲",
    icon: Dice5,
    heading: "Free Board Game Timers",
    description: "Keep game night moving with free, mobile-friendly timers. No app download, no signup — just pick a timer and play.",
    heroCta: "Start Playing →",
    heroCtaHref: "/board-games/countdown",
    gridHeading: "Choose Your Timer",
    featuredTimers: ["board-countdown", "board-chess-clock", "board-round-timer"],
    faq: [
      { question: "What is a chess clock for board games?", answer: "A chess clock is a two-player timer where each player has their own countdown. After making a move, you tap the clock to switch to your opponent's timer." },
      { question: "How do I time board game turns?", answer: "For two-player games, use the Chess Clock. For group games, use the Countdown Timer. For tracking rounds, use the Round Timer." },
      { question: "Can I track game scores with friends?", answer: "Yes! GoTimer's challenge system lets you create ongoing rivalries, invite friends, and track wins over time." },
    ],
  },
  {
    slug: "photography",
    name: "Photography",
    emoji: "🎞️",
    icon: Camera,
    heading: "Precision Timing for Film & Darkroom",
    description: "Film development timers, reciprocity calculators, and darkroom tools. Free, browser-based, safelight-safe.",
    heroCta: "Start Developing →",
    heroCtaHref: "/photography/film-development",
    gridHeading: "Your Darkroom Toolkit",
    featuredTimers: ["film-development", "long-exposure-calculator", "stand-development"],
    accent: "#cc0000",
  },
  {
    slug: "fitness",
    name: "Fitness",
    emoji: "🏋️",
    icon: Dumbbell,
    heading: "Workout Timers That Push You Harder",
    description: "Interval training, Tabata, HIIT, stretching, and rest timers for every workout style. Free, no app needed.",
    heroCta: "Start Training →",
    heroCtaHref: "/fitness/hiit",
    gridHeading: "Pick Your Workout",
    featuredTimers: ["hiit", "tabata", "emom"],
  },
  {
    slug: "wellness",
    name: "Wellness",
    emoji: "🧘",
    icon: Heart,
    heading: "Timers for Mind & Body",
    description: "Meditation, breathing exercises, sleep timers, and fasting trackers for your daily wellbeing routine.",
    heroCta: "Start Breathing →",
    heroCtaHref: "/wellness/meditation",
    gridHeading: "Your Wellness Toolkit",
    featuredTimers: ["meditation", "breathing", "sleep"],
  },
  {
    slug: "productivity",
    name: "Productivity",
    emoji: "🎯",
    icon: Target,
    heading: "Focus Timers for Deep Work",
    description: "Pomodoro, study sessions, ADHD focus timers, classroom activities, and presentation timing. Get more done.",
    heroCta: "Start Focusing →",
    heroCtaHref: "/productivity/pomodoro",
    gridHeading: "Choose Your Method",
    featuredTimers: ["pomodoro", "study", "adhd-focus"],
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    emoji: "🍳",
    icon: CookingPot,
    heading: "Kitchen Timers — Never Burn Dinner Again",
    description: "Cooking timers, egg timers, and multi-timer support for when you're juggling multiple dishes. Precision for every chef.",
    heroCta: "Start Cooking →",
    heroCtaHref: "/kitchen/cooking",
    gridHeading: "Kitchen Essentials",
    featuredTimers: ["cooking", "eggs", "kitchen-multi-timer"],
  },
];
```

- [ ] **Step 5: Add lookup helpers**

Add to `src/lib/timer-registry.ts`:

```typescript
// --- Lookup Helpers ---

export function get_strategy_def(id: string): StrategyDefinition | undefined {
  return TIMER_STRATEGIES.find((s) => s.id === id);
}

export function get_preset_def(id: string): PresetDefinition | undefined {
  return TIMER_PRESETS.find((p) => p.id === id);
}

export function get_category_def(slug: string): CategoryDefinition | undefined {
  return TIMER_CATEGORIES.find((c) => c.slug === slug);
}

export function get_presets_by_category(category: string): PresetDefinition[] {
  return TIMER_PRESETS.filter((p) => p.category === category);
}

export function get_presets_by_strategy(strategy: string): PresetDefinition[] {
  return TIMER_PRESETS.filter((p) => p.strategy === strategy);
}

/**
 * Resolve a timer ID — checks presets first, then strategies.
 * Returns the resolved strategy ID and merged config.
 */
export function resolve_timer(id: string, overrides?: Record<string, unknown>): {
  strategy_id: string;
  config: Record<string, unknown>;
  name: string;
  route: string;
} | null {
  const preset = get_preset_def(id);
  if (preset) {
    const strategy = get_strategy_def(preset.strategy);
    if (!strategy) return null;
    return {
      strategy_id: preset.strategy,
      config: { ...preset.defaultConfig, ...overrides },
      name: preset.name,
      route: strategy.route,
    };
  }

  const strategy = get_strategy_def(id);
  if (strategy) {
    return {
      strategy_id: strategy.id,
      config: { ...strategy.defaultConfig, ...overrides },
      name: strategy.name,
      route: strategy.route,
    };
  }

  return null;
}

/** All valid timer IDs (strategies + presets) for validation */
export function get_all_timer_ids(): string[] {
  return [
    ...TIMER_STRATEGIES.map((s) => s.id),
    ...TIMER_PRESETS.map((p) => p.id),
  ];
}

/** All category slugs */
export const REGISTRY_CATEGORY_SLUGS = TIMER_CATEGORIES.map((c) => c.slug);
```

- [ ] **Step 6: Verify the file compiles**

Run: `npx tsc --noEmit src/lib/timer-registry.ts 2>&1 || npx next build --no-lint 2>&1 | head -30`

Expected: No type errors related to timer-registry.ts

- [ ] **Step 7: Commit**

```bash
git add src/lib/timer-registry.ts
git commit -m "feat: create unified timer registry with strategies, presets, and categories"
```

---

### Task 2: Create the Registry Validator

**Files:**
- Create: `src/lib/timer-registry-validator.ts`

- [ ] **Step 1: Create the validator file**

Create `src/lib/timer-registry-validator.ts`:

```typescript
import { TIMER_STRATEGIES, TIMER_PRESETS, TIMER_CATEGORIES } from "./timer-registry";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

/**
 * Validate the timer registry for internal consistency.
 * Runs checks that don't require filesystem access (safe for client/server).
 */
export function validate_registry_consistency(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const strategy_ids = new Set(TIMER_STRATEGIES.map((s) => s.id));
  const preset_ids = new Set(TIMER_PRESETS.map((p) => p.id));
  const category_slugs = new Set(TIMER_CATEGORIES.map((c) => c.slug));

  // Check for duplicate strategy IDs
  if (strategy_ids.size !== TIMER_STRATEGIES.length) {
    const seen = new Set<string>();
    for (const s of TIMER_STRATEGIES) {
      if (seen.has(s.id)) errors.push(`Duplicate strategy ID: "${s.id}"`);
      seen.add(s.id);
    }
  }

  // Check for duplicate preset IDs
  if (preset_ids.size !== TIMER_PRESETS.length) {
    const seen = new Set<string>();
    for (const p of TIMER_PRESETS) {
      if (seen.has(p.id)) errors.push(`Duplicate preset ID: "${p.id}"`);
      seen.add(p.id);
    }
  }

  // Check preset-strategy references
  for (const preset of TIMER_PRESETS) {
    if (!strategy_ids.has(preset.strategy)) {
      errors.push(`Preset "${preset.id}" references unknown strategy "${preset.strategy}"`);
    }
  }

  // Check preset-category references
  for (const preset of TIMER_PRESETS) {
    if (!category_slugs.has(preset.category)) {
      errors.push(`Preset "${preset.id}" references unknown category "${preset.category}"`);
    }
  }

  // Check category featuredTimers reference valid presets in that category
  for (const category of TIMER_CATEGORIES) {
    const category_presets = new Set(
      TIMER_PRESETS.filter((p) => p.category === category.slug).map((p) => p.id)
    );
    for (const featured of category.featuredTimers) {
      if (!category_presets.has(featured)) {
        errors.push(
          `Category "${category.slug}" features "${featured}" which is not a preset in this category`
        );
      }
    }
  }

  // Check no ID collision between strategies and presets
  for (const preset of TIMER_PRESETS) {
    if (strategy_ids.has(preset.id)) {
      warnings.push(`Preset ID "${preset.id}" shadows strategy ID "${preset.id}" — preset will take priority in resolve_timer()`);
    }
  }

  // Check every category has at least one preset
  for (const category of TIMER_CATEGORIES) {
    const count = TIMER_PRESETS.filter((p) => p.category === category.slug).length;
    if (count === 0) {
      warnings.push(`Category "${category.slug}" has no presets`);
    }
  }

  return { errors, warnings };
}

/**
 * Validate registry against STRATEGY_REGISTRY keys.
 * Requires passing in the strategy registry keys (to avoid importing
 * the full strategy module which has heavy deps).
 */
export function validate_against_strategy_registry(
  strategy_registry_keys: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const registry_ids = new Set(TIMER_STRATEGIES.map((s) => s.id));
  const impl_keys = new Set(strategy_registry_keys);

  // Strategies in STRATEGY_REGISTRY but not in timer-registry
  for (const key of strategy_registry_keys) {
    if (!registry_ids.has(key)) {
      errors.push(`Strategy "${key}" exists in STRATEGY_REGISTRY but not in timer-registry`);
    }
  }

  // Strategies in timer-registry but not in STRATEGY_REGISTRY
  for (const s of TIMER_STRATEGIES) {
    if (!impl_keys.has(s.id)) {
      errors.push(`Strategy "${s.id}" exists in timer-registry but not in STRATEGY_REGISTRY`);
    }
  }

  return { errors, warnings };
}

/**
 * Validate that routes exist on the filesystem.
 * Only call server-side in development.
 */
export async function validate_routes(app_dir: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Dynamic import fs to keep this file importable on the client
  const fs = await import("fs");
  const path = await import("path");

  // Check strategy routes
  for (const strategy of TIMER_STRATEGIES) {
    if (strategy.route && strategy.route !== "/countdown") {
      const route_dir = path.join(app_dir, strategy.route.replace(/^\//, ""));
      if (!fs.existsSync(route_dir)) {
        warnings.push(`Strategy "${strategy.id}" route "${strategy.route}" — directory not found: ${route_dir}`);
      }
    }
    if (strategy.setupRoute) {
      const setup_dir = path.join(app_dir, strategy.setupRoute.replace(/^\//, ""));
      if (!fs.existsSync(setup_dir)) {
        warnings.push(`Strategy "${strategy.id}" setupRoute "${strategy.setupRoute}" — directory not found: ${setup_dir}`);
      }
    }
  }

  // Check preset routes
  for (const preset of TIMER_PRESETS) {
    const route_dir = path.join(app_dir, preset.route.replace(/^\//, ""));
    if (!fs.existsSync(route_dir)) {
      warnings.push(`Preset "${preset.id}" route "${preset.route}" — directory not found: ${route_dir}`);
    }
  }

  // Check category routes
  for (const category of TIMER_CATEGORIES) {
    const route_dir = path.join(app_dir, category.slug);
    if (!fs.existsSync(route_dir)) {
      warnings.push(`Category "${category.slug}" — directory not found: ${route_dir}`);
    }
  }

  return { errors, warnings };
}

/**
 * Run all validations and log results. Call from dev startup.
 */
export async function run_dev_validation(
  strategy_registry_keys: string[],
  app_dir: string
): Promise<void> {
  const consistency = validate_registry_consistency();
  const strategy_check = validate_against_strategy_registry(strategy_registry_keys);
  const route_check = await validate_routes(app_dir);

  const all_errors = [...consistency.errors, ...strategy_check.errors, ...route_check.errors];
  const all_warnings = [...consistency.warnings, ...strategy_check.warnings, ...route_check.warnings];

  if (all_warnings.length > 0) {
    console.warn("\n⚠️  Timer Registry Warnings:");
    for (const w of all_warnings) {
      console.warn(`   • ${w}`);
    }
  }

  if (all_errors.length > 0) {
    console.error("\n❌ Timer Registry Errors:");
    for (const e of all_errors) {
      console.error(`   • ${e}`);
    }
    throw new Error(`Timer registry validation failed with ${all_errors.length} error(s)`);
  }

  if (all_errors.length === 0 && all_warnings.length === 0) {
    console.log("✓ Timer registry validated — all strategies, presets, and routes OK");
  }
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/lib/timer-registry-validator.ts 2>&1 | head -20`

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/timer-registry-validator.ts
git commit -m "feat: add timer registry validator for dev-time and admin checks"
```

---

### Task 3: Wire Up Dev-Time Validation

**Files:**
- Create: `src/instrumentation.ts`

- [ ] **Step 1: Create the instrumentation file**

Next.js instrumentation runs once at server startup. Create `src/instrumentation.ts`:

```typescript
export async function register() {
  if (process.env.NODE_ENV === "development") {
    const { STRATEGY_REGISTRY } = await import("./lib/timer-strategies");
    const { run_dev_validation } = await import("./lib/timer-registry-validator");
    const path = await import("path");

    const app_dir = path.join(process.cwd(), "src", "app");

    try {
      await run_dev_validation(Object.keys(STRATEGY_REGISTRY), app_dir);
    } catch (err) {
      console.error(err);
    }
  }
}
```

- [ ] **Step 2: Enable instrumentation in next.config.ts**

Read `next.config.ts` and check if `experimental.instrumentationHook` is already set. If the project uses Next.js 15+, instrumentation is enabled by default — just verify the file is picked up.

Run: `npx next dev &` then check console output for the validation log line.

Expected: Console shows either `✓ Timer registry validated` or lists specific warnings/errors.

Kill the dev server after confirming.

- [ ] **Step 3: Commit**

```bash
git add src/instrumentation.ts
git commit -m "feat: wire up timer registry dev-time validation on server start"
```

---

### Task 4: Update the /api/v1/timers Endpoint

**Files:**
- Modify: `src/app/api/v1/timers/route.ts`

- [ ] **Step 1: Rewrite route.ts to read from registry**

Replace the entire contents of `src/app/api/v1/timers/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { TIMER_STRATEGIES } from "@/lib/timer-registry";

// GET /api/v1/timers — public, no auth required
export async function GET() {
  const timer_types = TIMER_STRATEGIES.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    default_config: s.defaultConfig,
  }));

  return NextResponse.json({
    status: "ok",
    data: {
      timer_types,
    },
  });
}
```

- [ ] **Step 2: Verify the endpoint returns all 10 strategies**

Run: `curl -s http://localhost:3000/api/v1/timers | python3 -m json.tool | head -50`

Expected: JSON with 10 timer_types including multi-step, ambient, calculator-timer, multi-timer, turn-timer, enlarger (in addition to the original 4).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/v1/timers/route.ts
git commit -m "feat: /api/v1/timers now reads from unified timer registry (10 strategies)"
```

---

### Task 5: Create the /api/v1/timer-presets Endpoint

**Files:**
- Create: `src/app/api/v1/timer-presets/route.ts`

- [ ] **Step 1: Create the presets endpoint**

Create `src/app/api/v1/timer-presets/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  TIMER_PRESETS,
  REGISTRY_CATEGORY_SLUGS,
} from "@/lib/timer-registry";

// GET /api/v1/timer-presets?category=fitness — public, no auth required
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (category && !REGISTRY_CATEGORY_SLUGS.includes(category)) {
    return NextResponse.json(
      {
        status: "error",
        error: `Invalid category. Must be one of: ${REGISTRY_CATEGORY_SLUGS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const filtered = category
    ? TIMER_PRESETS.filter((p) => p.category === category)
    : TIMER_PRESETS;

  const presets = filtered.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    strategy: p.strategy,
    category: p.category,
    default_config: p.defaultConfig,
  }));

  return NextResponse.json({
    status: "ok",
    data: {
      presets,
      categories: REGISTRY_CATEGORY_SLUGS,
    },
  });
}
```

- [ ] **Step 2: Verify the endpoint works**

Run: `curl -s http://localhost:3000/api/v1/timer-presets | python3 -m json.tool | head -30`

Expected: JSON with all presets and categories array.

Run: `curl -s "http://localhost:3000/api/v1/timer-presets?category=fitness" | python3 -m json.tool`

Expected: Only fitness presets (hiit, tabata, stretching, emom, rest-timer).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/v1/timer-presets/route.ts
git commit -m "feat: add /api/v1/timer-presets endpoint with category filtering"
```

---

### Task 6: Update /api/v1/timer-url to Resolve Presets

**Files:**
- Modify: `src/app/api/v1/timer-url/route.ts`
- Modify: `src/app/api/v1/timer-url/embed/route.ts`

- [ ] **Step 1: Update the timer-url route to use resolve_timer**

Replace the contents of `src/app/api/v1/timer-url/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { encode_live_timer } from "@/lib/timer-url-encoder";
import { resolve_timer, get_strategy_def, get_all_timer_ids } from "@/lib/timer-registry";

// Map strategy IDs to their page routes for URL generation
function get_page_path(strategy_id: string): string {
  const strategy = get_strategy_def(strategy_id);
  return strategy?.route || "/countdown";
}

function build_config_from_params(
  strategy_id: string,
  params: URLSearchParams,
): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  const duration = params.get("duration");
  const label = params.get("label");
  const work = params.get("work");
  const rest = params.get("rest");
  const rounds = params.get("rounds");

  switch (strategy_id) {
    case "countdown":
      if (duration) config.duration = Number(duration);
      break;
    case "chess-clock":
      if (duration) config.duration_per_player = Number(duration);
      break;
    case "round-timer":
      if (duration) config.round_duration = Number(duration);
      break;
    case "interval":
      if (work) config.work = Number(work);
      if (rest) config.rest = Number(rest);
      if (rounds) config.rounds = Number(rounds);
      break;
  }

  if (label) config.label = label;

  return config;
}

// GET /api/v1/timer-url — public, no auth required
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { status: "error", error: "Missing type parameter." },
      { status: 400 },
    );
  }

  // Resolve preset or strategy
  const resolved = resolve_timer(type);
  if (!resolved) {
    return NextResponse.json(
      {
        status: "error",
        error: `Unknown timer type "${type}". Use GET /api/v1/timers for strategies or GET /api/v1/timer-presets for presets.`,
      },
      { status: 400 },
    );
  }

  const started_str = searchParams.get("started");
  const started = started_str ? new Date(started_str) : new Date();

  if (isNaN(started.getTime())) {
    return NextResponse.json(
      { status: "error", error: "Invalid started timestamp." },
      { status: 400 },
    );
  }

  const embed = searchParams.get("embed") === "true";

  // Build config: preset defaults merged with any URL param overrides
  const param_overrides = build_config_from_params(resolved.strategy_id, searchParams);
  const config = { ...resolved.config, ...param_overrides };

  const timer_path = get_page_path(resolved.strategy_id);
  const query_string = encode_live_timer({ type: resolved.strategy_id, started, config });
  const origin = new URL(request.url).origin;

  const url = `${origin}${timer_path}?${query_string}`;
  const embed_url = `${origin}/embed${timer_path}?${query_string}`;

  const expires_at = new Date(started.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const duration = searchParams.get("duration");
  const label = searchParams.get("label");

  return NextResponse.json({
    status: "ok",
    data: {
      url: embed ? embed_url : url,
      embed_url,
      expires_at,
      timer_type: resolved.strategy_id,
      ...(duration ? { duration_seconds: Number(duration) } : {}),
      ...(label ? { label } : {}),
    },
  });
}
```

- [ ] **Step 2: Update the embed route similarly**

Replace the contents of `src/app/api/v1/timer-url/embed/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { encode_live_timer } from "@/lib/timer-url-encoder";
import { resolve_timer, get_strategy_def } from "@/lib/timer-registry";

type SizeOption = "compact" | "standard" | "large";

const SIZE_DIMENSIONS: Record<SizeOption, { width: number; height: number }> = {
  compact: { width: 300, height: 250 },
  standard: { width: 480, height: 400 },
  large: { width: 640, height: 500 },
};

function build_config_from_params(
  strategy_id: string,
  params: URLSearchParams,
): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  const duration = params.get("duration");
  const label = params.get("label");
  const work = params.get("work");
  const rest = params.get("rest");
  const rounds = params.get("rounds");

  switch (strategy_id) {
    case "countdown":
      if (duration) config.duration = Number(duration);
      break;
    case "chess-clock":
      if (duration) config.duration_per_player = Number(duration);
      break;
    case "round-timer":
      if (duration) config.round_duration = Number(duration);
      break;
    case "interval":
      if (work) config.work = Number(work);
      if (rest) config.rest = Number(rest);
      if (rounds) config.rounds = Number(rounds);
      break;
  }

  if (label) config.label = label;

  return config;
}

// GET /api/v1/timer-url/embed — public, no auth required
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { status: "error", error: "Missing type parameter." },
      { status: 400 },
    );
  }

  const resolved = resolve_timer(type);
  if (!resolved) {
    return NextResponse.json(
      {
        status: "error",
        error: `Unknown timer type "${type}". Use GET /api/v1/timers for strategies or GET /api/v1/timer-presets for presets.`,
      },
      { status: 400 },
    );
  }

  const started_str = searchParams.get("started");
  const started = started_str ? new Date(started_str) : new Date();

  if (isNaN(started.getTime())) {
    return NextResponse.json(
      { status: "error", error: "Invalid started timestamp." },
      { status: 400 },
    );
  }

  const theme = searchParams.get("theme") || "auto";
  const size = (searchParams.get("size") || "standard") as SizeOption;
  const controls = searchParams.get("controls") || "full";
  const accent = searchParams.get("accent");
  const autostart = searchParams.get("autostart") === "true";

  if (!["compact", "standard", "large"].includes(size)) {
    return NextResponse.json(
      { status: "error", error: "Invalid size. Must be one of: compact, standard, large" },
      { status: 400 },
    );
  }

  const param_overrides = build_config_from_params(resolved.strategy_id, searchParams);
  const config = { ...resolved.config, ...param_overrides };

  const strategy = get_strategy_def(resolved.strategy_id);
  const timer_path = strategy?.route || "/countdown";
  const timer_name = resolved.name;

  const query_string = encode_live_timer({ type: resolved.strategy_id, started, config });
  const origin = new URL(request.url).origin;

  const embed_params = new URLSearchParams(query_string);
  if (theme !== "auto") embed_params.set("theme", theme);
  if (accent) embed_params.set("accent", accent);
  if (autostart) embed_params.set("autostart", "true");
  if (controls !== "full") embed_params.set("controls", controls);

  const embed_url = `${origin}/embed${timer_path}?${embed_params.toString()}`;
  const dims = SIZE_DIMENSIONS[size];

  const html = `<!-- GoTimer Embed -->\n<div style="position:relative;width:100%;max-width:${dims.width}px;">\n  <iframe src="${embed_url}"\n    width="100%" height="${dims.height}" frameborder="0"\n    allow="autoplay" loading="lazy"\n    style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"></iframe>\n  <noscript><a href="${origin}${timer_path}">\n    Free ${timer_name} by GoTimer</a></noscript>\n</div>`;

  return NextResponse.json({
    status: "ok",
    data: {
      url: embed_url,
      html,
      timer_type: resolved.strategy_id,
    },
  });
}
```

- [ ] **Step 3: Verify preset resolution works**

Run: `curl -s "http://localhost:3000/api/v1/timer-url?type=pomodoro" | python3 -m json.tool`

Expected: Returns a URL with interval strategy and pomodoro defaults (work=1500, rest=300, rounds=4).

Run: `curl -s "http://localhost:3000/api/v1/timer-url?type=countdown&duration=60" | python3 -m json.tool`

Expected: Still works as before — backwards compatible.

Run: `curl -s "http://localhost:3000/api/v1/timer-url/embed?type=hiit&theme=dark" | python3 -m json.tool`

Expected: Returns embed HTML for interval strategy with HIIT defaults.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/v1/timer-url/route.ts src/app/api/v1/timer-url/embed/route.ts
git commit -m "feat: timer-url endpoints resolve preset IDs (pomodoro, hiit, etc.)"
```

---

### Task 7: Update Sitemap to Use Registry

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Replace hardcoded timer URLs with registry iteration**

Edit `src/app/sitemap.ts`. Replace the hardcoded timer/category entries in `static_routes` with registry-driven generation. Keep non-timer static routes (blog, studio, privacy, etc.) hardcoded.

The new `static_routes` should be:

```typescript
import type { MetadataRoute } from "next";
import { get_db } from "@/lib/db";
import { TIMER_STRATEGIES, TIMER_PRESETS, TIMER_CATEGORIES } from "@/lib/timer-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://gotimer.org";
  const staticDate = new Date("2026-04-15");

  // Non-timer static routes
  const static_routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: staticDate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/blog`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/studio`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/public-challenges`, lastModified: staticDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/partners`, lastModified: staticDate, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, lastModified: staticDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Strategy routes (timer pages + setup pages)
  const strategy_routes: MetadataRoute.Sitemap = TIMER_STRATEGIES.flatMap((s) => {
    const routes: MetadataRoute.Sitemap = [
      { url: `${base}${s.route}`, lastModified: staticDate, changeFrequency: "monthly" as const, priority: s.sitemapPriority },
    ];
    if (s.setupRoute) {
      routes.push({
        url: `${base}${s.setupRoute}`,
        lastModified: staticDate,
        changeFrequency: "monthly" as const,
        priority: s.sitemapPriority,
      });
    }
    return routes;
  });

  // Deduplicate strategy routes (some strategies share the /countdown route)
  const seen_urls = new Set<string>();
  const unique_strategy_routes = strategy_routes.filter((r) => {
    if (seen_urls.has(r.url)) return false;
    seen_urls.add(r.url);
    return true;
  });

  // Category landing pages
  const category_routes: MetadataRoute.Sitemap = TIMER_CATEGORIES.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Preset sub-pages (filter out presets whose route is a top-level strategy route)
  const strategy_route_set = new Set(TIMER_STRATEGIES.map((s) => s.route));
  const preset_routes: MetadataRoute.Sitemap = TIMER_PRESETS
    .filter((p) => !strategy_route_set.has(p.route))
    .map((p) => ({
      url: `${base}${p.route}`,
      lastModified: staticDate,
      changeFrequency: "monthly" as const,
      priority: p.sitemapPriority,
    }));

  // ... rest of the function (challenge_routes, timer_page_routes, blog_routes) stays the same
```

Keep the existing DB-driven sections (challenges, timer pages, blog posts) unchanged. Combine all routes at the end:

```typescript
  return [
    ...static_routes,
    ...unique_strategy_routes,
    ...category_routes,
    ...preset_routes,
    ...challenge_routes,
    ...timer_page_routes,
    ...blog_routes,
  ];
}
```

- [ ] **Step 2: Verify the sitemap generates correctly**

Run: `curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"` 

Expected: Count should be equal to or greater than the previous count. Verify key URLs are present:

Run: `curl -s http://localhost:3000/sitemap.xml | grep "turn-timer"`

Expected: Shows `/board-games/turn-timer` URL.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: sitemap now auto-generates timer URLs from registry"
```

---

### Task 8: Update site-categories.ts to Derive from Registry

**Files:**
- Modify: `src/lib/site-categories.ts`

- [ ] **Step 1: Replace site-categories.ts with registry-backed shim**

Replace the contents of `src/lib/site-categories.ts`:

```typescript
import type { LucideIcon } from "lucide-react";
import {
  TIMER_CATEGORIES,
  TIMER_PRESETS,
  get_category_def,
  get_presets_by_category,
  type CategoryDefinition,
  type PresetDefinition,
} from "./timer-registry";

// Re-export types that consumers expect
export interface TimerEntry {
  slug: string;
  name: string;
  description: string;
}

export interface SiteCategory {
  slug: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  heading: string;
  description: string;
  hero_cta: string;
  hero_cta_href: string;
  grid_heading: string;
  timers: TimerEntry[];
  featured_timers: string[];
  accent?: string;
  faq?: Array<{ question: string; answer: string }>;
}

function preset_to_timer_entry(preset: PresetDefinition): TimerEntry {
  // Extract the last segment of the route as slug (e.g., "/fitness/hiit" -> "hiit")
  const slug = preset.route.split("/").pop() || preset.id;
  return {
    slug,
    name: preset.name,
    description: preset.description,
  };
}

function category_to_site_category(cat: CategoryDefinition): SiteCategory {
  const presets = get_presets_by_category(cat.slug);
  return {
    slug: cat.slug,
    name: cat.name,
    emoji: cat.emoji,
    icon: cat.icon,
    heading: cat.heading,
    description: cat.description,
    hero_cta: cat.heroCta,
    hero_cta_href: cat.heroCtaHref,
    grid_heading: cat.gridHeading,
    timers: presets.map(preset_to_timer_entry),
    featured_timers: cat.featuredTimers.map((id) => {
      const preset = TIMER_PRESETS.find((p) => p.id === id);
      return preset ? preset.route.split("/").pop() || id : id;
    }),
    accent: cat.accent,
    faq: cat.faq,
  };
}

// Build SITE_CATEGORIES from registry
export const SITE_CATEGORIES: SiteCategory[] = TIMER_CATEGORIES.map(category_to_site_category);

/** Get a category by slug */
export function get_category(slug: string): SiteCategory | undefined {
  return SITE_CATEGORIES.find((c) => c.slug === slug);
}

/** All category slugs (for route validation) */
export const CATEGORY_SLUGS = SITE_CATEGORIES.map((c) => c.slug);
```

- [ ] **Step 2: Verify no consumer breaks**

Run: `npx next build 2>&1 | tail -30`

Expected: Build succeeds. All category pages, homepage category-grid, not-found page, and category-page components still work because `SiteCategory`, `TimerEntry`, `SITE_CATEGORIES`, `get_category`, and `CATEGORY_SLUGS` are all still exported with the same shapes.

- [ ] **Step 3: Spot-check a category page in browser**

Start dev server, navigate to `http://localhost:3000/fitness`.

Expected: Page renders with all 5 fitness timers listed (HIIT, Tabata, Stretching, EMOM, Rest Timer), same as before.

- [ ] **Step 4: Commit**

```bash
git add src/lib/site-categories.ts
git commit -m "refactor: site-categories now derives from unified timer registry"
```

---

### Task 9: Update MCP Server — Add list_timer_presets and Update create_timer

**Files:**
- Modify: `gotimer-mcp/index.js`

- [ ] **Step 1: Add the list_timer_presets tool definition to TOOLS array**

In `gotimer-mcp/index.js`, add to the `TOOLS` array after the `list_timer_types` entry:

```javascript
  {
    name: "list_timer_presets",
    description: "Lists pre-configured timer presets (e.g. Pomodoro, HIIT, Meditation, Film Development). Optionally filter by category.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["board-games", "photography", "fitness", "wellness", "productivity", "kitchen"],
          description: "Filter presets by category. Omit to list all presets.",
        },
      },
      required: [],
    },
  },
```

- [ ] **Step 2: Add the handler for list_timer_presets**

In the `switch (name)` block inside the `CallToolRequestSchema` handler, add after the `list_timer_types` case:

```javascript
      case "list_timer_presets": {
        const category = args.category;
        const params = category ? `?category=${encodeURIComponent(category)}` : "";
        const data = await api_request(`/timer-presets${params}`);
        result = data;
        break;
      }
```

- [ ] **Step 3: Update create_timer description to mention preset support**

In the `TOOLS` array, update the `create_timer` tool's `description` to:

```javascript
    description: "Creates a live timer on GoTimer and returns a shareable URL. The timer starts immediately — all users opening the URL see the same synchronized countdown. Accepts strategy types (countdown, chess-clock, round-timer, interval, etc.) and preset names (pomodoro, hiit, meditation, tabata, etc.). Use list_timer_types for strategies and list_timer_presets for presets.",
```

Update the `type` property in `create_timer`'s inputSchema to remove the restrictive `enum` and use a description instead:

```javascript
        type: { type: "string", description: "Timer type — accepts strategy IDs (countdown, chess-clock, round-timer, interval, multi-step, ambient, calculator-timer, multi-timer, turn-timer, enlarger) or preset IDs (pomodoro, hiit, tabata, meditation, etc.). Use list_timer_types and list_timer_presets to see all options." },
```

- [ ] **Step 4: Update create_pomodoro to mention it's now a convenience wrapper**

Update the `create_pomodoro` description:

```javascript
    description: "Creates a Pomodoro focus timer on GoTimer. Convenience wrapper — you can also use create_timer with type 'pomodoro'. Returns a shareable URL. Default: 25 min work, 5 min break, 4 rounds.",
```

- [ ] **Step 5: Similarly update get_timer_url and get_embed_code type fields**

For `get_timer_url`, update the `type` property:

```javascript
        type: { type: "string", description: "Timer type — accepts strategy IDs or preset IDs. Use list_timer_types and list_timer_presets to see all options." },
```

For `get_embed_code`, update the `type` property:

```javascript
        type: { type: "string", description: "Timer type — accepts strategy IDs or preset IDs. Use list_timer_types and list_timer_presets to see all options." },
```

- [ ] **Step 6: Verify in MCP Inspector**

Restart the MCP Inspector connection and verify:
1. `list_timer_presets` appears in the tools list
2. Running `list_timer_presets` with no args returns all presets
3. Running `list_timer_presets` with `category: "fitness"` returns only fitness presets
4. Running `create_timer` with `type: "pomodoro"` returns a valid URL

- [ ] **Step 7: Commit**

```bash
git add gotimer-mcp/index.js
git commit -m "feat(mcp): add list_timer_presets tool, create_timer accepts preset IDs"
```

---

### Task 10: Update MCP README

**Files:**
- Modify: `gotimer-mcp/README.md`

- [ ] **Step 1: Add list_timer_presets to the Tools table**

In `gotimer-mcp/README.md`, add to the Timer Tools table after `list_timer_types`:

```markdown
| `list_timer_presets` | List pre-configured presets (Pomodoro, HIIT, etc.) by category | No |
```

- [ ] **Step 2: Add a preset example**

Add after the existing examples section:

```markdown
### List fitness timer presets
```
list_timer_presets({ category: "fitness" })
→ [{ id: "hiit", name: "HIIT Timer", strategy: "interval", ... }, ...]
```

### Create a timer using a preset name
```
create_timer({ type: "pomodoro" })
→ https://gotimer.org/countdown?type=interval&started=...&work=1500&rest=300&rounds=4
```
```

- [ ] **Step 3: Commit**

```bash
git add gotimer-mcp/README.md
git commit -m "docs(mcp): document list_timer_presets tool and preset support in create_timer"
```

---

### Task 11: Create Admin Timer Health Page

**Files:**
- Create: `src/app/admin/timer-health/page.tsx`
- Modify: `src/components/admin/sidebar.tsx`

- [ ] **Step 1: Create the admin timer health page**

Create `src/app/admin/timer-health/page.tsx`:

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type HealthEntry = {
  id: string;
  name: string;
  kind: "strategy" | "preset";
  category?: string;
  strategy?: string;
  in_registry: boolean;
  has_route: boolean;
  in_api: boolean;
};

type HealthData = {
  entries: HealthEntry[];
  errors: string[];
  warnings: string[];
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle2 className="w-4 h-4 text-green-500" />
  ) : (
    <XCircle className="w-4 h-4 text-red-500" />
  );
}

export default function TimerHealthPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [health, set_health] = useState<HealthData | null>(null);
  const [health_loading, set_health_loading] = useState(true);

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (loading || !authenticated || !permission_ok) return;
    fetch("/api/admin/timer-health")
      .then((r) => r.json())
      .then((data) => set_health(data))
      .catch(() => {})
      .finally(() => set_health_loading(false));
  }, [loading, authenticated, permission_ok]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-5xl">
      <h1 className="font-headline text-2xl font-black text-foreground mb-2">Timer Health</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Validates that all timers are properly registered, have routes, and appear in API responses.
      </p>

      {health_loading ? (
        <p className="text-muted-foreground">Running checks...</p>
      ) : health ? (
        <>
          {health.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Errors ({health.errors.length})
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc pl-5">
                {health.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          {health.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Warnings ({health.warnings.length})
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc pl-5">
                {health.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {health.errors.length === 0 && health.warnings.length === 0 && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <p className="text-green-800 dark:text-green-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> All checks passed
              </p>
            </div>
          )}

          <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-container">
                  <th className="text-left p-3 font-medium text-muted-foreground">Timer</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Registry</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Route</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">API</th>
                </tr>
              </thead>
              <tbody>
                {health.entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-surface-container last:border-0">
                    <td className="p-3 font-medium text-foreground">{entry.name}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        entry.kind === "strategy"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      }`}>
                        {entry.kind}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{entry.category || "—"}</td>
                    <td className="p-3 text-center"><StatusIcon ok={entry.in_registry} /></td>
                    <td className="p-3 text-center"><StatusIcon ok={entry.has_route} /></td>
                    <td className="p-3 text-center"><StatusIcon ok={entry.in_api} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-destructive">Failed to load health data.</p>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Create the admin API endpoint for timer health**

Create `src/app/api/admin/timer-health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { TIMER_STRATEGIES, TIMER_PRESETS } from "@/lib/timer-registry";
import { STRATEGY_REGISTRY } from "@/lib/timer-strategies";
import {
  validate_registry_consistency,
  validate_against_strategy_registry,
  validate_routes,
} from "@/lib/timer-registry-validator";
import path from "path";
import fs from "fs";

export async function GET() {
  const consistency = validate_registry_consistency();
  const strategy_check = validate_against_strategy_registry(Object.keys(STRATEGY_REGISTRY));
  const app_dir = path.join(process.cwd(), "src", "app");
  const route_check = await validate_routes(app_dir);

  const errors = [...consistency.errors, ...strategy_check.errors, ...route_check.errors];
  const warnings = [...consistency.warnings, ...strategy_check.warnings, ...route_check.warnings];

  // Build entries with status checks
  const strategy_entries = TIMER_STRATEGIES.map((s) => {
    const route_dir = path.join(app_dir, s.route.replace(/^\//, ""));
    return {
      id: s.id,
      name: s.name,
      kind: "strategy" as const,
      in_registry: true,
      has_route: fs.existsSync(route_dir),
      in_api: true, // strategies are always in API since API reads from registry
    };
  });

  const preset_entries = TIMER_PRESETS.map((p) => {
    const route_dir = path.join(app_dir, p.route.replace(/^\//, ""));
    return {
      id: p.id,
      name: p.name,
      kind: "preset" as const,
      category: p.category,
      strategy: p.strategy,
      in_registry: true,
      has_route: fs.existsSync(route_dir),
      in_api: true,
    };
  });

  // Check for strategies in STRATEGY_REGISTRY but NOT in timer-registry
  const registry_ids = new Set(TIMER_STRATEGIES.map((s) => s.id));
  const orphan_entries = Object.keys(STRATEGY_REGISTRY)
    .filter((key) => !registry_ids.has(key))
    .map((key) => ({
      id: key,
      name: key,
      kind: "strategy" as const,
      in_registry: false,
      has_route: false,
      in_api: false,
    }));

  return NextResponse.json({
    entries: [...strategy_entries, ...preset_entries, ...orphan_entries],
    errors,
    warnings,
  });
}
```

- [ ] **Step 3: Add Timer Health to admin sidebar**

In `src/components/admin/sidebar.tsx`, add to the third NAV_GROUPS group (the one with SEO, Analytics, etc.), after the Settings entry:

```typescript
      { label: "Timer Health", href: "/admin/timer-health", icon: <Activity className="w-4 h-4" /> },
```

Add `Activity` to the lucide-react import at the top of the file.

- [ ] **Step 4: Verify the admin page works**

Start dev server, navigate to `http://localhost:3000/admin/timer-health` (must be logged in as admin).

Expected: Table shows all strategies and presets with green checkmarks. Any missing routes show red X.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/timer-health/page.tsx src/app/api/admin/timer-health/route.ts src/components/admin/sidebar.tsx
git commit -m "feat: add admin timer health dashboard with registration status checks"
```

---

### Task 12: Final Verification

- [ ] **Step 1: Run the full build**

Run: `npx next build 2>&1 | tail -20`

Expected: Build succeeds with no errors.

- [ ] **Step 2: Test MCP in Inspector**

Restart MCP Inspector with `node /Users/pubs/Local/01.code/gotimer/gotimer-mcp/index.js`.

Test these tools:
1. `list_timer_types` — should return 10 strategies
2. `list_timer_presets` — should return all presets
3. `list_timer_presets({ category: "fitness" })` — should return 5 fitness presets
4. `create_timer({ type: "pomodoro" })` — should return valid URL
5. `create_timer({ type: "countdown", duration: 60 })` — should still work (backward compat)

- [ ] **Step 3: Verify sitemap**

Run: `curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"`

Verify the count includes all strategies, categories, and preset sub-pages.

- [ ] **Step 4: Commit any remaining fixes**

If any issues were found and fixed during verification, commit them.
