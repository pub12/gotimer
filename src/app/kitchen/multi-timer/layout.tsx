import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Multi-Timer — Run Multiple Kitchen Timers at Once",
  description:
    "Free online multi-timer for running multiple countdowns simultaneously. Perfect for Thanksgiving dinner, multi-course meals, and meal prep. Name, edit, and track each timer independently. No app needed.",
  alternates: {
    canonical: "/kitchen/multi-timer",
  },
  openGraph: {
    title: "Free Multi-Timer — Run Multiple Kitchen Timers at Once",
    description:
      "Free online multi-timer for running multiple countdowns simultaneously. Perfect for complex meals and meal prep.",
    url: "https://gotimer.org/kitchen/multi-timer",
  },
  twitter: {
    card: "summary",
    title: "Multi-Timer",
    description:
      "Free multi-timer for running multiple countdowns at once. Perfect for cooking multiple dishes simultaneously.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Multi-Timer",
  url: "https://gotimer.org/kitchen/multi-timer",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online multi-timer for running multiple independent countdowns at once. Name each timer, start and pause individually or all at once.",
  featureList: [
    "Unlimited simultaneous timers",
    "Name each timer for easy tracking",
    "Individual start, pause, and reset controls",
    "Start All and Pause All bulk actions",
    "Edit timer names and durations mid-countdown",
    "Audio alerts when each timer completes",
    "Full-screen display",
    "Shareable timer links",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Kitchen", item: "https://gotimer.org/kitchen" },
    { "@type": "ListItem", position: 3, name: "Multi-Timer", item: "https://gotimer.org/kitchen/multi-timer" },
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
