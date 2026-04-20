import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Presentation Timer — Keep Talks on Schedule | GoTimer",
  description: "Free presentation timer for talks, meetings, and speeches. Large display countdown visible to the whole room.",
  alternates: { canonical: "/productivity/presentation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
