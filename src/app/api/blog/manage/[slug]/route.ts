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
