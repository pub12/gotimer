import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { MAGE_KNIGHT_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["mage-knight"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Mage Knight Turn Timer — Free, 3-Minute Cap for the Combat Puzzle",
  description:
    "Free Mage Knight turn timer. 3-minute per-turn cap pre-configured for the combat puzzle. Solo or cooperative; hybrid mode with 35-minute personal bank.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Mage Knight turn timer pre-tuned to a 3-minute per-turn cap. Sized for the multi-card combat puzzle without abandoning the puzzle itself. Supports solo and cooperative play.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(MAGE_KNIGHT_FAQ);
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
