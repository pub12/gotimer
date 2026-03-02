import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db, get_challenge_scores } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();
  const challenges = db
    .prepare(
      `SELECT gc.*,
        (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
       FROM game_challenges gc
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
