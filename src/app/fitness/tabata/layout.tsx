import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tabata Timer — 20/10 Interval Training Protocol | GoTimer",
  description:
    "Free online Tabata timer with the classic 20-second work, 10-second rest protocol for 8 rounds. Customizable intervals, audio cues, and full-screen display. No download required.",
  alternates: {
    canonical: "/fitness/tabata",
  },
  openGraph: {
    title: "Free Tabata Timer — 20/10 Interval Training Protocol | GoTimer",
    description:
      "Free online Tabata timer with the classic 20-second work, 10-second rest protocol. Customizable rounds and intervals with audio alerts.",
    url: "https://gotimer.org/fitness/tabata",
  },
  twitter: {
    card: "summary",
    title: "Tabata Timer | GoTimer",
    description:
      "Free online Tabata timer — 20s work, 10s rest, 8 rounds. Customizable intervals with audio cues for high-intensity training.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Tabata Timer",
  url: "https://gotimer.org/fitness/tabata",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online Tabata timer for high-intensity interval training. Classic 20/10 protocol with customizable work, rest, and round settings plus audio alerts.",
  featureList: [
    "Classic 20s work / 10s rest Tabata protocol",
    "Adjustable work and rest durations",
    "Configurable number of rounds",
    "Audio cues for work and rest transitions",
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
    { "@type": "ListItem", position: 3, name: "Tabata Timer", item: "https://gotimer.org/fitness/tabata" },
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
