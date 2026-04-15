import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Egg Timer — Soft, Medium & Hard Boiled Presets | GoTimer",
  description:
    "Free online egg timer with presets for soft boiled (6 min), medium boiled (8 min), and hard boiled (10 min) eggs. Audio alerts for perfect eggs every time. No app needed.",
  alternates: {
    canonical: "/kitchen/eggs",
  },
  openGraph: {
    title: "Free Egg Timer — Soft, Medium & Hard Boiled Presets | GoTimer",
    description:
      "Free online egg timer with presets for soft, medium, and hard boiled eggs. Audio alerts for perfect results.",
    url: "https://gotimer.org/kitchen/eggs",
  },
  twitter: {
    card: "summary",
    title: "Egg Timer | GoTimer",
    description:
      "Free egg boiling timer with presets for soft, medium, and hard boiled eggs. Perfect results every time.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Egg Timer",
  url: "https://gotimer.org/kitchen/eggs",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online egg timer with one-tap presets for soft boiled, medium boiled, and hard boiled eggs. Audio alerts and visual countdown.",
  featureList: [
    "Soft boiled egg preset (6 minutes)",
    "Medium boiled egg preset (8 minutes)",
    "Hard boiled egg preset (10 minutes)",
    "Audio alert when eggs are ready",
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
    { "@type": "ListItem", position: 3, name: "Egg Timer", item: "https://gotimer.org/kitchen/eggs" },
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
