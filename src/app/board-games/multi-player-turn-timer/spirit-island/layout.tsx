import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { SPIRIT_ISLAND_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["spirit-island"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Spirit Island Turn Timer — Free, Stops Quarterbacking",
  description:
    "Free Spirit Island turn timer. 90-second cap pre-configured to stop quarterbacking and let every spirit play their own turn. Shareable URL with spirit names.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Spirit Island turn timer pre-tuned to a 90-second per-turn cap. Designed to stop the alpha-player quarterback problem common in cooperative games. Supports Branch & Claw and Jagged Earth expansions.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(SPIRIT_ISLAND_FAQ);
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
