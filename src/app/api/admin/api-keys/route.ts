import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

type ApiKeyRecord = {
  key: string;
  name: string;
  created_at: string;
};

function get_api_keys(db: ReturnType<typeof get_db>): ApiKeyRecord[] {
  const row = db
    .prepare(`SELECT value FROM settings WHERE key = 'api_keys'`)
    .get() as { value: string } | undefined;

  if (!row) return [];

  try {
    return JSON.parse(row.value) as ApiKeyRecord[];
  } catch {
    return [];
  }
}

function save_api_keys(db: ReturnType<typeof get_db>, keys: ApiKeyRecord[]): void {
  db.prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES ('api_keys', ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(JSON.stringify(keys));
}

// GET /api/admin/api-keys — list keys (admin only, partial key display)
export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();
  const keys = get_api_keys(db);

  // Return partial keys (first 8 chars + "...")
  const safe_keys = keys.map((k) => ({
    name: k.name,
    key_preview: k.key.slice(0, 8) + "...",
    created_at: k.created_at,
  }));

  return NextResponse.json({ api_keys: safe_keys });
}

// POST /api/admin/api-keys — generate a new API key
export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "name must be 100 characters or less" }, { status: 400 });
  }

  const db = get_db();
  const keys = get_api_keys(db);

  // Check for duplicate name
  if (keys.some((k) => k.name === name.trim())) {
    return NextResponse.json({ error: "A key with this name already exists" }, { status: 409 });
  }

  const new_key = `gtmr_${crypto.randomBytes(32).toString("hex")}`;
  const new_record: ApiKeyRecord = {
    key: new_key,
    name: name.trim(),
    created_at: new Date().toISOString(),
  };

  keys.push(new_record);
  save_api_keys(db, keys);

  // Return the full key only once
  return NextResponse.json(
    {
      api_key: {
        name: new_record.name,
        key: new_key,
        created_at: new_record.created_at,
      },
      warning: "This is the only time the full key will be shown. Store it securely.",
    },
    { status: 201 }
  );
}

// DELETE /api/admin/api-keys?key_name=xxx — revoke a key
export async function DELETE(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const key_name = searchParams.get("key_name");

  if (!key_name) {
    return NextResponse.json({ error: "key_name query parameter is required" }, { status: 400 });
  }

  const db = get_db();
  const keys = get_api_keys(db);
  const filtered = keys.filter((k) => k.name !== key_name);

  if (filtered.length === keys.length) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  save_api_keys(db, filtered);

  return NextResponse.json({ ok: true, message: `Key "${key_name}" revoked` });
}
