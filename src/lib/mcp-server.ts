/**
 * MCP (Model Context Protocol) server for GoTimer.
 * Handles JSON-RPC messages and manages SSE sessions.
 * Used by /api/mcp/sse and /api/mcp/messages routes.
 */

const API_BASE = process.env.GOTIMER_API_URL || "https://gotimer.org/api/v1";

// --- Session management ---

interface MCPSession {
  controller: ReadableStreamDefaultController;
  createdAt: number;
}

const sessions = new Map<string, MCPSession>();

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Clean stale sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      try { session.controller.close(); } catch {}
      sessions.delete(id);
    }
  }
}, 60_000);

export function createSession(id: string, controller: ReadableStreamDefaultController) {
  sessions.set(id, { controller, createdAt: Date.now() });
}

export function deleteSession(id: string) {
  sessions.delete(id);
}

export function getSession(id: string): MCPSession | undefined {
  return sessions.get(id);
}

export function sendSSE(controller: ReadableStreamDefaultController, event: string, data: string) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
}

// --- Internal API helper ---

async function apiRequest(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers as Record<string, string>) } });
  const json = await res.json();

  if (!res.ok || json.status === "error") {
    throw new Error(json.error || `Request failed: ${res.status}`);
  }

  return json.data || json;
}

// --- Tool definitions ---

const TOOLS = [
  {
    name: "list_timer_types",
    description: "Returns all available timer types in GoTimer with their names, descriptions, and default configurations.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "list_timer_presets",
    description: "Lists pre-configured timer presets (e.g. Pomodoro, HIIT, Meditation, Film Development). Optionally filter by category.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["board-games", "photography", "fitness", "wellness", "productivity", "kitchen"],
          description: "Filter presets by category. Omit to list all presets.",
        },
      },
      required: [],
    },
  },
  {
    name: "list_public_challenges",
    description: "Lists all public challenges on GoTimer with participant counts and scores.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_leaderboard",
    description: "Gets the leaderboard and game history for a specific GoTimer challenge.",
    inputSchema: {
      type: "object",
      properties: {
        challenge_id: { type: "string", description: "The UUID of the challenge to fetch." },
      },
      required: ["challenge_id"],
    },
  },
  {
    name: "create_challenge",
    description: "Creates a new GoTimer challenge. Requires an API key configured via GOTIMER_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The challenge name (max 100 characters)." },
        format: { type: "string", enum: ["head-to-head", "group", "solo"], description: "Challenge format. Defaults to head-to-head." },
        timer_type: { type: "string", enum: ["countdown", "chess-clock", "round-timer"], description: "Timer type to use." },
        is_public: { type: "boolean", description: "Whether the challenge is publicly visible. Defaults to true." },
      },
      required: ["name"],
    },
  },
  {
    name: "join_challenge",
    description: "Joins a GoTimer group challenge using a join code. Requires an API key configured via GOTIMER_API_KEY.",
    inputSchema: {
      type: "object",
      properties: {
        challenge_id: { type: "string", description: "The UUID of the challenge to join." },
        join_code: { type: "string", description: "The join code for the challenge (e.g. TIMER-1234)." },
      },
      required: ["challenge_id", "join_code"],
    },
  },
  {
    name: "create_timer",
    description: "Creates a live timer on GoTimer and returns a shareable URL. Accepts strategy types (countdown, chess-clock, etc.) and preset names (pomodoro, hiit, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Timer type — strategy ID or preset ID." },
        duration: { type: "number", description: "Duration in seconds. Default: 300." },
        label: { type: "string", description: "Optional label displayed on the timer." },
        work: { type: "number", description: "Work period in seconds (interval timer only)." },
        rest: { type: "number", description: "Rest period in seconds (interval timer only)." },
        rounds: { type: "number", description: "Number of rounds (interval timer only)." },
      },
      required: ["type"],
    },
  },
  {
    name: "create_pomodoro",
    description: "Creates a Pomodoro focus timer. Default: 25 min work, 5 min break, 4 rounds.",
    inputSchema: {
      type: "object",
      properties: {
        work_minutes: { type: "number", description: "Work period in minutes. Default: 25." },
        break_minutes: { type: "number", description: "Break period in minutes. Default: 5." },
        rounds: { type: "number", description: "Number of rounds. Default: 4." },
        label: { type: "string", description: "Optional label." },
      },
      required: [],
    },
  },
  {
    name: "get_timer_url",
    description: "Returns a URL to a GoTimer page with pre-filled configuration (timer does NOT auto-start).",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Timer type — strategy ID or preset ID." },
        duration: { type: "number", description: "Duration in seconds." },
        label: { type: "string", description: "Optional label." },
      },
      required: ["type"],
    },
  },
  {
    name: "get_embed_code",
    description: "Generates HTML embed code for a GoTimer widget. Returns an iframe snippet.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Timer type — strategy ID or preset ID." },
        duration: { type: "number", description: "Duration in seconds. Default: 300." },
        theme: { type: "string", enum: ["light", "dark", "auto"], description: "Widget theme." },
        size: { type: "string", enum: ["compact", "standard", "large"], description: "Widget size." },
        controls: { type: "string", enum: ["full", "minimal", "none"], description: "Controls to show." },
        autostart: { type: "boolean", description: "Auto-start. Default: false." },
      },
      required: ["type"],
    },
  },
];

// --- Tool execution ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function executeTool(name: string, args: any) {
  switch (name) {
    case "list_timer_types": {
      const data = await apiRequest("/timers");
      return data.timer_types || data;
    }
    case "list_timer_presets": {
      const params = args.category ? `?category=${encodeURIComponent(args.category)}` : "";
      return await apiRequest(`/timer-presets${params}`);
    }
    case "list_public_challenges": {
      const data = await apiRequest("/challenges");
      return data.challenges || data;
    }
    case "get_leaderboard": {
      if (!args.challenge_id) throw new Error("challenge_id is required");
      const data = await apiRequest(`/challenges/${args.challenge_id}`);
      return { challenge: data.challenge, leaderboard: data.leaderboard, draws: data.draws, total_games: (data.games || []).length };
    }
    case "create_challenge": {
      if (!args.name) throw new Error("name is required");
      const body: Record<string, unknown> = { name: args.name };
      if (args.format) body.format = args.format;
      if (args.timer_type) body.timer_type = args.timer_type;
      if (args.is_public !== undefined) body.is_public = args.is_public;
      const data = await apiRequest("/challenges", { method: "POST", body: JSON.stringify(body) });
      return data.challenge || data;
    }
    case "join_challenge": {
      if (!args.challenge_id) throw new Error("challenge_id is required");
      if (!args.join_code) throw new Error("join_code is required");
      return await apiRequest(`/challenges/${args.challenge_id}/join`, { method: "POST", body: JSON.stringify({ join_code: args.join_code }) });
    }
    case "create_timer": {
      if (!args.type) throw new Error("type is required");
      const params = new URLSearchParams({ type: args.type });
      if (args.duration) params.set("duration", String(args.duration));
      if (args.label) params.set("label", args.label);
      if (args.work) params.set("work", String(args.work));
      if (args.rest) params.set("rest", String(args.rest));
      if (args.rounds) params.set("rounds", String(args.rounds));
      const data = await apiRequest(`/timer-url?${params.toString()}`);
      return { url: data.url, embed_url: data.embed_url, expires_at: data.expires_at, timer_type: data.timer_type, message: `Timer created! Share this link: ${data.url}` };
    }
    case "create_pomodoro": {
      const workSecs = (args.work_minutes || 25) * 60;
      const breakSecs = (args.break_minutes || 5) * 60;
      const rounds = args.rounds || 4;
      const params = new URLSearchParams({ type: "interval", work: String(workSecs), rest: String(breakSecs), rounds: String(rounds) });
      if (args.label) params.set("label", args.label);
      const data = await apiRequest(`/timer-url?${params.toString()}`);
      return { url: data.url, embed_url: data.embed_url, expires_at: data.expires_at, message: `Pomodoro timer created! ${args.work_minutes || 25}m work / ${args.break_minutes || 5}m break x ${rounds} rounds. Share: ${data.url}` };
    }
    case "get_timer_url": {
      if (!args.type) throw new Error("type is required");
      const typePaths: Record<string, string> = { countdown: "/countdown", "chess-clock": "/chess-clock", "round-timer": "/round-timer", interval: "/countdown" };
      const path = typePaths[args.type] || "/countdown";
      const params = new URLSearchParams();
      if (args.duration) params.set("duration", String(args.duration));
      if (args.label) params.set("label", args.label);
      const base = API_BASE.replace("/api/v1", "");
      const qs = params.toString();
      return { url: `${base}${path}${qs ? `?${qs}` : ""}` };
    }
    case "get_embed_code": {
      if (!args.type) throw new Error("type is required");
      const params = new URLSearchParams({ type: args.type });
      if (args.duration) params.set("duration", String(args.duration));
      if (args.theme) params.set("theme", args.theme);
      if (args.size) params.set("size", args.size);
      if (args.controls) params.set("controls", args.controls);
      if (args.autostart) params.set("autostart", "true");
      const data = await apiRequest(`/timer-url/embed?${params.toString()}`);
      return { html: data.html, url: data.url, message: "Embed code generated. Paste the HTML into any webpage." };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// --- JSON-RPC message handler ---

interface JSONRPCRequest {
  jsonrpc: "2.0";
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JSONRPCResponse {
  jsonrpc: "2.0";
  id?: string | number;
  result?: unknown;
  error?: { code: number; message: string };
}

export async function handleJSONRPCMessage(message: JSONRPCRequest): Promise<JSONRPCResponse | null> {
  const { method, id, params } = message;

  // Notifications (no id) don't get responses
  if (id === undefined) return null;

  try {
    switch (method) {
      case "initialize": {
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "gotimer-mcp", version: "2.1.0" },
          },
        };
      }

      case "tools/list": {
        return {
          jsonrpc: "2.0",
          id,
          result: { tools: TOOLS },
        };
      }

      case "tools/call": {
        const toolName = params?.name as string;
        const toolArgs = (params?.arguments || {}) as Record<string, unknown>;
        try {
          const result = await executeTool(toolName, toolArgs);
          return {
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            },
          };
        } catch (error) {
          return {
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Error: ${(error as Error).message}` }],
              isError: true,
            },
          };
        }
      }

      case "ping": {
        return { jsonrpc: "2.0", id, result: {} };
      }

      default: {
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
      }
    }
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: (error as Error).message },
    };
  }
}
