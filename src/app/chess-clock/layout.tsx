import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Chess Clock — Two-Player Timer",
  description:
    "Free two-player chess clock with individual countdowns. Tap to switch turns. Works for chess, Scrabble, Go, and any turn-based board game.",
  alternates: {
    canonical: "/chess-clock",
  },
  openGraph: {
    title: "Free Online Chess Clock — Two-Player Timer",
    description:
      "Free two-player chess clock with individual countdowns. Tap to switch turns. Works for chess, Scrabble, Go, and any turn-based board game.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Chess Clock — Two-Player Timer",
    description:
      "Free two-player chess clock with individual countdowns. Tap to switch turns. Works for chess, Scrabble, Go, and any turn-based board game.",
    images: ["/fight.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Chess Clock",
  url: "https://gotimer.org/chess-clock",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free two-player chess clock with individual countdowns. Tap to switch turns. Works for chess, Scrabble, Go, and any turn-based board game.",
  featureList: [
    "Two independent player clocks",
    "Tap to switch turns",
    "Configurable time controls",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // JSON-LD is a static object we control - safe to serialize
  const jsonLdString = JSON.stringify(jsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      {children}
    </>
  );
}
