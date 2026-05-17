import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { TWILIGHT_IMPERIUM_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["twilight-imperium"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Twilight Imperium 4 Turn Timer — Free, Up to 8 Players",
  description:
    "Free Twilight Imperium turn timer. 90-second tactical cap and 5-minute strategy-phase cap pre-configured. Shareable URL with player names — keeps the 10-hour space epic on track.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Twilight Imperium turn timer. Pre-tuned to a 90-second per-turn cap with a 60-minute personal time bank in hybrid mode. Supports 3-6 players (8 with Prophecy of Kings). Shareable URL keeps player names baked into the link.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(TWILIGHT_IMPERIUM_FAQ);
const gameLd = build_preset_game_ld(preset);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        // skipcq: JS-0440
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameLd) }}
      />
      {children}
    </>
  );
}
