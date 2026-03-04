import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Clock - GoTimer",
  description:
    "Two-player chess clock timer. Tap to switch turns. Perfect for chess, Scrabble, and turn-based board games. Free online chess clock.",
  alternates: {
    canonical: "/chess-clock",
  },
  openGraph: {
    title: "Chess Clock - GoTimer",
    description:
      "Two-player chess clock timer. Tap to switch turns. Perfect for chess and turn-based board games.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
