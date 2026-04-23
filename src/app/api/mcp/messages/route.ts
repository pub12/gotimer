import { NextRequest, NextResponse } from "next/server";
import { getSession, sendSSE, handleJSONRPCMessage } from "@/lib/mcp-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing sessionId parameter" },
      { status: 400 }
    );
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: "Session not found. Connect to /api/mcp/sse first." },
      { status: 404 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle single message or batch
  const messages = Array.isArray(body) ? body : [body];

  for (const message of messages) {
    const response = await handleJSONRPCMessage(message);
    if (response) {
      sendSSE(session.controller, "message", JSON.stringify(response));
    }
  }

  return new Response("Accepted", { status: 202 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
