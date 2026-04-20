import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free HIIT Timer — High-Intensity Interval Training | GoTimer",
  description: "Free online HIIT timer with configurable work and rest intervals. Audio cues, full-screen display, no download required.",
  alternates: { canonical: "/fitness/hiit" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
