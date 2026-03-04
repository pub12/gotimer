import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Clock Online - Free Two-Player Game Timer | GoTimer",
  description:
    "Play with a free online chess clock. Tap to switch turns between two players. Perfect for chess, Scrabble, Go, and any turn-based board game. No download needed.",
  alternates: {
    canonical: "/chess-clock",
  },
  openGraph: {
    title: "Chess Clock Online - Free Two-Player Game Timer | GoTimer",
    description:
      "Play with a free online chess clock. Tap to switch turns between two players. Perfect for chess, Scrabble, and board games.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Clock Online - Free Two-Player Game Timer | GoTimer",
    description:
      "Play with a free online chess clock. Tap to switch turns between two players. Perfect for chess, Scrabble, and board games.",
    images: ["/fight.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
