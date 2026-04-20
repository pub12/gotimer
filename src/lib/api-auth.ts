import { NextRequest } from "next/server";
import { get_db } from "@/lib/db";

type ApiKeyRecord = {
  key: string;
  name: string;
  created_at: string;
};

export async function validateApiKey(
  request: NextRequest
): Promise<{ valid: boolean; key_name?: string; user_id?: string }> {
  // Check Authorization header (Bearer token) or X-API-Key header
  const auth_header = request.headers.get("Authorization");
  const x_api_key = request.headers.get("X-API-Key");

  let provided_key: string | null = null;

  if (auth_header && auth_header.startsWith("Bearer ")) {
    provided_key = auth_header.slice(7).trim();
  } else if (x_api_key) {
    provided_key = x_api_key.trim();
  }

  if (!provided_key) {
    return { valid: false };
  }

  try {
    const db = get_db();
    // Check admin keys (settings table)
    const row = db
      .prepare(`SELECT value FROM settings WHERE key = 'api_keys'`)
      .get() as { value: string } | undefined;

    if (row) {
      const api_keys: ApiKeyRecord[] = JSON.parse(row.value);
      const matched = api_keys.find((k) => k.key === provided_key);
      if (matched) {
        return { valid: true, key_name: matched.name };
      }
    }

    // Check user keys (api_keys table)
    const user_key = db
      .prepare(`SELECT name, user_id FROM api_keys WHERE key = ?`)
      .get(provided_key) as { name: string; user_id: string } | undefined;

    if (user_key) {
      return { valid: true, key_name: user_key.name, user_id: user_key.user_id };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
}
