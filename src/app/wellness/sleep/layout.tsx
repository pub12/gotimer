import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Sleep Timer — Wind-Down Countdown for Better Rest",
  description:
    "Free online sleep countdown timer to build a consistent wind-down routine. Set your bedtime countdown, reduce screen time, and improve sleep quality. No app needed.",
  alternates: {
    canonical: "/wellness/sleep",
  },
  openGraph: {
    title: "Free Sleep Timer — Wind-Down Countdown for Better Rest",
    description:
      "Free online sleep countdown timer to build a consistent wind-down routine. Set your bedtime countdown and improve sleep quality.",
    url: "https://gotimer.org/wellness/sleep",
  },
  twitter: {
    card: "summary",
    title: "Sleep Timer",
    description:
      "Free sleep countdown timer for building a wind-down routine and improving sleep hygiene.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Sleep Timer",
  url: "https://gotimer.org/wellness/sleep",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online sleep countdown timer for building wind-down routines and improving sleep hygiene with customizable durations.",
  featureList: [
    "Customizable wind-down duration",
    "Gentle audio alert when time is up",
    "Full-screen display for bedside use",
    "Default 30-minute wind-down session",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Sleep Timer", item: "https://gotimer.org/wellness/sleep" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLdString = JSON.stringify(jsonLd);
  const breadcrumbLdString = JSON.stringify(breadcrumbLd);

  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: breadcrumbLdString }}
      />
      {children}
    </>
  );
}
