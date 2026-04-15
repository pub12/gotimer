import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Intermittent Fasting Timer — 16:8, 18:6, 20:4, OMAD Tracker",
  description:
    "Free online intermittent fasting timer and tracker. Support for 16:8, 18:6, 20:4, and OMAD protocols. Track your fasting window with audio alerts. No app download needed.",
  alternates: {
    canonical: "/wellness/fasting",
  },
  openGraph: {
    title: "Free Intermittent Fasting Timer — 16:8, 18:6, 20:4, OMAD Tracker",
    description:
      "Free online intermittent fasting timer with preset protocols. Track your fasting window with audio alerts and visual countdown.",
    url: "https://gotimer.org/wellness/fasting",
  },
  twitter: {
    card: "summary",
    title: "Intermittent Fasting Timer",
    description:
      "Free fasting timer with 16:8, 18:6, 20:4, and OMAD presets. Track your fasting window online.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Intermittent Fasting Timer",
  url: "https://gotimer.org/wellness/fasting",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online intermittent fasting timer with presets for 16:8, 18:6, 20:4, and OMAD protocols. Visual countdown and audio alerts.",
  featureList: [
    "Pre-built fasting protocol presets (12h, 14h, 16h, 18h, 20h, 24h)",
    "Custom duration input",
    "Audio alert when fasting window ends",
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
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Fasting Timer", item: "https://gotimer.org/wellness/fasting" },
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
