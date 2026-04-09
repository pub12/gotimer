import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";
import { validateApiKey } from "@/lib/api-auth";
import crypto from "crypto";

// POST /api/v1/challenges/:id/join — requires API key auth
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateApiKey(request);
  if (!auth.valid) {
    return NextResponse.json(
      { status: "error", error: "Unauthorized — valid API key required" },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { join_code } = body;

  if (!join_code || typeof join_code !== "string") {
    return NextResponse.json(
      { status: "error", error: "join_code is required" },
      { status: 400 }
    );
  }

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

  if (challenge.join_code !== join_code) {
    return NextResponse.json(
      { status: "error", error: "Invalid join code" },
      { status: 403 }
    );
  }

  if (challenge.format !== "group") {
    return NextResponse.json(
      { status: "error", error: "This challenge does not support joining via code" },
      { status: 400 }
    );
  }

  // Use key_name as a pseudo user_id for API-joined participants
  const participant_user_id = `api:${auth.key_name}`;

  // Check if already joined
  const existing = db
    .prepare(
      `SELECT id FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`
    )
    .get(id, participant_user_id);

  if (existing) {
    return NextResponse.json({
      status: "ok",
      data: { message: "Already a participant", challenge_id: id },
    });
  }

  const participant_id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO challenge_participants (id, challenge_id, user_id, role) VALUES (?, ?, ?, 'participant')`
  ).run(participant_id, id, participant_user_id);

  return NextResponse.json(
    {
      status: "ok",
      data: {
        message: "Joined challenge successfully",
        challenge_id: id,
        participant_id,
      },
    },
    { status: 201 }
  );
}
