import { NextRequest, NextResponse } from "next/server";
import { encode_live_timer } from "@/lib/timer-url-encoder";
import { resolve_timer } from "@/lib/timer-registry";

/**
 * Extract URL param overrides relevant to a given strategy.
 * These are merged on top of any preset/strategy defaults.
 */
function build_config_from_params(
  strategy_id: string,
  params: URLSearchParams,
): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  const duration = params.get("duration");
  const label = params.get("label");
  const work = params.get("work");
  const rest = params.get("rest");
  const rounds = params.get("rounds");

  switch (strategy_id) {
    case "countdown":
      if (duration) config.duration = Number(duration);
      break;
    case "chess-clock":
      if (duration) config.duration_per_player = Number(duration);
      break;
    case "round-timer":
      if (duration) config.round_duration = Number(duration);
      break;
    case "interval":
      if (work) config.work = Number(work);
      if (rest) config.rest = Number(rest);
      if (rounds) config.rounds = Number(rounds);
      break;
  }

  if (label) config.label = label;

  return config;
}

// GET /api/v1/timer-url — public, no auth required
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      {
        status: "error",
        error: "Missing type parameter. Pass a strategy ID (e.g. countdown, chess-clock) or preset ID (e.g. pomodoro, hiit).",
      },
      { status: 400 },
    );
  }

  // Resolve the timer type (preset or strategy) to get defaults and strategy_id.
  // We resolve first without overrides, then extract param overrides using the
  // resolved strategy_id (so "pomodoro" correctly maps to "interval" params).
  const base = resolve_timer(type);

  if (!base) {
    return NextResponse.json(
      {
        status: "error",
        error: `Unknown timer type "${type}". Pass a strategy ID (e.g. countdown, chess-clock, interval) or preset ID (e.g. pomodoro, hiit, meditation).`,
      },
      { status: 400 },
    );
  }

  // Extract URL param overrides using the underlying strategy_id
  const param_overrides = build_config_from_params(base.strategy_id, searchParams);

  // Re-resolve with overrides merged on top of preset/strategy defaults
  const resolved = resolve_timer(type, param_overrides)!;

  const started_str = searchParams.get("started");
  const started = started_str ? new Date(started_str) : new Date();

  if (isNaN(started.getTime())) {
    return NextResponse.json(
      { status: "error", error: "Invalid started timestamp." },
      { status: 400 },
    );
  }

  const embed = searchParams.get("embed") === "true";

  // For URL encoding we need the underlying strategy_id, and the resolved
  // config already has preset defaults merged with param overrides.
  const query_string = encode_live_timer({
    type: resolved.strategy_id,
    started,
    config: resolved.config,
  });
  const origin = new URL(request.url).origin;
  const timer_path = resolved.route;

  const url = `${origin}${timer_path}?${query_string}`;
  const embed_url = `${origin}/embed${timer_path}?${query_string}`;

  const expires_at = new Date(started.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const duration = searchParams.get("duration");
  const label = searchParams.get("label");

  return NextResponse.json({
    status: "ok",
    data: {
      url: embed ? embed_url : url,
      embed_url,
      expires_at,
      timer_type: resolved.strategy_id,
      ...(duration ? { duration_seconds: Number(duration) } : {}),
      ...(label ? { label } : {}),
    },
  });
}
