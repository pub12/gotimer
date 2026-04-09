import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import { logAdminAction } from "@/lib/audit-log";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const db = get_db();

  const page = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  db.prepare(
    `UPDATE timer_pages SET status = 'published', published_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
  ).run(id);

  const history_id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO page_publish_history (id, page_slug, action, admin_user_id) VALUES (?, ?, 'publish', ?)`
  ).run(history_id, page.slug as string, auth.user.id);

  logAdminAction(db, auth.user.id, "publish", "timer_page", id, JSON.stringify({ status: page.status }), JSON.stringify({ status: "published" }));

  const updated = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id);
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

  const page = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  db.prepare(
    `UPDATE timer_pages SET status = 'draft', published_at = null, updated_at = datetime('now') WHERE id = ?`
  ).run(id);

  const history_id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO page_publish_history (id, page_slug, action, admin_user_id) VALUES (?, ?, 'unpublish', ?)`
  ).run(history_id, page.slug as string, auth.user.id);

  logAdminAction(db, auth.user.id, "unpublish", "timer_page", id, JSON.stringify({ status: page.status }), JSON.stringify({ status: "draft" }));

  const updated = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id);
  return NextResponse.json(updated);
}
