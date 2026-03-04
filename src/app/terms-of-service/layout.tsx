import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - GoTimer",
  description:
    "GoTimer terms of service. Read the terms governing your use of GoTimer.org.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
