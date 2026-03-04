import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://gotimer.org"),
  title: "GoTimer - Free Online Board Game Timers & Challenge Tracker",
  description:
    "Free online board game timers, ADHD focus timers, and competitive challenge tracking. Countdown timers, chess clocks, round timers, and score tracking for tabletop gaming and productivity.",
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
    title: "GoTimer - Free Online Board Game Timers & Challenge Tracker",
    description:
      "Free online board game timers and challenge tracking. Countdown, chess clock, round timer, and score tracking for tabletop gaming.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoTimer - Free Online Board Game Timers & Challenge Tracker",
    description:
      "Free online board game timers and challenge tracking. Countdown, chess clock, round timer, and score tracking.",
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
        "A free, mobile-friendly web application providing countdown timers, chess clocks, round timers, and competitive challenge tracking for board games.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
