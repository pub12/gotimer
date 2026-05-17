import { Metadata } from "next";
import {
  build_preset_breadcrumb_ld,
  build_preset_faq_ld,
  build_preset_game_ld,
  build_preset_metadata,
  build_preset_web_app_ld,
} from "@/lib/board-game-preset-schema";
import { BOARD_GAME_PRESETS } from "@/lib/board-game-presets";
import { THROUGH_THE_AGES_FAQ } from "./faq";

const preset = BOARD_GAME_PRESETS["through-the-ages"];

export const metadata: Metadata = build_preset_metadata(preset, {
  title: "Through the Ages Turn Timer — Free, 30-Minute Time Bank",
  description:
    "Free Through the Ages turn timer. 30-minute personal bank per player, time-bank mode pre-configured for the civilization-arc decision space.",
});

const webAppLd = build_preset_web_app_ld(
  preset,
  "Free Through the Ages turn timer pre-tuned for time-bank mode with a 30-minute personal budget per player. Covers civic and military action decisions across the full civilization arc without freezing the table.",
);
const breadcrumbLd = build_preset_breadcrumb_ld(preset);
const faqLd = build_preset_faq_ld(THROUGH_THE_AGES_FAQ);
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
