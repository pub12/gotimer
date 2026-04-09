import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Round Timer — Track Rounds & Total Time",
  description:
    "Count-up timer tracking total elapsed time and individual round durations. Perfect for tournaments, Twilight Imperium, and Pomodoro focus sessions.",
  alternates: {
    canonical: "/round-timer",
  },
  openGraph: {
    title: "Free Online Round Timer — Track Rounds & Total Time",
    description:
      "Count-up timer tracking total elapsed time and individual round durations. Perfect for tournaments, Twilight Imperium, and Pomodoro focus sessions.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Round Timer — Track Rounds & Total Time",
    description:
      "Count-up timer tracking total elapsed time and individual round durations. Perfect for tournaments, Twilight Imperium, and Pomodoro focus sessions.",
    images: ["/fight.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer Round Timer",
  url: "https://gotimer.org/round-timer",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Count-up timer tracking total elapsed time and individual round durations. Perfect for tournaments, Twilight Imperium, and Pomodoro focus sessions.",
  featureList: [
    "Track total elapsed time",
    "Record individual round durations",
    "Lap/round history",
    "Works on mobile, tablet, and desktop",
    "No login or download required",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // JSON-LD is a static object we control - safe to serialize
  const jsonLdString = JSON.stringify(jsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      {children}
    </>
  );
}
