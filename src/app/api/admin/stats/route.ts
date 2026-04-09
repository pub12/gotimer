import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();

  const active_challenges = (
    db.prepare(`SELECT COUNT(*) as count FROM game_challenges WHERE status = 'active'`).get() as { count: number }
  ).count;

  const published_pages = (
    db.prepare(`SELECT COUNT(*) as count FROM timer_pages WHERE status = 'published'`).get() as { count: number }
  ).count;

  const draft_pages = (
    db.prepare(`SELECT COUNT(*) as count FROM timer_pages WHERE status = 'draft'`).get() as { count: number }
  ).count;

  const published_blog = (
    db.prepare(`SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'`).get() as { count: number }
  ).count;

  const draft_blog = (
    db.prepare(`SELECT COUNT(*) as count FROM blog_posts WHERE status = 'draft'`).get() as { count: number }
  ).count;

  const draft_pages_list = db
    .prepare(`SELECT id, slug, title, created_at, updated_at FROM timer_pages WHERE status = 'draft' ORDER BY updated_at DESC LIMIT 10`)
    .all() as { id: string; slug: string; title: string; created_at: string; updated_at: string }[];

  return NextResponse.json({
    active_challenges,
    published_pages,
    draft_pages,
    published_blog,
    draft_blog,
    draft_pages_list,
  });
}
