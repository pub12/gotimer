import { Metadata } from "next";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Free Countdown Timer for Board Games - GoTimer",
  description:
    "Set a countdown timer from 1 second to 60 minutes. Perfect for board game turns, trivia rounds, ADHD focus sessions, and Pomodoro technique. Free, no download, works on mobile.",
  alternates: {
    canonical: "/countdown-setup",
  },
  openGraph: {
    title: "Free Countdown Timer for Board Games - GoTimer",
    description:
      "Set a countdown timer from 1 second to 60 minutes. Perfect for board game turns, trivia rounds, and focus sessions. Free, no download.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Countdown Timer for Board Games - GoTimer",
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long should a countdown timer be for board games?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the game complexity. For party games like Codenames, 30-60 seconds per turn works well. For strategy games like Catan, 1-2 minutes gives players time to think. For trivia or speed rounds, 10-15 seconds adds excitement. GoTimer lets you set any duration from 1 second to 60 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best timer for Catan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Catan, a countdown timer set to 60-90 seconds per turn keeps the game moving without rushing decisions. Use GoTimer's countdown timer with audio alerts so players know when their time is running out. For tournament play, consider using the round timer to track total game time.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use a countdown timer on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! GoTimer works in any mobile browser - no app download needed. Just visit gotimer.org on your phone, set your timer duration, and tap Start. The timer fills the full screen and plays audio alerts so everyone at the table can see and hear it.",
      },
    },
    {
      "@type": "Question",
      name: "Is GoTimer good for ADHD focus and Pomodoro sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The countdown timer is perfect for ADHD focus sessions and Pomodoro technique. Set 25-minute focus blocks with audio alerts that gently notify you when time is up, so you don't need to constantly check the clock. The full-screen, distraction-free display helps you stay on task. Many users with ADHD find timed work blocks more manageable than open-ended sessions.",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // Static objects defined at module level - safe to serialize (no user input)
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbJsonLdString = JSON.stringify(breadcrumbJsonLd);
  const faqJsonLdString = JSON.stringify(faqJsonLd);
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLdString }}
      />
      <div className="w-full max-w-2xl mx-auto pt-12 md:pt-20 px-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Countdown Timer Setup" }]} />
      </div>
      {children}
    </>
  );
}
