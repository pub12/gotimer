import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import { logAdminAction } from "@/lib/audit-log";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const db = get_db();
  const page = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id);

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const db = get_db();

  const existing = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const allowed_fields = ["slug", "title", "timer_type", "intro_html", "faq_json", "meta_title", "meta_description", "timer_config_json", "character_id", "status"];

  const updates: string[] = [];
  const values: unknown[] = [];

  for (const field of allowed_fields) {
    if (field in body) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.push(`updated_at = datetime('now')`);
  values.push(id);

  db.prepare(`UPDATE timer_pages SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  const updated = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id);

  logAdminAction(db, auth.user.id, "update", "timer_page", id, JSON.stringify(existing), JSON.stringify(body));

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const db = get_db();

  const existing = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  db.prepare(`DELETE FROM timer_pages WHERE id = ?`).run(id);

  logAdminAction(db, auth.user.id, "delete", "timer_page", id, JSON.stringify(existing), null);

  return NextResponse.json({ success: true });
}
