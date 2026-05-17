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

  "multi-player-turn-timer": {
    id: "multi-player-turn-timer",
    name: "Multi-Player Turn Timer",
    description:
      "Per-turn, time-bank, or hybrid clock for 3-8 named players. Powers the multi-player board game turn timer.",
    defaultConfig: {
      player_names: ["Player 1", "Player 2", "Player 3", "Player 4"],
      mode: "per-turn",
      per_turn: 60,
      bank: 600,
      warning_at: 10,
    },
    supportedParams: ["players", "mode", "per_turn", "bank", "warning_at"],
    route: "/board-games/multi-player-turn-timer",
    sitemapPriority: 0.8,
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

  "espresso-shot": {
    id: "espresso-shot",
    name: "Espresso Shot Timer",
    description:
      "Count-up shot timer with first-drip capture and a 25-30s target band. Powers the espresso timer.",
    defaultConfig: { target_min: 25, target_max: 30 },
    supportedParams: ["target_min", "target_max"],
    route: "/kitchen/espresso-timer",
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
  "board-multi-player-turn-timer": {
    id: "board-multi-player-turn-timer",
    name: "Multi-Player Turn Timer",
    description:
      "Free turn timer for 3-8 players. Per-turn, time-bank, or hybrid mode. Shareable URL keeps names baked in.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      player_names: ["Player 1", "Player 2", "Player 3", "Player 4"],
      mode: "per-turn",
      per_turn: 90,
      bank: 20 * 60,
      warning_at: 10,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer",
    sitemapPriority: 0.8,
  },
  "board-mpt-twilight-imperium": {
    id: "board-mpt-twilight-imperium",
    name: "Twilight Imperium Turn Timer",
    description:
      "Pre-tuned 90-second tactical cap for the 10-hour space epic. Up to 6-8 players.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 90,
      bank: 60 * 60,
      warning_at: 15,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/twilight-imperium",
    sitemapPriority: 0.7,
  },
  "board-mpt-gloomhaven": {
    id: "board-mpt-gloomhaven",
    name: "Gloomhaven Turn Timer",
    description:
      "60-second cap for card-and-action planning. Works for Frosthaven and Jaws of the Lion.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 60,
      bank: 30 * 60,
      warning_at: 10,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/gloomhaven",
    sitemapPriority: 0.7,
  },
  "board-mpt-brass-birmingham": {
    id: "board-mpt-brass-birmingham",
    name: "Brass: Birmingham Turn Timer",
    description: "90-second cap for build-and-flip planning. Suits Lancashire too.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 90,
      bank: 25 * 60,
      warning_at: 15,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/brass-birmingham",
    sitemapPriority: 0.7,
  },
  "board-mpt-spirit-island": {
    id: "board-mpt-spirit-island",
    name: "Spirit Island Turn Timer",
    description:
      "Cooperative — 90-second cap stops quarterbacking and lets every spirit play their own turn.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 90,
      bank: 25 * 60,
      warning_at: 15,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/spirit-island",
    sitemapPriority: 0.7,
  },
  "board-mpt-terra-mystica": {
    id: "board-mpt-terra-mystica",
    name: "Terra Mystica Turn Timer",
    description:
      "2-minute cap for multi-step euro turns. Equally suitable for Gaia Project.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 120,
      bank: 30 * 60,
      warning_at: 15,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/terra-mystica",
    sitemapPriority: 0.7,
  },
  "board-mpt-food-chain-magnate": {
    id: "board-mpt-food-chain-magnate",
    name: "Food Chain Magnate Turn Timer",
    description:
      "Time-bank mode with 25-minute personal budget — multiplayer chess clock for FCM.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "time-bank",
      per_turn: 90,
      bank: 25 * 60,
      warning_at: 30,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/food-chain-magnate",
    sitemapPriority: 0.7,
  },
  "board-mpt-through-the-ages": {
    id: "board-mpt-through-the-ages",
    name: "Through the Ages Turn Timer",
    description:
      "Time-bank mode with 30-minute personal budget for civilization-arc decisions.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "time-bank",
      per_turn: 90,
      bank: 30 * 60,
      warning_at: 30,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/through-the-ages",
    sitemapPriority: 0.7,
  },
  "board-mpt-mage-knight": {
    id: "board-mpt-mage-knight",
    name: "Mage Knight Turn Timer",
    description:
      "3-minute cap for the combat puzzle. Solo or 2-4 player; hybrid mode option.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 180,
      bank: 35 * 60,
      warning_at: 30,
    },
    category: "board-games",
    route: "/board-games/multi-player-turn-timer/mage-knight",
    sitemapPriority: 0.7,
  },
  "board-analysis-paralysis-timer": {
    id: "board-analysis-paralysis-timer",
    name: "Analysis Paralysis Timer",
    description:
      "Free analysis-paralysis timer for board games. Per-turn cap, hybrid mode for mixed-pace groups.",
    strategy: "multi-player-turn-timer",
    defaultConfig: {
      mode: "per-turn",
      per_turn: 90,
      bank: 15 * 60,
      warning_at: 10,
    },
    category: "board-games",
    route: "/board-games/analysis-paralysis-timer",
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
  "sauna-timer": {
    id: "sauna-timer",
    name: "Sauna Timer",
    description:
      "Free 15-minute sauna timer for Finnish, infrared, and steam saunas",
    strategy: "countdown",
    defaultConfig: { duration: 15 * 60 },
    category: "wellness",
    route: "/wellness/sauna-timer",
    sitemapPriority: 0.8,
  },
  "cold-plunge-timer": {
    id: "cold-plunge-timer",
    name: "Cold Plunge Timer",
    description:
      "Free 2-minute cold plunge timer for ice baths and cold-water immersion",
    strategy: "countdown",
    defaultConfig: { duration: 120 },
    category: "wellness",
    route: "/wellness/cold-plunge-timer",
    sitemapPriority: 0.8,
  },
  "contrast-therapy": {
    id: "contrast-therapy",
    name: "Contrast Therapy Timer",
    description:
      "Multi-phase sauna and cold-plunge sequencer with Søberg, 15-3-1, and Wim Hof-style presets",
    strategy: "multi-step",
    defaultConfig: {
      steps: [
        { name: "Sauna — Round 1/3", duration: 15 * 60 },
        { name: "Plunge — Round 1/3", duration: 120 },
        { name: "Rest — Round 1/3", duration: 60 },
        { name: "Sauna — Round 2/3", duration: 15 * 60 },
        { name: "Plunge — Round 2/3", duration: 120 },
        { name: "Rest — Round 2/3", duration: 60 },
        { name: "Sauna — Round 3/3", duration: 15 * 60 },
        { name: "Plunge — Round 3/3", duration: 120 },
      ],
    },
    category: "wellness",
    route: "/wellness/contrast-therapy",
    sitemapPriority: 0.8,
  },
  "soberg-protocol": {
    id: "soberg-protocol",
    name: "Søberg Protocol Timer",
    description:
      "Published Søberg sequence — 3 rounds of 15-2-1, ends on cold",
    strategy: "multi-step",
    defaultConfig: {
      steps: [
        { name: "Sauna — Round 1/3", duration: 15 * 60 },
        { name: "Plunge — Round 1/3", duration: 120 },
        { name: "Rest — Round 1/3", duration: 60 },
        { name: "Sauna — Round 2/3", duration: 15 * 60 },
        { name: "Plunge — Round 2/3", duration: 120 },
        { name: "Rest — Round 2/3", duration: 60 },
        { name: "Sauna — Round 3/3", duration: 15 * 60 },
        { name: "Plunge — Round 3/3", duration: 120 },
      ],
    },
    category: "wellness",
    route: "/wellness/contrast-therapy/soberg-protocol",
    sitemapPriority: 0.8,
  },
  "fifteen-three-rest": {
    id: "fifteen-three-rest",
    name: "15-3-1 Sauna + Cold Plunge Timer",
    description:
      "Sauna-heavy contrast therapy: 15 min sauna, 3 min cold, 1 min rest — 3 rounds, ends on cold",
    strategy: "multi-step",
    defaultConfig: {
      steps: [
        { name: "Sauna — Round 1/3", duration: 15 * 60 },
        { name: "Cold plunge — Round 1/3", duration: 3 * 60 },
        { name: "Rest — Round 1/3", duration: 60 },
        { name: "Sauna — Round 2/3", duration: 15 * 60 },
        { name: "Cold plunge — Round 2/3", duration: 3 * 60 },
        { name: "Rest — Round 2/3", duration: 60 },
        { name: "Sauna — Round 3/3", duration: 15 * 60 },
        { name: "Cold plunge — Round 3/3", duration: 3 * 60 },
      ],
    },
    category: "wellness",
    route: "/wellness/contrast-therapy/15-3-rest",
    sitemapPriority: 0.7,
  },
  "wim-hof-style-contrast": {
    id: "wim-hof-style-contrast",
    name: "Wim Hof-style Contrast Timer",
    description:
      "Breath work, cold plunge, recovery — 3 rounds ending on cold, no sauna required",
    strategy: "multi-step",
    defaultConfig: {
      steps: [
        { name: "Breath work — Round 1/3", duration: 3 * 60 },
        { name: "Cold plunge — Round 1/3", duration: 120 },
        { name: "Recovery — Round 1/3", duration: 90 },
        { name: "Breath work — Round 2/3", duration: 3 * 60 },
        { name: "Cold plunge — Round 2/3", duration: 120 },
        { name: "Recovery — Round 2/3", duration: 90 },
        { name: "Breath work — Round 3/3", duration: 3 * 60 },
        { name: "Cold plunge — Round 3/3", duration: 120 },
      ],
    },
    category: "wellness",
    route: "/wellness/contrast-therapy/wim-hof-style",
    sitemapPriority: 0.7,
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

  // -- Coffee — Pour-Over (1 hub + 9 leaves) -------------------------------
  "pour-over-timer": {
    id: "pour-over-timer",
    name: "Pour Over Timer",
    description:
      "Multi-recipe pour-over timer with Hoffmann V60, Kasuya 4:6, Chemex, AeroPress, French Press and more pre-configured.",
    strategy: "multi-step",
    defaultConfig: {
      steps: [
        { name: "Bloom — 50g total", duration: 45 },
        { name: "Pour 1 — 100g total", duration: 15 },
        { name: "Wait — 100g total", duration: 30 },
        { name: "Pour 2 — 150g total", duration: 15 },
        { name: "Wait — 150g total", duration: 30 },
        { name: "Pour 3 — 200g total", duration: 15 },
        { name: "Pour 4 — 250g total", duration: 10 },
        { name: "Drawdown — 250g total", duration: 60 },
      ],
    },
    category: "kitchen",
    route: "/kitchen/pour-over-timer",
    sitemapPriority: 0.8,
  },
  "pour-over-v60": {
    id: "pour-over-v60",
    name: "V60 Timer",
    description: "Generic four-pour Hario V60 recipe — 15g/240g, ~3 minutes",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/v60",
    sitemapPriority: 0.8,
  },
  "pour-over-chemex": {
    id: "pour-over-chemex",
    name: "Chemex Timer",
    description: "Standard Chemex 3-cup recipe — 30g/500g, ~5:30 drawdown",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/chemex",
    sitemapPriority: 0.7,
  },
  "pour-over-aeropress": {
    id: "pour-over-aeropress",
    name: "AeroPress Timer",
    description: "Standard upright AeroPress recipe — 17g/250g, 1:00 steep + press",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/aeropress",
    sitemapPriority: 0.7,
  },
  "pour-over-aeropress-inverted": {
    id: "pour-over-aeropress-inverted",
    name: "Inverted AeroPress Timer",
    description: "World AeroPress Championship-style inverted method — 18g/220g",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/aeropress-inverted",
    sitemapPriority: 0.7,
  },
  "pour-over-french-press": {
    id: "pour-over-french-press",
    name: "French Press Timer",
    description: "Classic 4-minute French press — 30g/500g, coarse grind, plunge and pour",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/french-press",
    sitemapPriority: 0.7,
  },
  "pour-over-hoffmann-v60": {
    id: "pour-over-hoffmann-v60",
    name: "Hoffmann V60 Timer",
    description:
      "James Hoffmann&apos;s Ultimate V60 Technique — 15g/250g, four 50g pours, finish at 3:30",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/hoffmann-v60",
    sitemapPriority: 0.9,
  },
  "pour-over-hoffmann-french-press": {
    id: "pour-over-hoffmann-french-press",
    name: "Hoffmann French Press Timer",
    description:
      "James Hoffmann&apos;s Best French Press Technique — 30g/500g, 4-min steep + skim + 5-min rest",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/hoffmann-french-press",
    sitemapPriority: 0.8,
  },
  "pour-over-tetsu-kasuya-4-6": {
    id: "pour-over-tetsu-kasuya-4-6",
    name: "Tetsu Kasuya 4:6 Timer",
    description:
      "2016 World Brewers Cup-winning recipe — 20g/300g, five pours split 40%/60% by intent",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/tetsu-kasuya-4-6",
    sitemapPriority: 0.9,
  },
  "pour-over-kalita-wave": {
    id: "pour-over-kalita-wave",
    name: "Kalita Wave Timer",
    description:
      "Kalita Wave 185 recipe — 22g/350g, three even pours into flat-bottom dripper",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/pour-over-timer/kalita-wave",
    sitemapPriority: 0.7,
  },

  // -- Coffee — Espresso (1 hub + 2 leaves) --------------------------------
  "espresso-timer": {
    id: "espresso-timer",
    name: "Espresso Timer",
    description:
      "Count-up espresso shot timer with first-drip capture and a 25-30 second target band.",
    strategy: "espresso-shot",
    defaultConfig: { target_min: 25, target_max: 30 },
    category: "kitchen",
    route: "/kitchen/espresso-timer",
    sitemapPriority: 0.8,
  },
  "espresso-pre-infusion": {
    id: "espresso-pre-infusion",
    name: "Espresso Pre-Infusion Timer",
    description:
      "Espresso timer optimized for tracking pre-infusion duration — first-drip + extraction time split.",
    strategy: "espresso-shot",
    defaultConfig: { target_min: 25, target_max: 30 },
    category: "kitchen",
    route: "/kitchen/espresso-timer/pre-infusion",
    sitemapPriority: 0.7,
  },
  "espresso-25-second-shot": {
    id: "espresso-25-second-shot",
    name: "25 Second Espresso Timer",
    description:
      "Classic double-shot recipe with 25-30s target band locked in. 18g dose, 36g yield.",
    strategy: "espresso-shot",
    defaultConfig: { target_min: 25, target_max: 30 },
    category: "kitchen",
    route: "/kitchen/espresso-timer/25-second-shot",
    sitemapPriority: 0.7,
  },

  // -- Tea (1 hub + 9 leaves) ----------------------------------------------
  "tea-timer": {
    id: "tea-timer",
    name: "Tea Timer",
    description:
      "Free tea steeping timer with seven per-type presets (green, oolong, white, black, pu-erh, herbal, matcha) plus gongfu and multi-cup modes.",
    strategy: "countdown",
    defaultConfig: { duration: 120 },
    category: "kitchen",
    route: "/kitchen/tea-timer",
    sitemapPriority: 0.9,
  },
  "tea-green": {
    id: "tea-green",
    name: "Green Tea Timer",
    description:
      "Free green tea timer — 75-80°C, 1-3 min default. Sencha, Dragon Well, Gyokuro sub-variety timings.",
    strategy: "countdown",
    defaultConfig: { duration: 120 },
    category: "kitchen",
    route: "/kitchen/tea-timer/green",
    sitemapPriority: 0.8,
  },
  "tea-black": {
    id: "tea-black",
    name: "Black Tea Timer",
    description:
      "Free black tea timer — 90-100°C, 3-5 min default. Assam, Darjeeling, Earl Grey timings.",
    strategy: "countdown",
    defaultConfig: { duration: 240 },
    category: "kitchen",
    route: "/kitchen/tea-timer/black",
    sitemapPriority: 0.8,
  },
  "tea-oolong": {
    id: "tea-oolong",
    name: "Oolong Tea Timer",
    description:
      "Free oolong tea timer — 85-95°C, 2-4 min default. Tieguanyin, Da Hong Pao, Dancong timings.",
    strategy: "countdown",
    defaultConfig: { duration: 180 },
    category: "kitchen",
    route: "/kitchen/tea-timer/oolong",
    sitemapPriority: 0.8,
  },
  "tea-white": {
    id: "tea-white",
    name: "White Tea Timer",
    description:
      "Free white tea timer — 75-85°C, 2-5 min default. Silver Needle, White Peony, Shou Mei timings.",
    strategy: "countdown",
    defaultConfig: { duration: 180 },
    category: "kitchen",
    route: "/kitchen/tea-timer/white",
    sitemapPriority: 0.7,
  },
  "tea-pu-erh": {
    id: "tea-pu-erh",
    name: "Pu-Erh Tea Timer",
    description:
      "Free pu-erh tea timer for sheng (raw) and shou (ripe) Chinese fermented tea. Gongfu or Western brewing.",
    strategy: "countdown",
    defaultConfig: { duration: 180 },
    category: "kitchen",
    route: "/kitchen/tea-timer/pu-erh",
    sitemapPriority: 0.7,
  },
  "tea-herbal": {
    id: "tea-herbal",
    name: "Herbal Tea Timer",
    description:
      "Free herbal tea (tisane) timer — 100°C, 5-10 min. Chamomile, peppermint, rooibos, hibiscus timings.",
    strategy: "countdown",
    defaultConfig: { duration: 360 },
    category: "kitchen",
    route: "/kitchen/tea-timer/herbal",
    sitemapPriority: 0.7,
  },
  "tea-matcha": {
    id: "tea-matcha",
    name: "Matcha Timer",
    description:
      "Free matcha whisking timer — 30-second usucha cycle. Usucha and koicha technique notes.",
    strategy: "countdown",
    defaultConfig: { duration: 30 },
    category: "kitchen",
    route: "/kitchen/tea-timer/matcha",
    sitemapPriority: 0.7,
  },
  "tea-gongfu": {
    id: "tea-gongfu",
    name: "Gongfu Cha Timer",
    description:
      "Free gongfu cha multi-infusion timer — 8 infusions auto-progressing (10-15-20-30-45-60-90-120s).",
    strategy: "multi-step",
    defaultConfig: { steps: [] },
    category: "kitchen",
    route: "/kitchen/tea-timer/gongfu",
    sitemapPriority: 0.8,
  },
  "tea-multi-cup": {
    id: "tea-multi-cup",
    name: "Multi-Cup Tea Timer",
    description:
      "Free multi-cup tea timer — brew up to 6 teas at once with per-cup type and steep time.",
    strategy: "multi-timer",
    defaultConfig: {
      timers: [
        { id: "cup-green", name: "Green tea", duration: 120 },
        { id: "cup-oolong", name: "Oolong", duration: 180 },
        { id: "cup-black", name: "Black tea", duration: 240 },
      ],
    },
    category: "kitchen",
    route: "/kitchen/tea-timer/multi-cup",
    sitemapPriority: 0.8,
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
    featuredTimers: [
      "board-multi-player-turn-timer",
      "board-chess-clock",
      "board-turn-timer",
    ],
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
      "Meditation, breathing exercises, sleep timers, sauna and cold-plunge protocols, and fasting trackers for your daily wellbeing routine.",
    heroCta: "Start Breathing \u2192",
    heroCtaHref: "/wellness/meditation",
    gridHeading: "Your Wellness Toolkit",
    featuredTimers: ["contrast-therapy", "meditation", "breathing"],
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
    featuredTimers: ["pour-over-timer", "tea-timer", "espresso-timer"],
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
