import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.GOTIMER_API_URL || "https://gotimer.org/api/v1";
const API_KEY = process.env.GOTIMER_API_KEY || "";

async function api_request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }

  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  const json = await res.json();

  if (!res.ok || json.status === "error") {
    throw new Error(json.error || `Request failed: ${res.status}`);
  }

  return json.data || json;
}

const TOOLS = [
  {
    name: "list_timer_types",
    description: "Returns all available timer types in GoTimer with their names, descriptions, and default configurations.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "list_public_challenges",
    description: "Lists all public challenges on GoTimer with participant counts and scores.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_leaderboard",
    description: "Gets the leaderboard and game history for a specific GoTimer challenge.",
    inputSchema: {
      type: "object",
      properties: {
        challenge_id: {
          type: "string",
          description: "The UUID of the challenge to fetch.",
        },
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
        name: {
          type: "string",
          description: "The challenge name (max 100 characters).",
        },
        format: {
          type: "string",
          enum: ["head-to-head", "group", "solo"],
          description: "Challenge format. Defaults to head-to-head.",
        },
        timer_type: {
          type: "string",
          enum: ["countdown", "chess-clock", "round-timer"],
          description: "Timer type to use for this challenge.",
        },
        is_public: {
          type: "boolean",
          description: "Whether the challenge is publicly visible. Defaults to true.",
        },
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
        challenge_id: {
          type: "string",
          description: "The UUID of the challenge to join.",
        },
        join_code: {
          type: "string",
          description: "The join code for the challenge (e.g. TIMER-1234).",
        },
      },
      required: ["challenge_id", "join_code"],
    },
  },
];

const server = new Server(
  { name: "gotimer-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "list_timer_types": {
        const data = await api_request("/timers");
        result = data.timer_types || data;
        break;
      }

      case "list_public_challenges": {
        const data = await api_request("/challenges");
        result = data.challenges || data;
        break;
      }

      case "get_leaderboard": {
        const { challenge_id } = args;
        if (!challenge_id) throw new Error("challenge_id is required");
        const data = await api_request(`/challenges/${challenge_id}`);
        result = {
          challenge: data.challenge,
          leaderboard: data.leaderboard,
          draws: data.draws,
          total_games: (data.games || []).length,
        };
        break;
      }

      case "create_challenge": {
        const { name: challenge_name, format, timer_type, is_public } = args;
        if (!challenge_name) throw new Error("name is required");

        const body = { name: challenge_name };
        if (format) body.format = format;
        if (timer_type) body.timer_type = timer_type;
        if (is_public !== undefined) body.is_public = is_public;

        const data = await api_request("/challenges", {
          method: "POST",
          body: JSON.stringify(body),
        });
        result = data.challenge || data;
        break;
      }

      case "join_challenge": {
        const { challenge_id, join_code } = args;
        if (!challenge_id) throw new Error("challenge_id is required");
        if (!join_code) throw new Error("join_code is required");

        const data = await api_request(`/challenges/${challenge_id}/join`, {
          method: "POST",
          body: JSON.stringify({ join_code }),
        });
        result = data;
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
