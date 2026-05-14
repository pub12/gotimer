import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board Game Round Timer | GoTimer",
  description: "Free round timer for board games. Track rounds and total game time. No download required.",
  alternates: { canonical: "/round-timer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
