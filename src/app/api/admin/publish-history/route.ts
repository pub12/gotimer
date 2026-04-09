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

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const db = get_db();

  const events = slug
    ? db
        .prepare(
          `SELECT * FROM page_publish_history WHERE page_slug = ? ORDER BY timestamp DESC`
        )
        .all(slug)
    : db
        .prepare(
          `SELECT * FROM page_publish_history ORDER BY timestamp DESC LIMIT 500`
        )
        .all();

  return NextResponse.json(events);
}
