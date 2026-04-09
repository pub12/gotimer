import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import { logAdminAction } from "@/lib/audit-log";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();
  const pages = db
    .prepare(`SELECT * FROM timer_pages ORDER BY created_at DESC`)
    .all();

  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { slug, title, timer_type, intro_html, faq_json, meta_title, meta_description, timer_config_json, character_id } = body;

  if (!slug || !title || !timer_type) {
    return NextResponse.json({ error: "slug, title, and timer_type are required" }, { status: 400 });
  }

  const db = get_db();
  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO timer_pages (id, slug, title, timer_type, intro_html, faq_json, meta_title, meta_description, timer_config_json, character_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`
  ).run(
    id,
    slug,
    title,
    timer_type,
    intro_html ?? "",
    faq_json ?? "[]",
    meta_title ?? "",
    meta_description ?? "",
    timer_config_json ?? "{}",
    character_id ?? null
  );

  const page = db.prepare(`SELECT * FROM timer_pages WHERE id = ?`).get(id);

  logAdminAction(db, auth.user.id, "create", "timer_page", id, null, JSON.stringify({ slug, title, timer_type }));

  return NextResponse.json(page, { status: 201 });
}
