import { Metadata } from "next";
import { EYE_STRAIN_FAQ } from "./faq";

export const metadata: Metadata = {
  title: "20-20-20 Rule Timer — Free Eye-Strain Break Reminder",
  description:
    "Free 20-20-20 rule timer for digital eye strain. Every 20 minutes, look 20 feet away for 20 seconds. Optional browser notifications. No download or extension required.",
  alternates: {
    canonical: "/wellness/20-20-20-timer",
  },
  openGraph: {
    title: "20-20-20 Rule Timer — Free Eye-Strain Break Reminder",
    description:
      "Free 20-20-20 rule timer for digital eye strain. Every 20 minutes, look 20 feet away for 20 seconds. Optional browser notifications.",
    url: "https://gotimer.org/wellness/20-20-20-timer",
  },
  twitter: {
    card: "summary",
    title: "20-20-20 Rule Timer",
    description:
      "Free eye-strain break timer. Every 20 minutes, look 20 feet away for 20 seconds. No install needed.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer 20-20-20 Rule Timer",
  url: "https://gotimer.org/wellness/20-20-20-timer",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online 20-20-20 rule timer to prevent digital eye strain. Reminds you every 20 minutes to look 20 feet away for 20 seconds, with optional browser notifications and audio cues.",
  featureList: [
    "20-minute focus / 20-second look-away cycle by default",
    "Optional browser notifications (tap to enable)",
    "Audio chime when each cycle ends",
    "Continues counting in background tabs",
    "Configurable reminder interval (10 / 20 / 30 / 45 / 60 min)",
    "No download, account, or extension required",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Wellness", item: "https://gotimer.org/wellness" },
    { "@type": "ListItem", position: 3, name: "20-20-20 Rule Timer", item: "https://gotimer.org/wellness/20-20-20-timer" },
  ],
};

const medicalLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  headline: "20-20-20 Rule Timer for Digital Eye Strain",
  about: {
    "@type": "MedicalCondition",
    name: "Digital Eye Strain",
    alternateName: "Computer Vision Syndrome",
  },
  audience: {
    "@type": "MedicalAudience",
    audienceType: "Patient",
  },
  lastReviewed: "2026-05-17",
  url: "https://gotimer.org/wellness/20-20-20-timer",
  citation: [
    "https://www.aao.org/eye-health/tips-prevention/computer-usage",
    "https://www.aoa.org/healthy-eyes/eye-and-vision-conditions/computer-vision-syndrome",
  ],
};

function strip_html(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: EYE_STRAIN_FAQ.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: strip_html(q.answer),
    },
  })),
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
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {children}
    </>
  );
}
