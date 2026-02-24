import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = get_db();
  const challenges = db
    .prepare(
      `SELECT gc.*,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id AND cg.winner_id = ?) as my_wins,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id AND cg.winner_id != ? AND cg.winner_id IS NOT NULL AND cg.is_draw = 0) as opponent_wins,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id AND cg.is_draw = 1) as draws,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
       FROM game_challenges gc
       INNER JOIN challenge_participants cp ON cp.challenge_id = gc.id
       WHERE cp.user_id = ?
       ORDER BY gc.updated_at DESC`
    )
    .all(auth.user.id, auth.user.id, auth.user.id);

  // Get participants for each challenge
  const enriched = (challenges as Record<string, unknown>[]).map((c) => {
    const participants = db
      .prepare(
        `SELECT cp.user_id, cp.role FROM challenge_participants cp WHERE cp.challenge_id = ?`
      )
      .all(c.id as string);
    return { ...c, participants };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
  }

  if (description && typeof description === "string" && description.length > 500) {
    return NextResponse.json({ error: "Description must be 500 characters or less" }, { status: 400 });
  }

  const db = get_db();
  const id = crypto.randomUUID();
  const participant_id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO game_challenges (id, name, description, created_by) VALUES (?, ?, ?, ?)`
  ).run(id, name.trim(), (description || "").trim(), auth.user.id);

  db.prepare(
    `INSERT INTO challenge_participants (id, challenge_id, user_id, role) VALUES (?, ?, ?, 'creator')`
  ).run(participant_id, id, auth.user.id);

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id);

  return NextResponse.json(challenge, { status: 201 });
}
