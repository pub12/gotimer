import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Countdown Timer — Audio Alerts & Custom Duration",
  description:
    "Set a countdown timer from 1 second to 60 minutes. Audio beeps during the last 10 seconds. Perfect for board games, Pomodoro sessions, cooking, and ADHD focus.",
  alternates: {
    canonical: "/countdown",
  },
  openGraph: {
    title: "Free Online Countdown Timer — Audio Alerts & Custom Duration",
    description:
      "Set a countdown timer from 1 second to 60 minutes. Audio beeps during the last 10 seconds. Perfect for board games, Pomodoro sessions, cooking, and ADHD focus.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Countdown Timer — Audio Alerts & Custom Duration",
    description:
      "Set a countdown timer from 1 second to 60 minutes. Audio beeps during the last 10 seconds. Perfect for board games, Pomodoro sessions, cooking, and ADHD focus.",
    images: ["/fight.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Countdown Timer",
  url: "https://gotimer.org/countdown",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Set a countdown timer from 1 second to 60 minutes. Audio beeps during the last 10 seconds. Perfect for board games, Pomodoro sessions, cooking, and ADHD focus.",
  featureList: [
    "Custom duration from 1 second to 60 minutes",
    "Audio alert during final 10 seconds",
    "Full-screen display",
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
    { "@type": "ListItem", position: 3, name: "Countdown Timer", item: "https://gotimer.org/countdown" },
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
