/**
 * Server-side JSON-LD + Metadata helpers for the /classroom toolkit routes.
 *
 * Mirrors src/lib/debate-preset-schema.ts. The classroom tools are NOT timers
 * (no TimerPage shell, no preset/strategy registration), so we hand-roll the
 * schema instead of reusing the timer-shaped helpers.
 *
 * Each leaf route emits 3 JSON-LD scripts (WebApplication + BreadcrumbList +
 * FAQPage). The hub adds a 4th (ItemList of the four tools).
 */
import type { Metadata } from "next";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolListItem {
  position: number;
  name: string;
  url_path: string;
  description: string;
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

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export function build_classroom_metadata(
  path_after_classroom: string | null,
  meta: { title: string; description: string },
): Metadata {
  const path = path_after_classroom
    ? `/classroom/${path_after_classroom}`
    : "/classroom";
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

// ---------------------------------------------------------------------------
// WebApplication
// ---------------------------------------------------------------------------

export function build_classroom_web_app_ld(opts: {
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
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: opts.description,
    featureList: opts.features,
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export interface BreadcrumbCrumb {
  name: string;
  path: string;
}

export function build_classroom_breadcrumb_ld(crumbs: BreadcrumbCrumb[]) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    {
      "@type": "ListItem",
      position: 2,
      name: "Classroom Tools",
      item: `${BASE}/classroom`,
    },
  ];
  crumbs.forEach((c, i) => {
    items.push({
      "@type": "ListItem",
      position: 3 + i,
      name: c.name,
      item: `${BASE}${c.path}`,
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// ---------------------------------------------------------------------------
// FAQPage
// ---------------------------------------------------------------------------

export function build_classroom_faq_ld(faq: FaqItem[]) {
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

// ---------------------------------------------------------------------------
// ItemList — hub only, enumerates the four tools for carousel rich results
// ---------------------------------------------------------------------------

export function build_classroom_itemlist_ld(items: ToolListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Classroom Tools for Teachers",
    itemListElement: items.map((it) => ({
      "@type": "ListItem",
      position: it.position,
      name: it.name,
      url: `${BASE}${it.url_path}`,
      description: it.description,
    })),
  };
}
