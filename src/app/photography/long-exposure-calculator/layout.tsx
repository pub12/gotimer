import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Long Exposure Calculator — Reciprocity Failure Compensation | GoTimer",
  description:
    "Free online reciprocity failure calculator for long exposure film photography. Select your film stock, enter the metered exposure, and get the corrected time. Supports ND filters and 30+ film stocks.",
  alternates: {
    canonical: "/photography/long-exposure-calculator",
  },
  openGraph: {
    title: "Free Long Exposure Calculator — Reciprocity Failure Compensation | GoTimer",
    description:
      "Reciprocity failure calculator for long exposure film photography. Supports 30+ film stocks and ND filter compensation with integrated countdown timer.",
    url: "https://gotimer.org/photography/long-exposure-calculator",
  },
  twitter: {
    card: "summary",
    title: "Long Exposure Calculator | GoTimer",
    description:
      "Free reciprocity failure calculator with ND filter support and integrated countdown timer for film photography.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Long Exposure Calculator",
  url: "https://gotimer.org/photography/long-exposure-calculator",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online reciprocity failure calculator for long exposure film photography. Corrects metered exposure times for film sensitivity loss during extended exposures.",
  featureList: [
    "Reciprocity failure correction for 30+ film stocks",
    "ND filter compensation from ND2 to ND1000",
    "Grouped film stock selection by manufacturer",
    "Integrated countdown timer for corrected exposure",
    "Instant calculation with correction stop display",
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
    { "@type": "ListItem", position: 3, name: "Long Exposure Calculator", item: "https://gotimer.org/photography/long-exposure-calculator" },
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
