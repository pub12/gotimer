import type { Metadata } from "next";

/**
 * Minimal layout for the canonical short-form embed iframe URL (/e/[slug]).
 *
 * Renders no Navbar, no Footer, no analytics-bound chrome — these pages run
 * inside third-party iframes and must stay lightweight and free of consent
 * banners. They are explicitly noindex so they never compete with the real
 * timer pages in search results.
 */

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function EmbedShortLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
