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
    .get(id);

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const participants = db
    .prepare(`SELECT * FROM challenge_participants WHERE challenge_id = ?`)
    .all(id) as { user_id: string; role: string; score_override: number | null }[];

  const scores = get_challenge_scores(db, id, participants);

  const games_per_player = participants.map((p) => {
    const result = db
      .prepare(
        `SELECT COUNT(*) as count FROM challenge_games WHERE challenge_id = ? AND (winner_id = ? OR created_by = ?)`
      )
      .get(id, p.user_id, p.user_id) as { count: number };
    return { ...p, score: scores[p.user_id] ?? 0, games_played: result.count };
  });

  // Sort by score descending
  games_per_player.sort((a, b) => b.score - a.score);

  return NextResponse.json(games_per_player);
}
