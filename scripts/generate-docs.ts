/**
 * generate-docs.ts — Build-time script that generates documentation files
 * from the timer registry (single source of truth).
 *
 * Outputs:
 *   - public/llms.txt          (~100 lines, short-form for quick LLM context)
 *   - public/llms-full.txt     (~400 lines, full documentation)
 *   - public/api/openapi.json  (OpenAPI 3.0.3 specification)
 *
 * Usage:  npx tsx scripts/generate-docs.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

import {
  STRATEGIES,
  PRESETS,
  CATEGORIES,
  REGISTRY_CATEGORY_SLUGS,
} from "../src/lib/timer-registry";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_URL = "https://gotimer.org";
const API_BASE = `${BASE_URL}/api/v1`;
const BUILD_DATE = new Date().toISOString().split("T")[0];
const SITE_DESCRIPTION = `GoTimer is a free, browser-based timer platform for board games, fitness, photography, wellness, productivity, and cooking. No app download, no signup required — works in any modern browser at ${BASE_URL}.`;
const CONTACT = "pubs@hazoservices.com";

const strategy_list = Object.values(STRATEGIES);
const preset_list = Object.values(PRESETS);
const category_list = Object.values(CATEGORIES);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function strip_html(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function presets_for_category(slug: string) {
  return preset_list.filter((p) => p.category === slug);
}

// ---------------------------------------------------------------------------
// generate_llms_txt — short-form ~100 lines
// ---------------------------------------------------------------------------

function generate_llms_txt(): string {
  const strategy_lines = strategy_list
    .map((s) => `- **${s.name}** (${s.id}): ${s.description}`)
    .join("\n");

  const category_lines = category_list
    .map((c) => {
      const presets = presets_for_category(c.slug);
      const names = presets.map((p) => p.name).join(", ");
      return `- **${c.emoji} ${c.name}** (${presets.length} presets): ${names}`;
    })
    .join("\n");

  const setup_pages = strategy_list
    .filter((s) => s.setupRoute)
    .map((s) => `- ${s.name}: ${BASE_URL}${s.setupRoute}`)
    .join("\n");

  const category_pages = category_list
    .map((c) => `- ${c.emoji} ${c.name}: ${BASE_URL}/${c.slug}`)
    .join("\n");

  return `# GoTimer.org

> ${SITE_DESCRIPTION}

Last updated: ${BUILD_DATE}
Full documentation: ${BASE_URL}/llms-full.txt

## Timer Strategies (${strategy_list.length} engines)

${strategy_lines}

## Categories (${category_list.length})

${category_lines}

## MCP Integration

GoTimer provides an MCP server for AI assistants.

- **npm package**: gotimer-mcp
- **Claude Desktop config**:
\`\`\`json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"],
      "env": {
        "GOTIMER_API_KEY": "your-api-key"
      }
    }
  }
}
\`\`\`
- **Tools**: list_timer_types, list_timer_presets, list_public_challenges, get_leaderboard, create_challenge, join_challenge, create_timer, create_pomodoro, get_timer_url, get_embed_code

## Key URLs

- API base: ${API_BASE}
- OpenAPI spec: ${BASE_URL}/api/openapi.json
- Developer docs: ${BASE_URL}/developers
- Sitemap: ${BASE_URL}/sitemap.xml

### Strategy Setup Pages
${setup_pages}

### Category Pages
${category_pages}

## Contact

${CONTACT}
`;
}

// ---------------------------------------------------------------------------
// generate_llms_full_txt — full documentation ~400 lines
// ---------------------------------------------------------------------------

function generate_llms_full_txt(): string {
  // --- Strategies section ---
  const strategy_sections = strategy_list
    .map((s) => {
      const config_json = JSON.stringify(s.defaultConfig, null, 2)
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n");
      const lines = [
        `### ${s.name} (\`${s.id}\`)`,
        ``,
        `${s.description}`,
        ``,
        `- Route: ${BASE_URL}${s.route}`,
      ];
      if (s.setupRoute) lines.push(`- Setup: ${BASE_URL}${s.setupRoute}`);
      if (s.embedRoute) lines.push(`- Embed: ${BASE_URL}${s.embedRoute}`);
      lines.push(`- Supported params: ${s.supportedParams.join(", ")}`);
      lines.push(`- Default config:`);
      lines.push(config_json);
      return lines.join("\n");
    })
    .join("\n\n");

  // --- Categories section ---
  const category_sections = category_list
    .map((c) => {
      const presets = presets_for_category(c.slug);
      const preset_lines = presets
        .map((p) => {
          const cfg = JSON.stringify(p.defaultConfig);
          return `  - **${p.name}** (\`${p.id}\`): ${p.description} — defaults: \`${cfg}\``;
        })
        .join("\n");

      let section = `### ${c.emoji} ${c.name}\n\n${c.description}\n\n- URL: ${BASE_URL}/${c.slug}\n- Presets (${presets.length}):\n${preset_lines}`;

      if (c.faq && c.faq.length > 0) {
        const faq_lines = c.faq
          .map(
            (f) =>
              `  **Q: ${f.question}**\n  A: ${strip_html(f.answer)}`
          )
          .join("\n\n");
        section += `\n\n- FAQ:\n${faq_lines}`;
      }

      return section;
    })
    .join("\n\n");

  // --- API Reference ---
  const api_reference = `## API Reference

Base URL: ${API_BASE}

### GET /timers

List all timer strategies with names, descriptions, and default configs.

\`\`\`bash
curl ${API_BASE}/timers
\`\`\`

### GET /timer-presets

List all presets. Optionally filter by category.

\`\`\`bash
curl ${API_BASE}/timer-presets
curl "${API_BASE}/timer-presets?category=fitness"
\`\`\`

### GET /timer-url

Generate a shareable timer URL. The timer starts immediately.

\`\`\`bash
curl "${API_BASE}/timer-url?type=countdown&duration=300"
curl "${API_BASE}/timer-url?type=pomodoro"
curl "${API_BASE}/timer-url?type=hiit&work=40&rest=20&rounds=8"
\`\`\`

### GET /timer-url/embed

Generate embeddable timer HTML and URL.

\`\`\`bash
curl "${API_BASE}/timer-url/embed?type=countdown&duration=300&theme=dark&size=standard"
\`\`\`

### GET /challenges

List all public challenges with scores.

\`\`\`bash
curl ${API_BASE}/challenges
\`\`\`

### GET /challenges/:id

Get challenge details, leaderboard, and game history.

\`\`\`bash
curl ${API_BASE}/challenges/CHALLENGE_UUID
\`\`\`

### POST /challenges

Create a new challenge. Requires API key.

\`\`\`bash
curl -X POST ${API_BASE}/challenges \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Chess Rivalry", "format": "head-to-head", "timer_type": "chess-clock"}'
\`\`\`

### POST /challenges/:id/join

Join a group challenge with a join code. Requires API key.

\`\`\`bash
curl -X POST ${API_BASE}/challenges/CHALLENGE_UUID/join \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"join_code": "TIMER-1234"}'
\`\`\``;

  // --- MCP Section ---
  const mcp_section = `## MCP Server (gotimer-mcp)

GoTimer provides a Model Context Protocol server for AI assistants like Claude.

### Installation

\`\`\`json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"],
      "env": {
        "GOTIMER_API_KEY": "your-api-key"
      }
    }
  }
}
\`\`\`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| GOTIMER_API_KEY | API key for authenticated endpoints (create/join challenges) | For write ops |
| GOTIMER_API_URL | Override API base URL (default: ${API_BASE}) | No |

### Tools (10)

| Tool | Description |
|------|-------------|
| list_timer_types | Returns all available timer strategies |
| list_timer_presets | Lists pre-configured presets, optionally filtered by category |
| list_public_challenges | Lists all public challenges with scores |
| get_leaderboard | Gets leaderboard and game history for a challenge |
| create_challenge | Creates a new challenge (requires API key) |
| join_challenge | Joins a group challenge with a join code (requires API key) |
| create_timer | Creates a live timer and returns a shareable URL |
| create_pomodoro | Convenience wrapper for Pomodoro focus timers |
| get_timer_url | Returns a pre-filled setup page URL (timer does not auto-start) |
| get_embed_code | Generates HTML embed code for a timer widget |`;

  // --- Embed Section ---
  const embed_section = `## Embedding Timers

Embed GoTimer widgets on any website with an iframe.

### Example

\`\`\`html
<iframe src="${BASE_URL}/embed/countdown?duration=300"
  width="480" height="400" frameborder="0"
  allow="autoplay" loading="lazy"
  style="border-radius: 8px;"></iframe>
\`\`\`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Strategy or preset ID (e.g. countdown, pomodoro, hiit) |
| duration | number | Duration in seconds |
| theme | string | light, dark, or auto (default: auto) |
| size | string | compact, standard, or large (default: standard) |
| controls | string | full, minimal, or none (default: full) |
| autostart | boolean | Whether timer starts automatically (default: false) |
| label | string | Optional label displayed on the timer |

### Size Dimensions

| Size | Width | Height |
|------|-------|--------|
| compact | 300px | 250px |
| standard | 480px | 400px |
| large | 640px | 500px |`;

  // --- Who is it for ---
  const who_lines = category_list
    .map((c) => `- **${c.emoji} ${c.name}**: ${c.description}`)
    .join("\n");

  const who_section = `## Who Is GoTimer For?

${who_lines}
- Anyone needing a simple, distraction-free timer in the browser`;

  // --- Pages table ---
  const pages_rows: string[] = [];
  pages_rows.push(`| Page | URL |`);
  pages_rows.push(`|------|-----|`);
  pages_rows.push(`| Home | ${BASE_URL} |`);

  for (const s of strategy_list) {
    if (s.setupRoute) {
      pages_rows.push(`| ${s.name} Setup | ${BASE_URL}${s.setupRoute} |`);
    }
    pages_rows.push(`| ${s.name} | ${BASE_URL}${s.route} |`);
    if (s.embedRoute) {
      pages_rows.push(`| ${s.name} Embed | ${BASE_URL}${s.embedRoute} |`);
    }
  }

  for (const c of category_list) {
    pages_rows.push(`| ${c.emoji} ${c.name} | ${BASE_URL}/${c.slug} |`);
  }

  pages_rows.push(`| Developer Docs | ${BASE_URL}/developers |`);
  pages_rows.push(`| Public Challenges | ${BASE_URL}/public-challenges |`);
  pages_rows.push(`| Privacy Policy | ${BASE_URL}/privacy-policy |`);
  pages_rows.push(`| Terms of Service | ${BASE_URL}/terms-of-service |`);
  pages_rows.push(`| Sitemap | ${BASE_URL}/sitemap.xml |`);

  const pages_section = `## Pages

${pages_rows.join("\n")}`;

  return `# GoTimer.org — Full Documentation

> ${SITE_DESCRIPTION}

Website: ${BASE_URL}
Category: Web Application / Timer Platform
Price: Free (no ads)
Platform: Any modern web browser (mobile, tablet, desktop)
Account Required: No (timers work without login; challenges require a free account)
Last updated: ${BUILD_DATE}

---

## Overview

${SITE_DESCRIPTION}

GoTimer offers ${strategy_list.length} timer strategies, ${preset_list.length} specialized presets across ${category_list.length} categories, and a challenge tracking system for competitive play.

---

## Timer Strategies (${strategy_list.length})

${strategy_sections}

---

## Categories (${category_list.length})

${category_sections}

---

${api_reference}

---

${mcp_section}

---

${embed_section}

---

${who_section}

---

${pages_section}

---

## Contact

For support or feature requests: ${CONTACT}
`;
}

// ---------------------------------------------------------------------------
// generate_openapi_json — OpenAPI 3.0.3 spec
// ---------------------------------------------------------------------------

function generate_openapi_json(): string {
  const strategy_ids = strategy_list.map((s) => s.id);
  const category_slugs = REGISTRY_CATEGORY_SLUGS;

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "GoTimer API",
      description: `Public REST API for GoTimer — ${strategy_list.length} timer strategies, ${preset_list.length} presets across ${category_list.length} categories. Manage timers, presets, embeds, and challenges.`,
      version: "2.0.0",
      contact: {
        name: "GoTimer",
        url: `${BASE_URL}/developers`,
        email: CONTACT,
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: API_BASE,
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          description:
            "API key as Bearer token. Obtain keys from your GoTimer admin panel.",
        },
        ApiKeyHeader: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API key in X-API-Key header.",
        },
      },
      schemas: {
        TimerStrategy: {
          type: "object",
          properties: {
            id: {
              type: "string",
              enum: strategy_ids,
              example: "countdown",
            },
            name: { type: "string", example: "Countdown Timer" },
            description: { type: "string" },
            default_config: { type: "object" },
          },
        },
        TimerPreset: {
          type: "object",
          properties: {
            id: { type: "string", example: "pomodoro" },
            name: { type: "string", example: "Pomodoro Timer" },
            description: { type: "string" },
            strategy: {
              type: "string",
              enum: strategy_ids,
            },
            category: {
              type: "string",
              enum: category_slugs,
            },
            default_config: { type: "object" },
          },
        },
        Challenge: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            format: {
              type: "string",
              enum: ["head-to-head", "group", "solo"],
            },
            timer_type: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["active", "completed", "archived"],
            },
            is_public: { type: "integer", enum: [0, 1] },
            join_code: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["ok", "error"] },
            data: { type: "object" },
            error: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/timers": {
        get: {
          summary: "List timer strategies",
          description: `Returns all ${strategy_list.length} timer strategies with names, descriptions, and default configurations. No authentication required.`,
          operationId: "listTimerStrategies",
          tags: ["Timers"],
          responses: {
            "200": {
              description: "List of timer strategies",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          timer_types: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/TimerStrategy",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/timer-presets": {
        get: {
          summary: "List timer presets",
          description: `Returns all ${preset_list.length} timer presets. Optionally filter by category. No authentication required.`,
          operationId: "listTimerPresets",
          tags: ["Timers"],
          parameters: [
            {
              name: "category",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: category_slugs,
              },
              description: `Filter by category. Valid values: ${category_slugs.join(", ")}`,
            },
          ],
          responses: {
            "200": {
              description: "List of timer presets",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          presets: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/TimerPreset",
                            },
                          },
                          categories: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid category parameter",
            },
          },
        },
      },
      "/timer-url": {
        get: {
          summary: "Generate a shareable timer URL",
          description:
            "Creates a live timer URL that starts immediately. Accepts strategy IDs or preset IDs with optional parameter overrides. No authentication required.",
          operationId: "getTimerUrl",
          tags: ["Timers"],
          parameters: [
            {
              name: "type",
              in: "query",
              required: true,
              schema: { type: "string" },
              description:
                "Strategy ID (e.g. countdown, chess-clock) or preset ID (e.g. pomodoro, hiit).",
            },
            {
              name: "duration",
              in: "query",
              required: false,
              schema: { type: "number" },
              description: "Duration in seconds.",
            },
            {
              name: "label",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Optional label displayed on the timer.",
            },
            {
              name: "work",
              in: "query",
              required: false,
              schema: { type: "number" },
              description: "Work period in seconds (interval strategy).",
            },
            {
              name: "rest",
              in: "query",
              required: false,
              schema: { type: "number" },
              description: "Rest period in seconds (interval strategy).",
            },
            {
              name: "rounds",
              in: "query",
              required: false,
              schema: { type: "number" },
              description: "Number of rounds (interval strategy).",
            },
            {
              name: "started",
              in: "query",
              required: false,
              schema: { type: "string", format: "date-time" },
              description:
                "Start timestamp. Defaults to now.",
            },
            {
              name: "embed",
              in: "query",
              required: false,
              schema: { type: "boolean" },
              description:
                "If true, returns embed URL instead of regular URL.",
            },
          ],
          responses: {
            "200": {
              description: "Timer URL generated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          url: { type: "string", format: "uri" },
                          embed_url: { type: "string", format: "uri" },
                          expires_at: {
                            type: "string",
                            format: "date-time",
                          },
                          timer_type: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { description: "Missing or invalid parameters" },
          },
        },
      },
      "/timer-url/embed": {
        get: {
          summary: "Generate embeddable timer HTML",
          description:
            "Returns an iframe HTML snippet and embed URL for a timer widget. Supports theme, size, and control customization. No authentication required.",
          operationId: "getTimerEmbed",
          tags: ["Timers"],
          parameters: [
            {
              name: "type",
              in: "query",
              required: true,
              schema: { type: "string" },
              description:
                "Strategy ID or preset ID.",
            },
            {
              name: "duration",
              in: "query",
              required: false,
              schema: { type: "number" },
              description: "Duration in seconds.",
            },
            {
              name: "theme",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["light", "dark", "auto"],
                default: "auto",
              },
              description: "Widget theme.",
            },
            {
              name: "size",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["compact", "standard", "large"],
                default: "standard",
              },
              description:
                "Widget size (compact: 300x250, standard: 480x400, large: 640x500).",
            },
            {
              name: "controls",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["full", "minimal", "none"],
                default: "full",
              },
              description: "Control buttons to show.",
            },
            {
              name: "autostart",
              in: "query",
              required: false,
              schema: { type: "boolean", default: false },
              description: "Whether timer starts automatically.",
            },
            {
              name: "label",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Optional label displayed on the timer.",
            },
          ],
          responses: {
            "200": {
              description: "Embed code generated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          url: { type: "string", format: "uri" },
                          html: { type: "string" },
                          timer_type: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { description: "Missing or invalid parameters" },
          },
        },
      },
      "/challenges": {
        get: {
          summary: "List public challenges",
          description:
            "Returns all public challenges with scores. No authentication required.",
          operationId: "listChallenges",
          tags: ["Challenges"],
          responses: {
            "200": {
              description: "List of public challenges",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          challenges: {
                            type: "array",
                            items: {
                              $ref: "#/components/schemas/Challenge",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a challenge",
          description:
            "Creates a new challenge. Requires API key authentication.",
          operationId: "createChallenge",
          tags: ["Challenges"],
          security: [{ BearerAuth: [] }, { ApiKeyHeader: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      maxLength: 100,
                      description: "Challenge name",
                    },
                    format: {
                      type: "string",
                      enum: ["head-to-head", "group", "solo"],
                      default: "head-to-head",
                    },
                    timer_type: {
                      type: "string",
                      enum: ["countdown", "chess-clock", "round-timer"],
                      nullable: true,
                    },
                    is_public: {
                      type: "boolean",
                      default: true,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Challenge created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          challenge: {
                            $ref: "#/components/schemas/Challenge",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { description: "Invalid request body" },
            "401": { description: "Missing or invalid API key" },
          },
        },
      },
      "/challenges/{id}": {
        get: {
          summary: "Get challenge details",
          description:
            "Returns challenge details including leaderboard and game history. Only works for public challenges.",
          operationId: "getChallenge",
          tags: ["Challenges"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Challenge ID",
            },
          ],
          responses: {
            "200": {
              description: "Challenge details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      data: {
                        type: "object",
                        properties: {
                          challenge: {
                            $ref: "#/components/schemas/Challenge",
                          },
                          leaderboard: {
                            type: "array",
                            items: { type: "object" },
                          },
                          games: {
                            type: "array",
                            items: { type: "object" },
                          },
                          draws: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "403": { description: "Challenge is private" },
            "404": { description: "Challenge not found" },
          },
        },
      },
      "/challenges/{id}/join": {
        post: {
          summary: "Join a challenge",
          description:
            "Join a group challenge using its join code. Requires API key authentication.",
          operationId: "joinChallenge",
          tags: ["Challenges"],
          security: [{ BearerAuth: [] }, { ApiKeyHeader: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Challenge ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["join_code"],
                  properties: {
                    join_code: {
                      type: "string",
                      example: "TIMER-1234",
                      description:
                        "The join code provided by the challenge creator",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Joined challenge successfully" },
            "200": { description: "Already a participant" },
            "400": {
              description:
                "Challenge does not support join codes or invalid request",
            },
            "401": { description: "Missing or invalid API key" },
            "403": { description: "Invalid join code" },
            "404": { description: "Challenge not found" },
          },
        },
      },
    },
    tags: [
      {
        name: "Timers",
        description: "Timer strategies, presets, URLs, and embeds",
      },
      {
        name: "Challenges",
        description: "Challenge management and leaderboards",
      },
    ],
  };

  return JSON.stringify(spec, null, 2);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  const root = join(new URL("..", import.meta.url).pathname);
  const public_dir = join(root, "public");
  const api_dir = join(public_dir, "api");

  mkdirSync(api_dir, { recursive: true });

  const llms_txt = generate_llms_txt();
  const llms_full_txt = generate_llms_full_txt();
  const openapi_json = generate_openapi_json();

  writeFileSync(join(public_dir, "llms.txt"), llms_txt);
  writeFileSync(join(public_dir, "llms-full.txt"), llms_full_txt);
  writeFileSync(join(api_dir, "openapi.json"), openapi_json);

  const count = (s: string) => s.split("\n").length;

  console.log("Documentation generated from timer registry:");
  console.log(`  public/llms.txt          ${count(llms_txt)} lines`);
  console.log(`  public/llms-full.txt     ${count(llms_full_txt)} lines`);
  console.log(`  public/api/openapi.json  ${count(openapi_json)} lines`);
}

main();
