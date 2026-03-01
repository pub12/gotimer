import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = get_db();
  const games = db
    .prepare(`SELECT id, name FROM games ORDER BY name ASC`)
    .all();

  return NextResponse.json(games);
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "Name must be 100 characters or less" }, { status: 400 });
  }

  const db = get_db();
  const trimmed = name.trim();

  // Check if game already exists (case-insensitive)
  const existing = db
    .prepare(`SELECT id, name FROM games WHERE LOWER(name) = LOWER(?)`)
    .get(trimmed) as { id: string; name: string } | undefined;

  if (existing) {
    return NextResponse.json(existing);
  }

  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO games (id, name, created_by) VALUES (?, ?, ?)`
  ).run(id, trimmed, auth.user.id);

  return NextResponse.json({ id, name: trimmed }, { status: 201 });
}
