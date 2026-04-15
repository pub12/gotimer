import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Cyanotype Timer — UV Exposure Timer for Alternative Process Printing | GoTimer",
  description:
    "Free online cyanotype UV exposure timer. Time your cyanotype, Van Dyke brown, and other alternative photographic processes with precision. Adjustable duration for varying UV conditions.",
  alternates: {
    canonical: "/photography/cyanotype",
  },
  openGraph: {
    title: "Free Cyanotype Timer — UV Exposure Timer for Alternative Process Printing | GoTimer",
    description:
      "Free cyanotype UV exposure timer for alternative photographic processes. Adjustable duration for sunlight and UV lamp exposures.",
    url: "https://gotimer.org/photography/cyanotype",
  },
  twitter: {
    card: "summary",
    title: "Cyanotype Timer | GoTimer",
    description:
      "Free UV exposure timer for cyanotype and alternative process printing with adjustable duration.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Cyanotype Timer",
  url: "https://gotimer.org/photography/cyanotype",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online UV exposure timer for cyanotype and alternative photographic printing processes. Adjustable countdown for varying UV intensity and paper types.",
  featureList: [
    "Adjustable countdown duration for different UV conditions",
    "Audio alert when exposure is complete",
    "Works for cyanotype, Van Dyke brown, and other UV-sensitive processes",
    "Full-screen display for darkroom use",
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
    { "@type": "ListItem", position: 3, name: "Cyanotype Timer", item: "https://gotimer.org/photography/cyanotype" },
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
