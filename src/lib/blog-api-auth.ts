import { NextRequest, NextResponse } from "next/server";

export function verify_blog_api_key(request: NextRequest): boolean {
  const key = process.env.BLOG_API_KEY;
  if (!key) return false;

  const auth_header = request.headers.get("authorization");
  if (!auth_header?.startsWith("Bearer ")) return false;

  return auth_header.slice(7) === key;
}

export function unauthorized_response() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
