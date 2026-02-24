import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const api_key = process.env.GIPHY_API_KEY;
  if (!api_key || api_key === "YOUR_GIPHY_API_KEY") {
    return NextResponse.json(
      { error: "GIPHY API key not configured" },
      { status: 500 }
    );
  }

  const search_params = request.nextUrl.searchParams;
  const q = search_params.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  // Clamp and validate limit/offset
  const raw_limit = parseInt(search_params.get("limit") || "20", 10);
  const raw_offset = parseInt(search_params.get("offset") || "0", 10);
  const limit = Math.min(Math.max(1, isNaN(raw_limit) ? 20 : raw_limit), 50);
  const offset = Math.max(0, isNaN(raw_offset) ? 0 : raw_offset);

  const giphy_url = new URL("https://api.giphy.com/v1/gifs/search");
  giphy_url.searchParams.set("api_key", api_key);
  giphy_url.searchParams.set("q", q);
  giphy_url.searchParams.set("limit", limit.toString());
  giphy_url.searchParams.set("offset", offset.toString());
  giphy_url.searchParams.set("rating", "pg");

  try {
    const response = await fetch(giphy_url.toString());
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from GIPHY" },
        { status: 502 }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to GIPHY" },
      { status: 502 }
    );
  }
}
