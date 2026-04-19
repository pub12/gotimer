#!/usr/bin/env node
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
  {
    name: "create_timer",
    description: "Creates a live timer on GoTimer and returns a shareable URL. The timer starts immediately — all users opening the URL see the same synchronized countdown. Accepts strategy types (countdown, chess-clock, round-timer, interval, etc.) and preset names (pomodoro, hiit, meditation, tabata, etc.). Use list_timer_types for strategies and list_timer_presets for presets.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Timer type — accepts strategy IDs (countdown, chess-clock, round-timer, interval, multi-step, ambient, calculator-timer, multi-timer, turn-timer, enlarger) or preset IDs (pomodoro, hiit, tabata, meditation, etc.). Use list_timer_types and list_timer_presets to see all options." },
        duration: { type: "number", description: "Duration in seconds. For countdown, this is the total time. For chess-clock, time per player. For round-timer, round duration. Default: 300." },
        label: { type: "string", description: "Optional label displayed on the timer (e.g. 'Team Standup', 'Pomodoro Session')." },
        work: { type: "number", description: "Work period in seconds (interval timer only). Default: 1500." },
        rest: { type: "number", description: "Rest period in seconds (interval timer only). Default: 300." },
        rounds: { type: "number", description: "Number of rounds (interval timer only). Default: 4." },
      },
      required: ["type"],
    },
  },
  {
    name: "create_pomodoro",
    description: "Creates a Pomodoro focus timer on GoTimer. Convenience wrapper — you can also use create_timer with type 'pomodoro'. Returns a shareable URL. Default: 25 min work, 5 min break, 4 rounds.",
    inputSchema: {
      type: "object",
      properties: {
        work_minutes: { type: "number", description: "Work period in minutes. Default: 25." },
        break_minutes: { type: "number", description: "Break period in minutes. Default: 5." },
        rounds: { type: "number", description: "Number of work/break rounds. Default: 4." },
        label: { type: "string", description: "Optional label (e.g. 'Deep Work Session')." },
      },
      required: [],
    },
  },
  {
    name: "get_timer_url",
    description: "Returns a URL to a GoTimer page with pre-filled configuration. Unlike create_timer, the timer does NOT start automatically — the user sees the setup page with values pre-filled.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Timer type — accepts strategy IDs or preset IDs. Use list_timer_types and list_timer_presets to see all options." },
        duration: { type: "number", description: "Duration in seconds." },
        label: { type: "string", description: "Optional label." },
      },
      required: ["type"],
    },
  },
  {
    name: "get_embed_code",
    description: "Generates HTML embed code for a GoTimer widget that can be placed on any website. Returns an iframe snippet ready to paste into HTML.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Timer type — accepts strategy IDs or preset IDs. Use list_timer_types and list_timer_presets to see all options." },
        duration: { type: "number", description: "Duration in seconds. Default: 300." },
        theme: { type: "string", enum: ["light", "dark", "auto"], description: "Widget theme. Default: auto." },
        size: { type: "string", enum: ["compact", "standard", "large"], description: "Widget size. Default: standard." },
        controls: { type: "string", enum: ["full", "minimal", "none"], description: "Control buttons to show. Default: full." },
        autostart: { type: "boolean", description: "Whether timer starts automatically. Default: false." },
      },
      required: ["type"],
    },
  },
];

const server = new Server(
  { name: "gotimer-mcp", version: "2.0.0" },
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

      case "list_timer_presets": {
        const category = args.category;
        const params = category ? `?category=${encodeURIComponent(category)}` : "";
        const data = await api_request(`/timer-presets${params}`);
        result = data;
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

      case "create_timer": {
        const { type: timer_type, duration, label, work, rest, rounds } = args;
        if (!timer_type) throw new Error("type is required");
        const params = new URLSearchParams({ type: timer_type });
        if (duration) params.set("duration", String(duration));
        if (label) params.set("label", label);
        if (work) params.set("work", String(work));
        if (rest) params.set("rest", String(rest));
        if (rounds) params.set("rounds", String(rounds));
        const data = await api_request(`/timer-url?${params.toString()}`);
        result = {
          url: data.url,
          embed_url: data.embed_url,
          expires_at: data.expires_at,
          timer_type: data.timer_type,
          message: `Timer created! Share this link: ${data.url}`,
        };
        break;
      }

      case "create_pomodoro": {
        const work_secs = (args.work_minutes || 25) * 60;
        const break_secs = (args.break_minutes || 5) * 60;
        const pomo_rounds = args.rounds || 4;
        const params = new URLSearchParams({
          type: "interval",
          work: String(work_secs),
          rest: String(break_secs),
          rounds: String(pomo_rounds),
        });
        if (args.label) params.set("label", args.label);
        const data = await api_request(`/timer-url?${params.toString()}`);
        result = {
          url: data.url,
          embed_url: data.embed_url,
          expires_at: data.expires_at,
          message: `Pomodoro timer created! ${args.work_minutes || 25}m work / ${args.break_minutes || 5}m break × ${pomo_rounds} rounds. Share: ${data.url}`,
        };
        break;
      }

      case "get_timer_url": {
        const { type: timer_type, duration, label } = args;
        if (!timer_type) throw new Error("type is required");
        const type_paths = { countdown: "/countdown", "chess-clock": "/chess-clock", "round-timer": "/round-timer", interval: "/countdown" };
        const path = type_paths[timer_type] || "/countdown";
        const params = new URLSearchParams();
        if (duration) params.set("duration", String(duration));
        if (label) params.set("label", label);
        const base = API_BASE.replace("/api/v1", "");
        const qs = params.toString();
        const url = `${base}${path}${qs ? `?${qs}` : ""}`;
        result = {
          url,
          message: `Timer page URL: ${url}`,
        };
        break;
      }

      case "get_embed_code": {
        const { type: timer_type, duration, theme, size, controls, autostart } = args;
        if (!timer_type) throw new Error("type is required");
        const params = new URLSearchParams({ type: timer_type });
        if (duration) params.set("duration", String(duration));
        if (theme) params.set("theme", theme);
        if (size) params.set("size", size);
        if (controls) params.set("controls", controls);
        if (autostart) params.set("autostart", "true");
        const data = await api_request(`/timer-url/embed?${params.toString()}`);
        result = {
          html: data.html,
          url: data.url,
          message: "Embed code generated. Paste the HTML into any webpage.",
        };
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
