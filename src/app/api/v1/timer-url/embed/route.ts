import { NextRequest, NextResponse } from "next/server";
import { encode_live_timer } from "@/lib/timer-url-encoder";
import { resolve_timer } from "@/lib/timer-registry";

type SizeOption = "compact" | "standard" | "large";

const SIZE_DIMENSIONS: Record<SizeOption, { width: number; height: number }> = {
  compact: { width: 300, height: 250 },
  standard: { width: 480, height: 400 },
  large: { width: 640, height: 500 },
};

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

// GET /api/v1/timer-url/embed — public, no auth required
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

  const theme = searchParams.get("theme") || "auto";
  const size = (searchParams.get("size") || "standard") as SizeOption;
  const controls = searchParams.get("controls") || "full";
  const accent = searchParams.get("accent");
  const autostart = searchParams.get("autostart") === "true";

  if (!["compact", "standard", "large"].includes(size)) {
    return NextResponse.json(
      { status: "error", error: "Invalid size. Must be one of: compact, standard, large" },
      { status: 400 },
    );
  }

  const timer_path = resolved.route;
  const timer_name = resolved.name;

  const query_string = encode_live_timer({
    type: resolved.strategy_id,
    started,
    config: resolved.config,
  });
  const origin = new URL(request.url).origin;

  // Build embed URL with embed-specific params
  const embed_params = new URLSearchParams(query_string);
  if (theme !== "auto") embed_params.set("theme", theme);
  if (accent) embed_params.set("accent", accent);
  if (autostart) embed_params.set("autostart", "true");
  if (controls !== "full") embed_params.set("controls", controls);

  const embed_url = `${origin}/embed${timer_path}?${embed_params.toString()}`;
  const dims = SIZE_DIMENSIONS[size];

  const html = `<!-- GoTimer Embed -->\n<div style="position:relative;width:100%;max-width:${dims.width}px;">\n  <iframe src="${embed_url}"\n    width="100%" height="${dims.height}" frameborder="0"\n    allow="autoplay" loading="lazy"\n    style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"></iframe>\n  <noscript><a href="${origin}${timer_path}">\n    Free ${timer_name} by GoTimer</a></noscript>\n</div>`;

  return NextResponse.json({
    status: "ok",
    data: {
      url: embed_url,
      html,
      timer_type: resolved.strategy_id,
    },
  });
}
