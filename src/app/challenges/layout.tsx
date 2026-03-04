import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Challenges - GoTimer",
  description:
    "View and manage your board game challenges. Track scores, add game results, and compete with friends on GoTimer.",
  alternates: {
    canonical: "/challenges",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "My Challenges - GoTimer",
    description:
      "View and manage your board game challenges. Track scores and compete with friends.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
