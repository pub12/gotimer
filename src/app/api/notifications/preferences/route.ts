import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timer_id = searchParams.get("timer_id");

    const db = get_db();

    let prefs;
    if (timer_id) {
      prefs = db
        .prepare(
          `SELECT * FROM notification_preferences WHERE user_id = ? AND timer_id = ?`
        )
        .all(auth.user.id, timer_id);
    } else {
      prefs = db
        .prepare(
          `SELECT * FROM notification_preferences WHERE user_id = ?`
        )
        .all(auth.user.id);
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      timer_id,
      channel,
      notify_before_completion,
      notify_on_step_change,
      notify_on_agitation,
      notify_on_complete,
    } = body;

    const db = get_db();

    // Check if preference already exists for this user/timer/channel combo
    const existing = db
      .prepare(
        `SELECT id FROM notification_preferences
         WHERE user_id = ? AND COALESCE(timer_id, '') = COALESCE(?, '') AND channel = ?`
      )
      .get(auth.user.id, timer_id || null, channel || "push") as { id: string } | undefined;

    if (existing) {
      // Update existing preference
      db.prepare(
        `UPDATE notification_preferences SET
           notify_before_completion = ?,
           notify_on_step_change = ?,
           notify_on_agitation = ?,
           notify_on_complete = ?,
           updated_at = datetime('now')
         WHERE id = ?`
      ).run(
        notify_before_completion ?? 120,
        notify_on_step_change ? 1 : 0,
        notify_on_agitation ? 1 : 0,
        notify_on_complete !== false ? 1 : 0,
        existing.id
      );

      const updated = db
        .prepare(`SELECT * FROM notification_preferences WHERE id = ?`)
        .get(existing.id);
      return NextResponse.json(updated);
    }

    // Create new preference
    const id = crypto.randomUUID();

    db.prepare(
      `INSERT INTO notification_preferences
         (id, user_id, timer_id, channel, notify_before_completion, notify_on_step_change, notify_on_agitation, notify_on_complete, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).run(
      id,
      auth.user.id,
      timer_id || null,
      channel || "push",
      notify_before_completion ?? 120,
      notify_on_step_change ? 1 : 0,
      notify_on_agitation ? 1 : 0,
      notify_on_complete !== false ? 1 : 0
    );

    const created = db
      .prepare(`SELECT * FROM notification_preferences WHERE id = ?`)
      .get(id);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error saving notification preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
