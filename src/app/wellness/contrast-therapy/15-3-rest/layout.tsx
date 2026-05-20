import { Metadata } from "next";
import { FIFTEEN_THREE_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "15-3-1 Sauna Timer — Sauna-Heavy Contrast Therapy",
  description:
    "Free 15-3-1 contrast therapy timer: 15 minutes sauna, 3 minutes cold, 1 minute rest. 3 rounds, ends on cold. Sauna-heavy variant of the 11-Minute Cold Protocol.",
  alternates: {
    canonical: "/wellness/contrast-therapy/15-3-rest",
  },
  openGraph: {
    title: "15-3-1 Sauna Timer — Sauna-Heavy Contrast Therapy",
    description:
      "Free 15-3-1 timer: 15 min sauna, 3 min cold, 1 min rest. 3 rounds, ends on cold.",
    url: "https://gotimer.org/wellness/contrast-therapy/15-3-rest",
  },
  twitter: {
    card: "summary",
    title: "15 Minute Sauna + Cold Plunge Timer",
    description:
      "Free contrast therapy timer with 15 minute sauna and 3 minute cold plunge rounds.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer 15-3-1 Contrast Therapy Timer",
  url: "https://gotimer.org/wellness/contrast-therapy/15-3-rest",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free 15-3-1 contrast-therapy timer. Three rounds of 15 minutes sauna, 3 minutes cold plunge, and 1 minute rest, ending on cold. About 57 minutes total with 9 minutes of cold exposure per session.",
  featureList: [
    "Pre-loaded with the 15-3-1 sauna-heavy contrast sequence",
    "3 rounds, ends on cold to sustain the brown-fat signal",
    "9 minutes total cold exposure per session",
    "Audio cue at every phase transition",
    "Wake lock keeps screen on through the 57-minute session",
    "No download, account, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Contrast Therapy", item: "https://gotimer.org/wellness/contrast-therapy" },
    { "@type": "ListItem", position: 4, name: "15-3-1 Sauna Timer", item: "https://gotimer.org/wellness/contrast-therapy/15-3-rest" },
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
  mainEntity: FIFTEEN_THREE_FAQ.map((q) => ({
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
