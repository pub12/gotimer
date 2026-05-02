import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Interval Timer Online — HIIT, Tabata, EMOM & Custom",
  description:
    "Free online interval timer for HIIT, Tabata, and EMOM workouts. Configurable work and rest periods, audio cues, full-screen display — no download needed.",
  alternates: { canonical: "/interval-timer" },
  openGraph: {
    title: "Free Interval Timer Online — HIIT, Tabata, EMOM & Custom",
    description:
      "Free online interval timer for HIIT, Tabata, and EMOM workouts. Configurable work and rest periods, audio cues, full-screen display — no download needed.",
    url: "https://gotimer.org/interval-timer",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Interval Timer",
  url: "https://gotimer.org/interval-timer",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online interval timer for HIIT, Tabata, and EMOM training with configurable work/rest periods and audio cues.",
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Interval Timer", item: "https://gotimer.org/interval-timer" },
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
