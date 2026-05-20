import { Metadata } from "next";
import { COLD_PLUNGE_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Cold Plunge Timer — Free Online 2-Minute Ice Bath Tool",
  description:
    "Free cold plunge timer for ice baths and cold water immersion. Research-backed default of 2 minutes, adjustable from 30 seconds to 5 minutes. Audio alert, no signup.",
  alternates: {
    canonical: "/wellness/cold-plunge-timer",
  },
  openGraph: {
    title: "Cold Plunge Timer — Free Online 2-Minute Ice Bath Tool",
    description:
      "Free cold plunge timer for ice baths and cold water immersion. 2-minute default, adjustable to 5 minutes.",
    url: "https://gotimer.org/wellness/cold-plunge-timer",
  },
  twitter: {
    card: "summary",
    title: "Cold Plunge Timer",
    description:
      "Free online cold plunge timer for ice baths. 2-minute default from the 11-Minute Cold Protocol. No signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Cold Plunge Timer",
  url: "https://gotimer.org/wellness/cold-plunge-timer",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online cold plunge timer for ice baths and cold-water immersion. Defaults to 2 minutes per the 11-Minute Cold Protocol, adjustable from 30 seconds to 5 minutes with audio cues at the start and end.",
  featureList: [
    "Adjustable duration (30 sec / 1 / 2 / 3 / 5 min)",
    "2-minute default per the 11-Minute Cold Protocol",
    "Loud audio alert at the end of the plunge",
    "Wake lock keeps the screen on for the whole round",
    "Cross-linked to the full contrast-therapy hub",
    "No download, account, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Cold Plunge Timer", item: "https://gotimer.org/wellness/cold-plunge-timer" },
  ],
};

function strip_html(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COLD_PLUNGE_FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: strip_html(q.answer),
    },
  })),
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
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {children}
    </>
  );
}
