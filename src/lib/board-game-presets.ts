/**
 * Per-game timing presets for the multi-player turn timer.
 *
 * Each entry encodes BGG-community-derived recommendations: a default per-turn
 * cap, a recommended bank for time-bank mode, the typical player range, and
 * the BGG URL used in the Game JSON-LD blob.
 */

import type { MPMode } from "@/lib/timer-strategies/multi-player-turn-timer";

export interface BoardGamePreset {
  slug: string;
  /** Display name on the preset page. */
  name: string;
  /** Full official name used in Game schema. */
  official_name: string;
  /** Short marketing tagline. */
  tagline: string;
  /** Typical number-of-players spec, e.g. "3-6". */
  number_of_players: string;
  /** Min player count for the configurator. */
  min_players: number;
  /** Max player count for the configurator. */
  max_players: number;
  /** Default player count to seed the configurator with. */
  default_players: number;
  /** Default per-turn cap in seconds. */
  default_per_turn: number;
  /** Default bank per player in seconds (time-bank / hybrid). */
  default_bank: number;
  /** Default mode the preset opens in. */
  default_mode: MPMode;
  /** Warning threshold in seconds. */
  warning_at: number;
  /** BoardGameGeek canonical URL. */
  bgg_url: string;
  /** Names used by the Game JSON-LD as alternateName. */
  alternate_names?: string[];
}

export const BOARD_GAME_PRESETS: Record<string, BoardGamePreset> = {
  "twilight-imperium": {
    slug: "twilight-imperium",
    name: "Twilight Imperium",
    official_name: "Twilight Imperium: Fourth Edition",
    tagline:
      "5-minute strategy-phase cap, 90-second cap on tactical actions. Keeps the 10-hour space epic from sliding to 14.",
    number_of_players: "3-6",
    min_players: 3,
    max_players: 6,
    default_players: 4,
    default_per_turn: 90,
    default_bank: 60 * 60,
    default_mode: "per-turn",
    warning_at: 15,
    bgg_url: "https://boardgamegeek.com/boardgame/233078/twilight-imperium-fourth-edition",
    alternate_names: ["TI4", "Twilight Imperium 4"],
  },
  gloomhaven: {
    slug: "gloomhaven",
    name: "Gloomhaven",
    official_name: "Gloomhaven",
    tagline:
      "60-second turn cap for combat planning. Stops monster activations from melting into 15-minute strategy huddles.",
    number_of_players: "1-4",
    min_players: 2,
    max_players: 4,
    default_players: 4,
    default_per_turn: 60,
    default_bank: 30 * 60,
    default_mode: "per-turn",
    warning_at: 10,
    bgg_url: "https://boardgamegeek.com/boardgame/174430/gloomhaven",
  },
  "brass-birmingham": {
    slug: "brass-birmingham",
    name: "Brass: Birmingham",
    official_name: "Brass: Birmingham",
    tagline:
      "90-second cap covers the build-action analysis. Auctions and tile placement stop sprawling.",
    number_of_players: "2-4",
    min_players: 2,
    max_players: 4,
    default_players: 4,
    default_per_turn: 90,
    default_bank: 25 * 60,
    default_mode: "per-turn",
    warning_at: 15,
    bgg_url: "https://boardgamegeek.com/boardgame/224517/brass-birmingham",
  },
  "spirit-island": {
    slug: "spirit-island",
    name: "Spirit Island",
    official_name: "Spirit Island",
    tagline:
      "Cooperative game — use a per-turn cap to stop quarterbacking. 90 seconds for fast-power choices.",
    number_of_players: "1-4",
    min_players: 2,
    max_players: 4,
    default_players: 4,
    default_per_turn: 90,
    default_bank: 25 * 60,
    default_mode: "per-turn",
    warning_at: 15,
    bgg_url: "https://boardgamegeek.com/boardgame/162886/spirit-island",
  },
  "terra-mystica": {
    slug: "terra-mystica",
    name: "Terra Mystica",
    official_name: "Terra Mystica",
    tagline:
      "Two-minute cap for the long, multi-step turns. Round structure stays brisk without losing the planning depth.",
    number_of_players: "2-5",
    min_players: 2,
    max_players: 5,
    default_players: 4,
    default_per_turn: 120,
    default_bank: 30 * 60,
    default_mode: "per-turn",
    warning_at: 15,
    bgg_url: "https://boardgamegeek.com/boardgame/120677/terra-mystica",
  },
  "food-chain-magnate": {
    slug: "food-chain-magnate",
    name: "Food Chain Magnate",
    official_name: "Food Chain Magnate",
    tagline:
      "Time-bank mode shines here — 25 minutes per player matches the punishing auction-and-hire phases.",
    number_of_players: "2-5",
    min_players: 2,
    max_players: 5,
    default_players: 4,
    default_per_turn: 90,
    default_bank: 25 * 60,
    default_mode: "time-bank",
    warning_at: 30,
    bgg_url: "https://boardgamegeek.com/boardgame/175914/food-chain-magnate",
  },
  "through-the-ages": {
    slug: "through-the-ages",
    name: "Through the Ages",
    official_name: "Through the Ages: A New Story of Civilization",
    tagline:
      "Time-bank works best — 30 minutes per player covers the civilization-arc decisions without freezing the table.",
    number_of_players: "2-4",
    min_players: 2,
    max_players: 4,
    default_players: 4,
    default_per_turn: 90,
    default_bank: 30 * 60,
    default_mode: "time-bank",
    warning_at: 30,
    bgg_url: "https://boardgamegeek.com/boardgame/182028/through-the-ages-a-new-story-of-civilization",
  },
  "mage-knight": {
    slug: "mage-knight",
    name: "Mage Knight",
    official_name: "Mage Knight Board Game",
    tagline:
      "Heavy combat puzzle solo or in co-op. 3-minute cap covers the multi-card combats without abandoning the puzzle.",
    number_of_players: "1-4",
    min_players: 1,
    max_players: 4,
    default_players: 3,
    default_per_turn: 180,
    default_bank: 35 * 60,
    default_mode: "per-turn",
    warning_at: 30,
    bgg_url: "https://boardgamegeek.com/boardgame/96848/mage-knight-board-game",
  },
};

export function get_board_game_preset(slug: string): BoardGamePreset | undefined {
  return BOARD_GAME_PRESETS[slug];
}

export function list_board_game_presets(): BoardGamePreset[] {
  return Object.values(BOARD_GAME_PRESETS);
}
