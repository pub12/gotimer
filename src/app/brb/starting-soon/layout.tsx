import { Metadata } from "next";
import { STARTING_SOON_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "OBS Starting Soon Countdown — Transparent, Free, No Watermark",
  description:
    "Free 'Starting Soon' countdown overlay for OBS. 5-minute default, customizable via URL. Transparent background, no signup, no watermark.",
  alternates: { canonical: "/brb/starting-soon" },
  openGraph: {
    title: "OBS Starting Soon Countdown — Transparent, Free, No Watermark",
    description:
      "Free 'Starting Soon' countdown overlay for OBS Browser Source. URL-configurable, no account, no watermark.",
    url: "https://gotimer.org/brb/starting-soon",
  },
  twitter: {
    card: "summary",
    title: "OBS Starting Soon Countdown",
    description: "Free transparent countdown overlay for OBS, no signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Stream Starting Soon Countdown",
  url: "https://gotimer.org/brb/starting-soon",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free transparent 'Starting Soon' countdown overlay for OBS, Streamlabs, vMix, and XSplit. URL-driven, no signup, no watermark.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Streamer Tools", item: "https://gotimer.org/streamer-tools" },
    { "@type": "ListItem", position: 3, name: "BRB Overlay", item: "https://gotimer.org/brb" },
    { "@type": "ListItem", position: 4, name: "Stream Starting Soon", item: "https://gotimer.org/brb/starting-soon" },
  ],
};

function strip_html(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: STARTING_SOON_FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: strip_html(q.answer) },
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
