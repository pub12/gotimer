import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get("email");
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email parameter required" }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const db = get_db();
  const user = db
    .prepare(
      `SELECT id, name, profile_picture_url FROM hazo_users WHERE LOWER(email_address) = ?`
    )
    .get(trimmed) as { id: string; name: string | null; profile_picture_url: string | null } | undefined;

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    name: user.name || "Unknown",
    profilePic: user.profile_picture_url || null,
  });
}
