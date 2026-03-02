import { NextResponse } from "next/server";
import { get_db, get_challenge_scores } from "@/lib/db";

export async function GET() {
  const db = get_db();
  const challenges = db
    .prepare(
      `SELECT gc.*, g.name as game_name,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
       FROM game_challenges gc
       LEFT JOIN games g ON gc.game_id = g.id
       WHERE gc.is_public = 1
       ORDER BY gc.updated_at DESC`
    )
    .all();

  const enriched = (challenges as Record<string, unknown>[]).map((c) => {
    const participants = db
      .prepare(
        `SELECT cp.user_id, cp.role, cp.score_override FROM challenge_participants cp WHERE cp.challenge_id = ?`
      )
      .all(c.id as string) as { user_id: string; role: string; score_override: number | null }[];

    const scores = get_challenge_scores(db, c.id as string, participants);

    return { ...c, participants, scores };
  });

  return NextResponse.json(enriched);
}
