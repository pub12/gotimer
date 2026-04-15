import type { LucideIcon } from "lucide-react";
import {
  Dice5, Camera, Dumbbell, Heart, Target, CookingPot,
} from "lucide-react";

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
  /** All timers in this category */
  timers: TimerEntry[];
  /** Featured timers shown on homepage (max 3) */
  featured_timers: string[];
  /** Accent color for hero decorative elements */
  accent?: string;
  /** FAQ items for the category page */
  faq?: Array<{ question: string; answer: string }>;
}

export const SITE_CATEGORIES: SiteCategory[] = [
  {
    slug: "board-games",
    name: "Board Games",
    emoji: "🎲",
    icon: Dice5,
    heading: "Free Board Game Timers",
    description: "Keep game night moving with free, mobile-friendly timers. No app download, no signup — just pick a timer and play.",
    hero_cta: "Start Playing →",
    hero_cta_href: "/board-games/countdown",
    grid_heading: "Choose Your Timer",
    timers: [
      { slug: "countdown", name: "Countdown Timer", description: "Set a time limit for turns or rounds" },
      { slug: "chess-clock", name: "Chess Clock", description: "Two-player time control for competitive games" },
      { slug: "round-timer", name: "Round Timer", description: "Track rounds and total game time" },
      { slug: "turn-timer", name: "Turn Timer", description: "Per-player turn countdown for 2-8 players" },
    ],
    featured_timers: ["countdown", "chess-clock", "round-timer"],
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
    hero_cta: "Start Developing →",
    hero_cta_href: "/photography/film-development",
    grid_heading: "Your Darkroom Toolkit",
    timers: [
      { slug: "film-development", name: "Film Development Timer", description: "Multi-step sequential timer for B&W, C-41, and E-6 processes" },
      { slug: "long-exposure-calculator", name: "Long Exposure Calculator", description: "Reciprocity failure correction for film photography" },
      { slug: "stand-development", name: "Stand Development Timer", description: "Long-form ambient timer for stand and semi-stand development" },
      { slug: "enlarger-timer", name: "Enlarger Timer", description: "F-stop timing and test strip mode for darkroom printing" },
      { slug: "cyanotype", name: "Cyanotype Timer", description: "UV exposure timer for alternative processes" },
      { slug: "photo-walk", name: "Photo Walk Timer", description: "Timed photo challenges and sprint sessions" },
    ],
    featured_timers: ["film-development", "long-exposure-calculator", "stand-development"],
    accent: "#cc0000",
  },
  {
    slug: "fitness",
    name: "Fitness",
    emoji: "🏋️",
    icon: Dumbbell,
    heading: "Workout Timers That Push You Harder",
    description: "Interval training, Tabata, HIIT, stretching, and rest timers for every workout style. Free, no app needed.",
    hero_cta: "Start Training →",
    hero_cta_href: "/fitness/hiit",
    grid_heading: "Pick Your Workout",
    timers: [
      { slug: "hiit", name: "HIIT Timer", description: "Configurable high-intensity interval training" },
      { slug: "tabata", name: "Tabata Timer", description: "Classic 20/10 protocol — 8 rounds, 4 minutes" },
      { slug: "stretching", name: "Stretching Timer", description: "Hold timer with exercise sequences" },
      { slug: "emom", name: "EMOM Timer", description: "Every Minute On the Minute workout timer" },
      { slug: "rest-timer", name: "Rest Timer", description: "Quick countdown between sets" },
    ],
    featured_timers: ["hiit", "tabata", "emom"],
  },
  {
    slug: "wellness",
    name: "Wellness",
    emoji: "🧘",
    icon: Heart,
    heading: "Timers for Mind & Body",
    description: "Meditation, breathing exercises, sleep timers, and fasting trackers for your daily wellbeing routine.",
    hero_cta: "Start Breathing →",
    hero_cta_href: "/wellness/meditation",
    grid_heading: "Your Wellness Toolkit",
    timers: [
      { slug: "meditation", name: "Meditation Timer", description: "Guided mindfulness with interval bells" },
      { slug: "breathing", name: "Breathing Timer", description: "Box breathing, 4-7-8, and Wim Hof exercises" },
      { slug: "sleep", name: "Sleep Timer", description: "Gentle countdown for wind-down routines" },
      { slug: "fasting", name: "Fasting Timer", description: "Track intermittent fasting windows" },
    ],
    featured_timers: ["meditation", "breathing", "sleep"],
  },
  {
    slug: "productivity",
    name: "Productivity",
    emoji: "🎯",
    icon: Target,
    heading: "Focus Timers for Deep Work",
    description: "Pomodoro, study sessions, ADHD focus timers, classroom activities, and presentation timing. Get more done.",
    hero_cta: "Start Focusing →",
    hero_cta_href: "/productivity/pomodoro",
    grid_heading: "Choose Your Method",
    timers: [
      { slug: "pomodoro", name: "Pomodoro Timer", description: "25-minute focus sessions with 5-minute breaks" },
      { slug: "study", name: "Study Timer", description: "Timed study blocks with break reminders" },
      { slug: "adhd-focus", name: "ADHD Focus Timer", description: "Low-distraction timer with shorter intervals" },
      { slug: "classroom", name: "Classroom Timer", description: "Large display activity timers for teachers" },
      { slug: "presentation", name: "Presentation Timer", description: "Keep talks and meetings on schedule" },
    ],
    featured_timers: ["pomodoro", "study", "adhd-focus"],
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    emoji: "🍳",
    icon: CookingPot,
    heading: "Kitchen Timers — Never Burn Dinner Again",
    description: "Cooking timers, egg timers, and multi-timer support for when you're juggling multiple dishes. Precision for every chef.",
    hero_cta: "Start Cooking →",
    hero_cta_href: "/kitchen/cooking",
    grid_heading: "Kitchen Essentials",
    timers: [
      { slug: "cooking", name: "Cooking Timer", description: "General cooking timer with preset durations" },
      { slug: "eggs", name: "Egg Timer", description: "Perfect soft, medium, and hard boiled eggs every time" },
      { slug: "multi-timer", name: "Multi-Timer", description: "Run multiple simultaneous timers for different dishes" },
      { slug: "bread-proofing", name: "Bread Proofing Timer", description: "Long-form rise timer with temperature notes" },
    ],
    featured_timers: ["cooking", "eggs", "multi-timer"],
  },
];

/** Get a category by slug */
export function get_category(slug: string): SiteCategory | undefined {
  return SITE_CATEGORIES.find((c) => c.slug === slug);
}

/** All category slugs (for route validation) */
export const CATEGORY_SLUGS = SITE_CATEGORIES.map((c) => c.slug);
