import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Game Timer — Board Games, Turn Timer & Chess Clock",
  description:
    "Free game timers for board games, card games, and strategy games. Turn timers, chess clocks, and round timers — no download, no sign-up.",
  alternates: { canonical: "/game-timer" },
  openGraph: {
    title: "Free Online Game Timer — Board Games, Turn Timer & Chess Clock",
    description:
      "Free game timers for board games, card games, and strategy games. Turn timers, chess clocks, and round timers — no download, no sign-up.",
    url: "https://gotimer.org/game-timer",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Game Timer",
  url: "https://gotimer.org/game-timer",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online game timers for board games, turn-based games, chess clocks, and more.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Game Timer", item: "https://gotimer.org/game-timer" },
  ],
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
      {children}
    </>
  );
}
