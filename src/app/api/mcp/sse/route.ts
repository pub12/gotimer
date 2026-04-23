import { createSession, deleteSession, sendSSE } from "@/lib/mcp-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionId = crypto.randomUUID();

  const stream = new ReadableStream({
    start(controller) {
      createSession(sessionId, controller);

      // Send the endpoint event — tells the client where to POST messages
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
      "Access-Control-Allow-Origin": "*",
    },
  });
}
