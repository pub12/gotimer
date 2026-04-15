import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { category_id } = body;

    const db = get_db();

    const existing = db
      .prepare(`SELECT * FROM saved_timers WHERE id = ? AND user_id = ?`)
      .get(id, auth.user.id);

    if (!existing) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    // Verify target category belongs to user (if not null)
    if (category_id) {
      const category = db
        .prepare(`SELECT * FROM studio_categories WHERE id = ? AND user_id = ?`)
        .get(category_id, auth.user.id);

      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
    }

    const now = new Date().toISOString();

    db.prepare(
      `UPDATE saved_timers SET category_id = ?, updated_at = ? WHERE id = ? AND user_id = ?`
    ).run(category_id || null, now, id, auth.user.id);

    const timer = db.prepare(`SELECT * FROM saved_timers WHERE id = ?`).get(id);

    return NextResponse.json(timer);
  } catch (error) {
    console.error("Error moving timer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
