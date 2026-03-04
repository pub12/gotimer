import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turn Timer & Round Timer Online - Free Board Game Timer | GoTimer",
  description:
    "Track turns and rounds with a free online turn timer. Monitor total elapsed time and individual round durations for tournaments, strategy games, and timeboxing. No download needed.",
  alternates: {
    canonical: "/round-timer",
  },
  openGraph: {
    title: "Turn Timer & Round Timer Online - Free Board Game Timer | GoTimer",
    description:
      "Track turns and rounds with a free online turn timer. Perfect for tournaments, strategy games, and timeboxing sessions.",
    images: [{ url: "/fight.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turn Timer & Round Timer Online - Free Board Game Timer | GoTimer",
    description:
      "Track turns and rounds with a free online turn timer. Perfect for tournaments, strategy games, and timeboxing sessions.",
    images: ["/fight.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
