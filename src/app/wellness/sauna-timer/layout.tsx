import { Metadata } from "next";
import { SAUNA_TIMER_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Sauna Timer — Free Online 15-Minute Session Tool",
  description:
    "Free online sauna timer for Finnish, infrared, and steam saunas. Adjustable session length, audio cue when time is up, screen stays on. No app needed.",
  alternates: {
    canonical: "/wellness/sauna-timer",
  },
  openGraph: {
    title: "Sauna Timer — Free Online 15-Minute Session Tool",
    description:
      "Free sauna timer for Finnish, infrared, and steam saunas. Adjustable session length with audio alerts.",
    url: "https://gotimer.org/wellness/sauna-timer",
  },
  twitter: {
    card: "summary",
    title: "Sauna Timer",
    description:
      "Free online sauna timer for Finnish, infrared, and steam saunas. No app required.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Sauna Timer",
  url: "https://gotimer.org/wellness/sauna-timer",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online sauna timer for Finnish, infrared, and steam saunas. Adjustable session length with audio cues and a wake lock that keeps the screen on for the entire round.",
  featureList: [
    "Adjustable session length (5 / 10 / 15 / 20 / 30 minutes)",
    "Audio alert when the session ends",
    "Wake-lock keeps the screen on through the round",
    "Works for Finnish, infrared, and steam saunas",
    "Direct cross-link to the 11-Minute Cold contrast-therapy protocol",
    "No download, account, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Sauna Timer", item: "https://gotimer.org/wellness/sauna-timer" },
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
  mainEntity: SAUNA_TIMER_FAQ.map((q) => ({
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
