import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

  const post = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Set publish_date only if not already set
  if (post.publish_date) {
    db.prepare(
      `UPDATE blog_posts SET status = 'published', updated_at = datetime('now') WHERE id = ?`
    ).run(id);
  } else {
    db.prepare(
      `UPDATE blog_posts SET status = 'published', publish_date = datetime('now'), updated_at = datetime('now') WHERE id = ?`
    ).run(id);
  }

  logAdminAction(db, auth.user.id, "publish", "blog_post", id, JSON.stringify({ status: post.status }), JSON.stringify({ status: "published" }));

  revalidatePath("/sitemap.xml");

  const updated = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(id);
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

  const post = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  db.prepare(
    `UPDATE blog_posts SET status = 'draft', updated_at = datetime('now') WHERE id = ?`
  ).run(id);

  logAdminAction(db, auth.user.id, "unpublish", "blog_post", id, JSON.stringify({ status: post.status }), JSON.stringify({ status: "draft" }));

  revalidatePath("/sitemap.xml");

  const updated = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(id);
  return NextResponse.json(updated);
}
