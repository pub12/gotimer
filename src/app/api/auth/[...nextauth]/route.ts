// Route: /api/auth/[...nextauth]
// Wrapper: await Promise-based params (Next.js 16) before passing to hazo_auth's
// NextAuth handler, which expects synchronous params. Pass original NextRequest
// so .nextUrl is preserved (hazo_auth's proxy rewrite breaks .nextUrl).
import { NextRequest } from "next/server";
import { nextauthGET as _GET, nextauthPOST as _POST } from "hazo_auth/server/routes";

type Ctx = { params: Promise<{ nextauth: string[] }> };

export async function GET(request: NextRequest, context: Ctx) {
  const params = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _GET(request, { params } as any);
}

export async function POST(request: NextRequest, context: Ctx) {
  const params = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _POST(request, { params } as any);
}
