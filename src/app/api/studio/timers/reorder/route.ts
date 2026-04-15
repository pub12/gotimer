import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }

    const db = get_db();

    const updateStmt = db.prepare(
      `UPDATE saved_timers SET sort_order = ?, updated_at = ? WHERE id = ? AND user_id = ?`
    );

    const now = new Date().toISOString();

    const updateAll = db.transaction(() => {
      for (const item of items) {
        if (!item.id || typeof item.sort_order !== "number") continue;
        updateStmt.run(item.sort_order, now, item.id, auth.user.id);
      }
    });

    updateAll();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering timers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
