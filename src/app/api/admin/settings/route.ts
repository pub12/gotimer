import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

type SettingRow = { key: string; value: string; updated_at: string };

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();
  const rows = db.prepare(`SELECT key, value, updated_at FROM settings`).all() as SettingRow[];

  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const db = get_db();
  const upsert = db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  );

  const upsert_many = db.transaction((entries: [string, string][]) => {
    for (const [key, value] of entries) {
      upsert.run(key, String(value));
    }
  });

  const entries = Object.entries(body as Record<string, string>).filter(
    ([k]) => typeof k === "string" && k.length > 0
  );

  upsert_many(entries as [string, string][]);

  return NextResponse.json({ ok: true });
}
