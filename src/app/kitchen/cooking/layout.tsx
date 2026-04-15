import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Cooking Timer — Kitchen Countdown with Presets",
  description:
    "Free online cooking timer with quick presets for common cooking times. Set 5, 10, 15, 20, 30, 45, or 60 minute countdowns. Audio alerts and full-screen display. No app needed.",
  alternates: {
    canonical: "/kitchen/cooking",
  },
  openGraph: {
    title: "Free Cooking Timer — Kitchen Countdown with Presets",
    description:
      "Free online cooking timer with quick presets for common kitchen tasks. Audio alerts and full-screen display.",
    url: "https://gotimer.org/kitchen/cooking",
  },
  twitter: {
    card: "summary",
    title: "Cooking Timer",
    description:
      "Free cooking timer with quick presets for 5 to 60 minutes. Audio alerts so you never overcook.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Cooking Timer",
  url: "https://gotimer.org/kitchen/cooking",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online cooking timer with quick presets for common cooking times. Audio alerts and full-screen kitchen display.",
  featureList: [
    "Quick presets for 5, 10, 15, 20, 30, 45, and 60 minutes",
    "Custom duration input",
    "Audio alert when timer completes",
    "Full-screen display for kitchen visibility",
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
    { "@type": "ListItem", position: 3, name: "Cooking Timer", item: "https://gotimer.org/kitchen/cooking" },
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
