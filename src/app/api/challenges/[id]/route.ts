import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db, get_challenge_scores } from "@/lib/db";

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

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  // Verify user is a participant
  const participant = db
    .prepare(
      `SELECT * FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`
    )
    .get(id, auth.user.id);

  if (!participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  const participants = db
    .prepare(`SELECT * FROM challenge_participants WHERE challenge_id = ?`)
    .all(id) as { user_id: string; score_override?: number | null }[];

  const games = db
    .prepare(
      `SELECT * FROM challenge_games WHERE challenge_id = ? ORDER BY played_at DESC`
    )
    .all(id);

  const scores = get_challenge_scores(db, id, participants);

  const draws = db
    .prepare(
      `SELECT COUNT(*) as count FROM challenge_games WHERE challenge_id = ? AND is_draw = 1`
    )
    .get(id) as { count: number };

  return NextResponse.json({
    ...challenge,
    participants,
    games,
    scores,
    draws: draws.count,
    current_user_id: auth.user.id,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = get_db();

  // Only the creator can edit a challenge
  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  if (challenge.created_by !== auth.user.id) {
    return NextResponse.json(
      { error: "Only the creator can edit" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { name, description, status, gif_url, is_public, scores, pending_opponent_score } = body;

  // Handle score overrides with audit trail
  if (scores && typeof scores === "object") {
    const participants = db
      .prepare(`SELECT user_id, score_override FROM challenge_participants WHERE challenge_id = ?`)
      .all(id) as { user_id: string; score_override: number | null }[];
    const participant_map = new Map(participants.map((p) => [p.user_id, p]));

    for (const [user_id, value] of Object.entries(scores)) {
      if (!participant_map.has(user_id)) {
        return NextResponse.json({ error: `Invalid participant: ${user_id}` }, { status: 400 });
      }
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        return NextResponse.json({ error: `Score must be a non-negative integer` }, { status: 400 });
      }
    }

    const current_scores = get_challenge_scores(db, id, participants);

    const update_score = db.prepare(
      `UPDATE challenge_participants SET score_override = ?, score_changed_by = ?, score_changed_at = datetime('now'), score_changed_from = ? WHERE challenge_id = ? AND user_id = ?`
    );
    for (const [user_id, value] of Object.entries(scores)) {
      const old_score = current_scores[user_id] ?? 0;
      if (value !== old_score) {
        update_score.run(value, auth.user.id, old_score, id, user_id);
      }
    }
  }

  const updates: string[] = [];
  const values: unknown[] = [];

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 100) {
      return NextResponse.json({ error: "Name must be 1-100 characters" }, { status: 400 });
    }
    updates.push("name = ?");
    values.push(name.trim());
  }
  if (description !== undefined) {
    if (typeof description !== "string" || description.length > 500) {
      return NextResponse.json({ error: "Description must be 500 characters or less" }, { status: 400 });
    }
    updates.push("description = ?");
    values.push(description.trim());
  }
  if (status !== undefined) {
    if (!["active", "completed", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.push("status = ?");
    values.push(status);
  }
  if (gif_url !== undefined) {
    if (gif_url) {
      try {
        const url = new URL(gif_url);
        if (!url.hostname.endsWith("giphy.com")) {
          return NextResponse.json({ error: "Only GIPHY URLs are allowed" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid gif_url" }, { status: 400 });
      }
      updates.push("gif_url = ?");
      values.push(gif_url);
    } else {
      updates.push("gif_url = ?");
      values.push(null);
    }
  }

  if (is_public !== undefined) {
    updates.push("is_public = ?");
    values.push(is_public ? 1 : 0);
  }

  if (pending_opponent_score !== undefined) {
    if (pending_opponent_score === null) {
      updates.push("pending_opponent_score = ?");
      values.push(null);
    } else if (typeof pending_opponent_score === "number" && Number.isInteger(pending_opponent_score) && pending_opponent_score >= 0) {
      updates.push("pending_opponent_score = ?");
      values.push(pending_opponent_score);
    } else {
      return NextResponse.json({ error: "pending_opponent_score must be a non-negative integer" }, { status: 400 });
    }
  }

  if (updates.length === 0 && !scores) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    values.push(id);
    db.prepare(
      `UPDATE game_challenges SET ${updates.join(", ")} WHERE id = ?`
    ).run(...values);
  } else if (scores) {
    db.prepare(`UPDATE game_challenges SET updated_at = datetime('now') WHERE id = ?`).run(id);
  }

  const updated = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id);

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = get_db();

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  if (challenge.created_by !== auth.user.id) {
    return NextResponse.json(
      { error: "Only the creator can delete" },
      { status: 403 }
    );
  }

  db.prepare(`DELETE FROM game_challenges WHERE id = ?`).run(id);

  return NextResponse.json({ success: true });
}
