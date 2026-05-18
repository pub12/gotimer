/**
 * Server-side JSON-LD + Metadata helpers for the /embed niche pages.
 *
 * Mirrors src/lib/classroom-tool-schema.ts. The /embed pages target
 * "embed countdown timer", "iframe timer", and platform-specific
 * keywords ("embed timer wordpress", "shopify countdown timer", etc.).
 *
 * Each leaf route emits 3-4 JSON-LD scripts:
 *   - WebApplication (always)
 *   - BreadcrumbList (always)
 *   - FAQPage       (always — one per page)
 *   - HowTo         (platform-specific landing pages only — WordPress, Shopify, Notion)
 *
 * Schema is hand-rolled rather than going through the timer-page schema
 * helpers because these are not timers (no TimerPage shell, no preset
 * registration). Same nested-layout-duplication trap as classroom: keep
 * JSON-LD in page.tsx, not in a parent layout, to avoid doubled scripts.
 */
import type { Metadata } from "next";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
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

export function build_embed_metadata(
  path_after_embed: string | null,
  meta: { title: string; description: string },
): Metadata {
  const path = path_after_embed ? `/embed/${path_after_embed}` : "/embed";
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

export function build_embed_web_app_ld(opts: {
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
    applicationCategory: "WebApplication",
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

export function build_embed_breadcrumb_ld(crumbs: BreadcrumbCrumb[]) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    {
      "@type": "ListItem",
      position: 2,
      name: "Embed Widgets",
      item: `${BASE}/embed`,
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

export function build_embed_faq_ld(faq: FaqItem[]) {
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
// HowTo — for platform-specific install guides
// ---------------------------------------------------------------------------

export function build_embed_howto_ld(opts: {
  name: string;
  description: string;
  total_time_iso?: string;
  steps: HowToStep[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.total_time_iso ? { totalTime: opts.total_time_iso } : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: strip_html(s.text),
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}
