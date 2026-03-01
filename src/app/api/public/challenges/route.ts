import { NextResponse } from "next/server";
import { get_db } from "@/lib/db";

export async function GET() {
  const db = get_db();
  const challenges = db
    .prepare(
      `SELECT gc.*,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
       FROM game_challenges gc
       WHERE gc.is_public = 1
       ORDER BY gc.updated_at DESC`
    )
    .all();

  const enriched = (challenges as Record<string, unknown>[]).map((c) => {
    const participants = db
      .prepare(
        `SELECT cp.user_id, cp.role FROM challenge_participants cp WHERE cp.challenge_id = ?`
      )
      .all(c.id as string);

    const scores: Record<string, number> = {};
    for (const p of participants as { user_id: string }[]) {
      const wins = db
        .prepare(
          `SELECT COUNT(*) as count FROM challenge_games WHERE challenge_id = ? AND winner_id = ? AND is_draw = 0`
        )
        .get(c.id as string, p.user_id) as { count: number };
      scores[p.user_id] = wins.count;
    }

    return { ...c, participants, scores };
  });

  return NextResponse.json(enriched);
}
