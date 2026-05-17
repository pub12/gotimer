import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eye Strain Timer — Free Screen-Break Reminder (No Install)",
  description:
    "Free eye-strain timer for office workers, students, and contact-lens wearers. Reminds you to look away from your screen on a schedule. Browser-based, no extension required.",
  alternates: {
    canonical: "/wellness/20-20-20-timer",
  },
  openGraph: {
    title: "Eye Strain Timer — Free Screen-Break Reminder",
    description:
      "Free eye-strain timer with browser notifications. Reduces ciliary muscle fatigue from sustained screen use.",
    url: "https://gotimer.org/wellness/eye-strain-timer",
  },
  twitter: {
    card: "summary",
    title: "Eye Strain Timer",
    description:
      "Free, no-install eye-strain timer with browser-notification reminders for long screen sessions.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Eye Strain Timer",
  url: "https://gotimer.org/wellness/eye-strain-timer",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online eye-strain timer that reminds you to look away from your screen on a schedule. Built around the 20-20-20 rule recommended by the American Academy of Ophthalmology.",
  featureList: [
    "Scheduled look-away reminders",
    "Audio chime and optional browser notifications",
    "Counts down in background tabs",
    "Configurable interval",
    "Free, no install",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "Eye Strain Timer", item: "https://gotimer.org/wellness/eye-strain-timer" },
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
