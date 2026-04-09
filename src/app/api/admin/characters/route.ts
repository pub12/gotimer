import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import { randomUUID } from "crypto";

type CharacterRow = {
  id: string;
  file_path: string;
  character_name: string;
  scene_description: string;
  generation_prompt: string;
  created_at: string;
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
  const characters = db
    .prepare(`SELECT * FROM character_images ORDER BY created_at DESC`)
    .all() as CharacterRow[];

  return NextResponse.json({ characters });
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { file_path, character_name, scene_description, generation_prompt } = body;

  if (!file_path || !character_name) {
    return NextResponse.json({ error: "file_path and character_name are required" }, { status: 400 });
  }

  const db = get_db();
  const id = randomUUID();

  db.prepare(
    `INSERT INTO character_images (id, file_path, character_name, scene_description, generation_prompt)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, file_path, character_name, scene_description ?? "", generation_prompt ?? "");

  return NextResponse.json({ id });
}

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
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = get_db();
  db.prepare(`DELETE FROM character_images WHERE id = ?`).run(id);

  return NextResponse.json({ ok: true });
}
