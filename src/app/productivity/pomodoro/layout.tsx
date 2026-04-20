import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Pomodoro Timer — 25/5 Focus Sessions | GoTimer",
  description: "Free online Pomodoro timer with 25-minute focus sessions and 5-minute breaks. Customizable intervals with audio alerts.",
  alternates: { canonical: "/productivity/pomodoro" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
