import { NextResponse } from "next/server";
import { STRATEGIES } from "@/lib/timer-registry";

// GET /api/v1/timers — public, no auth required
export async function GET() {
  const timer_types = Object.values(STRATEGIES).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    default_config: s.defaultConfig,
  }));

  return NextResponse.json({
    status: "ok",
    data: {
      timer_types,
    },
  });
}
