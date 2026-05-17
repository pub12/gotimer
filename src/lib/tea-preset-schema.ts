/**
 * Server-side JSON-LD + Metadata helpers for the tea preset routes.
 *
 * Mirrors coffee-preset-schema.ts. Each tea leaf emits 4 JSON-LD scripts:
 * WebApplication, BreadcrumbList, FAQPage, and HowTo (for the brewing
 * instructions). The hub emits WebApplication, BreadcrumbList, FAQPage.
 */

import type { Metadata } from "next";
import type { TeaPreset } from "@/lib/tea-presets";

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

export function build_tea_metadata(
  slug: string,
  meta: { title: string; description: string },
): Metadata {
  const path = `/kitchen/tea-timer/${slug}`;
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

export function build_tea_web_app_ld(opts: {
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

export function build_tea_breadcrumb_ld(opts: {
  leaf_slug?: string;
  leaf_name?: string;
}) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Kitchen", item: `${BASE}/kitchen` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Tea Timer",
      item: `${BASE}/kitchen/tea-timer`,
    },
  ];
  if (opts.leaf_slug && opts.leaf_name) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: opts.leaf_name,
      item: `${BASE}/kitchen/tea-timer/${opts.leaf_slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function build_tea_faq_ld(faq: FaqItem[]) {
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
 * HowTo schema for a per-type tea brewing guide. Per-tea pages share the same
 * basic shape (heat water → measure leaf → steep → strain) with type-specific
 * temperature and time values.
 */
export function build_tea_howto_ld(tea: TeaPreset) {
  const minutes = Math.floor(tea.steep_seconds / 60);
  const seconds = tea.steep_seconds % 60;
  const time_phrase =
    minutes > 0 && seconds > 0
      ? `${minutes} min ${seconds} sec`
      : minutes > 0
        ? `${minutes} minute${minutes === 1 ? "" : "s"}`
        : `${seconds} seconds`;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to brew ${tea.name.toLowerCase()}`,
    description: `Brew ${tea.name.toLowerCase()} the right way: ${tea.temp_c}°C water, ${time_phrase} steep, ${tea.ratio} leaf ratio.`,
    totalTime: iso_duration_seconds(tea.steep_seconds + 90),
    supply: [
      {
        "@type": "HowToSupply",
        name: `${tea.name} (loose leaf or quality bag)`,
      },
      { "@type": "HowToSupply", name: "Filtered water" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Kettle with temperature control (or stovetop + thermometer)" },
      { "@type": "HowToTool", name: "Teapot, gaiwan, or infuser mug" },
      { "@type": "HowToTool", name: "Timer (this page)" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Heat water to the right temperature",
        text: `Heat filtered water to ${tea.temp_c}°C (${tea.temp_f}°F). Use a variable kettle, or boil and let cool — water drops about 5°C every 30 seconds in a kettle off the boil.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Measure the leaf",
        text: `Use ${tea.ratio}. A digital scale is more accurate than spoons because leaf density varies — Silver Needle and Sencha are fluffy; broken-leaf blends are dense.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Steep for the right time",
        text: `Pour the heated water over the leaves and start the timer for ${time_phrase}. Range: ${Math.floor(tea.steep_min / 60) || `${tea.steep_min}s`}-${Math.floor(tea.steep_max / 60) || `${tea.steep_max}s`} min depending on sub-variety and how strong you like it.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Strain immediately",
        text: `When the timer ends, separate leaves from water. Leaves left in cooling water continue to release tannins and bitterness — this is the single most common over-steeping mistake.`,
      },
    ],
  };
}

/**
 * HowTo schema for the gongfu cha multi-infusion method. Used by the
 * /kitchen/tea-timer/gongfu leaf.
 */
export function build_gongfu_howto_ld(opts: {
  total_minutes: number;
  infusion_count: number;
  rinse_seconds: number;
  infusion_seconds: number[];
}) {
  const ladder = opts.infusion_seconds
    .map((s, i) => `infusion ${i + 1}: ${s}s`)
    .join(", ");
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to brew gongfu cha (multi-infusion tea)",
    description:
      `Brew tea gongfu-style with ${opts.infusion_count} short infusions in a small gaiwan, using the timer to step through the progression (${ladder}).`,
    totalTime: iso_duration_seconds(opts.total_minutes * 60),
    supply: [
      { "@type": "HowToSupply", name: "Oolong, pu-erh, or aged white tea (5-8g)" },
      { "@type": "HowToSupply", name: "Filtered water at 95-100°C" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Gaiwan or small teapot (100-150ml)" },
      { "@type": "HowToTool", name: "Pitcher (gongdaobei) for decanting" },
      { "@type": "HowToTool", name: "Small tasting cups" },
      { "@type": "HowToTool", name: "Variable-temperature kettle" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Warm the vessel and rinse the leaves",
        text: `Pour hot water into the gaiwan to warm it, then discard. Add 5-8g of leaf. Fill with water and immediately decant — this ${opts.rinse_seconds}-second rinse opens the leaves and washes off processing dust.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Infusion 1 — short",
        text: `Refill the gaiwan and steep for ${opts.infusion_seconds[0]} seconds. Decant fully into the pitcher, then pour into tasting cups. Never leave water on the leaves between infusions.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Progressive infusions",
        text: `Each subsequent infusion gets longer as the leaves spend. The timer auto-advances: ${ladder}. Adjust by feel — taste between infusions and add 5-10s if the cup is thin, subtract if it is overpowering.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Know when to stop",
        text:
          "Most quality oolongs go 6-8 infusions; aged pu-erh can go 10-15+. Stop when the tea tastes thin or watery — at that point the leaves are spent.",
      },
    ],
  };
}
