import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; gameId: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, gameId } = await params;
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

  const game = db
    .prepare(
      `SELECT * FROM challenge_games WHERE id = ? AND challenge_id = ?`
    )
    .get(gameId, id) as Record<string, unknown> | undefined;

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.created_by !== auth.user.id) {
    return NextResponse.json({ error: "You can only edit your own games" }, { status: 403 });
  }

  const body = await request.json();
  const { winner_id, is_draw, notes, gif_url, played_at } = body;

  const updates: string[] = [];
  const values: unknown[] = [];

  if (winner_id !== undefined) {
    updates.push("winner_id = ?");
    values.push(winner_id);
  }
  if (is_draw !== undefined) {
    updates.push("is_draw = ?");
    values.push(is_draw ? 1 : 0);
    if (is_draw) {
      updates.push("winner_id = NULL");
    }
  }
  if (notes !== undefined) {
    if (typeof notes !== "string" || notes.length > 1000) {
      return NextResponse.json({ error: "Notes must be 1000 characters or less" }, { status: 400 });
    }
    updates.push("notes = ?");
    values.push(notes.trim());
  }
  if (gif_url !== undefined) {
    if (gif_url !== null) {
      try {
        const url = new URL(gif_url);
        if (!url.hostname.endsWith("giphy.com")) {
          return NextResponse.json({ error: "Only GIPHY URLs are allowed" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid gif_url" }, { status: 400 });
      }
    }
    updates.push("gif_url = ?");
    values.push(gif_url);
  }
  if (played_at !== undefined) {
    const parsed = new Date(played_at);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid played_at date" }, { status: 400 });
    }
    updates.push("played_at = ?");
    values.push(parsed.toISOString());
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  values.push(gameId, id);

  db.prepare(
    `UPDATE challenge_games SET ${updates.join(", ")} WHERE id = ? AND challenge_id = ?`
  ).run(...values);

  const updated = db
    .prepare(`SELECT * FROM challenge_games WHERE id = ?`)
    .get(gameId);

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; gameId: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, gameId } = await params;
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

  const game = db
    .prepare(
      `SELECT * FROM challenge_games WHERE id = ? AND challenge_id = ?`
    )
    .get(gameId, id) as Record<string, unknown> | undefined;

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.created_by !== auth.user.id) {
    return NextResponse.json({ error: "You can only delete your own games" }, { status: 403 });
  }

  db.prepare(
    `DELETE FROM challenge_games WHERE id = ? AND challenge_id = ?`
  ).run(gameId, id);

  return NextResponse.json({ success: true });
}
