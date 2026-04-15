import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get("category_id");

    const db = get_db();

    let timers;
    if (category_id) {
      timers = db
        .prepare(
          `SELECT * FROM saved_timers WHERE user_id = ? AND category_id = ? ORDER BY sort_order ASC, created_at DESC`
        )
        .all(auth.user.id, category_id);
    } else {
      timers = db
        .prepare(
          `SELECT * FROM saved_timers WHERE user_id = ? ORDER BY sort_order ASC, created_at DESC`
        )
        .all(auth.user.id);
    }

    return NextResponse.json(timers);
  } catch (error) {
    console.error("Error fetching timers:", error);
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
    const { category_id, type, title, icon, accent_color, theme, config_json, sort_order } = body;

    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const db = get_db();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO saved_timers (id, user_id, category_id, type, title, icon, accent_color, theme, config_json, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      auth.user.id,
      category_id || null,
      type,
      title,
      icon || "⏱️",
      accent_color || "#E8613C",
      theme || "",
      typeof config_json === "object" ? JSON.stringify(config_json) : config_json || "{}",
      sort_order ?? 0,
      now,
      now
    );

    const timer = db.prepare(`SELECT * FROM saved_timers WHERE id = ?`).get(id);

    return NextResponse.json(timer, { status: 201 });
  } catch (error) {
    console.error("Error creating timer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
