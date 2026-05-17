import { Metadata } from "next";
import { ANALYSIS_PARALYSIS_FAQ } from "./faq";

const BASE = "https://gotimer.org";
const url = `${BASE}/board-games/analysis-paralysis-timer`;

export const metadata: Metadata = {
  title: "Analysis Paralysis Timer — Free Board Game Turn Timer",
  description:
    "Free analysis-paralysis timer for board games. 60-90 second per-turn cap, hybrid mode with personal bank for mixed-pace groups. No signup, shareable URL.",
  alternates: { canonical: "/board-games/analysis-paralysis-timer" },
  openGraph: {
    title: "Analysis Paralysis Timer — Free Board Game Turn Timer",
    description:
      "Free analysis-paralysis timer for board games. 60-90 second cap, hybrid mode with personal bank.",
    url,
  },
  twitter: {
    card: "summary",
    title: "Analysis Paralysis Timer",
    description: "Free board-game turn timer for AP-prone groups.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Analysis Paralysis Timer",
  url,
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free analysis-paralysis timer for board games. Per-turn, time-bank, and hybrid modes for 2-8 players. Designed to externalize the time-pressure conversation in AP-prone groups without singling anyone out.",
  featureList: [
    "Per-turn cap that chimes when time is up",
    "Hybrid mode for mixed-pace groups (cap + personal bank)",
    "Multiplayer chess-clock time-bank mode",
    "2-8 named players with per-player tracking",
    "Shareable URL with player names baked in",
    "No signup, install, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Board Games", item: `${BASE}/board-games` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Analysis Paralysis Timer",
      item: url,
    },
  ],
};

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

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ANALYSIS_PARALYSIS_FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: strip_html(q.answer),
    },
  })),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {children}
    </>
  );
}
