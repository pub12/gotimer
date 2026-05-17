import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { TERRA_MYSTICA_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["terra-mystica"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Terra Mystica Turn Timer — Free, 2-Minute Cap",
  description:
    "Free Terra Mystica turn timer. 2-minute per-turn cap pre-configured for multi-step euro turns. Works for Gaia Project too. Shareable URL with player names.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Terra Mystica turn timer pre-tuned to a 2-minute per-turn cap. Sized for the multi-step decisions of a heavy euro: terraform, build, upgrade, scoring-tile alignment. Also suitable for Gaia Project.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(TERRA_MYSTICA_FAQ);
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
