import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth, get_hazo_connect_instance, hazo_get_user_profiles } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

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

    // Work with result as plain JSON to avoid strict type constraints
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result as any;
    const profiles: { user_id: string; name: string | null; profile_picture_url: string | null; email?: string | null; days_since_created?: number }[] = data.profiles || [];
    const not_found_ids: string[] = data.not_found_ids || [];

    const missing_name_ids = profiles
      .filter((p) => !p.name)
      .map((p) => p.user_id);
    const ids_to_lookup = [...not_found_ids, ...missing_name_ids];

    // Fallback: query hazo_users directly for missing profiles
    if (ids_to_lookup.length > 0) {
      const db = get_db();
      const placeholders = ids_to_lookup.map(() => "?").join(", ");
      const rows = db
        .prepare(
          `SELECT id as user_id, name, email, profile_picture_url
           FROM hazo_users WHERE id IN (${placeholders})`
        )
        .all(...ids_to_lookup) as { user_id: string; name: string | null; email: string | null; profile_picture_url: string | null }[];

      const db_map = new Map(rows.map((r) => [r.user_id, r]));

      // Update existing profiles that had missing names
      for (const profile of profiles) {
        if (!profile.name && db_map.has(profile.user_id)) {
          const row = db_map.get(profile.user_id)!;
          profile.name = row.name || row.email?.split("@")[0] || null;
          if (!profile.profile_picture_url && row.profile_picture_url) {
            profile.profile_picture_url = row.profile_picture_url;
          }
        }
      }

      // Add profiles for not_found_ids that exist in hazo_users
      const found_from_db: string[] = [];
      for (const nf_id of not_found_ids) {
        if (db_map.has(nf_id)) {
          const row = db_map.get(nf_id)!;
          profiles.push({
            user_id: row.user_id,
            name: row.name || row.email?.split("@")[0] || null,
            profile_picture_url: row.profile_picture_url,
          });
          found_from_db.push(nf_id);
        }
      }

      // Update not_found_ids to exclude those we found in DB
      data.not_found_ids = not_found_ids.filter(
        (nf_id: string) => !found_from_db.includes(nf_id)
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}
