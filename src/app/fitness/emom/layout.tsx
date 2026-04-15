import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free EMOM Timer — Every Minute On the Minute Workout | GoTimer",
  description:
    "Free online EMOM timer for CrossFit and functional fitness. Set custom intervals and rounds, track your Every Minute On the Minute workouts with audio cues. No app needed.",
  alternates: {
    canonical: "/fitness/emom",
  },
  openGraph: {
    title: "Free EMOM Timer — Every Minute On the Minute Workout | GoTimer",
    description:
      "Free online EMOM timer for CrossFit and functional fitness. Set custom intervals and rounds, track your Every Minute On the Minute workouts with audio cues.",
    url: "https://gotimer.org/fitness/emom",
  },
  twitter: {
    card: "summary",
    title: "EMOM Timer | GoTimer",
    description:
      "Free online EMOM timer with custom intervals and audio alerts for CrossFit and functional fitness workouts.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer EMOM Timer",
  url: "https://gotimer.org/fitness/emom",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online EMOM timer for CrossFit and functional fitness workouts. Customizable intervals and rounds with audio alerts.",
  featureList: [
    "Customizable interval length",
    "Configurable number of rounds",
    "Audio cues at round transitions",
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
    { "@type": "ListItem", position: 2, name: "Fitness", item: "https://gotimer.org/fitness" },
    { "@type": "ListItem", position: 3, name: "EMOM Timer", item: "https://gotimer.org/fitness/emom" },
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
