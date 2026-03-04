import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Round Timer - GoTimer",
  description:
    "Round timer tracking total elapsed time and individual rounds. Ideal for strategy games, tournaments, and timeboxing. Free online round timer.",
  alternates: {
    canonical: "/round-timer",
  },
  openGraph: {
    title: "Round Timer - GoTimer",
    description:
      "Round timer tracking total elapsed time and individual rounds. Ideal for strategy games and tournaments.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
