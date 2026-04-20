import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";
import { verify_blog_api_key, unauthorized_response } from "@/lib/blog-api-auth";

/**
 * Single blog post endpoint by slug.
 *
 * GET /api/blog/manage/:slug — Fetch full post data by slug
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
  }

  const { slug } = await params;
  const db = get_db();

  const post = db.prepare(`
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug
    FROM blog_posts bp
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    WHERE bp.slug = ?
  `).get(slug) as Record<string, unknown> | undefined;

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Parse faq_json from string to array
  if (typeof post.faq_json === "string") {
    try {
      post.faq_json = JSON.parse(post.faq_json as string);
    } catch {
      post.faq_json = [];
    }
  }

  return NextResponse.json({ post });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
  }

  const { slug } = await params;
  const body = await request.json();
  const db = get_db();

  const existing_post = db
    .prepare(`SELECT * FROM blog_posts WHERE slug = ?`)
    .get(slug) as Record<string, unknown> | undefined;

  if (!existing_post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

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

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  if (updates.status === "published" && !existing_post.publish_date) {
    updates.publish_date = new Date().toISOString();
  }

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

  return NextResponse.json({ success: true, action: "updated", post });
}
