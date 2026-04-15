import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Film Development Timer — B&W, C-41 & E-6 Process Timing",
  description:
    "Free online film development timer with multi-step sequencing for B&W, C-41, and E-6 processes. Built-in agitation reminders, push/pull compensation, and temperature adjustments. No app download required.",
  alternates: {
    canonical: "/photography/film-development",
  },
  openGraph: {
    title: "Free Film Development Timer — B&W, C-41 & E-6 Process Timing",
    description:
      "Free online film development timer with multi-step sequencing for B&W, C-41, and E-6 processes. Agitation reminders, push/pull compensation, and temperature adjustments.",
    url: "https://gotimer.org/photography/film-development",
  },
  twitter: {
    card: "summary",
    title: "Film Development Timer",
    description:
      "Multi-step film development timer for B&W, C-41, and E-6 with agitation alerts and temperature compensation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Film Development Timer",
  url: "https://gotimer.org/photography/film-development",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online film development timer for darkroom photographers. Supports B&W, C-41, and E-6 processes with agitation reminders and temperature compensation.",
  featureList: [
    "Multi-step sequential timing for complete development workflows",
    "Built-in agitation interval reminders",
    "Push and pull processing compensation",
    "Temperature-based time adjustments",
    "Pre-loaded recipes for popular film and developer combinations",
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
    { "@type": "ListItem", position: 3, name: "Film Development Timer", item: "https://gotimer.org/photography/film-development" },
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
