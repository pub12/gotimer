import { Metadata } from "next";
import { MULTI_PLAYER_TURN_TIMER_FAQ } from "./faq";
import { MultiPlayerTurnTimerHub } from "./hub";

export const metadata: Metadata = {
  title: "Multi-Player Board Game Turn Timer — Free, No Signup, Up to 8 Players",
  description:
    "Free turn timer for 3-8 players. Per-turn cap, time-bank chess-clock mode, or hybrid. Shareable URL with player names. No signup, cures analysis paralysis.",
  alternates: {
    canonical: "/board-games/multi-player-turn-timer",
  },
  openGraph: {
    title: "Multi-Player Board Game Turn Timer — Free, Up to 8 Players",
    description:
      "Free turn timer for 3-8 players. Per-turn, time-bank, or hybrid mode. Shareable URL with names baked in.",
    url: "https://gotimer.org/board-games/multi-player-turn-timer",
  },
  twitter: {
    card: "summary",
    title: "Multi-Player Board Game Turn Timer",
    description:
      "Free turn timer for 3-8 players. Per-turn, time-bank, or hybrid mode. No signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Multi-Player Board Game Turn Timer",
  url: "https://gotimer.org/board-games/multi-player-turn-timer",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free multi-player board game turn timer for 3-8 named players. Supports a per-turn cap (auto-advancing), a chess-clock-style time-bank mode, and a hybrid mode that drains the per-turn cap first and then the personal bank. Player names and settings are URL-encoded so links round-trip across a group.",
  featureList: [
    "3-8 named players with per-player tracking",
    "Per-turn, time-bank, and hybrid modes",
    "Shareable URL with player names baked in",
    "Pre-tuned presets for Twilight Imperium, Gloomhaven, Brass: Birmingham, and more",
    "Wake-lock keeps the screen on through long sessions",
    "Audio warning and chime on auto-advance",
    "Works on tablets placed in the middle of the table",
    "No signup, install, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Board Games",
      item: "https://gotimer.org/board-games",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Multi-Player Turn Timer",
      item: "https://gotimer.org/board-games/multi-player-turn-timer",
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
  mainEntity: MULTI_PLAYER_TURN_TIMER_FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: strip_html(q.answer),
    },
  })),
};

export default function Page() {
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
      <MultiPlayerTurnTimerHub />
    </>
  );
}
