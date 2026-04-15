import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(
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

    const timer = db
      .prepare(`SELECT * FROM saved_timers WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);

    if (!timer) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    return NextResponse.json(timer);
  } catch (error) {
    console.error("Error fetching timer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
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
      .get(id, auth.user.id);

    if (!existing) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    const body = await request.json();
    const { category_id, type, title, icon, accent_color, theme, config_json, sort_order } = body;
    const now = new Date().toISOString();

    db.prepare(
      `UPDATE saved_timers
       SET category_id = ?, type = ?, title = ?, icon = ?, accent_color = ?, theme = ?, config_json = ?, sort_order = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`
    ).run(
      category_id !== undefined ? category_id : (existing as any).category_id,
      type || (existing as any).type,
      title || (existing as any).title,
      icon || (existing as any).icon,
      accent_color || (existing as any).accent_color,
      theme !== undefined ? theme : (existing as any).theme,
      typeof config_json === "object"
        ? JSON.stringify(config_json)
        : config_json !== undefined
          ? config_json
          : (existing as any).config_json,
      sort_order !== undefined ? sort_order : (existing as any).sort_order,
      now,
      id,
      auth.user.id
    );

    const timer = db.prepare(`SELECT * FROM saved_timers WHERE id = ?`).get(id);

    return NextResponse.json(timer);
  } catch (error) {
    console.error("Error updating timer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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

    const result = db
      .prepare(`DELETE FROM saved_timers WHERE id = ? AND user_id = ?`)
      .run(id, auth.user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting timer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
