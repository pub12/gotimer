import { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Free Turn Timer for Board Games - Round & Tournament Timer | GoTimer",
  description:
    "Track turns and rounds with a free board game turn timer. Perfect for tournament play, strategy games like Twilight Imperium, and timeboxing sessions. No download, works on mobile.",
  alternates: {
    canonical: "/round-timer-setup",
  },
  openGraph: {
    title: "Free Turn Timer for Board Games - Round & Tournament Timer | GoTimer",
    description:
      "Track turns and rounds with a free board game turn timer. Perfect for tournament play, strategy games, and timeboxing sessions.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Turn Timer for Board Games - Round & Tournament Timer | GoTimer",
    description:
      "Track turns and rounds with a free board game turn timer. Perfect for tournament play, strategy games, and timeboxing sessions.",
    images: ["/fight.jpg"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Round Timer Setup", item: "https://gotimer.org/round-timer-setup" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Use a Round Timer for Board Game Tournaments",
  description:
    "Use GoTimer's round timer to track total game time and individual round durations during tournament play.",
  step: [
    {
      "@type": "HowToStep",
      name: "Start the timer",
      text: "Press Start to begin tracking time. Both the total elapsed time and current round time start counting up.",
    },
    {
      "@type": "HowToStep",
      name: "End a round",
      text: "Press Round Reset to log the current round time and start a new round. The total timer continues running.",
    },
    {
      "@type": "HowToStep",
      name: "Review round history",
      text: "View all previous round times in the history list below the timer. Use this to analyze game pacing.",
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
      name: "What is a round timer for board games?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A round timer tracks both total elapsed time and individual round durations. Unlike a countdown, it counts up - you press a button to mark the end of each round. This is ideal for games like Twilight Imperium, Terraforming Mars, and Gloomhaven where you want to know how long each round takes without setting a fixed limit.",
      },
    },
    {
      "@type": "Question",
      name: "How do I time a board game tournament?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use GoTimer's round timer to track tournament rounds. Start the timer when the round begins, and press Round Reset when the round ends. The total timer keeps running across all rounds while you see individual round durations. This helps organizers stay on schedule and analyze game pacing.",
      },
    },
    {
      "@type": "Question",
      name: "What timer should I use for Twilight Imperium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Twilight Imperium games can run 4-12+ hours, so GoTimer's round timer is perfect. It tracks total game time and individual round durations without limits. You can see how long each strategy phase takes, helping players pace themselves. Many TI groups use the round timer to set soft time targets per round.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // JSON-LD: static module-level objects with no user input, safe for dangerouslySetInnerHTML
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbJsonLdString = JSON.stringify(breadcrumbJsonLd);
  const faqJsonLdString = JSON.stringify(faqJsonLd);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLdString }} />
      <div className="w-full max-w-2xl mx-auto pt-12 md:pt-20 px-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Round Timer Setup" }]} />
      </div>
      {children}
    </>
  );
}
