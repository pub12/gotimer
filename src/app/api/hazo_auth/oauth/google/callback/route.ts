// Wrapped hazo_auth OAuth callback - fixes redirect URL behind reverse proxy
import { oauthGoogleCallbackGET } from "hazo_auth/server/routes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = await oauthGoogleCallbackGET(req);

  // Debug: log what hazo_auth's get_origin_url produced
  const location = response.headers.get("location");
  const publicUrl = process.env.NEXTAUTH_URL;
  console.log(`[OAuth Fix] Location from hazo_auth: ${location}`);
  console.log(`[OAuth Fix] NEXTAUTH_URL: ${publicUrl}`);

  // Fix redirect URL: replace internal localhost origin with public NEXTAUTH_URL
  if (location && publicUrl) {
    try {
      const locUrl = new URL(location);
      const publicOrigin = publicUrl.replace(/\/$/, "");

      if (locUrl.origin !== publicOrigin) {
        const fixedLocation = location.replace(locUrl.origin, publicOrigin);
        console.log(`[OAuth Fix] Rewriting: ${location} -> ${fixedLocation}`);

        const fixedResponse = new NextResponse(null, {
          status: response.status,
          headers: {
            Location: fixedLocation,
          },
        });
        // Copy all cookies from original response
        response.headers.getSetCookie().forEach((cookie) => {
          fixedResponse.headers.append("set-cookie", cookie);
        });
        return fixedResponse;
      }
    } catch {
      // URL parse failed, return original
    }
  }

  return response;
}
