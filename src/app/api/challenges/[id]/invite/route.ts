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

  // Verify challenge exists
  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id);

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

  const token = crypto.randomBytes(32).toString("hex");
  const invite_id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO challenge_invitations (id, challenge_id, token, invited_by) VALUES (?, ?, ?, ?)`
  ).run(invite_id, id, token, auth.user.id);

  const origin = request.headers.get("origin") || request.nextUrl.origin;
  const invite_url = `${origin}/challenges/invite/${token}`;

  return NextResponse.json({ token, invite_url }, { status: 201 });
}
