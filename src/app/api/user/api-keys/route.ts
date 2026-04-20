import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

const MAX_KEYS = 5;

export async function GET(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request, { strict: false });
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = get_db();
    const rows = db
      .prepare(`SELECT id, name, key, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC`)
      .all(auth.user.id) as { id: string; name: string; key: string; created_at: string }[];

    const api_keys = rows.map((r) => ({
      id: r.id,
      name: r.name,
      key_preview: r.key.slice(0, 12) + "...",
      created_at: r.created_at,
    }));

    return NextResponse.json({
      api_keys,
      limit: MAX_KEYS,
      remaining: MAX_KEYS - api_keys.length,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request, { strict: false });
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: "Name must be 100 characters or fewer" }, { status: 400 });
    }

    const db = get_db();

    const count = db
      .prepare(`SELECT COUNT(*) as cnt FROM api_keys WHERE user_id = ?`)
      .get(auth.user.id) as { cnt: number };

    if (count.cnt >= MAX_KEYS) {
      return NextResponse.json(
        { error: `Maximum of ${MAX_KEYS} API keys allowed. Delete an existing key first.` },
        { status: 409 }
      );
    }

    const duplicate = db
      .prepare(`SELECT id FROM api_keys WHERE user_id = ? AND name = ?`)
      .get(auth.user.id, name) as { id: string } | undefined;

    if (duplicate) {
      return NextResponse.json({ error: "An API key with this name already exists" }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const key = "gtmr_" + crypto.randomBytes(32).toString("hex");

    db.prepare(`INSERT INTO api_keys (id, user_id, key, name) VALUES (?, ?, ?, ?)`).run(
      id,
      auth.user.id,
      key,
      name
    );

    const row = db.prepare(`SELECT created_at FROM api_keys WHERE id = ?`).get(id) as { created_at: string };

    return NextResponse.json(
      {
        api_key: { id, name, key, created_at: row.created_at },
        warning: "This is the only time the full key will be shown. Store it securely.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request, { strict: false });
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const db = get_db();
    const result = db
      .prepare(`DELETE FROM api_keys WHERE id = ? AND user_id = ?`)
      .run(id, auth.user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
