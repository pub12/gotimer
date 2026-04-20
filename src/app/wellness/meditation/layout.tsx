import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Meditation Timer — Guided Mindfulness Sessions | GoTimer",
  description: "Free online meditation timer with interval bells. Set session length for guided mindfulness practice. No download required.",
  alternates: { canonical: "/wellness/meditation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
