import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners & Listings - GoTimer",
  description:
    "GoTimer partner sites and directory listings. Find GoTimer on board game directories and app listing sites.",
  alternates: {
    canonical: "/partners",
  },
  openGraph: {
    title: "Partners & Listings - GoTimer",
    description: "GoTimer partner sites and directory listings.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
