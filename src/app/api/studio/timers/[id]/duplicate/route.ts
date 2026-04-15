import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = get_db();

    const existing = db
      .prepare(`SELECT * FROM saved_timers WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id) as any;

    if (!existing) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO saved_timers (id, user_id, category_id, type, title, icon, accent_color, theme, config_json, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      newId,
      auth.user.id,
      existing.category_id,
      existing.type,
      `${existing.title} (Copy)`,
      existing.icon,
      existing.accent_color,
      existing.theme,
      existing.config_json,
      existing.sort_order,
      now,
      now
    );

    const timer = db.prepare(`SELECT * FROM saved_timers WHERE id = ?`).get(newId);

    return NextResponse.json(timer, { status: 201 });
  } catch (error) {
    console.error("Error duplicating timer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
