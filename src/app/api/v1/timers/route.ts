import { NextResponse } from "next/server";

const TIMER_TYPES = [
  {
    id: "countdown",
    name: "Countdown Timer",
    description: "A simple countdown timer that counts down from a set duration.",
    default_config: {
      duration: 300,
      alert_at: 60,
    },
  },
  {
    id: "chess-clock",
    name: "Chess Clock",
    description: "A two-player chess clock where each player has their own time bank.",
    default_config: {
      duration_per_player: 600,
      increment: 0,
    },
  },
  {
    id: "round-timer",
    name: "Round Timer",
    description: "A round-based timer for sports and combat games with work and rest periods.",
    default_config: {
      round_duration: 180,
      rest_duration: 60,
      rounds: 3,
    },
  },
];

// GET /api/v1/timers — public, no auth required
export async function GET() {
  return NextResponse.json({
    status: "ok",
    data: {
      timer_types: TIMER_TYPES,
    },
  });
}
