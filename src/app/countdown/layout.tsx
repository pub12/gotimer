import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Timer Online - Free Board Game Timer | GoTimer",
  description:
    "Use a free online countdown timer with sound alerts for board games, trivia, and focus sessions. Full-screen display, audio cues, works on any device. No download needed.",
  alternates: {
    canonical: "/countdown",
  },
  openGraph: {
    title: "Countdown Timer Online - Free Board Game Timer | GoTimer",
    description:
      "Use a free online countdown timer with sound alerts for board games, trivia, and focus sessions. Works on any device.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Timer Online - Free Board Game Timer | GoTimer",
    description:
      "Use a free online countdown timer with sound alerts for board games, trivia, and focus sessions. Works on any device.",
    images: ["/fight.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
