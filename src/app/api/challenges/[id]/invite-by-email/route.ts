import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import { send_email } from "hazo_notify/emailer";
import { build_invite_email } from "@/lib/invite-email";
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
  const body = await request.json();
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Don't allow inviting yourself
  if (email === auth.user.email_address?.toLowerCase()) {
    return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
  }

  const db = get_db();

  // Verify challenge exists and user is a participant
  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const is_participant = db
    .prepare(`SELECT id FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`)
    .get(id, auth.user.id);

  if (!is_participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  // Check if email already has a pending invitation for this challenge
  const existing_invite = db
    .prepare(
      `SELECT id FROM challenge_invitations WHERE challenge_id = ? AND invited_email = ? AND status = 'pending'`
    )
    .get(id, email);

  if (existing_invite) {
    return NextResponse.json(
      { error: "This person already has a pending invitation" },
      { status: 409 }
    );
  }

  // Check if the email belongs to someone already a participant
  const user = db
    .prepare(`SELECT id, name, profile_picture_url FROM hazo_users WHERE LOWER(email_address) = ?`)
    .get(email) as { id: string; name: string | null; profile_picture_url: string | null } | undefined;

  if (user) {
    const already_participant = db
      .prepare(`SELECT id FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`)
      .get(id, user.id);

    if (already_participant) {
      return NextResponse.json(
        { error: "This person is already in the challenge" },
        { status: 409 }
      );
    }
  }

  // Create invitation
  const token = crypto.randomBytes(32).toString("hex");
  const invite_id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO challenge_invitations (id, challenge_id, token, invited_by, invited_email, invited_user_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(invite_id, id, token, auth.user.id, email, user?.id || null);

  // Build and send email
  const origin = request.headers.get("origin") || request.nextUrl.origin;
  const invite_url = `${origin}/challenges/invite/${token}`;

  const { html, text, subject } = build_invite_email({
    inviter_name: auth.user.name || "Someone",
    challenge_name: challenge.name as string,
    challenge_description: (challenge.description as string) || "",
    timer_type: (challenge.timer_type as string) || null,
    gif_url: (challenge.gif_url as string) || null,
    invite_url,
    is_existing_user: !!user,
  });

  // Send email (fire and forget — don't block on failure)
  send_email({ to: email, subject, content: { html, text } }).catch((err) =>
    console.error("Failed to send invite email:", err)
  );

  return NextResponse.json(
    {
      invitation: {
        id: invite_id,
        email,
        existingUser: !!user,
        userName: user?.name || null,
        profilePic: user?.profile_picture_url || null,
      },
    },
    { status: 201 }
  );
}
