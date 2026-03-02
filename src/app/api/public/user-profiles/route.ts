import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_ids, challenge_context } = body;

  if (!Array.isArray(user_ids) || user_ids.length === 0) {
    return NextResponse.json({ error: "user_ids array required" }, { status: 400 });
  }

  // Limit to 10 IDs per request for public endpoint
  const limited_ids = user_ids.slice(0, 10);

  try {
    const db = get_db();
    const placeholders = limited_ids.map(() => "?").join(", ");
    const rows = db
      .prepare(
        `SELECT u.id as user_id, u.name, u.profile_picture_url,
                COALESCE(up.show_public_profile_pic, 0) as show_public_profile_pic
         FROM hazo_users u
         LEFT JOIN user_preferences up ON up.user_id = u.id
         WHERE u.id IN (${placeholders})`
      )
      .all(...limited_ids) as { user_id: string; name: string | null; profile_picture_url: string | null; show_public_profile_pic: number }[];

    const found_ids = new Set(rows.map((r) => r.user_id));
    const not_found_ids = limited_ids.filter((id) => !found_ids.has(id));

    // If called from a challenge context, verify the users are participants
    // and show their pics (they agreed to a public challenge)
    let challenge_participant_ids = new Set<string>();
    if (challenge_context) {
      const participants = db
        .prepare(
          `SELECT cp.user_id FROM challenge_participants cp
           INNER JOIN game_challenges gc ON gc.id = cp.challenge_id
           WHERE cp.challenge_id = ? AND gc.is_public = 1`
        )
        .all(challenge_context) as { user_id: string }[];
      challenge_participant_ids = new Set(participants.map((p) => p.user_id));
    }

    // First name only for privacy; show pic if opted in or if they're a participant in a public challenge
    const profiles = rows.map((r) => ({
      user_id: r.user_id,
      name: (r.name || "Player").split(" ")[0],
      profile_picture_url:
        (r.show_public_profile_pic || challenge_participant_ids.has(r.user_id))
          ? (r.profile_picture_url || null)
          : null,
    }));

    return NextResponse.json({ profiles, not_found_ids });
  } catch {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}
