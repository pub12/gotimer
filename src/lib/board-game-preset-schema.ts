/**
 * Server-side JSON-LD + Metadata helpers for the per-game preset routes.
 */

import type { Metadata } from "next";
import type { BoardGamePreset } from "@/lib/board-game-presets";

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

export function build_preset_metadata(
  preset: BoardGamePreset,
  meta: { title: string; description: string },
): Metadata {
  const url = `${BASE}/board-games/multi-player-turn-timer/${preset.slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/board-games/multi-player-turn-timer/${preset.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function build_preset_web_app_ld(preset: BoardGamePreset, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `GoTimer ${preset.name} Turn Timer`,
    url: `${BASE}/board-games/multi-player-turn-timer/${preset.slug}`,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description,
    featureList: [
      `Pre-tuned for ${preset.name} (${preset.number_of_players} players)`,
      "Per-turn, time-bank, and hybrid modes",
      "Shareable URL with player names baked in",
      "Wake-lock keeps the screen on through long sessions",
      "Audio warning before turn cap expires",
      "No signup, install, or extension required",
    ],
  };
}

export function build_preset_breadcrumb_ld(preset: BoardGamePreset) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Board Games",
        item: `${BASE}/board-games`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Multi-Player Turn Timer",
        item: `${BASE}/board-games/multi-player-turn-timer`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${preset.name} Turn Timer`,
        item: `${BASE}/board-games/multi-player-turn-timer/${preset.slug}`,
      },
    ],
  };
}

export function build_preset_faq_ld(faq: FaqItem[]) {
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

export function build_preset_game_ld(preset: BoardGamePreset) {
  const game: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: preset.official_name,
    numberOfPlayers: preset.number_of_players,
    url: preset.bgg_url,
  };
  if (preset.alternate_names && preset.alternate_names.length > 0) {
    game.alternateName = preset.alternate_names;
  }
  return game;
}
