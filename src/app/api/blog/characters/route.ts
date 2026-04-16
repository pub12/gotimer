import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";
import { verify_blog_api_key, unauthorized_response } from "@/lib/blog-api-auth";

/**
 * API key-authenticated character listing endpoint.
 *
 * GET /api/blog/characters — List all available characters with IDs
 */

export async function GET(request: NextRequest) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
  }

  const db = get_db();
  const characters = db
    .prepare(`SELECT id, character_name, file_path, scene_description FROM character_images ORDER BY character_name`)
    .all();

  return NextResponse.json({ characters });
}
