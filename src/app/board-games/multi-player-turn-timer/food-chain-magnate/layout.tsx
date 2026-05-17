import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { FOOD_CHAIN_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["food-chain-magnate"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Food Chain Magnate Turn Timer — Free, 25-Minute Time Bank",
  description:
    "Free Food Chain Magnate turn timer. 25-minute personal bank per player, time-bank mode pre-configured. Multiplayer chess clock for the auction-heavy economy game.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Food Chain Magnate turn timer pre-tuned for time-bank mode with a 25-minute personal budget per player. Functions as a multiplayer chess clock for the auction-and-hire economy game.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(FOOD_CHAIN_FAQ);
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
