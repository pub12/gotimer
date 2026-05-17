import { Metadata } from "next";
import { BRB_PRESET_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "Twitch BRB Timer — Free Transparent Countdown for OBS",
  description:
    "Free 'Be Right Back' countdown overlay for Twitch and OBS. 5-minute default, no signup, no watermark. Transparent background, URL-configurable.",
  alternates: { canonical: "/brb/be-right-back" },
  openGraph: {
    title: "Twitch BRB Timer — Free Transparent Countdown for OBS",
    description: "Free transparent BRB countdown for OBS Browser Source. No account, no watermark.",
    url: "https://gotimer.org/brb/be-right-back",
  },
  twitter: {
    card: "summary",
    title: "Twitch BRB Timer — Free Overlay",
    description: "Transparent BRB countdown for OBS. URL-configurable, no signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Twitch BRB Countdown",
  url: "https://gotimer.org/brb/be-right-back",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Free transparent BRB countdown overlay for OBS, Streamlabs, vMix, XSplit. URL-driven, no signup.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Streamer Tools", item: "https://gotimer.org/streamer-tools" },
    { "@type": "ListItem", position: 3, name: "BRB Overlay", item: "https://gotimer.org/brb" },
    { "@type": "ListItem", position: 4, name: "Be Right Back", item: "https://gotimer.org/brb/be-right-back" },
  ],
};

function strip_html(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BRB_PRESET_FAQ.map((q) => ({
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
