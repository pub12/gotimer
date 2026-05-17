import { Metadata } from "next";

/**
 * SEO alias for the "obs countdown timer" head term.
 * Canonical points at /brb to consolidate ranking signal.
 */
export const metadata: Metadata = {
  title: "OBS Countdown Timer — Free, Transparent, No Watermark",
  description:
    "Free OBS countdown timer for Browser Source — transparent background, URL-configurable, no signup or watermark. Drop the URL into OBS and stream.",
  alternates: { canonical: "/brb" },
  openGraph: {
    title: "OBS Countdown Timer — Free, Transparent, No Watermark",
    description:
      "Free OBS countdown timer for Browser Source. Transparent background, no signup, no watermark.",
    url: "https://gotimer.org/brb",
  },
  twitter: {
    card: "summary",
    title: "Free OBS Countdown Timer",
    description: "Transparent countdown overlay for OBS. URL-configurable, no signup.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer OBS Countdown Timer",
  url: "https://gotimer.org/brb",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free OBS countdown timer for Browser Source. Transparent background, URL-configurable, no account.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Streamer Tools", item: "https://gotimer.org/streamer-tools" },
    { "@type": "ListItem", position: 3, name: "OBS Countdown Timer", item: "https://gotimer.org/streamer-tools/obs-countdown" },
  ],
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
      {children}
    </>
  );
}
