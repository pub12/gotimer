import { NextRequest, NextResponse } from "next/server";
import { get_db, get_challenge_scores } from "@/lib/db";
import { validateApiKey } from "@/lib/api-auth";
import crypto from "crypto";

// GET /api/v1/challenges — public, no auth required
export async function GET() {
  const db = get_db();
  const challenges = db
    .prepare(
      `SELECT gc.id, gc.name, gc.format, gc.timer_type, gc.status, gc.is_public,
        gc.join_code, gc.created_at, gc.updated_at,
        (SELECT COUNT(*) FROM challenge_participants cp WHERE cp.challenge_id = gc.id) as participant_count,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
       FROM game_challenges gc
       WHERE gc.is_public = 1
       ORDER BY gc.updated_at DESC`
    )
    .all() as Record<string, unknown>[];

  const enriched = challenges.map((c) => {
    const participants = db
      .prepare(
        `SELECT cp.user_id, cp.role, cp.score_override FROM challenge_participants cp WHERE cp.challenge_id = ?`
      )
      .all(c.id as string) as { user_id: string; role: string; score_override: number | null }[];

    const scores = get_challenge_scores(db, c.id as string, participants);

    return { ...c, scores };
  });

  return NextResponse.json({
    status: "ok",
    data: {
      challenges: enriched,
    },
  });
}

// POST /api/v1/challenges — requires API key auth
export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (!auth.valid) {
    return NextResponse.json(
      { status: "error", error: "Unauthorized — valid API key required" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, format, timer_type, is_public } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { status: "error", error: "name is required" },
      { status: 400 }
    );
  }

  if (name.trim().length > 100) {
    return NextResponse.json(
      { status: "error", error: "name must be 100 characters or less" },
      { status: 400 }
    );
  }

  const valid_formats = ["head-to-head", "group", "solo"];
  const challenge_format =
    format && typeof format === "string" && valid_formats.includes(format)
      ? format
      : "head-to-head";

  const valid_timer_types = ["countdown", "chess-clock", "round-timer"];
  const challenge_timer_type =
    timer_type && typeof timer_type === "string" && valid_timer_types.includes(timer_type)
      ? timer_type
      : null;

  let join_code: string | null = null;
  if (challenge_format === "group") {
    const digits = Math.floor(1000 + Math.random() * 9000).toString();
    join_code = `TIMER-${digits}`;
  }

  const is_public_value = is_public === false ? 0 : 1;

  const db = get_db();
  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO game_challenges (id, name, description, created_by, is_public, format, timer_type, join_code) VALUES (?, ?, '', 'api', ?, ?, ?, ?)`
  ).run(id, name.trim(), is_public_value, challenge_format, challenge_timer_type, join_code);

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id);

  return NextResponse.json(
    { status: "ok", data: { challenge } },
    { status: 201 }
  );
}
