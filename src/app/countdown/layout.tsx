import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Timer - GoTimer",
  description:
    "Mobile-friendly countdown timer with sound alerts for board games and activities. Simple, distraction-free countdown with audio cues.",
  alternates: {
    canonical: "/countdown",
  },
  openGraph: {
    title: "Countdown Timer - GoTimer",
    description:
      "Mobile-friendly countdown timer with sound alerts for board games and activities.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
