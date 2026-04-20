import { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Free Online Chess Clock - Timer for Two Players",
  description:
    "Play chess with a free online chess clock. Set custom time limits per player for chess, Scrabble, Go, or any two-player board game. No download, works on mobile.",
  alternates: {
    canonical: "/chess-clock-setup",
  },
  openGraph: {
    title: "Free Online Chess Clock - Timer for Two Players",
    description:
      "Play chess with a free online chess clock. Set custom time limits per player for chess, Scrabble, Go, or any two-player board game.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Chess Clock - Timer for Two Players",
    description:
      "Play chess with a free online chess clock. Set custom time limits per player for chess, Scrabble, Go, or any two-player board game.",
    images: ["/fight.jpg"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Chess Clock Setup", item: "https://gotimer.org/chess-clock-setup" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Set Up a Chess Clock for Board Games",
  description:
    "Use GoTimer to set up a two-player chess clock with customizable time limits.",
  step: [
    {
      "@type": "HowToStep",
      name: "Choose time per player",
      text: "Select a preset time (2m, 5m, 10m, 20m, 30m, or 60m) or use the slider to set any duration from 10 seconds to 60 minutes per player.",
    },
    {
      "@type": "HowToStep",
      name: "Start the clock",
      text: "Press Start to begin. Player 1's clock starts counting down immediately.",
    },
    {
      "@type": "HowToStep",
      name: "Switch turns",
      text: "After making a move, tap the active player's button to switch the clock to the other player.",
    },
    {
      "@type": "HowToStep",
      name: "Monitor time",
      text: "Audio beeps play every 30 seconds, every second in the last 10 seconds, and a long tone when a player runs out of time.",
    },
  ],
  tool: {
    "@type": "HowToTool",
    name: "GoTimer web app",
  },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  // All JSON-LD data is hardcoded at module level with no user input - safe to serialize
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbJsonLdString = JSON.stringify(breadcrumbJsonLd);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} />
      <div className="w-full max-w-2xl mx-auto pt-12 md:pt-20 px-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Chess Clock Setup" }]} />
      </div>
      {children}
    </>
  );
}
