import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = get_db();
  // Upsert default row if missing
  db.prepare(
    `INSERT OR IGNORE INTO user_preferences (user_id) VALUES (?)`
  ).run(auth.user.id);

  const row = db
    .prepare(`SELECT * FROM user_preferences WHERE user_id = ?`)
    .get(auth.user.id) as { user_id: string; show_public_profile_pic: number };

  return NextResponse.json({
    show_public_profile_pic: row.show_public_profile_pic === 1,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { show_public_profile_pic } = body;

  if (typeof show_public_profile_pic !== "boolean") {
    return NextResponse.json(
      { error: "show_public_profile_pic must be a boolean" },
      { status: 400 }
    );
  }

  const db = get_db();
  db.prepare(
    `INSERT INTO user_preferences (user_id, show_public_profile_pic)
     VALUES (?, ?)
     ON CONFLICT(user_id) DO UPDATE SET show_public_profile_pic = excluded.show_public_profile_pic`
  ).run(auth.user.id, show_public_profile_pic ? 1 : 0);

  return NextResponse.json({ show_public_profile_pic });
}
