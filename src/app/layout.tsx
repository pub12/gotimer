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
  title: "GoTimer.org - Your Boardgame Tracker",
  description:
    "A modern, mobile-friendly timer for games, chess, and more. Track game challenges with friends, countdown timers, chess clocks, and round timers.",
  keywords:
    "game timer, chess clock, countdown timer, game challenges, board games, mobile timer, online timer, boardgame tracker",
  openGraph: {
    title: "GoTimer.org - Your Boardgame Tracker",
    description: "A modern, mobile-friendly timer for games, chess, and more.",
    type: "website",
    images: [{ url: "/fight.jpg" }],
  },
  twitter: {
    card: "summary",
    title: "GoTimer.org - Your Boardgame Tracker",
    description: "A modern, mobile-friendly timer for games, chess, and more.",
    images: ["/fight.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
