import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_web_app_ld,
} from "@/lib/coffee-preset-schema";
import { ESPRESSO_HUB_FAQ } from "./faq";
import { EspressoTimer } from "./timer";

export const metadata: Metadata = {
  title: "Espresso Timer — Free Espresso Shot Timer with First-Drip Capture",
  description:
    "Free espresso shot timer with pre-infusion / first-drip capture and a 25-30s target band. Audio cues, visual target indicator, total time + extraction time. No signup.",
  alternates: {
    canonical: "/kitchen/espresso-timer",
  },
  openGraph: {
    title: "Espresso Timer — Free Espresso Shot Timer with First-Drip Capture",
    description:
      "Free espresso shot timer with first-drip capture and 25-30s target band.",
    url: "https://gotimer.org/kitchen/espresso-timer",
  },
  twitter: {
    card: "summary",
    title: "Espresso Timer",
    description:
      "Free espresso shot timer with first-drip capture, target band, and audio cues.",
  },
};

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Espresso Shot Timer",
  url_path: "/kitchen/espresso-timer",
  description:
    "Free espresso shot timer with first-drip capture and a configurable target band. Counts up from pump-on, captures first-drip timestamp on tap, displays both total elapsed and extraction-time (since-first-drip), and signals the 25-30 second target window with color + audio.",
  features: [
    "Count-up timer from pump-on",
    "First-drip button captures pre-infusion duration",
    "Live target band — amber / emerald / rose by time",
    "Both total time and extraction time visible",
    "Audio cue at 25s and 30s",
    "Wake lock keeps screen on during the shot",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({ kind: "espresso" });

const faqLd = build_coffee_faq_ld(ESPRESSO_HUB_FAQ);

export default function Page() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <EspressoTimer />
    </>
  );
}
