import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { timer_type, duration } = body;

  if (!timer_type || typeof timer_type !== "string") {
    return NextResponse.json({ error: "timer_type is required" }, { status: 400 });
  }

  if (typeof duration !== "number" || duration <= 0) {
    return NextResponse.json({ error: "duration must be a positive number" }, { status: 400 });
  }

  const db = get_db();
  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO timer_sessions (id, user_id, timer_type, duration) VALUES (?, ?, ?, ?)`
  ).run(id, auth.user.id, timer_type, Math.round(duration));

  const session = db.prepare(`SELECT * FROM timer_sessions WHERE id = ?`).get(id);

  return NextResponse.json(session, { status: 201 });
}

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timer_type = searchParams.get("timer_type");

  const db = get_db();

  let sessions;
  if (timer_type) {
    sessions = db
      .prepare(
        `SELECT * FROM timer_sessions WHERE user_id = ? AND timer_type = ? ORDER BY completed_at DESC`
      )
      .all(auth.user.id, timer_type);
  } else {
    sessions = db
      .prepare(
        `SELECT * FROM timer_sessions WHERE user_id = ? ORDER BY completed_at DESC`
      )
      .all(auth.user.id);
  }

  return NextResponse.json(sessions);
}
