import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Photo Walk Timer — Timed Photography Challenges & Sprint Shooting | GoTimer",
  description:
    "Free online photo walk timer for timed photography challenges. Set shooting and review intervals to push your creativity with structured photo sprints. No app download needed.",
  alternates: {
    canonical: "/photography/photo-walk",
  },
  openGraph: {
    title: "Free Photo Walk Timer — Timed Photography Challenges & Sprint Shooting | GoTimer",
    description:
      "Free photo walk timer for timed photography challenges. Shoot-and-review intervals to structure creative photo walks and sprint sessions.",
    url: "https://gotimer.org/photography/photo-walk",
  },
  twitter: {
    card: "summary",
    title: "Photo Walk Timer | GoTimer",
    description:
      "Free timed photography challenge timer with shoot/review intervals for creative photo walks.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Photo Walk Timer",
  url: "https://gotimer.org/photography/photo-walk",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online photo walk timer for timed photography challenges. Configurable shooting and review intervals with round tracking and audio cues.",
  featureList: [
    "Configurable shooting and review interval durations",
    "Adjustable number of rounds for session length",
    "Audio cues at interval transitions",
    "Skip button for flexible pacing",
    "Full-screen display for outdoor visibility",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Photography", item: "https://gotimer.org/photography" },
    { "@type": "ListItem", position: 3, name: "Photo Walk Timer", item: "https://gotimer.org/photography/photo-walk" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // JSON-LD is a static object we control - safe to serialize
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
