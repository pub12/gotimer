import { Metadata } from "next";
import { WIM_HOF_CONTRAST_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Wim Hof-style Contrast Timer — Breath Work + Cold Plunge",
  description:
    "Free Wim Hof-style contrast therapy timer: 3 min breath work, 2 min cold, 90 sec recovery. 3 rounds, ends on cold. No sauna required, no signup.",
  alternates: {
    canonical: "/wellness/contrast-therapy/wim-hof-style",
  },
  openGraph: {
    title: "Wim Hof-style Contrast Timer — Breath Work + Cold Plunge",
    description:
      "Free Wim Hof-style contrast timer. 3 min breath work, 2 min cold, 90 sec recovery. 3 rounds, ends on cold.",
    url: "https://gotimer.org/wellness/contrast-therapy/wim-hof-style",
  },
  twitter: {
    card: "summary",
    title: "Wim Hof-style Contrast Timer",
    description:
      "Breath work + cold plunge in 3 rounds. No sauna required.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Wim Hof-style Contrast Timer",
  url: "https://gotimer.org/wellness/contrast-therapy/wim-hof-style",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free Wim Hof-style contrast-therapy timer. Three rounds of 3 minutes breath work, 2 minutes cold immersion, and 90 seconds recovery, ending on cold. About 22 minutes total — no sauna required.",
  featureList: [
    "Pre-loaded with 3 breath/cold/recovery rounds",
    "Ends on cold to sustain the brown-fat signal",
    "Works with a cold shower at home if no plunge tank available",
    "Audio cue at every phase transition",
    "Wake lock keeps screen on through the session",
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
    { "@type": "ListItem", position: 4, name: "Wim Hof-style Contrast Timer", item: "https://gotimer.org/wellness/contrast-therapy/wim-hof-style" },
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
  mainEntity: WIM_HOF_CONTRAST_FAQ.map((q) => ({
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
