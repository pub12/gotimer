/**
 * Site categories — derived from the unified timer registry.
 *
 * This file re-exports data in the shape that category pages, homepage grid,
 * and other components expect. The underlying data lives in timer-registry.ts.
 */

import type { LucideIcon } from "lucide-react";
import {
  CATEGORIES,
  PRESETS,
  type CategoryDefinition,
  type PresetDefinition,
  get_presets_by_category,
} from "./timer-registry";

// Re-export types that consumers expect
export interface TimerEntry {
  slug: string;
  name: string;
  description: string;
  /**
   * Full canonical route to the preset page. When present, TimerCard
   * links here directly instead of reconstructing `/<category>/<slug>`.
   * Required for presets whose route lives outside their category prefix
   * (e.g. streamer-tools presets that live under /brb/*).
   */
  route?: string;
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
    route: preset.route,
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
      const preset = PRESETS[id];
      return preset ? preset.route.split("/").pop() || id : id;
    }),
    accent: cat.accent,
    faq: cat.faq,
  };
}

/** All site categories, derived from the timer registry */
export const SITE_CATEGORIES: SiteCategory[] = Object.values(CATEGORIES).map(
  category_to_site_category,
);

/** Get a category by slug */
export function get_category(slug: string): SiteCategory | undefined {
  return SITE_CATEGORIES.find((c) => c.slug === slug);
}

/** All category slugs (for route validation) */
export const CATEGORY_SLUGS = SITE_CATEGORIES.map((c) => c.slug);
