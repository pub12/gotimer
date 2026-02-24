import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth, get_hazo_connect_instance, hazo_get_user_profiles } from "hazo_auth/server-lib";

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { user_ids } = body;

  if (!Array.isArray(user_ids) || user_ids.length === 0) {
    return NextResponse.json({ error: "user_ids array required" }, { status: 400 });
  }

  // Limit to 50 IDs per request
  const limited_ids = user_ids.slice(0, 50);

  try {
    const adapter = get_hazo_connect_instance();
    const result = await hazo_get_user_profiles(adapter, limited_ids);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}
