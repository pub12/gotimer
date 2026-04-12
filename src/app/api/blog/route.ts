import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const db = get_db();

  let rows;
  if (category) {
    rows = db
      .prepare(
        `SELECT bp.*, ci.id AS char_id, ci.file_path AS char_file_path, ci.character_name AS char_name
         FROM blog_posts bp
         JOIN blog_categories bc ON bp.category_id = bc.id
         LEFT JOIN character_images ci ON bp.character_id = ci.id
         WHERE bp.status = 'published' AND bc.slug = ?
         ORDER BY bp.publish_date DESC`
      )
      .all(category) as Record<string, unknown>[];
  } else {
    rows = db
      .prepare(
        `SELECT bp.*, ci.id AS char_id, ci.file_path AS char_file_path, ci.character_name AS char_name
         FROM blog_posts bp
         LEFT JOIN character_images ci ON bp.character_id = ci.id
         WHERE bp.status = 'published'
         ORDER BY bp.publish_date DESC`
      )
      .all() as Record<string, unknown>[];
  }

  const posts = rows.map(({ char_id, char_file_path, char_name, ...post }) => ({
    ...post,
    character: char_id
      ? { id: char_id, file_path: char_file_path, character_name: char_name }
      : null,
  }));

  return NextResponse.json({ posts });
}
