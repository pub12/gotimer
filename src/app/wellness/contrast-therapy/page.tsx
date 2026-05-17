import { Metadata } from "next";
import { CONTRAST_THERAPY_FAQ } from "./faq";
import { ContrastTherapyTimer } from "./timer";

export const metadata: Metadata = {
  title: "Contrast Therapy Timer — Free Sauna + Cold Plunge Sequencer",
  description:
    "Free multi-phase contrast therapy timer with Søberg, 15-3-1, and Wim Hof-style presets. Sauna and cold-plunge sequencing, ends on cold. No signup.",
  alternates: {
    canonical: "/wellness/contrast-therapy",
  },
  openGraph: {
    title: "Contrast Therapy Timer — Free Sauna + Cold Plunge Sequencer",
    description:
      "Free multi-phase contrast therapy timer. Søberg, 15-3-1, and Wim Hof-style presets.",
    url: "https://gotimer.org/wellness/contrast-therapy",
  },
  twitter: {
    card: "summary",
    title: "Contrast Therapy Timer",
    description:
      "Free sauna + cold-plunge sequencer with Søberg, 15-3-1, and Wim Hof-style presets.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Contrast Therapy Timer",
  url: "https://gotimer.org/wellness/contrast-therapy",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free multi-phase contrast therapy timer for sauna and cold-plunge sequencing. Three pre-built protocols (Søberg, 15-3-1, Wim Hof-style) plus customizable phase lengths and cycle counts. Always ends on cold per the Søberg principle.",
  featureList: [
    "Three pre-built protocols (Søberg, 15-3-1, Wim Hof-style)",
    "Always ends on cold (Søberg principle)",
    "Audio cues at each phase transition",
    "Wake lock keeps the screen on through the session",
    "URL encodes the chosen preset for easy sharing",
    "Cross-linked to single-purpose sauna and cold-plunge timers",
    "No download, account, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Contrast Therapy Timer", item: "https://gotimer.org/wellness/contrast-therapy" },
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
  mainEntity: CONTRAST_THERAPY_FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: strip_html(q.answer),
    },
  })),
};

export default function Page() {
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
      <ContrastTherapyTimer />
    </>
  );
}
