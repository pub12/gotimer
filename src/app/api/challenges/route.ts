import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db, get_challenge_scores } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = get_db();
  const challenges = db
    .prepare(
      `SELECT gc.*, g.name as game_name,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id AND cg.winner_id = ?) as my_wins,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id AND cg.winner_id != ? AND cg.winner_id IS NOT NULL AND cg.is_draw = 0) as opponent_wins,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id AND cg.is_draw = 1) as draws,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
       FROM game_challenges gc
       INNER JOIN challenge_participants cp ON cp.challenge_id = gc.id
       LEFT JOIN games g ON gc.game_id = g.id
       WHERE cp.user_id = ?
       ORDER BY gc.updated_at DESC`
    )
    .all(auth.user.id, auth.user.id, auth.user.id);

  // Get participants and apply score overrides for each challenge
  const enriched = (challenges as Record<string, unknown>[]).map((c) => {
    const participants = db
      .prepare(
        `SELECT cp.user_id, cp.role, cp.score_override FROM challenge_participants cp WHERE cp.challenge_id = ?`
      )
      .all(c.id as string) as { user_id: string; role: string; score_override: number | null }[];

    const scores = get_challenge_scores(db, c.id as string, participants);

    const my_score = scores[auth.user.id] ?? (c.my_wins as number);
    const opponent_score = Object.entries(scores)
      .filter(([uid]) => uid !== auth.user.id)
      .reduce((sum, [, v]) => sum + v, 0);

    return { ...c, participants, my_wins: my_score, opponent_wins: opponent_score };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, gif_url, is_public, game_id } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
  }

  if (description && typeof description === "string" && description.length > 500) {
    return NextResponse.json({ error: "Description must be 500 characters or less" }, { status: 400 });
  }

  if (gif_url) {
    try {
      const url = new URL(gif_url);
      if (!url.hostname.endsWith("giphy.com")) {
        return NextResponse.json({ error: "Only GIPHY URLs are allowed" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid gif_url" }, { status: 400 });
    }
  }

  const db = get_db();
  const id = crypto.randomUUID();
  const participant_id = crypto.randomUUID();

  const is_public_value = is_public === false ? 0 : 1;

  db.prepare(
    `INSERT INTO game_challenges (id, name, description, created_by, gif_url, is_public, game_id) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name.trim(), (description || "").trim(), auth.user.id, gif_url || null, is_public_value, game_id || null);

  db.prepare(
    `INSERT INTO challenge_participants (id, challenge_id, user_id, role) VALUES (?, ?, ?, 'creator')`
  ).run(participant_id, id, auth.user.id);

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id);

  return NextResponse.json(challenge, { status: 201 });
}
