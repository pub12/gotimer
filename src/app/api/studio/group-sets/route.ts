import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

interface SavedGroupSetSetup {
  names: string[];
  mode: string;
  target: number;
  exclusions: string[][];
  seed?: string;
}

function is_valid_setup(value: unknown): value is SavedGroupSetSetup {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  if (!Array.isArray(s.names) || s.names.length === 0) return false;
  if (typeof s.mode !== "string") return false;
  if (typeof s.target !== "number") return false;
  if (!Array.isArray(s.exclusions)) return false;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = get_db();
    const rows = db
      .prepare(
        `SELECT * FROM saved_group_sets WHERE user_id = ? ORDER BY created_at DESC`,
      )
      .all(auth.user.id);

    return NextResponse.json({ group_sets: rows });
  } catch (error) {
    console.error("Error fetching group sets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name_raw = typeof body?.name === "string" ? body.name.trim() : "";
    const slug = typeof body?.slug === "string" && body.slug.length > 0 ? body.slug : "default";
    const groups = body?.groups;
    const setup = body?.setup;

    if (name_raw.length === 0) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: "groups must be a non-empty array" }, { status: 400 });
    }
    if (!is_valid_setup(setup)) {
      return NextResponse.json({ error: "setup is invalid" }, { status: 400 });
    }

    const db = get_db();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO saved_group_sets (id, user_id, slug, name, groups_json, setup_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      auth.user.id,
      slug,
      name_raw,
      JSON.stringify(groups),
      JSON.stringify(setup),
      now,
      now,
    );

    const row = db.prepare(`SELECT * FROM saved_group_sets WHERE id = ?`).get(id);
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("Error creating group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
