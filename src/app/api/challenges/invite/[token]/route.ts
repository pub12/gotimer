import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = get_db();

  const invitation = db
    .prepare(
      `SELECT ci.*, gc.name as challenge_name, gc.description as challenge_description, gc.status as challenge_status
       FROM challenge_invitations ci
       INNER JOIN game_challenges gc ON gc.id = ci.challenge_id
       WHERE ci.token = ?`
    )
    .get(token) as Record<string, unknown> | undefined;

  if (!invitation) {
    return NextResponse.json(
      { error: "Invitation not found" },
      { status: 404 }
    );
  }

  const participant_count = db
    .prepare(
      `SELECT COUNT(*) as count FROM challenge_participants WHERE challenge_id = ?`
    )
    .get(invitation.challenge_id as string) as { count: number };

  return NextResponse.json({
    challenge_name: invitation.challenge_name,
    challenge_description: invitation.challenge_description,
    challenge_status: invitation.challenge_status,
    status: invitation.status,
    participant_count: participant_count.count,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;
  const db = get_db();

  const invitation = db
    .prepare(
      `SELECT * FROM challenge_invitations WHERE token = ? AND status = 'pending'`
    )
    .get(token) as Record<string, unknown> | undefined;

  if (!invitation) {
    return NextResponse.json(
      { error: "Invitation not found or already used" },
      { status: 404 }
    );
  }

  // Check if user is already a participant
  const existing = db
    .prepare(
      `SELECT * FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`
    )
    .get(invitation.challenge_id as string, auth.user.id);

  if (existing) {
    return NextResponse.json({
      message: "Already a participant",
      challenge_id: invitation.challenge_id,
    });
  }

  const participant_id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO challenge_participants (id, challenge_id, user_id, role) VALUES (?, ?, ?, 'participant')`
  ).run(participant_id, invitation.challenge_id, auth.user.id);

  // Mark invitation as accepted
  db.prepare(
    `UPDATE challenge_invitations SET status = 'accepted' WHERE id = ?`
  ).run(invitation.id);

  return NextResponse.json({
    success: true,
    challenge_id: invitation.challenge_id,
  });
}
