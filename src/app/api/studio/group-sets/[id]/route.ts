import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = get_db();
    const row = db
      .prepare(`SELECT * FROM saved_group_sets WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error("Error fetching group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = get_db();
    const existing = db
      .prepare(`SELECT * FROM saved_group_sets WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates: string[] = [];
    const values: unknown[] = [];
    if (typeof body?.name === "string" && body.name.trim().length > 0) {
      updates.push("name = ?");
      values.push(body.name.trim());
    }
    if (Array.isArray(body?.groups)) {
      updates.push("groups_json = ?");
      values.push(JSON.stringify(body.groups));
    }
    if (body?.setup && typeof body.setup === "object") {
      updates.push("setup_json = ?");
      values.push(JSON.stringify(body.setup));
    }
    if (updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }
    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);
    values.push(auth.user.id);

    db.prepare(
      `UPDATE saved_group_sets SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    ).run(...(values as never[]));

    const row = db.prepare(`SELECT * FROM saved_group_sets WHERE id = ? AND user_id = ?`).get(id, auth.user.id);
    return NextResponse.json(row);
  } catch (error) {
    console.error("Error updating group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const db = get_db();
    const result = db
      .prepare(`DELETE FROM saved_group_sets WHERE id = ? AND user_id = ?`)
      .run(id, auth.user.id);
    if (result.changes === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting group set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
