import { NextRequest, NextResponse } from "next/server";
import { get_db, get_challenge_scores } from "@/lib/db";

// GET /api/v1/challenges/:id — public for public challenges, no auth needed
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = get_db();

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json(
      { status: "error", error: "Challenge not found" },
      { status: 404 }
    );
  }

  if (!challenge.is_public) {
    return NextResponse.json(
      { status: "error", error: "Challenge is private" },
      { status: 403 }
    );
  }

  const participants = db
    .prepare(
      `SELECT cp.user_id, cp.role, cp.score_override FROM challenge_participants cp WHERE cp.challenge_id = ?`
    )
    .all(id) as { user_id: string; role: string; score_override: number | null }[];

  const scores = get_challenge_scores(db, id, participants);

  const games = db
    .prepare(
      `SELECT id, winner_id, is_draw, played_at, points FROM challenge_games WHERE challenge_id = ? ORDER BY played_at DESC`
    )
    .all(id);

  const draws = db
    .prepare(
      `SELECT COUNT(*) as count FROM challenge_games WHERE challenge_id = ? AND is_draw = 1`
    )
    .get(id) as { count: number };

  // Build leaderboard
  const leaderboard = participants
    .map((p) => ({
      user_id: p.user_id,
      role: p.role,
      score: scores[p.user_id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({
    status: "ok",
    data: {
      challenge,
      leaderboard,
      games,
      draws: draws.count,
    },
  });
}
