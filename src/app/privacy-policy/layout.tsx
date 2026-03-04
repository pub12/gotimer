import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - GoTimer",
  description:
    "GoTimer privacy policy. Learn how we collect, use, and protect your data.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
