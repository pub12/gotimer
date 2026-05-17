import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free OBS Browser-Source Countdown Timer — No Signup",
  description:
    "Transparent BRB and starting-soon countdown overlay for OBS Studio. URL-driven config, no watermark, no signup. Drop the URL into a Browser Source and stream.",
  alternates: {
    canonical: "/brb",
  },
  openGraph: {
    title: "Free OBS Browser-Source Countdown Timer — No Signup",
    description:
      "Transparent BRB and starting-soon countdown overlay for OBS Studio. URL-driven config, no watermark, no signup.",
    url: "https://gotimer.org/brb",
  },
  twitter: {
    card: "summary",
    title: "Free OBS BRB Countdown Overlay",
    description:
      "Transparent countdown overlay for OBS. URL-configurable, no signup, no watermark.",
  },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GoTimer OBS BRB Countdown Overlay",
  url: "https://gotimer.org/brb",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Transparent countdown overlay for OBS Studio, Streamlabs Desktop, vMix, and XSplit. URL-configurable, no signup, no watermark, no extension.",
  featureList: [
    "Transparent background (CSS-native, no Custom CSS required)",
    "URL-driven configuration via query string",
    "Pre-built preset URLs for starting-soon, BRB, stream-end, raid scenarios",
    "System fonts (sans/serif/mono) — no Google Fonts dependency",
    "Pulse animation on last 10 seconds",
    "No account, no signup, no watermark",
  ],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gotimer.org" },
    { "@type": "ListItem", position: 2, name: "Streamer Tools", item: "https://gotimer.org/streamer-tools" },
    { "@type": "ListItem", position: 3, name: "BRB Countdown Overlay", item: "https://gotimer.org/brb" },
  ],
};

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to add a countdown overlay to OBS Studio",
  description:
    "Add a free transparent countdown overlay to your OBS scene using a single URL — no plugins, no signup.",
  totalTime: "PT2M",
  tool: [
    { "@type": "HowToTool", name: "OBS Studio (or Streamlabs Desktop, vMix, XSplit)" },
    { "@type": "HowToTool", name: "A modern web browser" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Generate your URL",
      text: "Use the configurator on gotimer.org/brb to set the duration, label, color, font, size, and alignment. The URL updates live; copy it to your clipboard.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Open OBS and pick a scene",
      text: "In OBS Studio, switch to the scene where you want the countdown to appear — typically your Starting Soon or BRB scene.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Add a Browser Source",
      text: "Click the + icon in the Sources panel, choose Browser, give it a name, click OK. In the properties dialog, paste your URL. Set Width to 1920 and Height to 1080 (or match your canvas).",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Leave Custom CSS empty",
      text: "The overlay already sets a transparent background — no Custom CSS is required. Click OK to close the properties dialog.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Position and test",
      text: "Drag the source to where you want the timer. The countdown starts automatically and counts down to zero. Switch scenes to verify it keeps running in the background.",
    },
  ],
};

/**
 * Note: FAQPage JSON-LD for the /brb hub is emitted from BrbLanding
 * (the on-page component for the non-embed branch), not from this
 * layout. This is because the layout is also the parent of the four
 * preset routes (/brb/starting-soon, etc.) — emitting FAQPage here
 * would duplicate it on every preset page, which Google flags.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      {children}
    </>
  );
}
