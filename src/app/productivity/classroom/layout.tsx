import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Classroom Timer — Full-Screen Display for Teachers | GoTimer",
  description:
    "Free online classroom timer with large full-screen display. Perfect for activity transitions, group work, presentations, and exams. No app or install needed.",
  alternates: {
    canonical: "/productivity/classroom",
  },
  openGraph: {
    title: "Free Classroom Timer — Full-Screen Display for Teachers | GoTimer",
    description:
      "Free online classroom timer with large full-screen display for activity transitions, group work, and exams.",
    url: "https://gotimer.org/productivity/classroom",
  },
  twitter: {
    card: "summary",
    title: "Classroom Timer | GoTimer",
    description:
      "Free full-screen classroom timer for teachers. Manage transitions, group work, and exam timing.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Classroom Timer",
  url: "https://gotimer.org/productivity/classroom",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free online classroom timer with full-screen display for teachers. Manage activity transitions, group work, presentations, and exam timing.",
  featureList: [
    "Large full-screen countdown display",
    "Customizable duration for any activity",
    "Audio alert when time is up",
    "Works on projectors and smartboards",
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
    { "@type": "ListItem", position: 3, name: "Classroom Timer", item: "https://gotimer.org/productivity/classroom" },
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
