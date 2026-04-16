import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = auth.user.email_address?.toLowerCase();
  if (!email) {
    return NextResponse.json({ linked: 0 });
  }

  const db = get_db();

  // Find pending invitations for this email that haven't been linked yet
  const unlinked = db
    .prepare(
      `SELECT id FROM challenge_invitations
       WHERE LOWER(invited_email) = ? AND invited_user_id IS NULL AND status = 'pending'`
    )
    .all(email) as { id: string }[];

  if (unlinked.length === 0) {
    return NextResponse.json({ linked: 0 });
  }

  // Link them to this user
  const update_stmt = db.prepare(
    `UPDATE challenge_invitations SET invited_user_id = ? WHERE id = ?`
  );
  const link_all = db.transaction(() => {
    for (const inv of unlinked) {
      update_stmt.run(auth.user.id, inv.id);
    }
  });
  link_all();

  return NextResponse.json({ linked: unlinked.length });
}
