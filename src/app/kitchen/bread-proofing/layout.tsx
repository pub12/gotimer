import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Bread Proofing Timer — Dough Rise Countdown",
  description:
    "Free online bread proofing timer for tracking dough rise times. Supports first rise, second rise, sourdough, and cold fermentation. Audio alerts when proofing is complete. No app needed.",
  alternates: {
    canonical: "/kitchen/bread-proofing",
  },
  openGraph: {
    title: "Free Bread Proofing Timer — Dough Rise Countdown",
    description:
      "Free online bread proofing timer for tracking dough rise times. Supports all yeast types and fermentation methods.",
    url: "https://gotimer.org/kitchen/bread-proofing",
  },
  twitter: {
    card: "summary",
    title: "Bread Proofing Timer",
    description:
      "Free dough proofing timer for bread bakers. Track first rise, second rise, and cold fermentation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Bread Proofing Timer",
  url: "https://gotimer.org/kitchen/bread-proofing",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online bread proofing timer for tracking dough rise and fermentation times with customizable durations and audio alerts.",
  featureList: [
    "Customizable proofing duration",
    "Default 60-minute first rise timer",
    "Audio alert when proofing time completes",
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
    { "@type": "ListItem", position: 2, name: "Kitchen", item: "https://gotimer.org/kitchen" },
    { "@type": "ListItem", position: 3, name: "Bread Proofing Timer", item: "https://gotimer.org/kitchen/bread-proofing" },
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
