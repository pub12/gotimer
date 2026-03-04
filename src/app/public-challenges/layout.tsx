import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Game Challenges - GoTimer",
  description:
    "Browse public board game challenges. See scores, game history, and competitive matchups between players. Track your favorite rivalries.",
  alternates: {
    canonical: "/public-challenges",
  },
  openGraph: {
    title: "Public Game Challenges - GoTimer",
    description:
      "Browse public board game challenges. See scores, game history, and competitive matchups.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public Game Challenges - GoTimer",
    description:
      "Browse public board game challenges. See scores, game history, and competitive matchups.",
    images: ["/fight.jpg"],
  },
};

// Hardcoded breadcrumb data - no user input, safe for JSON-LD injection
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Public Challenges", item: "https://gotimer.org/public-challenges" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLdString = JSON.stringify(breadcrumbJsonLd);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} />
      {children}
    </>
  );
}
