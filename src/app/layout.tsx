import type { Metadata } from "next";
import { Lexend, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "sonner";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://gotimer.org"),
  title: {
    default: "GoTimer — Free Online Timers for Focus, Fitness & Games",
    template: "%s | GoTimer",
  },
  description:
    "Free online timers — Pomodoro, HIIT, chess clock, cooking, study and more. Built-in leaderboards, no login, start in seconds. 50+ ready-made timers.",
  keywords:
    "game timer, chess clock, countdown timer, round timer, board game timer, game challenges, board games, mobile timer, online timer, boardgame tracker, score tracking, adhd timer, pomodoro timer, focus timer",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  },
  openGraph: {
    title: "GoTimer — Free Online Timers for Focus, Fitness & Games",
    description:
      "Free online timers — Pomodoro, HIIT, chess clock, cooking, study and more. Built-in leaderboards, no login, start in seconds. 50+ ready-made timers.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoTimer — Free Online Timers for Focus, Fitness & Games",
    description:
      "Free online timers — Pomodoro, HIIT, chess clock, cooking, study and more. Built-in leaderboards, no login, start in seconds.",
    images: ["/fight.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "GoTimer",
      url: "https://gotimer.org",
      logo: "https://gotimer.org/favicon.ico",
      description:
        "Free online board game timers and competitive challenge tracking for tabletop gaming.",
    },
    {
      "@type": "WebApplication",
      name: "GoTimer",
      url: "https://gotimer.org",
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free countdown timers, Pomodoro, HIIT, chess clock, and more — with built-in leaderboards and rivalry tracking. No login needed. Start in seconds.",
      featureList: [
        "Countdown Timer with audio alerts",
        "Two-player Chess Clock",
        "Round Timer for tournament play",
        "Competitive challenge tracking",
        "Score history and visualizations",
        "Shareable public challenges",
        "GIF reactions for game results",
        "Works on mobile, tablet, and desktop",
      ],
    },
    {
      "@type": "WebSite",
      name: "GoTimer",
      url: "https://gotimer.org",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://gotimer.org/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD is a static object we control - safe to serialize
  const jsonLdString = JSON.stringify(jsonLd);

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${lexend.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
