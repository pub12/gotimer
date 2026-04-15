import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Board Game Turn Timer — Multi-Player Countdown | GoTimer",
  description:
    "Free online turn timer for 2-8 players. Per-player countdown keeps board game nights moving. Customizable names, time limits, and audio alerts. No app download needed.",
  alternates: {
    canonical: "/board-games/turn-timer",
  },
  openGraph: {
    title: "Free Board Game Turn Timer — Multi-Player Countdown | GoTimer",
    description:
      "Free online turn timer for 2-8 players. Per-player countdown keeps board game nights moving. Customizable names, time limits, and audio alerts.",
    url: "https://gotimer.org/board-games/turn-timer",
  },
  twitter: {
    card: "summary",
    title: "Board Game Turn Timer | GoTimer",
    description:
      "Free online turn timer for 2-8 players with customizable names and per-player countdowns for board game nights.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Turn Timer",
  url: "https://gotimer.org/board-games/turn-timer",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online turn timer for 2-8 players. Per-player countdown with customizable names, time limits, and audio alerts for board game nights.",
  featureList: [
    "Support for 2-8 players",
    "Per-player countdown timer",
    "Customizable player names",
    "Adjustable time per turn",
    "Total time tracking per player",
    "Audio alerts when time expires",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Board Games", item: "https://gotimer.org/board-games" },
    { "@type": "ListItem", position: 3, name: "Turn Timer", item: "https://gotimer.org/board-games/turn-timer" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // JSON-LD is a static object we control - safe to serialize
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbLdString = JSON.stringify(breadcrumbLd);

  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: breadcrumbLdString }}
      />
      {children}
    </>
  );
}
