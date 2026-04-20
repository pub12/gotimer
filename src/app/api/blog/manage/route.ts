import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";
import { verify_blog_api_key, unauthorized_response } from "@/lib/blog-api-auth";
import crypto from "crypto";

/**
 * API key-authenticated blog management endpoint.
 * Allows programmatic creation, updating, and publishing of blog posts
 * (e.g. from Claude Cowork, cron jobs, or external tools).
 *
 * Auth: Bearer token matching BLOG_API_KEY env var.
 *
 * GET   /api/blog/manage — List all blog posts (including drafts)
 * POST  /api/blog/manage — Create or full-update (upsert) a blog post
 * PATCH /api/blog/manage — Partial update of a blog post by slug
 */

export async function GET(request: NextRequest) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
  }

  const db = get_db();
  const { searchParams } = new URL(request.url);
  const fields = searchParams.get("fields");

  let posts;
  if (fields === "minimal") {
    posts = db
      .prepare(`SELECT id, slug, title, status, publish_date, category_id, created_at, updated_at FROM blog_posts ORDER BY created_at DESC`)
      .all();
  } else {
    posts = db
      .prepare(`
        SELECT bp.*, bc.name as category_name, bc.slug as category_slug
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        ORDER BY bp.created_at DESC
      `)
      .all();
  }

  const categories = db
    .prepare(`SELECT * FROM blog_categories ORDER BY name`)
    .all();

  return NextResponse.json({ posts, categories });
}

export async function POST(request: NextRequest) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
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
    character_id,
    featured_image,
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
    final_category_id = resolve_category(db, category_name);
  }

  // Check for existing post with same slug — update instead of duplicate
  const existing_post = db
    .prepare(`SELECT id FROM blog_posts WHERE slug = ?`)
    .get(slug) as { id: string } | undefined;

  const now = new Date().toISOString();
  const status = requested_status === "published" ? "published" : "draft";
  const publish_date = status === "published" ? now : null;
  const faq_value = typeof faq_json === "string" ? faq_json : JSON.stringify(faq_json ?? []);

  let post_id: string;

  if (existing_post) {
    // Update existing post
    post_id = existing_post.id;
    db.prepare(`
      UPDATE blog_posts
      SET title = ?, content = ?, category_id = ?, meta_title = ?, meta_description = ?,
          character_id = ?, featured_image = ?, faq_json = ?, status = ?, publish_date = COALESCE(?, publish_date), updated_at = ?
      WHERE id = ?
    `).run(
      title,
      content,
      final_category_id,
      meta_title ?? "",
      meta_description ?? "",
      character_id ?? null,
      featured_image ?? null,
      faq_value,
      status,
      publish_date,
      now,
      post_id
    );
  } else {
    // Create new post
    post_id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO blog_posts (id, slug, title, content, category_id, meta_title, meta_description, character_id, featured_image, faq_json, status, publish_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      post_id,
      slug,
      title,
      content,
      final_category_id,
      meta_title ?? "",
      meta_description ?? "",
      character_id ?? null,
      featured_image ?? null,
      faq_value,
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

export async function PATCH(request: NextRequest) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
  }

  const body = await request.json();
  const { slug } = body;

  if (!slug) {
    return NextResponse.json(
      { error: "slug is required" },
      { status: 400 }
    );
  }

  const db = get_db();

  const existing_post = db
    .prepare(`SELECT * FROM blog_posts WHERE slug = ?`)
    .get(slug) as Record<string, unknown> | undefined;

  if (!existing_post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  // Build dynamic update from only the fields present in the request body
  const allowed_fields = [
    "title", "content", "category_id", "meta_title", "meta_description",
    "character_id", "featured_image", "faq_json", "status",
  ];

  const updates: Record<string, unknown> = {};

  for (const field of allowed_fields) {
    if (body[field] !== undefined) {
      if (field === "faq_json") {
        updates[field] = typeof body[field] === "string" ? body[field] : JSON.stringify(body[field]);
      } else {
        updates[field] = body[field];
      }
    }
  }

  // Handle category_name → category_id resolution
  if (body.category_name && !body.category_id) {
    updates.category_id = resolve_category(db, body.category_name);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  // If status changed to published and post doesn't already have a publish_date, set it
  if (updates.status === "published" && !existing_post.publish_date) {
    updates.publish_date = new Date().toISOString();
  }

  // Always update the timestamp
  updates.updated_at = new Date().toISOString();

  const set_clause = Object.keys(updates).map(k => `${k} = ?`).join(", ");
  const values = Object.values(updates);

  db.prepare(`UPDATE blog_posts SET ${set_clause} WHERE slug = ?`).run(...values, slug);

  const post = db.prepare(`
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug
    FROM blog_posts bp
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    WHERE bp.slug = ?
  `).get(slug);

  return NextResponse.json({
    success: true,
    action: "updated",
    post,
  });
}

/** Resolve a category name to an ID, creating the category if it doesn't exist. */
function resolve_category(db: ReturnType<typeof get_db>, category_name: string): string {
  const existing = db
    .prepare(`SELECT id FROM blog_categories WHERE name = ? COLLATE NOCASE`)
    .get(category_name) as { id: string } | undefined;

  if (existing) {
    return existing.id;
  }

  const id = crypto.randomUUID();
  const cat_slug = category_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  db.prepare(`INSERT INTO blog_categories (id, slug, name, description, colour) VALUES (?, ?, ?, '', '#6366f1')`)
    .run(id, cat_slug, category_name);

  return id;
}
