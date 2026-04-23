import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession, sendSSE, handleJSONRPCMessage } from "@/lib/mcp-server";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id, MCP-Protocol-Version, Accept",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

// Streamable HTTP transport (MCP 2025-06-18): POST /api/mcp/sse with JSON-RPC body.
// Used by Smithery, Claude.ai connectors, and modern MCP clients.
export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const messages = Array.isArray(body) ? body : [body];
  const responses = [];

  for (const message of messages) {
    const response = await handleJSONRPCMessage(message);
    if (response) responses.push(response);
  }

  // Notifications/responses only — no body to return
  if (responses.length === 0) {
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  const payload = Array.isArray(body) ? responses : responses[0];
  return NextResponse.json(payload, { headers: CORS_HEADERS });
}

// Legacy SSE transport: GET opens an SSE stream and tells the client to POST to /api/mcp/messages.
export async function GET() {
  const sessionId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      createSession(sessionId, controller);
      sendSSE(controller, "endpoint", `/api/mcp/messages?sessionId=${sessionId}`);
    },
    cancel() {
      deleteSession(sessionId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      ...CORS_HEADERS,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
