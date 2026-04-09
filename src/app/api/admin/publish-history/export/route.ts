import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

type HistoryRow = {
  id: string;
  page_slug: string;
  action: string;
  timestamp: string;
  admin_user_id: string;
  manual_index_date: string | null;
};

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();
  const rows = db
    .prepare(
      `SELECT * FROM page_publish_history ORDER BY timestamp DESC`
    )
    .all() as HistoryRow[];

  const header = "page_slug,action,timestamp,admin_user_id\n";
  const body = rows
    .map((r) => {
      const escape = (v: string) =>
        `"${(v ?? "").toString().replace(/"/g, '""')}"`;
      return [
        escape(r.page_slug),
        escape(r.action),
        escape(r.timestamp),
        escape(r.admin_user_id),
      ].join(",");
    })
    .join("\n");

  const csv = header + body;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="publish-history-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
