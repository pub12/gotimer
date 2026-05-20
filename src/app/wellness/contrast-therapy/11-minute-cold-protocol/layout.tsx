import { Metadata } from "next";
import { ELEVEN_MIN_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "11-Minute Cold Protocol Timer — Free Contrast Therapy Tool",
  description:
    "Free 11-Minute Cold Protocol timer for sauna and cold-plunge contrast therapy. 3 rounds of 15-2-1, ends on cold, built around the 11-min weekly cold-exposure target. No signup.",
  alternates: {
    canonical: "/wellness/contrast-therapy/11-minute-cold-protocol",
  },
  openGraph: {
    title: "11-Minute Cold Protocol Timer — Free Contrast Therapy Tool",
    description:
      "Free 11-Minute Cold Protocol timer. 3 rounds of sauna and cold plunge, ends on cold.",
    url: "https://gotimer.org/wellness/contrast-therapy/11-minute-cold-protocol",
  },
  twitter: {
    card: "summary",
    title: "11-Minute Cold Protocol Timer",
    description:
      "Free 11-Minute Cold Protocol contrast-therapy timer. 3 rounds, ends on cold. No signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer 11-Minute Cold Protocol Timer",
  url: "https://gotimer.org/wellness/contrast-therapy/11-minute-cold-protocol",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free contrast-therapy timer built around the 11-minute weekly cold-exposure target from peer-reviewed cold-water immersion research. Three rounds of 15 minutes sauna, 2 minutes cold plunge at 0-15°C, and 1 minute rest — automatically ending on cold.",
  featureList: [
    "Pre-loaded with the 15-2-1, 3-round sequence",
    "Always ends on cold to sustain the brown-fat signal",
    "Audio cue at every phase transition",
    "Wake lock keeps screen on through the 55-minute session",
    "Round indicator and remaining-phase time always visible",
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
    { "@type": "ListItem", position: 4, name: "11-Minute Cold Protocol Timer", item: "https://gotimer.org/wellness/contrast-therapy/11-minute-cold-protocol" },
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
  mainEntity: ELEVEN_MIN_FAQ.map((q) => ({
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
