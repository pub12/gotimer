import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

type AdminKeyRecord = {
  key: string;
  name: string;
  created_at: string;
};

type UserKeyRow = {
  id: string;
  name: string;
  key: string;
  user_id: string;
  created_at: string;
};

// GET /api/admin/all-api-keys — list all API keys from both sources
export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();

  // Admin keys from settings table
  const settings_row = db
    .prepare(`SELECT value FROM settings WHERE key = 'api_keys'`)
    .get() as { value: string } | undefined;

  let admin_keys: { name: string; key_preview: string; created_at: string; source: "admin" }[] = [];
  if (settings_row) {
    try {
      const parsed = JSON.parse(settings_row.value) as AdminKeyRecord[];
      admin_keys = parsed.map((k) => ({
        name: k.name,
        key_preview: k.key.slice(0, 12) + "...",
        created_at: k.created_at,
        source: "admin" as const,
      }));
    } catch {
      // ignore malformed JSON
    }
  }

  // User keys from api_keys table
  const user_rows = db
    .prepare(`SELECT id, name, key, user_id, created_at FROM api_keys ORDER BY created_at DESC`)
    .all() as UserKeyRow[];

  const user_keys = user_rows.map((r) => ({
    id: r.id,
    name: r.name,
    key_preview: r.key.slice(0, 12) + "...",
    user_id: r.user_id,
    created_at: r.created_at,
    source: "user" as const,
  }));

  return NextResponse.json({
    admin_keys,
    user_keys,
    total: admin_keys.length + user_keys.length,
  });
}

// DELETE /api/admin/all-api-keys?id=xxx — revoke a user key
export async function DELETE(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query parameter is required" }, { status: 400 });
  }

  const db = get_db();
  const result = db.prepare(`DELETE FROM api_keys WHERE id = ?`).run(id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
