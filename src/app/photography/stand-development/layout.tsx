import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Stand Development Timer — Rodinal & Highly Dilute Developer Timing",
  description:
    "Free online stand development timer for film photography. Ambient countdown for Rodinal 1:100, HC-110, and other highly dilute developers with optional midpoint agitation reminders.",
  alternates: {
    canonical: "/photography/stand-development",
  },
  openGraph: {
    title: "Free Stand Development Timer — Rodinal & Highly Dilute Developer Timing",
    description:
      "Free stand development timer for Rodinal 1:100 and highly dilute developers. Ambient countdown with midpoint agitation reminders.",
    url: "https://gotimer.org/photography/stand-development",
  },
  twitter: {
    card: "summary",
    title: "Stand Development Timer",
    description:
      "Free ambient timer for stand and semi-stand film development with midpoint agitation alerts.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Stand Development Timer",
  url: "https://gotimer.org/photography/stand-development",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online stand development timer for film photographers using highly dilute developers like Rodinal 1:100. Includes midpoint agitation reminders and session notes.",
  featureList: [
    "Preset durations for semi-stand and full stand development",
    "Optional midpoint agitation reminder",
    "Session notes for recording film and developer details",
    "Ambient countdown display",
    "Audio alert at completion",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Photography", item: "https://gotimer.org/photography" },
    { "@type": "ListItem", position: 3, name: "Stand Development Timer", item: "https://gotimer.org/photography/stand-development" },
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
