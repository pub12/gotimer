import { Metadata } from "next";
import { RAID_COUNTDOWN_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Twitch Raid Countdown Timer — Free, No Signup",
  description:
    "Free 60-second raid countdown overlay for OBS, designed to line up cleanly with the Twitch /raid confirmation window. Transparent background, no signup.",
  alternates: { canonical: "/brb/raid-countdown" },
  openGraph: {
    title: "Twitch Raid Countdown Timer — Free, No Signup",
    description: "Free raid countdown for OBS Browser Source. Lines up with Twitch /raid confirmation.",
    url: "https://gotimer.org/brb/raid-countdown",
  },
  twitter: {
    card: "summary",
    title: "Twitch Raid Countdown — Free Overlay",
    description: "Free raid countdown for OBS. URL-configurable, no signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Twitch Raid Countdown",
  url: "https://gotimer.org/brb/raid-countdown",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Free transparent raid countdown overlay for OBS, designed to line up with Twitch /raid timing.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Streamer Tools", item: "https://gotimer.org/streamer-tools" },
    { "@type": "ListItem", position: 3, name: "BRB Overlay", item: "https://gotimer.org/brb" },
    { "@type": "ListItem", position: 4, name: "Raid Countdown", item: "https://gotimer.org/brb/raid-countdown" },
  ],
};

function strip_html(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: RAID_COUNTDOWN_FAQ.map((q) => ({
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
