import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ADHD Focus Timer — Short Interval Sessions | GoTimer",
  description: "Focus timer designed for ADHD with shorter work intervals and frequent breaks. Low-distraction interface.",
  alternates: { canonical: "/productivity/adhd-focus" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
