import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board Game Chess Clock | GoTimer",
  description: "Free chess clock for board games. Two-player time control for competitive games. No download required.",
  alternates: { canonical: "/board-games/chess-clock" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
