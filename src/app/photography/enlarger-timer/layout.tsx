import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Enlarger Timer — F-Stop Printing & Test Strips for Darkroom",
  description:
    "Free online enlarger timer for darkroom printing. Supports simple exposure, f-stop based timing, and sequential test strips with dry-down compensation. No app needed.",
  alternates: {
    canonical: "/photography/enlarger-timer",
  },
  openGraph: {
    title: "Free Enlarger Timer — F-Stop Printing & Test Strips for Darkroom",
    description:
      "Free online enlarger timer with f-stop printing, test strip sequencing, and dry-down compensation for darkroom photographers.",
    url: "https://gotimer.org/photography/enlarger-timer",
  },
  twitter: {
    card: "summary",
    title: "Enlarger Timer",
    description:
      "Free darkroom enlarger timer with f-stop timing, test strips, and dry-down compensation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Enlarger Timer",
  url: "https://gotimer.org/photography/enlarger-timer",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online darkroom enlarger timer with f-stop printing, sequential test strip exposures, and dry-down compensation for analog photographers.",
  featureList: [
    "Simple timed exposure mode",
    "F-stop based exposure timing with 1/3, 1/2, and full stop increments",
    "Sequential test strip mode with configurable strip count",
    "Dry-down compensation percentage adjustment",
    "Audio alert at exposure completion",
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
    { "@type": "ListItem", position: 3, name: "Enlarger Timer", item: "https://gotimer.org/photography/enlarger-timer" },
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
