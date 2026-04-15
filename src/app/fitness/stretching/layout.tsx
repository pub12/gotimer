import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Stretching Timer — Hold Timer for Flexibility Training",
  description:
    "Free online stretching timer with customizable hold durations. Perfect for static stretches, yoga poses, and mobility work. Audio alerts signal when to switch. No app needed.",
  alternates: {
    canonical: "/fitness/stretching",
  },
  openGraph: {
    title: "Free Stretching Timer — Hold Timer for Flexibility Training",
    description:
      "Free online stretching timer with adjustable hold durations for static stretches, yoga, and mobility routines. Audio cues and full-screen display.",
    url: "https://gotimer.org/fitness/stretching",
  },
  twitter: {
    card: "summary",
    title: "Stretching Timer",
    description:
      "Free online stretching hold timer with customizable durations and audio alerts for flexibility and mobility work.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Stretching Timer",
  url: "https://gotimer.org/fitness/stretching",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online stretching and hold timer for flexibility training. Set custom durations for static stretches, yoga poses, and mobility exercises with audio alerts.",
  featureList: [
    "Customizable hold duration",
    "Audio alert when time is up",
    "Full-screen display for easy viewing",
    "Simple one-tap start and reset",
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
    { "@type": "ListItem", position: 3, name: "Stretching Timer", item: "https://gotimer.org/fitness/stretching" },
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
