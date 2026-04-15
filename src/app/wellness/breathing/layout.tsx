import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Breathing Exercise Timer — Box Breathing & 4-7-8 Technique | GoTimer",
  description:
    "Free online breathing exercise timer for box breathing, 4-7-8, and other controlled breathing techniques. Reduce stress, improve focus, and fall asleep faster. No app download needed.",
  alternates: {
    canonical: "/wellness/breathing",
  },
  openGraph: {
    title: "Free Breathing Exercise Timer — Box Breathing & 4-7-8 Technique | GoTimer",
    description:
      "Free online breathing exercise timer for box breathing, 4-7-8, and other controlled breathing techniques. Reduce stress, improve focus, and fall asleep faster.",
    url: "https://gotimer.org/wellness/breathing",
  },
  twitter: {
    card: "summary",
    title: "Breathing Exercise Timer | GoTimer",
    description:
      "Free breathing exercise timer with guided intervals for box breathing, 4-7-8, and deep breathing techniques.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Breathing Exercise Timer",
  url: "https://gotimer.org/wellness/breathing",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online breathing exercise timer with guided intervals for box breathing, 4-7-8 technique, and deep breathing sessions.",
  featureList: [
    "Box breathing guided intervals",
    "4-7-8 breathing technique support",
    "Customizable session duration",
    "Audio cues for phase transitions",
    "Full-screen display",
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
    { "@type": "ListItem", position: 3, name: "Breathing Timer", item: "https://gotimer.org/wellness/breathing" },
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
