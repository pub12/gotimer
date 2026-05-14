import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board Game Countdown Timer | GoTimer",
  description: "Free countdown timer for board games. Set time limits for turns and rounds. No download required.",
  alternates: { canonical: "/countdown" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
