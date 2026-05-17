import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { GLOOMHAVEN_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["gloomhaven"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Gloomhaven Turn Timer — Free, 60-Second Cap for 2-4 Players",
  description:
    "Free Gloomhaven turn timer. 60-second per-turn cap pre-configured for card-and-action planning. Works for Frosthaven and Jaws of the Lion too. Shareable URL.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Gloomhaven turn timer pre-tuned to a 60-second per-turn cap. Stops card-planning paralysis without forcing a rushed play. Supports the original Gloomhaven, Frosthaven, and Jaws of the Lion.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(GLOOMHAVEN_FAQ);
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
