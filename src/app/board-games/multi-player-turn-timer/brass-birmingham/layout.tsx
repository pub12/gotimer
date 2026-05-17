import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { BRASS_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["brass-birmingham"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Brass: Birmingham Turn Timer — Free, 90-Second Cap",
  description:
    "Free Brass: Birmingham turn timer. 90-second per-turn cap pre-configured for build-and-flip planning. Works for Brass: Lancashire too. Shareable URL with player names.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Brass: Birmingham turn timer pre-tuned to a 90-second per-turn cap. Stops late-game develop-flip-scout paralysis. Also suitable for Brass: Lancashire and other heavy euros.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(BRASS_FAQ);
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
