/**
 * Server-side JSON-LD + Metadata helpers for the coffee preset routes.
 *
 * Modeled on board-game-preset-schema.ts — keeps the per-leaf layout.tsx
 * files terse and consistent.
 */

import type { Metadata } from "next";
import type { PourOverRecipe } from "@/lib/coffee-recipes";

export interface FaqItem {
  question: string;
  answer: string;
}

const BASE = "https://gotimer.org";

function strip_html(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function iso_duration_seconds(total_seconds: number): string {
  if (total_seconds <= 0) return "PT0S";
  const minutes = Math.floor(total_seconds / 60);
  const seconds = total_seconds % 60;
  if (minutes > 0 && seconds > 0) return `PT${minutes}M${seconds}S`;
  if (minutes > 0) return `PT${minutes}M`;
  return `PT${seconds}S`;
}

export function build_coffee_metadata(
  slug: string,
  kind: "pour-over" | "espresso",
  meta: { title: string; description: string },
): Metadata {
  const path = `/kitchen/${kind === "pour-over" ? "pour-over-timer" : "espresso-timer"}/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE}${path}`,
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function build_coffee_web_app_ld(opts: {
  name: string;
  url_path: string;
  description: string;
  features: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    url: `${BASE}${opts.url_path}`,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: opts.description,
    featureList: opts.features,
  };
}

export function build_coffee_breadcrumb_ld(opts: {
  kind: "pour-over" | "espresso";
  leaf_slug?: string;
  leaf_name?: string;
}) {
  const hub_slug = opts.kind === "pour-over" ? "pour-over-timer" : "espresso-timer";
  const hub_name = opts.kind === "pour-over" ? "Pour-Over Timer" : "Espresso Timer";
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Kitchen", item: `${BASE}/kitchen` },
    {
      "@type": "ListItem",
      position: 3,
      name: hub_name,
      item: `${BASE}/kitchen/${hub_slug}`,
    },
  ];
  if (opts.leaf_slug && opts.leaf_name) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: opts.leaf_name,
      item: `${BASE}/kitchen/${hub_slug}/${opts.leaf_slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function build_coffee_faq_ld(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: strip_html(q.answer),
      },
    })),
  };
}

/**
 * Recipe schema.org markup for a pour-over recipe. Validates in Google Rich
 * Results Test and is eligible for Recipe rich cards.
 */
export function build_pour_over_recipe_ld(recipe: PourOverRecipe) {
  const total_seconds = recipe.stages.reduce((sum, s) => sum + s.duration, 0);
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: `${recipe.name} pour-over recipe`,
    description: `${recipe.coffee_g}g coffee, ${recipe.water_g}g water at ${recipe.temp_c}°C, ${recipe.grind} grind. Ratio ${recipe.ratio}.`,
    recipeCategory: "Drink",
    recipeCuisine: "Coffee",
    recipeYield: `1 brew (${recipe.water_g}g)`,
    totalTime: iso_duration_seconds(total_seconds),
    keywords: `pour over, ${recipe.method}, ${recipe.name.toLowerCase()}, coffee recipe`,
    recipeIngredient: [
      `${recipe.coffee_g}g coffee, ${recipe.grind} grind`,
      `${recipe.water_g}g water at ${recipe.temp_c}°C`,
    ],
    recipeInstructions: recipe.stages.map((stage, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: stage.name,
      text: stage.note
        ? `${stage.name} — ${stage.pour_g > 0 ? `pour ${stage.pour_g}g to ${stage.cumulative_g}g total. ` : ""}${stage.note}`
        : `${stage.name} — ${stage.pour_g > 0 ? `pour ${stage.pour_g}g to ${stage.cumulative_g}g total. ` : `wait ${stage.duration}s.`}`,
    })),
    author: {
      "@type": "Person",
      name: recipe.source,
    },
  };
}

/**
 * Recipe schema for the 25-second espresso shot preset.
 */
export function build_espresso_recipe_ld(opts: {
  name: string;
  description: string;
  target_min: number;
  target_max: number;
  dose_g: number;
  yield_g: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: opts.name,
    description: opts.description,
    recipeCategory: "Drink",
    recipeCuisine: "Coffee",
    recipeYield: `1 double shot (~${opts.yield_g}g)`,
    totalTime: iso_duration_seconds(opts.target_max),
    keywords: "espresso, espresso shot timer, 25 second shot, pre-infusion",
    recipeIngredient: [
      `${opts.dose_g}g espresso, fine grind`,
      `Filtered water in the boiler at 92-94°C`,
    ],
    recipeInstructions: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pre-infusion",
        text: "Start the timer when the pump engages. The 'pre-infusion' phase lasts until coffee first drips from the portafilter — typically 4-8 seconds.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Capture first drip",
        text: "Tap the 'First Drip' button the moment coffee appears at the portafilter spout. The timer captures this as a reference timestamp for the extraction phase.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Extraction",
        text: `Continue the shot until elapsed time reaches the ${opts.target_min}-${opts.target_max} second target window. Stop the pump when yield matches your recipe.`,
      },
    ],
  };
}
