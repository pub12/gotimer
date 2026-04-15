import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Study Timer — Pomodoro & Focus Session Countdown | GoTimer",
  description:
    "Free online study timer for Pomodoro-style focus sessions. Set custom study and break intervals, track deep work sessions, and boost productivity. No app download needed.",
  alternates: {
    canonical: "/productivity/study",
  },
  openGraph: {
    title: "Free Study Timer — Pomodoro & Focus Session Countdown | GoTimer",
    description:
      "Free online study timer for Pomodoro-style focus sessions. Set custom intervals and track deep work sessions.",
    url: "https://gotimer.org/productivity/study",
  },
  twitter: {
    card: "summary",
    title: "Study Timer | GoTimer",
    description:
      "Free study session timer with customizable focus intervals for Pomodoro technique and deep work.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Study Timer",
  url: "https://gotimer.org/productivity/study",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online study timer for Pomodoro-style focus sessions with customizable durations and audio alerts.",
  featureList: [
    "Customizable study session duration",
    "Default 45-minute focus session",
    "Audio alert when session ends",
    "Full-screen display for distraction-free studying",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Productivity", item: "https://gotimer.org/productivity" },
    { "@type": "ListItem", position: 3, name: "Study Timer", item: "https://gotimer.org/productivity/study" },
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
