import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Break Reminder — Free, No Extension Required",
  description:
    "Free screen-break reminder that nudges you to look away every 20 minutes. Browser-based, optional notifications, runs in any tab. Built on the 20-20-20 rule.",
  alternates: {
    canonical: "/wellness/20-20-20-timer",
  },
  openGraph: {
    title: "Screen Break Reminder — Free, No Extension Required",
    description:
      "Free screen-break reminder for office workers and students. Optional browser notifications, no install.",
    url: "https://gotimer.org/wellness/screen-break-reminder",
  },
  twitter: {
    card: "summary",
    title: "Screen Break Reminder",
    description:
      "Free browser-based screen-break reminder. Nudges you to look away every 20 minutes.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Screen Break Reminder",
  url: "https://gotimer.org/wellness/screen-break-reminder",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online screen-break reminder. Plays a chime and (optionally) fires a browser notification every 20 minutes to remind you to look away from your screen.",
  featureList: [
    "Scheduled screen-break reminders",
    "Audio chime + optional browser notifications",
    "Counts down in background tabs",
    "Configurable interval (10/20/30/45/60 min)",
    "No install or browser extension",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Screen Break Reminder", item: "https://gotimer.org/wellness/screen-break-reminder" },
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
