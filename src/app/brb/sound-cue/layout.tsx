import { Metadata } from "next";

/**
 * The audio companion tab is a tool for streamers, not an SEO page —
 * noindex so it doesn't compete with /brb in search.
 */
export const metadata: Metadata = {
  title: "BRB Overlay — Audio Companion Tab",
  description:
    "Companion audio cue page for the BRB countdown overlay. Open in a second browser tab and add to OBS as an Audio Output Capture source.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/brb/sound-cue" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
