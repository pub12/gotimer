import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const auth = await hazo_get_auth(request);
    const body = await request.json();
    const { endpoint, p256dh, auth: sub_auth } = body;

    if (!endpoint || typeof endpoint !== "string") {
      return NextResponse.json({ error: "endpoint is required" }, { status: 400 });
    }
    if (!p256dh || typeof p256dh !== "string") {
      return NextResponse.json({ error: "p256dh is required" }, { status: 400 });
    }
    if (!sub_auth || typeof sub_auth !== "string") {
      return NextResponse.json({ error: "auth is required" }, { status: 400 });
    }

    const db = get_db();
    const id = crypto.randomUUID();
    const user_id = auth.authenticated ? auth.user.id : null;

    // Remove existing subscription for this endpoint to avoid duplicates
    db.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).run(endpoint);

    db.prepare(
      `INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`
    ).run(id, user_id, endpoint, p256dh, sub_auth);

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Error storing push subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
