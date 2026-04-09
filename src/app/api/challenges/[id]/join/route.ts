import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

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

  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const body = await request.json();
  const { join_code } = body;

  if (!join_code || typeof join_code !== "string") {
    return NextResponse.json({ error: "join_code is required" }, { status: 400 });
  }

  if (challenge.join_code !== join_code.trim().toUpperCase()) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 403 });
  }

  // Check if already a participant
  const existing = db
    .prepare(`SELECT * FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`)
    .get(id, auth.user.id);

  if (!existing) {
    const participant_id = crypto.randomUUID();
    db.prepare(
      `INSERT INTO challenge_participants (id, challenge_id, user_id, role) VALUES (?, ?, ?, 'participant')`
    ).run(participant_id, id, auth.user.id);
  }

  const participants = db
    .prepare(`SELECT * FROM challenge_participants WHERE challenge_id = ?`)
    .all(id);

  return NextResponse.json({ ...challenge, participants });
}
