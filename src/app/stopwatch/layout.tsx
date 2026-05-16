import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Stopwatch — Lap Times & Centisecond Accuracy",
  description:
    "Free online stopwatch with lap splits, centisecond display, and no app install. Works on iPhone, Android, and desktop. Perfect for running, study, and presentations.",
  alternates: { canonical: "/stopwatch" },
  openGraph: {
    title: "Free Online Stopwatch — Lap Times & Centisecond Accuracy",
    description:
      "Free online stopwatch with lap splits, centisecond display, and no app install. Works on iPhone, Android, and desktop.",
    url: "https://gotimer.org/stopwatch",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Stopwatch — Lap Times & Centisecond Accuracy",
    description:
      "Free online stopwatch with lap splits and centisecond display. No app install.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Stopwatch",
  url: "https://gotimer.org/stopwatch",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online stopwatch with lap splits, centisecond display, and full mobile support.",
  featureList: [
    "Centisecond display (10 updates per second)",
    "Lap splits with cumulative and split times",
    "Persists across page refreshes (localStorage)",
    "Drift-resistant timestamp-based timing",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Stopwatch", item: "https://gotimer.org/stopwatch" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
