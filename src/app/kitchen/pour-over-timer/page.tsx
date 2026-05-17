import { Metadata } from "next";
import {
  build_coffee_breadcrumb_ld,
  build_coffee_faq_ld,
  build_coffee_web_app_ld,
} from "@/lib/coffee-preset-schema";
import { POUR_OVER_HUB_FAQ } from "./faq";
import { PourOverTimer } from "./timer";

export const metadata: Metadata = {
  title: "Pour Over Timer — Free Multi-Recipe Brewing Timer",
  description:
    "Free pour-over coffee timer with Hoffmann V60, Tetsu Kasuya 4:6, Chemex, AeroPress, Kalita Wave, and French Press recipes pre-configured. Multi-stage pour scheduling with audio cues. No signup.",
  alternates: {
    canonical: "/kitchen/pour-over-timer",
  },
  openGraph: {
    title: "Pour Over Timer — Free Multi-Recipe Brewing Timer",
    description:
      "Free pour-over coffee timer with 9 recipes — Hoffmann V60, Tetsu Kasuya 4:6, Chemex, AeroPress, Kalita Wave, French Press.",
    url: "https://gotimer.org/kitchen/pour-over-timer",
  },
  twitter: {
    card: "summary",
    title: "Pour Over Timer",
    description:
      "Free pour-over coffee timer with 9 recipes — Hoffmann, Kasuya, Chemex, AeroPress, more.",
  },
};

const webAppLd = build_coffee_web_app_ld({
  name: "GoTimer Pour-Over Coffee Timer",
  url_path: "/kitchen/pour-over-timer",
  description:
    "Free multi-stage pour-over coffee timer with nine pre-configured recipes (Hoffmann V60, Tetsu Kasuya 4:6, Chemex, AeroPress standard and inverted, Kalita Wave, French Press classic and Hoffmann, and a generic V60). Each recipe defines pour-by-pour water targets, durations, and a drawdown phase. Audio cues at every transition.",
  features: [
    "Nine pre-configured pour-over recipes",
    "Named recipes from James Hoffmann and Tetsu Kasuya",
    "Pour-by-pour water target display",
    "Audio cue at every pour transition",
    "Wake lock keeps the screen on through the brew",
    "Shareable URL — each recipe has a dedicated page",
    "Skip-stage button for when a pour finishes early",
    "No signup, install, or extension required",
  ],
});

const breadcrumbLd = build_coffee_breadcrumb_ld({ kind: "pour-over" });

const faqLd = build_coffee_faq_ld(POUR_OVER_HUB_FAQ);

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
      <PourOverTimer />
    </>
  );
}
