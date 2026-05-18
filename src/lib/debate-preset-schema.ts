/**
 * Server-side JSON-LD + Metadata helpers for the debate-timer and
 * toastmasters-timer preset routes.
 *
 * Mirrors tea-preset-schema.ts / coffee-preset-schema.ts. Each leaf route
 * emits 4 JSON-LD scripts (WebApplication + BreadcrumbList + FAQPage + HowTo),
 * the two hubs emit 3 (no HowTo on hub — it lives on the format leaves).
 */
import type { Metadata } from "next";
import type { DebateFormat } from "@/lib/debate-formats";
import type { ToastmastersPreset } from "@/lib/toastmasters-presets";

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

// ---------------------------------------------------------------------------
// Metadata builders (one for each hub)
// ---------------------------------------------------------------------------

export function build_debate_metadata(
  slug: string | null,
  meta: { title: string; description: string },
): Metadata {
  const path = slug
    ? `/productivity/debate-timer/${slug}`
    : "/productivity/debate-timer";
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

export function build_toastmasters_metadata(
  slug: string | null,
  meta: { title: string; description: string },
): Metadata {
  const path = slug
    ? `/productivity/toastmasters-timer/${slug}`
    : "/productivity/toastmasters-timer";
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

export function build_debate_web_app_ld(opts: {
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
// Breadcrumbs (one per hub)
// ---------------------------------------------------------------------------

export function build_debate_breadcrumb_ld(opts: {
  leaf_slug?: string;
  leaf_name?: string;
}) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    {
      "@type": "ListItem",
      position: 2,
      name: "Productivity",
      item: `${BASE}/productivity`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Debate Timer",
      item: `${BASE}/productivity/debate-timer`,
    },
  ];
  if (opts.leaf_slug && opts.leaf_name) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: opts.leaf_name,
      item: `${BASE}/productivity/debate-timer/${opts.leaf_slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function build_toastmasters_breadcrumb_ld(opts: {
  leaf_slug?: string;
  leaf_name?: string;
}) {
  const items: Array<Record<string, unknown>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    {
      "@type": "ListItem",
      position: 2,
      name: "Productivity",
      item: `${BASE}/productivity`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Toastmasters Timer",
      item: `${BASE}/productivity/toastmasters-timer`,
    },
  ];
  if (opts.leaf_slug && opts.leaf_name) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: opts.leaf_name,
      item: `${BASE}/productivity/toastmasters-timer/${opts.leaf_slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

// ---------------------------------------------------------------------------
// FAQPage (shared)
// ---------------------------------------------------------------------------

export function build_debate_faq_ld(faq: FaqItem[]) {
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
// HowTo — debate format
// ---------------------------------------------------------------------------

export function build_debate_format_howto_ld(fmt: DebateFormat) {
  const total_seconds = fmt.steps.reduce((sum, s) => sum + s.duration, 0);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to time a ${fmt.name} debate round`,
    description: `Run a complete ${fmt.name} round using the standard ${fmt.league} speech times (${fmt.summary}). Phases auto-advance; the judge can rewind or skip with manual controls.`,
    totalTime: iso_duration_seconds(total_seconds),
    supply: [
      { "@type": "HowToSupply", name: "Debaters and judge(s)" },
      { "@type": "HowToSupply", name: "Topic / resolution for the round" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Timer (this page) — projectable" },
      { "@type": "HowToTool", name: "Flow paper or laptop for argument tracking" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose the format and start",
        text: `Open the ${fmt.name} preset and press Start. The first phase begins immediately — ${fmt.steps[0].name}.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Let phases auto-advance",
        text: `Each speech, crossfire, and rebuttal advances automatically when the phase timer hits zero. The full round runs ${fmt.total_minutes} minutes of structured time.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Use manual controls when needed",
        text:
          "Pause when prep time is being used. Press Next Phase to advance early if a speaker yields back. Press Previous Phase to rewind if you advanced by mistake or the speech needs replaying.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Project for the room",
        text:
          "Press F to enter fullscreen mode. The countdown is readable to the back of a classroom at 1920×1080 and the stoplight panel signals 30-second and time-up warnings to the speaker.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Track prep time separately",
        text: `${fmt.name} gives ${Math.round(fmt.prep_seconds / 60)} minutes of prep per side. Pause the round timer while prep is running; resume when the speaker starts the next speech.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// HowTo — Toastmasters speech
// ---------------------------------------------------------------------------

export function build_toastmasters_howto_ld(preset: ToastmastersPreset) {
  const total_seconds = preset.red_seconds + preset.grace_seconds;
  const m = (n: number) =>
    `${Math.floor(n / 60)}:${(n % 60).toString().padStart(2, "0")}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to time a Toastmasters ${preset.name.toLowerCase()}`,
    description: `Run a Toastmasters ${preset.name} with the standard green/yellow/red signal cycle (${preset.tagline}). The timer auto-changes signal lights at each milestone.`,
    totalTime: iso_duration_seconds(total_seconds),
    supply: [
      { "@type": "HowToSupply", name: "Speaker and Toastmaster of the meeting" },
      { "@type": "HowToSupply", name: "Speech (for prepared speeches) or topic (for Table Topics)" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Timer (this page) — projectable or held by the timer role" },
      { "@type": "HowToTool", name: "Ballot for the timer&apos;s report" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open the preset and prepare the room",
        text: `Open the ${preset.name} preset and press Start when the speaker is at the lectern. The qualifying window is ${m(preset.green_seconds)} to ${m(preset.red_seconds)}.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: `Show the green signal at ${m(preset.green_seconds)}`,
        text: `When the timer reaches ${m(preset.green_seconds)}, the green light turns on. The speaker is now in the qualifying window and may finish at any point until the red light.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: `Show the yellow signal at ${m(preset.yellow_seconds)}`,
        text: `At ${m(preset.yellow_seconds)} the yellow light replaces the green. This is the speaker&apos;s cue to begin wrapping up.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: `Show the red signal at ${m(preset.red_seconds)}`,
        text: `At ${m(preset.red_seconds)} the red light flashes. The speaker should conclude immediately — going past the grace window disqualifies the speech in contest play.`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Report the time to the meeting",
        text:
          "Note the exact speaking time on your ballot. The Timer reports each speaker&apos;s qualifying status (under green, in window, or over red) when called on by the Toastmaster.",
      },
    ],
  };
}
