import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = get_db();

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ? AND is_public = 1`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const participants = db
    .prepare(`SELECT * FROM challenge_participants WHERE challenge_id = ?`)
    .all(id);

  const games = db
    .prepare(
      `SELECT * FROM challenge_games WHERE challenge_id = ? ORDER BY played_at DESC`
    )
    .all(id);

  const scores: Record<string, number> = {};
  for (const p of participants as { user_id: string }[]) {
    const wins = db
      .prepare(
        `SELECT COUNT(*) as count FROM challenge_games WHERE challenge_id = ? AND winner_id = ? AND is_draw = 0`
      )
      .get(id, p.user_id) as { count: number };
    scores[p.user_id] = wins.count;
  }

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
  });
}
