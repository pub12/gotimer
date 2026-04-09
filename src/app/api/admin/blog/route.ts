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
  const posts = db
    .prepare(`SELECT * FROM blog_posts ORDER BY created_at DESC`)
    .all();

  return NextResponse.json({ posts });
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
  const {
    slug,
    title,
    content,
    category_id,
    meta_title,
    meta_description,
    character_id,
    faq_json,
    publish_date,
  } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }

  const db = get_db();
  const id = crypto.randomUUID();

  // Determine status: if publish_date is in the future, use "scheduled"; otherwise "draft"
  let status = "draft";
  if (publish_date) {
    const pd = new Date(publish_date);
    if (!isNaN(pd.getTime()) && pd > new Date()) {
      status = "scheduled";
    }
  }

  db.prepare(
    `INSERT INTO blog_posts (id, slug, title, content, category_id, meta_title, meta_description, character_id, faq_json, status, publish_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).run(
    id,
    slug,
    title,
    content ?? "",
    category_id ?? null,
    meta_title ?? "",
    meta_description ?? "",
    character_id ?? null,
    faq_json ?? "[]",
    status,
    publish_date ?? null
  );

  const post = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(id);

  logAdminAction(db, auth.user.id, "create", "blog_post", id, null, JSON.stringify({ slug, title, status }));

  return NextResponse.json(post, { status: 201 });
}
