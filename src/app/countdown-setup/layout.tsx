import { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Free Countdown Timer for Board Games",
  description:
    "Set a countdown timer from 1 second to 60 minutes. Perfect for board game turns, trivia rounds, ADHD focus sessions, and Pomodoro technique. Free, no download, works on mobile.",
  alternates: {
    canonical: "/countdown-setup",
  },
  openGraph: {
    title: "Free Countdown Timer for Board Games",
    description:
      "Set a countdown timer from 1 second to 60 minutes. Perfect for board game turns, trivia rounds, and focus sessions. Free, no download.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Countdown Timer for Board Games",
    description:
      "Set a countdown timer from 1 second to 60 minutes. Perfect for board game turns, trivia rounds, and focus sessions. Free, no download.",
    images: ["/fight.jpg"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Countdown Timer Setup", item: "https://gotimer.org/countdown-setup" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Set Up a Countdown Timer for Board Games",
  description:
    "Use GoTimer to set up a countdown timer with audio alerts for your board game night.",
  step: [
    {
      "@type": "HowToStep",
      name: "Choose a duration",
      text: "Select a preset time (10s, 15s, 30s, or 60s) or use the slider to set any duration from 1 second to 60 minutes.",
    },
    {
      "@type": "HowToStep",
      name: "Start the timer",
      text: "Press the Start button to begin the countdown. The timer will display on a full-screen view.",
    },
    {
      "@type": "HowToStep",
      name: "Enable sound alerts",
      text: "Toggle the sound icon to hear audio beeps during the last 10 seconds and a longer tone when time is up.",
    },
  ],
  tool: {
    "@type": "HowToTool",
    name: "GoTimer web app",
  },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  // Static objects defined at module level - safe to serialize (no user input)
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbJsonLdString = JSON.stringify(breadcrumbJsonLd);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }}
      />
      <div className="w-full max-w-2xl mx-auto pt-12 md:pt-20 px-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Countdown Timer Setup" }]} />
      </div>
      {children}
    </>
  );
}
