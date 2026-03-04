import { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Chess Clock Setup - GoTimer",
  description:
    "Configure a two-player chess clock. Set time per player for chess, Scrabble, or any turn-based game. Free online chess clock timer.",
  alternates: {
    canonical: "/chess-clock-setup",
  },
  openGraph: {
    title: "Chess Clock Setup - GoTimer",
    description:
      "Configure a two-player chess clock. Set time per player for chess, Scrabble, or any turn-based game.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Clock Setup - GoTimer",
    description:
      "Configure a two-player chess clock. Set time per player for chess, Scrabble, or any turn-based game.",
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long should a chess clock round be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard chess uses 5-10 minutes per player for blitz, 15-30 minutes for rapid, and 60+ minutes for classical. For board games like Scrabble or Go, 10-20 minutes per player is common. GoTimer lets you set any duration from 10 seconds to 60 minutes per player.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use a chess clock for Scrabble?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Chess clocks are widely used in competitive Scrabble. Tournament Scrabble typically uses 25 minutes per player. GoTimer's chess clock works perfectly - set the time, tap to switch after each word placement, and the clock tracks remaining time for both players.",
      },
    },
    {
      "@type": "Question",
      name: "What board games use a chess clock?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beyond chess, many two-player games benefit from a chess clock: Scrabble, Go, Blokus, Hive, Patchwork, 7 Wonders Duel, and Star Realms. Any turn-based game where you want to limit thinking time can use a chess clock to keep the game competitive and on schedule.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // All JSON-LD data is hardcoded at module level with no user input - safe to serialize
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbJsonLdString = JSON.stringify(breadcrumbJsonLd);
  const faqJsonLdString = JSON.stringify(faqJsonLd);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLdString }} />
      <div className="w-full max-w-2xl mx-auto pt-12 md:pt-20 px-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Chess Clock Setup" }]} />
      </div>
      {children}
    </>
  );
}
