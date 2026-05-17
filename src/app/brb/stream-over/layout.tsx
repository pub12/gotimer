import { Metadata } from "next";
import { STREAM_OVER_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Stream Ending Countdown Screen — Free OBS Overlay",
  description:
    "Free 2-minute stream-ending countdown overlay for OBS. Transparent background, no signup. Pair with /raid for a clean goodbye handoff.",
  alternates: { canonical: "/brb/stream-over" },
  openGraph: {
    title: "Stream Ending Countdown Screen — Free OBS Overlay",
    description: "Free wind-down countdown for OBS Browser Source. No account, no watermark.",
    url: "https://gotimer.org/brb/stream-over",
  },
  twitter: {
    card: "summary",
    title: "Stream Ending Countdown — Free OBS Overlay",
    description: "Transparent goodbye countdown for OBS. URL-configurable, no signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Stream Ending Countdown",
  url: "https://gotimer.org/brb/stream-over",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Free transparent stream-ending countdown overlay for OBS, Streamlabs, vMix, XSplit.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Streamer Tools", item: "https://gotimer.org/streamer-tools" },
    { "@type": "ListItem", position: 3, name: "BRB Overlay", item: "https://gotimer.org/brb" },
    { "@type": "ListItem", position: 4, name: "Stream Ending", item: "https://gotimer.org/brb/stream-over" },
  ],
};

function strip_html(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: STREAM_OVER_FAQ.map((q) => ({
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
