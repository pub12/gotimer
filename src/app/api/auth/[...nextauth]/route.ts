// Route: /api/auth/[...nextauth]
// Wrapper: hazo_auth's handler creates a plain Request (no .nextUrl) via proxy rewriting,
// which breaks NextAuth v4 that reads req.nextUrl.searchParams. We call the hazo_auth
// handler but patch the rewritten request to carry .nextUrl from the original NextRequest.
import { NextRequest } from "next/server";
import { nextauthGET as _GET, nextauthPOST as _POST } from "hazo_auth/server/routes";

type NextAuthContext = { params: Promise<{ nextauth: string[] }> };

async function callHandler(
  handler: typeof _GET,
  request: NextRequest,
  context: NextAuthContext
) {
  // Await the Promise-based params (Next.js 16 change)
  const resolvedParams = await context.params;

  // Monkey-patch: hazo_auth's rewrite_request_for_proxy returns a plain Request
  // that lacks .nextUrl. We override the handler to inject .nextUrl on the result.
  // Simplest fix: pass a Proxy around the request that intercepts the handler's
  // internal new Request() call. But that's fragile.
  //
  // Instead: patch the original request's .url to match NEXTAUTH_URL so
  // hazo_auth's rewrite_request_for_proxy returns the original request unchanged
  // (it skips rewriting when origins already match).
  const nextauthUrl = process.env.NEXTAUTH_URL;
  let req = request;
  if (nextauthUrl) {
    const publicOrigin = nextauthUrl.replace(/\/$/, "");
    const requestUrl = new URL(request.url);
    if (requestUrl.origin !== publicOrigin) {
      // Create a NextRequest with the corrected URL so origins match
      const correctedUrl = `${publicOrigin}${requestUrl.pathname}${requestUrl.search}`;
      req = new NextRequest(correctedUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        // @ts-expect-error duplex needed for streaming
        duplex: "half",
      });
    }
  }

  return handler(req, { params: resolvedParams });
}

export async function GET(request: NextRequest, context: NextAuthContext) {
  return callHandler(_GET, request, context);
}

export async function POST(request: NextRequest, context: NextAuthContext) {
  return callHandler(_POST, request, context);
}
