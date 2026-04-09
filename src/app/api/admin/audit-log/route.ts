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
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
  const offset = (page - 1) * limit;

  const db = get_db();

  const total_row = db
    .prepare(`SELECT COUNT(*) as count FROM admin_audit_log`)
    .get() as { count: number };

  const entries = db
    .prepare(
      `SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .all(limit, offset);

  return NextResponse.json({
    entries,
    total: total_row.count,
    page,
    limit,
  });
}
