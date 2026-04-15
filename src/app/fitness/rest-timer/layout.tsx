import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Rest Timer — Countdown Between Sets for Strength Training | GoTimer",
  description:
    "Free online rest timer for gym workouts. Time your rest periods between sets with preset durations for hypertrophy, strength, and power training. Audio alerts and full-screen display.",
  alternates: {
    canonical: "/fitness/rest-timer",
  },
  openGraph: {
    title: "Free Rest Timer — Countdown Between Sets for Strength Training | GoTimer",
    description:
      "Free online rest timer for timing recovery between sets. Preset durations for hypertrophy, strength, and power goals with audio alerts.",
    url: "https://gotimer.org/fitness/rest-timer",
  },
  twitter: {
    card: "summary",
    title: "Rest Timer | GoTimer",
    description:
      "Free online rest timer for gym workouts. Time your recovery between sets with audio cues for strength, hypertrophy, and power training.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Rest Timer",
  url: "https://gotimer.org/fitness/rest-timer",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online rest timer for timing recovery between sets during gym workouts. Configurable countdown with audio alerts for strength, hypertrophy, and power training.",
  featureList: [
    "Adjustable rest duration",
    "Audio alert when rest period ends",
    "Full-screen countdown display",
    "One-tap start for quick use between sets",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Fitness", item: "https://gotimer.org/fitness" },
    { "@type": "ListItem", position: 3, name: "Rest Timer", item: "https://gotimer.org/fitness/rest-timer" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
