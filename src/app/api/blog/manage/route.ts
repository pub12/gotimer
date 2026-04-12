import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";
import crypto from "crypto";

/**
 * API key-authenticated blog management endpoint.
 * Allows programmatic creation and publishing of blog posts
 * (e.g. from Claude Cowork, cron jobs, or external tools).
 *
 * Auth: Bearer token matching BLOG_API_KEY env var.
 *
 * POST /api/blog/manage — Create and optionally publish a blog post
 * GET  /api/blog/manage — List all blog posts (including drafts)
 */

function verify_api_key(request: NextRequest): boolean {
  const key = process.env.BLOG_API_KEY;
  if (!key) return false;

  const auth_header = request.headers.get("authorization");
  if (!auth_header?.startsWith("Bearer ")) return false;

  return auth_header.slice(7) === key;
}

export async function GET(request: NextRequest) {
  if (!verify_api_key(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = get_db();
  const posts = db
    .prepare(`SELECT id, slug, title, status, publish_date, category_id, created_at, updated_at FROM blog_posts ORDER BY created_at DESC`)
    .all();
  const categories = db
    .prepare(`SELECT * FROM blog_categories ORDER BY name`)
    .all();

  return NextResponse.json({ posts, categories });
}

export async function POST(request: NextRequest) {
  if (!verify_api_key(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    slug,
    title,
    content,
    category_id,
    category_name,
    meta_title,
    meta_description,
    faq_json,
    status: requested_status,
  } = body;

  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: "slug, title, and content are required" },
      { status: 400 }
    );
  }

  const db = get_db();

  // Auto-create category if category_name is provided but category_id is not
  let final_category_id = category_id ?? null;
  if (!final_category_id && category_name) {
    const existing = db
      .prepare(`SELECT id FROM blog_categories WHERE name = ? COLLATE NOCASE`)
      .get(category_name) as { id: string } | undefined;

    if (existing) {
      final_category_id = existing.id;
    } else {
      final_category_id = crypto.randomUUID();
      const cat_slug = category_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      db.prepare(`INSERT INTO blog_categories (id, slug, name, description, colour) VALUES (?, ?, ?, '', '#6366f1')`)
        .run(final_category_id, cat_slug, category_name);
    }
  }

  // Check for existing post with same slug — update instead of duplicate
  const existing_post = db
    .prepare(`SELECT id FROM blog_posts WHERE slug = ?`)
    .get(slug) as { id: string } | undefined;

  const now = new Date().toISOString();
  const status = requested_status === "published" ? "published" : "draft";
  const publish_date = status === "published" ? now : null;

  let post_id: string;

  if (existing_post) {
    // Update existing post
    post_id = existing_post.id;
    db.prepare(`
      UPDATE blog_posts
      SET title = ?, content = ?, category_id = ?, meta_title = ?, meta_description = ?,
          faq_json = ?, status = ?, publish_date = COALESCE(?, publish_date), updated_at = ?
      WHERE id = ?
    `).run(
      title,
      content,
      final_category_id,
      meta_title ?? "",
      meta_description ?? "",
      typeof faq_json === "string" ? faq_json : JSON.stringify(faq_json ?? []),
      status,
      publish_date,
      now,
      post_id
    );
  } else {
    // Create new post
    post_id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO blog_posts (id, slug, title, content, category_id, meta_title, meta_description, faq_json, status, publish_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      post_id,
      slug,
      title,
      content,
      final_category_id,
      meta_title ?? "",
      meta_description ?? "",
      typeof faq_json === "string" ? faq_json : JSON.stringify(faq_json ?? []),
      status,
      publish_date,
      now,
      now
    );
  }

  const post = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(post_id);

  return NextResponse.json({
    success: true,
    action: existing_post ? "updated" : "created",
    post,
  }, { status: existing_post ? 200 : 201 });
}
