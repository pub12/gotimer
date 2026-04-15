import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = get_db();

    const existing = db
      .prepare(`SELECT * FROM studio_categories WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, icon, sort_order } = body;
    const now = new Date().toISOString();

    db.prepare(
      `UPDATE studio_categories SET name = ?, icon = ?, sort_order = ?, updated_at = ? WHERE id = ? AND user_id = ?`
    ).run(
      name || (existing as any).name,
      icon || (existing as any).icon,
      sort_order !== undefined ? sort_order : (existing as any).sort_order,
      now,
      id,
      auth.user.id
    );

    const category = db.prepare(`SELECT * FROM studio_categories WHERE id = ?`).get(id);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = get_db();

    const result = db
      .prepare(`DELETE FROM studio_categories WHERE id = ? AND user_id = ?`)
      .run(id, auth.user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Timers in this category get category_id set to NULL via FK ON DELETE SET NULL

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
