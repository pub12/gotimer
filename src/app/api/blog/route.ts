import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const db = get_db();

  let posts;
  if (category) {
    posts = db
      .prepare(
        `SELECT bp.* FROM blog_posts bp
         JOIN blog_categories bc ON bp.category_id = bc.id
         WHERE bp.status = 'published' AND bc.slug = ?
         ORDER BY bp.publish_date DESC`
      )
      .all(category);
  } else {
    posts = db
      .prepare(
        `SELECT * FROM blog_posts WHERE status = 'published' ORDER BY publish_date DESC`
      )
      .all();
  }

  return NextResponse.json({ posts });
}
