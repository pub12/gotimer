/**
 * Timer Registry — single source of truth for all timer definitions.
 *
 * Two tiers:
 *   1. Strategies (10) — the underlying timer engines
 *   2. Presets  (24+) — specialized configurations referencing a parent strategy
 *
 * Plus category definitions for the six site verticals.
 */

import type { LucideIcon } from "lucide-react";
import {
  Dice5,
  Camera,
  Dumbbell,
  Heart,
  Target,
  CookingPot,
  Video,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface StrategyDefinition {
  id: string;
  name: string;
  description: string;
  defaultConfig: Record<string, unknown>;
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
  defaultConfig: Record<string, unknown>;
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

// ---------------------------------------------------------------------------
// Strategies (10 timer engines)
// ---------------------------------------------------------------------------

export const STRATEGIES: Record<string, StrategyDefinition> = {
  countdown: {
    id: "countdown",
    name: "Countdown Timer",
    description:
      "A simple countdown timer that counts down from a set duration.",
    defaultConfig: { duration: 300 },
    supportedParams: ["duration", "alert_at"],
    route: "/countdown",
    setupRoute: "/countdown-setup",
    embedRoute: "/countdown/embed",
    sitemapPriority: 0.9,
  },

  "chess-clock": {
    id: "chess-clock",
    name: "Chess Clock",
    description:
      "A two-player chess clock where each player has their own time bank.",
    defaultConfig: { duration_per_player: 600, increment: 0 },
    supportedParams: ["duration_per_player", "increment"],
    route: "/chess-clock",
    setupRoute: "/chess-clock-setup",
    embedRoute: "/chess-clock/embed",
    sitemapPriority: 0.8,
  },

  "round-timer": {
    id: "round-timer",
    name: "Round Timer",
    description:
      "A round-based timer for sports and combat games with work and rest periods.",
    defaultConfig: { round_duration: 180, rest_duration: 60, rounds: 3 },
    supportedParams: ["round_duration", "rest_duration", "rounds"],
    route: "/round-timer",
    setupRoute: "/round-timer-setup",
    embedRoute: "/round-timer/embed",
    sitemapPriority: 0.8,
  },

  interval: {
    id: "interval",
    name: "Interval Timer",
    description:
      "A work/rest interval timer, perfect for Pomodoro technique, HIIT workouts, and timed study sessions.",
    defaultConfig: { work: 1500, rest: 300, rounds: 4 },
    supportedParams: ["work", "rest", "rounds"],
    route: "/countdown",
    sitemapPriority: 0.7,
  },

  "multi-step": {
    id: "multi-step",
    name: "Multi-Step Timer",
    description:
      "A sequential timer that runs through multiple named steps, each with its own duration.",
    defaultConfig: {
      steps: [
        { name: "Step 1", duration: 60 },
        { name: "Step 2", duration: 60 },
      ],
    },
    supportedParams: ["steps"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },

  ambient: {
    id: "ambient",
    name: "Ambient Timer",
    description:
      "A long-form ambient timer that counts up or down with optional interval notifications.",
    defaultConfig: { duration: 3600, interval: 600 },
    supportedParams: ["duration", "interval"],
    route: "/countdown",
    sitemapPriority: 0.5,
  },

  "calculator-timer": {
    id: "calculator-timer",
    name: "Calculator Timer",
    description:
      "A timer that computes durations based on input values (e.g., reciprocity correction for film photography).",
    defaultConfig: { metered_time: 1, mode: "reciprocity" },
    supportedParams: ["metered_time", "mode"],
    route: "/countdown",
    sitemapPriority: 0.5,
  },

  "multi-timer": {
    id: "multi-timer",
    name: "Multi-Timer",
    description:
      "Run multiple independent countdown timers simultaneously.",
    defaultConfig: {
      timers: [
        { name: "Timer 1", duration: 300 },
        { name: "Timer 2", duration: 600 },
      ],
    },
    supportedParams: ["timers"],
    route: "/countdown",
    sitemapPriority: 0.6,
  },

  "turn-timer": {
    id: "turn-timer",
    name: "Turn Timer",
    description:
      "Per-player turn countdown for 2-8 players in board games and group activities.",
    defaultConfig: { players: 2, time_per_turn: 60 },
    supportedParams: ["players", "time_per_turn"],
    route: "/countdown",
    sitemapPriority: 0.7,
  },

  enlarger: {
    id: "enlarger",
    name: "Enlarger Timer",
    description:
      "F-stop timing and test strip mode for darkroom printing.",
    defaultConfig: { base_time: 10, mode: "f-stop" },
    supportedParams: ["base_time", "mode", "strips", "stop_increment"],
    route: "/countdown",
    sitemapPriority: 0.5,
  },

  stopwatch: {
    id: "stopwatch",
    name: "Stopwatch",
    description:
      "Count-up timer with centisecond precision and lap recording.",
    defaultConfig: {},
    supportedParams: [],
    route: "/stopwatch",
    embedRoute: "/stopwatch/embed",
    sitemapPriority: 0.9,
  },

  "interval-reminder": {
    id: "interval-reminder",
    name: "Interval Reminder",
    description:
      "Indefinitely-repeating break reminder. Powers the 20-20-20 eye-strain timer.",
    defaultConfig: { focus: 1200, break_seconds: 20 },
    supportedParams: ["focus", "break_seconds"],
    route: "/wellness/20-20-20-timer",
    sitemapPriority: 0.8,
  },
};

// ---------------------------------------------------------------------------
// Presets (24 specialized timers across 6 categories)
// ---------------------------------------------------------------------------

export const PRESETS: Record<string, PresetDefinition> = {
  // -- Board Games (4) -----------------------------------------------------
  "board-countdown": {
    id: "board-countdown",
    name: "Countdown Timer",
    description: "Set a time limit for turns or rounds",
    strategy: "countdown",
    defaultConfig: { duration: 120 },
    category: "board-games",
    route: "/board-games/countdown",
    sitemapPriority: 0.7,
  },
  "board-chess-clock": {
    id: "board-chess-clock",
    name: "Chess Clock",
    description: "Two-player time control for competitive games",
    strategy: "chess-clock",
    defaultConfig: { duration_per_player: 600, increment: 0 },
    category: "board-games",
    route: "/board-games/chess-clock",
    sitemapPriority: 0.7,
  },
  "board-round-timer": {
    id: "board-round-timer",
    name: "Round Timer",
    description: "Track rounds and total game time",
    strategy: "round-timer",
    defaultConfig: { round_duration: 180, rest_duration: 60, rounds: 3 },
    category: "board-games",
    route: "/board-games/round-timer",
    sitemapPriority: 0.7,
  },
  "board-turn-timer": {
    id: "board-turn-timer",
    name: "Turn Timer",
    description: "Per-player turn countdown for 2-8 players",
    strategy: "turn-timer",
    defaultConfig: { players: 4, time_per_turn: 60 },
    category: "board-games",
    route: "/board-games/turn-timer",
    sitemapPriority: 0.7,
  },

  // -- Photography (6) -----------------------------------------------------
  "film-development": {
    id: "film-development",
    name: "Film Development Timer",
    description:
      "Multi-step sequential timer for B&W, C-41, and E-6 processes",
    strategy: "multi-step",
    defaultConfig: {
      steps: [
        { name: "Developer", duration: 480 },
        { name: "Stop Bath", duration: 60 },
        { name: "Fixer", duration: 300 },
        { name: "Wash", duration: 300 },
      ],
    },
    category: "photography",
    route: "/photography/film-development",
    sitemapPriority: 0.8,
  },
  "long-exposure-calculator": {
    id: "long-exposure-calculator",
    name: "Long Exposure Calculator",
    description: "Reciprocity failure correction for film photography",
    strategy: "calculator-timer",
    defaultConfig: { metered_time: 1, mode: "reciprocity" },
    category: "photography",
    route: "/photography/long-exposure-calculator",
    sitemapPriority: 0.8,
  },
  "stand-development": {
    id: "stand-development",
    name: "Stand Development Timer",
    description:
      "Long-form ambient timer for stand and semi-stand development",
    strategy: "ambient",
    defaultConfig: { duration: 3600, interval: 1800 },
    category: "photography",
    route: "/photography/stand-development",
    sitemapPriority: 0.7,
  },
  "enlarger-timer": {
    id: "enlarger-timer",
    name: "Enlarger Timer",
    description: "F-stop timing and test strip mode for darkroom printing",
    strategy: "enlarger",
    defaultConfig: { base_time: 10, mode: "f-stop" },
    category: "photography",
    route: "/photography/enlarger-timer",
    sitemapPriority: 0.7,
  },
  cyanotype: {
    id: "cyanotype",
    name: "Cyanotype Timer",
    description: "UV exposure timer for alternative processes",
    strategy: "countdown",
    defaultConfig: { duration: 900 },
    category: "photography",
    route: "/photography/cyanotype",
    sitemapPriority: 0.6,
  },
  "photo-walk": {
    id: "photo-walk",
    name: "Photo Walk Timer",
    description: "Timed photo challenges and sprint sessions",
    strategy: "interval",
    defaultConfig: { work: 900, rest: 120, rounds: 4 },
    category: "photography",
    route: "/photography/photo-walk",
    sitemapPriority: 0.6,
  },

  // -- Fitness (5) ----------------------------------------------------------
  hiit: {
    id: "hiit",
    name: "HIIT Timer",
    description: "Configurable high-intensity interval training",
    strategy: "interval",
    defaultConfig: { work: 40, rest: 20, rounds: 8 },
    category: "fitness",
    route: "/fitness/hiit",
    sitemapPriority: 0.8,
  },
  tabata: {
    id: "tabata",
    name: "Tabata Timer",
    description: "Classic 20/10 protocol — 8 rounds, 4 minutes",
    strategy: "interval",
    defaultConfig: { work: 20, rest: 10, rounds: 8 },
    category: "fitness",
    route: "/fitness/tabata",
    sitemapPriority: 0.8,
  },
  stretching: {
    id: "stretching",
    name: "Stretching Timer",
    description: "Hold timer with exercise sequences",
    strategy: "interval",
    defaultConfig: { work: 30, rest: 10, rounds: 10 },
    category: "fitness",
    route: "/fitness/stretching",
    sitemapPriority: 0.7,
  },
  emom: {
    id: "emom",
    name: "EMOM Timer",
    description: "Every Minute On the Minute workout timer",
    strategy: "interval",
    defaultConfig: { work: 60, rest: 0, rounds: 10 },
    category: "fitness",
    route: "/fitness/emom",
    sitemapPriority: 0.7,
  },
  "rest-timer": {
    id: "rest-timer",
    name: "Rest Timer",
    description: "Quick countdown between sets",
    strategy: "countdown",
    defaultConfig: { duration: 90 },
    category: "fitness",
    route: "/fitness/rest-timer",
    sitemapPriority: 0.6,
  },

  // -- Wellness (4) ---------------------------------------------------------
  meditation: {
    id: "meditation",
    name: "Meditation Timer",
    description: "Guided mindfulness with interval bells",
    strategy: "ambient",
    defaultConfig: { duration: 600, interval: 300 },
    category: "wellness",
    route: "/wellness/meditation",
    sitemapPriority: 0.8,
  },
  breathing: {
    id: "breathing",
    name: "Breathing Timer",
    description: "Box breathing, 4-7-8, and Wim Hof exercises",
    strategy: "interval",
    defaultConfig: { work: 4, rest: 4, rounds: 10 },
    category: "wellness",
    route: "/wellness/breathing",
    sitemapPriority: 0.8,
  },
  sleep: {
    id: "sleep",
    name: "Sleep Timer",
    description: "Gentle countdown for wind-down routines",
    strategy: "countdown",
    defaultConfig: { duration: 1800 },
    category: "wellness",
    route: "/wellness/sleep",
    sitemapPriority: 0.7,
  },
  fasting: {
    id: "fasting",
    name: "Fasting Timer",
    description: "Track intermittent fasting windows",
    strategy: "countdown",
    defaultConfig: { duration: 57600 },
    category: "wellness",
    route: "/wellness/fasting",
    sitemapPriority: 0.7,
  },
  "20-20-20-timer": {
    id: "20-20-20-timer",
    name: "20-20-20 Rule Timer",
    description:
      "Eye-strain break reminder: every 20 minutes, look 20 feet away for 20 seconds",
    strategy: "interval-reminder",
    defaultConfig: { focus: 1200, break_seconds: 20 },
    category: "wellness",
    route: "/wellness/20-20-20-timer",
    sitemapPriority: 0.8,
  },
  "eye-strain-timer": {
    id: "eye-strain-timer",
    name: "Eye Strain Timer",
    description:
      "Scheduled screen-break reminders to reduce digital eye strain",
    strategy: "interval-reminder",
    defaultConfig: { focus: 1200, break_seconds: 20 },
    category: "wellness",
    route: "/wellness/eye-strain-timer",
    sitemapPriority: 0.6,
  },
  "screen-break-reminder": {
    id: "screen-break-reminder",
    name: "Screen Break Reminder",
    description:
      "Free browser-based screen-break reminder, no extension required",
    strategy: "interval-reminder",
    defaultConfig: { focus: 1200, break_seconds: 20 },
    category: "wellness",
    route: "/wellness/screen-break-reminder",
    sitemapPriority: 0.6,
  },

  // -- Productivity (5) -----------------------------------------------------
  pomodoro: {
    id: "pomodoro",
    name: "Pomodoro Timer",
    description: "25-minute focus sessions with 5-minute breaks",
    strategy: "interval",
    defaultConfig: { work: 1500, rest: 300, rounds: 4 },
    category: "productivity",
    route: "/productivity/pomodoro",
    sitemapPriority: 0.8,
  },
  study: {
    id: "study",
    name: "Study Timer",
    description: "Timed study blocks with break reminders",
    strategy: "interval",
    defaultConfig: { work: 2700, rest: 600, rounds: 3 },
    category: "productivity",
    route: "/productivity/study",
    sitemapPriority: 0.7,
  },
  "adhd-focus": {
    id: "adhd-focus",
    name: "ADHD Focus Timer",
    description: "Low-distraction timer with shorter intervals",
    strategy: "interval",
    defaultConfig: { work: 900, rest: 300, rounds: 4 },
    category: "productivity",
    route: "/productivity/adhd-focus",
    sitemapPriority: 0.7,
  },
  classroom: {
    id: "classroom",
    name: "Classroom Timer",
    description: "Large display activity timers for teachers",
    strategy: "countdown",
    defaultConfig: { duration: 600 },
    category: "productivity",
    route: "/productivity/classroom",
    sitemapPriority: 0.7,
  },
  presentation: {
    id: "presentation",
    name: "Presentation Timer",
    description: "Keep talks and meetings on schedule",
    strategy: "countdown",
    defaultConfig: { duration: 900 },
    category: "productivity",
    route: "/productivity/presentation",
    sitemapPriority: 0.7,
  },

  // -- Kitchen (4) ----------------------------------------------------------
  cooking: {
    id: "cooking",
    name: "Cooking Timer",
    description: "General cooking timer with preset durations",
    strategy: "countdown",
    defaultConfig: { duration: 600 },
    category: "kitchen",
    route: "/kitchen/cooking",
    sitemapPriority: 0.7,
  },
  eggs: {
    id: "eggs",
    name: "Egg Timer",
    description: "Perfect soft, medium, and hard boiled eggs every time",
    strategy: "countdown",
    defaultConfig: { duration: 420 },
    category: "kitchen",
    route: "/kitchen/eggs",
    sitemapPriority: 0.7,
  },
  "kitchen-multi-timer": {
    id: "kitchen-multi-timer",
    name: "Multi-Timer",
    description:
      "Run multiple simultaneous timers for different dishes",
    strategy: "multi-timer",
    defaultConfig: {
      timers: [
        { name: "Main Dish", duration: 1800 },
        { name: "Side", duration: 900 },
      ],
    },
    category: "kitchen",
    route: "/kitchen/multi-timer",
    sitemapPriority: 0.7,
  },
  "bread-proofing": {
    id: "bread-proofing",
    name: "Bread Proofing Timer",
    description: "Long-form rise timer with temperature notes",
    strategy: "ambient",
    defaultConfig: { duration: 3600, interval: 1800 },
    category: "kitchen",
    route: "/kitchen/bread-proofing",
    sitemapPriority: 0.6,
  },

  // -- Streamer Tools (6) ---------------------------------------------------
  "brb-overlay-hub": {
    id: "brb-overlay-hub",
    name: "BRB Countdown Overlay",
    description:
      "URL-configurable OBS Browser-Source countdown — transparent, no signup",
    strategy: "countdown",
    defaultConfig: { duration: 300 },
    category: "streamer-tools",
    route: "/brb",
    sitemapPriority: 0.8,
  },
  "brb-starting-soon": {
    id: "brb-starting-soon",
    name: "Stream Starting Soon",
    description: "5-minute pre-stream countdown for the cover scene",
    strategy: "countdown",
    defaultConfig: { duration: 300 },
    category: "streamer-tools",
    route: "/brb/starting-soon",
    sitemapPriority: 0.7,
  },
  "brb-be-right-back": {
    id: "brb-be-right-back",
    name: "Be Right Back Timer",
    description: "Clean 5-minute intermission countdown for mid-stream breaks",
    strategy: "countdown",
    defaultConfig: { duration: 300 },
    category: "streamer-tools",
    route: "/brb/be-right-back",
    sitemapPriority: 0.7,
  },
  "brb-stream-over": {
    id: "brb-stream-over",
    name: "Stream Ending Countdown",
    description: "Calm 2-minute wind-down for end-of-stream goodbyes",
    strategy: "countdown",
    defaultConfig: { duration: 120 },
    category: "streamer-tools",
    route: "/brb/stream-over",
    sitemapPriority: 0.7,
  },
  "brb-raid-countdown": {
    id: "brb-raid-countdown",
    name: "Twitch Raid Countdown",
    description: "1-minute high-energy raid timer aligned with Twitch /raid",
    strategy: "countdown",
    defaultConfig: { duration: 60 },
    category: "streamer-tools",
    route: "/brb/raid-countdown",
    sitemapPriority: 0.7,
  },
  "streamer-obs-countdown": {
    id: "streamer-obs-countdown",
    name: "OBS Countdown Timer",
    description: "SEO alias for the BRB overlay — canonical at /brb",
    strategy: "countdown",
    defaultConfig: { duration: 300 },
    category: "streamer-tools",
    route: "/streamer-tools/obs-countdown",
    sitemapPriority: 0.5,
  },
};

// ---------------------------------------------------------------------------
// Categories (6 site verticals)
// ---------------------------------------------------------------------------

export const CATEGORIES: Record<string, CategoryDefinition> = {
  "board-games": {
    slug: "board-games",
    name: "Board Games",
    emoji: "\u{1F3B2}",
    icon: Dice5,
    heading: "Free Board Game Timers",
    description:
      "Keep game night moving with free, mobile-friendly timers. No app download, no signup \u2014 just pick a timer and play.",
    heroCta: "Start Playing \u2192",
    heroCtaHref: "/board-games/countdown",
    gridHeading: "Choose Your Timer",
    featuredTimers: ["board-countdown", "board-chess-clock", "board-round-timer"],
    faq: [
      {
        question: "What is a chess clock for board games?",
        answer:
          "A chess clock is a two-player timer where each player has their own countdown. After making a move, you tap the clock to switch to your opponent\u2019s timer.",
      },
      {
        question: "How do I time board game turns?",
        answer:
          "For two-player games, use the Chess Clock. For group games, use the Countdown Timer. For tracking rounds, use the Round Timer.",
      },
      {
        question: "Can I track game scores with friends?",
        answer:
          "Yes! GoTimer\u2019s challenge system lets you create ongoing rivalries, invite friends, and track wins over time.",
      },
    ],
  },

  photography: {
    slug: "photography",
    name: "Photography",
    emoji: "\u{1F39E}\uFE0F",
    icon: Camera,
    heading: "Precision Timing for Film & Darkroom",
    description:
      "Film development timers, reciprocity calculators, and darkroom tools. Free, browser-based, safelight-safe.",
    heroCta: "Start Developing \u2192",
    heroCtaHref: "/photography/film-development",
    gridHeading: "Your Darkroom Toolkit",
    featuredTimers: [
      "film-development",
      "long-exposure-calculator",
      "stand-development",
    ],
    accent: "#cc0000",
  },

  fitness: {
    slug: "fitness",
    name: "Fitness",
    emoji: "\u{1F3CB}\uFE0F",
    icon: Dumbbell,
    heading: "Workout Timers That Push You Harder",
    description:
      "Interval training, Tabata, HIIT, stretching, and rest timers for every workout style. Free, no app needed.",
    heroCta: "Start Training \u2192",
    heroCtaHref: "/fitness/hiit",
    gridHeading: "Pick Your Workout",
    featuredTimers: ["hiit", "tabata", "emom"],
  },

  wellness: {
    slug: "wellness",
    name: "Wellness",
    emoji: "\u{1F9D8}",
    icon: Heart,
    heading: "Timers for Mind & Body",
    description:
      "Meditation, breathing exercises, sleep timers, and fasting trackers for your daily wellbeing routine.",
    heroCta: "Start Breathing \u2192",
    heroCtaHref: "/wellness/meditation",
    gridHeading: "Your Wellness Toolkit",
    featuredTimers: ["meditation", "breathing", "sleep"],
  },

  productivity: {
    slug: "productivity",
    name: "Productivity",
    emoji: "\u{1F3AF}",
    icon: Target,
    heading: "Focus Timers for Deep Work",
    description:
      "Pomodoro, study sessions, ADHD focus timers, classroom activities, and presentation timing. Get more done.",
    heroCta: "Start Focusing \u2192",
    heroCtaHref: "/productivity/pomodoro",
    gridHeading: "Choose Your Method",
    featuredTimers: ["pomodoro", "study", "adhd-focus"],
  },

  kitchen: {
    slug: "kitchen",
    name: "Kitchen",
    emoji: "\u{1F373}",
    icon: CookingPot,
    heading: "Kitchen Timers \u2014 Never Burn Dinner Again",
    description:
      "Cooking timers, egg timers, and multi-timer support for when you\u2019re juggling multiple dishes. Precision for every chef.",
    heroCta: "Start Cooking \u2192",
    heroCtaHref: "/kitchen/cooking",
    gridHeading: "Kitchen Essentials",
    featuredTimers: ["cooking", "eggs", "kitchen-multi-timer"],
  },

  "streamer-tools": {
    slug: "streamer-tools",
    name: "Streamer Tools",
    emoji: "\u{1F39A}\ufe0f",
    icon: Video,
    heading: "Streamer Tools \u2014 OBS Browser-Source Overlays",
    description:
      "Free, transparent countdown overlays for OBS Studio, Streamlabs, vMix, and XSplit. URL-configurable, no signup, no watermark.",
    heroCta: "Open the BRB overlay \u2192",
    heroCtaHref: "/brb",
    gridHeading: "Pre-built Scenarios",
    featuredTimers: ["brb-starting-soon", "brb-be-right-back", "brb-raid-countdown"],
    faq: [
      {
        question: "Are these overlays free?",
        answer:
          "Yes, completely. No signup, no watermark, no Twitch OAuth, no analytics on the embed URL itself. Paste the URL into OBS Browser Source and stream.",
      },
      {
        question: "Will the transparent background work with OBS?",
        answer:
          "Yes \u2014 each overlay sets a transparent CSS background natively, so OBS composites it cleanly over your scene without needing Custom CSS.",
      },
      {
        question: "Does audio play in OBS Browser Source?",
        answer:
          "OBS mutes Browser Source audio by default. Open /brb/sound-cue in a separate browser tab and add it to OBS as an Audio Output Capture source for chime cues.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Derived constants
// ---------------------------------------------------------------------------

/** All category slugs */
export const REGISTRY_CATEGORY_SLUGS = Object.keys(CATEGORIES);

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Get a strategy definition by id */
export function get_strategy_def(
  id: string,
): StrategyDefinition | undefined {
  return STRATEGIES[id];
}

/** Get a preset definition by id */
export function get_preset_def(id: string): PresetDefinition | undefined {
  return PRESETS[id];
}

/** Get a category definition by slug */
export function get_category_def(
  slug: string,
): CategoryDefinition | undefined {
  return CATEGORIES[slug];
}

/** Get all presets belonging to a category */
export function get_presets_by_category(category: string): PresetDefinition[] {
  return Object.values(PRESETS).filter((p) => p.category === category);
}

/** Get all presets that use a given strategy */
export function get_presets_by_strategy(strategy: string): PresetDefinition[] {
  return Object.values(PRESETS).filter((p) => p.strategy === strategy);
}

/** Resolved timer info returned by resolve_timer */
export interface ResolvedTimer {
  strategy_id: string;
  config: Record<string, unknown>;
  name: string;
  route: string;
}

/**
 * Resolve a timer by id. Checks presets first, then falls back to strategies.
 * Optional `overrides` are merged on top of the defaultConfig.
 */
export function resolve_timer(
  id: string,
  overrides?: Record<string, unknown>,
): ResolvedTimer | undefined {
  const preset = PRESETS[id];
  if (preset) {
    return {
      strategy_id: preset.strategy,
      config: { ...preset.defaultConfig, ...overrides },
      name: preset.name,
      route: preset.route,
    };
  }

  const strategy = STRATEGIES[id];
  if (strategy) {
    return {
      strategy_id: strategy.id,
      config: { ...strategy.defaultConfig, ...overrides },
      name: strategy.name,
      route: strategy.route,
    };
  }

  return undefined;
}

/** Get all known timer IDs (presets + strategies) */
export function get_all_timer_ids(): string[] {
  const preset_ids = Object.keys(PRESETS);
  const strategy_ids = Object.keys(STRATEGIES);
  // Deduplicate (some IDs like "turn-timer" appear in both)
  return Array.from(new Set([...preset_ids, ...strategy_ids]));
}
