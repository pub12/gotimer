import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = get_db();

  // Verify user is a participant
  const participant = db
    .prepare(
      `SELECT * FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`
    )
    .get(id, auth.user.id);

  if (!participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  const games = db
    .prepare(
      `SELECT * FROM challenge_games WHERE challenge_id = ? ORDER BY played_at DESC`
    )
    .all(id);

  return NextResponse.json(games);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = get_db();

  // Verify user is a participant
  const participant = db
    .prepare(
      `SELECT * FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`
    )
    .get(id, auth.user.id);

  if (!participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  const body = await request.json();
  const { winner_id, is_draw, notes, gif_url, played_at } = body;

  if (!is_draw && !winner_id) {
    return NextResponse.json(
      { error: "Winner or draw is required" },
      { status: 400 }
    );
  }

  // Validate notes length
  if (notes && typeof notes === "string" && notes.length > 1000) {
    return NextResponse.json(
      { error: "Notes must be 1000 characters or less" },
      { status: 400 }
    );
  }

  // Validate gif_url domain
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

  // Validate played_at date
  let validated_played_at = new Date().toISOString();
  if (played_at) {
    const parsed = new Date(played_at);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid played_at date" }, { status: 400 });
    }
    validated_played_at = parsed.toISOString();
  }

  // If winner specified, verify they are a participant
  if (winner_id) {
    const winner_participant = db
      .prepare(
        `SELECT * FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`
      )
      .get(id, winner_id);

    if (!winner_participant) {
      return NextResponse.json(
        { error: "Winner is not a participant" },
        { status: 400 }
      );
    }
  }

  const game_id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO challenge_games (id, challenge_id, winner_id, is_draw, notes, gif_url, played_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    game_id,
    id,
    is_draw ? null : winner_id,
    is_draw ? 1 : 0,
    (notes || "").trim(),
    gif_url || null,
    validated_played_at,
    auth.user.id
  );

  // Update challenge updated_at
  db.prepare(
    `UPDATE game_challenges SET updated_at = datetime('now') WHERE id = ?`
  ).run(id);

  const game = db
    .prepare(`SELECT * FROM challenge_games WHERE id = ?`)
    .get(game_id);

  return NextResponse.json(game, { status: 201 });
}
