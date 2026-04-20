# Auto-Generated Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a build-time script that generates `llms.txt`, `llms-full.txt`, and `openapi.json` from the timer registry, and update the developers page to import from the registry.

**Architecture:** A single TypeScript script (`scripts/generate-docs.ts`) imports the timer registry and writes three files to `public/`. It runs as a `prebuild` step. The `/developers` page imports from the registry directly for dynamic data tables.

**Tech Stack:** TypeScript, tsx runner, Next.js, timer-registry.ts

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `scripts/generate-docs.ts` | Create | Generate llms.txt, llms-full.txt, openapi.json from registry |
| `package.json` | Modify | Add `prebuild` script |
| `src/app/developers/page.tsx` | Modify | Import timer/preset data from registry |
| `src/app/developers/embeds/page.tsx` | Modify | Import timer types from registry |
| `.gitignore` | Modify | Add generated doc files |

---

### Task 1: Create the Documentation Generation Script

**Files:**
- Create: `scripts/generate-docs.ts`

- [ ] **Step 1: Create the script with imports and static prose**

Create `scripts/generate-docs.ts`:

```typescript
#!/usr/bin/env npx tsx
/**
 * Generate documentation files from the timer registry.
 * Run: npx tsx scripts/generate-docs.ts
 * Runs automatically as prebuild step.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  STRATEGIES,
  PRESETS,
  CATEGORIES,
  REGISTRY_CATEGORY_SLUGS,
  type StrategyDefinition,
  type PresetDefinition,
  type CategoryDefinition,
} from "../src/lib/timer-registry";

const BASE_URL = "https://gotimer.org";
const API_BASE = `${BASE_URL}/api/v1`;
const BUILD_DATE = new Date().toISOString().split("T")[0];

// Static prose — the only manually maintained content
const SITE_DESCRIPTION = `GoTimer is a free, browser-based timer platform for board games, fitness, photography, wellness, productivity, and cooking. No app download, no signup required — works in any modern browser at ${BASE_URL}.`;

const CONTACT = "pubs@hazoservices.com";
```

- [ ] **Step 2: Add the llms.txt generator function**

Add to `scripts/generate-docs.ts`:

```typescript
function generate_llms_txt(): string {
  const strategies = Object.values(STRATEGIES);
  const categories = Object.values(CATEGORIES);

  const strategy_lines = strategies
    .map((s) => `- **${s.name}** (${s.id}): ${s.description}`)
    .join("\n");

  const category_lines = categories
    .map((c) => {
      const presets = Object.values(PRESETS).filter((p) => p.category === c.slug);
      const preset_names = presets.map((p) => p.name).join(", ");
      return `- **${c.name}** (${presets.length} timers): ${preset_names}`;
    })
    .join("\n");

  return `# GoTimer.org

> ${SITE_DESCRIPTION}

Last updated: ${BUILD_DATE}
Full documentation: ${BASE_URL}/llms-full.txt

## Timer Strategies (${strategies.length} types)

${strategy_lines}

## Timer Categories & Presets (${Object.keys(PRESETS).length} presets)

${category_lines}

## MCP Server (AI Integration)

GoTimer has an MCP server for AI assistants. Install via:

\`\`\`json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"]
    }
  }
}
\`\`\`

Tools: list_timer_types, list_timer_presets, create_timer, create_pomodoro, get_timer_url, get_embed_code, list_public_challenges, get_leaderboard, create_challenge, join_challenge

## API

- Base URL: ${API_BASE}
- OpenAPI spec: ${BASE_URL}/api/openapi.json
- Developer docs: ${BASE_URL}/developers
- Embed docs: ${BASE_URL}/developers/embeds

## Key URLs

- Home: ${BASE_URL}
- Sitemap: ${BASE_URL}/sitemap.xml
- Public Challenges: ${BASE_URL}/public-challenges
${strategies.filter((s) => s.setupRoute).map((s) => `- ${s.name}: ${BASE_URL}${s.setupRoute}`).join("\n")}
${categories.map((c) => `- ${c.name}: ${BASE_URL}/${c.slug}`).join("\n")}
`;
}
```

- [ ] **Step 3: Add the llms-full.txt generator function**

Add to `scripts/generate-docs.ts`:

```typescript
function generate_llms_full_txt(): string {
  const strategies = Object.values(STRATEGIES);
  const categories = Object.values(CATEGORIES);
  const all_presets = Object.values(PRESETS);

  // Strategy details
  const strategy_sections = strategies
    .map((s) => {
      const config_str = JSON.stringify(s.defaultConfig, null, 2);
      return `### ${s.name} (\`${s.id}\`)

${s.description}

- Route: ${BASE_URL}${s.route}${s.setupRoute ? `\n- Setup: ${BASE_URL}${s.setupRoute}` : ""}
- Default config: \`${JSON.stringify(s.defaultConfig)}\`
- Supported params: ${s.supportedParams.join(", ") || "none"}`;
    })
    .join("\n\n");

  // Category + preset sections
  const category_sections = categories
    .map((c) => {
      const presets = all_presets.filter((p) => p.category === c.slug);
      const preset_lines = presets
        .map(
          (p) =>
            `  - **${p.name}** (\`${p.id}\`): ${p.description}. Strategy: ${p.strategy}. Defaults: \`${JSON.stringify(p.defaultConfig)}\``,
        )
        .join("\n");

      const faq_lines = (c.faq || [])
        .map((f) => `**Q: ${f.question}**\nA: ${f.answer.replace(/<[^>]*>/g, "")}`)
        .join("\n\n");

      return `### ${c.emoji} ${c.name}

${c.description}

- URL: ${BASE_URL}/${c.slug}
- Presets:
${preset_lines}${faq_lines ? `\n\n#### FAQ\n\n${faq_lines}` : ""}`;
    })
    .join("\n\n---\n\n");

  // API reference
  const api_section = `## API Reference

Base URL: \`${API_BASE}\`

All responses follow: \`{ "status": "ok", "data": { ... } }\` or \`{ "status": "error", "error": "message" }\`

### Public Endpoints (no authentication)

#### GET /timers
List all ${strategies.length} timer strategies with descriptions and default configs.
\`\`\`bash
curl ${API_BASE}/timers
\`\`\`

#### GET /timer-presets
List all ${all_presets.length} timer presets. Optional \`category\` filter.
\`\`\`bash
curl "${API_BASE}/timer-presets?category=fitness"
\`\`\`

#### GET /timer-url
Generate a shareable live timer URL. The \`type\` param accepts strategy IDs (countdown, interval) or preset IDs (pomodoro, hiit, tabata).
\`\`\`bash
curl "${API_BASE}/timer-url?type=pomodoro"
curl "${API_BASE}/timer-url?type=countdown&duration=300&label=Break+Time"
\`\`\`

#### GET /timer-url/embed
Generate HTML embed code for any timer type.
\`\`\`bash
curl "${API_BASE}/timer-url/embed?type=countdown&duration=300&theme=dark&size=compact"
\`\`\`
Params: type, duration, theme (light/dark/auto), size (compact/standard/large), controls (full/minimal/none), autostart (true/false)

#### GET /challenges
List all public challenges.
\`\`\`bash
curl ${API_BASE}/challenges
\`\`\`

#### GET /challenges/:id
Get challenge details, leaderboard, and game history.

### Authenticated Endpoints (API key required)

Pass key as \`Authorization: Bearer gtmr_...\` or \`X-API-Key: gtmr_...\`

#### POST /challenges
Create a new challenge.
\`\`\`bash
curl -X POST ${API_BASE}/challenges \\
  -H "Authorization: Bearer gtmr_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Weekly Chess","format":"group","timer_type":"chess-clock"}'
\`\`\`

#### POST /challenges/:id/join
Join a challenge with a join code.
\`\`\`bash
curl -X POST ${API_BASE}/challenges/CHALLENGE_ID/join \\
  -H "Authorization: Bearer gtmr_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"join_code":"TIMER-1234"}'
\`\`\``;

  // MCP section
  const mcp_section = `## MCP Server (AI Assistant Integration)

GoTimer provides an MCP (Model Context Protocol) server for AI assistants like Claude, ChatGPT, and others.

### Installation

\`\`\`json
{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"]
    }
  }
}
\`\`\`

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| GOTIMER_API_KEY | For challenges | — | API key for write operations |
| GOTIMER_API_URL | No | ${API_BASE} | API base URL |

### MCP Tools

| Tool | Description | Auth |
|------|-------------|------|
| list_timer_types | List all ${strategies.length} timer strategies | No |
| list_timer_presets | List ${all_presets.length} presets, filterable by category | No |
| create_timer | Create a live timer (accepts strategy or preset IDs) | No |
| create_pomodoro | Convenience wrapper for Pomodoro timers | No |
| get_timer_url | Get a pre-configured timer page URL | No |
| get_embed_code | Generate HTML embed code | No |
| list_public_challenges | List public challenges | No |
| get_leaderboard | Get challenge leaderboard | No |
| create_challenge | Create a new challenge | API key |
| join_challenge | Join a challenge | API key |`;

  // Embed section
  const embed_section = `## Embedding Timers

Add a timer to any website with an iframe:

\`\`\`html
<iframe src="${BASE_URL}/embed/countdown?duration=300"
  width="480" height="400" frameborder="0"
  allow="autoplay" loading="lazy"
  style="border-radius: 8px;"></iframe>
\`\`\`

### Embed Parameters

| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| type | Any strategy or preset ID | countdown | Timer type |
| duration | seconds | 300 | Timer duration |
| theme | light, dark, auto | auto | Color theme |
| size | compact, standard, large | standard | Widget size |
| controls | full, minimal, none | full | Control buttons |
| autostart | true, false | false | Auto-start timer |
| label | string | — | Display label |

### Size Dimensions

| Size | Width | Height |
|------|-------|--------|
| compact | 300px | 250px |
| standard | 480px | 400px |
| large | 640px | 500px |`;

  // Who is it for
  const who_section = categories
    .map((c) => `- **${c.name}**: ${c.description}`)
    .join("\n");

  // Pages
  const page_lines: string[] = [
    `| Home | ${BASE_URL} |`,
    ...strategies
      .filter((s) => s.setupRoute)
      .map((s) => `| ${s.name} Setup | ${BASE_URL}${s.setupRoute} |`),
    ...strategies
      .filter((s) => s.route !== "/countdown" || s.id === "countdown")
      .map((s) => `| ${s.name} | ${BASE_URL}${s.route} |`),
    ...categories.map((c) => `| ${c.name} Category | ${BASE_URL}/${c.slug} |`),
    `| Public Challenges | ${BASE_URL}/public-challenges |`,
    `| Developer API | ${BASE_URL}/developers |`,
    `| Embed Docs | ${BASE_URL}/developers/embeds |`,
    `| Blog | ${BASE_URL}/blog |`,
  ];

  return `# GoTimer.org — Full Documentation

> ${SITE_DESCRIPTION}

Website: ${BASE_URL}
Category: Web Application / Timer Platform
Price: Free (no ads)
Platform: Any modern web browser (mobile, tablet, desktop)
Account Required: No (timers work without login; challenges require a free account)
Last updated: ${BUILD_DATE}

---

## Timer Strategies (${strategies.length} types)

${strategy_sections}

---

## Timer Categories & Presets (${all_presets.length} presets across ${categories.length} categories)

${category_sections}

---

${api_section}

---

${mcp_section}

---

${embed_section}

---

## Who Is GoTimer For?

${who_section}

---

## Pages

| Page | URL |
|------|-----|
${page_lines.join("\n")}

---

## Contact

For support or feature requests: ${CONTACT}
`;
}
```

- [ ] **Step 4: Add the OpenAPI generator function**

Add to `scripts/generate-docs.ts`:

```typescript
function generate_openapi_json(): string {
  const strategies = Object.values(STRATEGIES);
  const all_presets = Object.values(PRESETS);

  const strategy_ids = strategies.map((s) => s.id);
  const preset_ids = all_presets.map((p) => p.id);

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "GoTimer API",
      description: `Public REST API for GoTimer — ${strategies.length} timer strategies, ${all_presets.length} presets across ${REGISTRY_CATEGORY_SLUGS.length} categories, challenge management, and embeddable widgets.`,
      version: "2.0.0",
      contact: { name: "GoTimer", url: `${BASE_URL}/developers` },
      license: { name: "MIT" },
    },
    servers: [{ url: API_BASE, description: "Production" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "API key as Bearer token (gtmr_... prefix).",
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
            id: { type: "string", enum: strategy_ids },
            name: { type: "string" },
            description: { type: "string" },
            default_config: { type: "object" },
          },
        },
        TimerPreset: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            strategy: { type: "string", enum: strategy_ids },
            category: { type: "string", enum: [...REGISTRY_CATEGORY_SLUGS] },
            default_config: { type: "object" },
          },
        },
        Challenge: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            format: { type: "string", enum: ["head-to-head", "group", "solo"] },
            timer_type: { type: "string", nullable: true },
            status: { type: "string", enum: ["active", "completed", "archived"] },
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
          description: `Returns all ${strategies.length} timer strategies with names, descriptions, and default configurations.`,
          operationId: "listTimerTypes",
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
                            items: { $ref: "#/components/schemas/TimerStrategy" },
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
          description: `Returns ${all_presets.length} pre-configured timer presets. Optionally filter by category.`,
          operationId: "listTimerPresets",
          tags: ["Timers"],
          parameters: [
            {
              name: "category",
              in: "query",
              required: false,
              schema: { type: "string", enum: [...REGISTRY_CATEGORY_SLUGS] },
              description: "Filter by category slug.",
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
                            items: { $ref: "#/components/schemas/TimerPreset" },
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
            "400": { description: "Invalid category" },
          },
        },
      },
      "/timer-url": {
        get: {
          summary: "Generate shareable timer URL",
          description: "Creates a live timer URL that starts immediately. Accepts strategy IDs or preset IDs.",
          operationId: "getTimerUrl",
          tags: ["Timers"],
          parameters: [
            {
              name: "type",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: `Strategy ID (${strategy_ids.join(", ")}) or preset ID (${preset_ids.slice(0, 5).join(", ")}, ...).`,
            },
            { name: "duration", in: "query", schema: { type: "integer" }, description: "Duration in seconds." },
            { name: "label", in: "query", schema: { type: "string" }, description: "Display label." },
            { name: "work", in: "query", schema: { type: "integer" }, description: "Work period in seconds (interval timers)." },
            { name: "rest", in: "query", schema: { type: "integer" }, description: "Rest period in seconds (interval timers)." },
            { name: "rounds", in: "query", schema: { type: "integer" }, description: "Number of rounds (interval timers)." },
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
                          expires_at: { type: "string", format: "date-time" },
                          timer_type: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { description: "Invalid or missing type" },
          },
        },
      },
      "/timer-url/embed": {
        get: {
          summary: "Generate embed HTML code",
          description: "Returns an iframe HTML snippet for embedding a timer on any website.",
          operationId: "getEmbedCode",
          tags: ["Timers"],
          parameters: [
            { name: "type", in: "query", required: true, schema: { type: "string" }, description: "Strategy or preset ID." },
            { name: "duration", in: "query", schema: { type: "integer" }, description: "Duration in seconds." },
            { name: "theme", in: "query", schema: { type: "string", enum: ["light", "dark", "auto"] }, description: "Widget theme." },
            { name: "size", in: "query", schema: { type: "string", enum: ["compact", "standard", "large"] }, description: "Widget size." },
            { name: "controls", in: "query", schema: { type: "string", enum: ["full", "minimal", "none"] }, description: "Control buttons." },
            { name: "autostart", in: "query", schema: { type: "boolean" }, description: "Auto-start timer." },
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
            "400": { description: "Invalid type or size" },
          },
        },
      },
      "/challenges": {
        get: {
          summary: "List public challenges",
          description: "Returns all public challenges with scores.",
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
                          challenges: { type: "array", items: { $ref: "#/components/schemas/Challenge" } },
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
          description: "Creates a new challenge. Requires API key.",
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
                    name: { type: "string", maxLength: 100 },
                    format: { type: "string", enum: ["head-to-head", "group", "solo"], default: "head-to-head" },
                    timer_type: { type: "string", nullable: true },
                    is_public: { type: "boolean", default: true },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Challenge created" },
            "400": { description: "Invalid request" },
            "401": { description: "Missing or invalid API key" },
          },
        },
      },
      "/challenges/{id}": {
        get: {
          summary: "Get challenge details",
          description: "Returns challenge details, leaderboard, and game history.",
          operationId: "getChallenge",
          tags: ["Challenges"],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            "200": { description: "Challenge details" },
            "403": { description: "Challenge is private" },
            "404": { description: "Challenge not found" },
          },
        },
      },
      "/challenges/{id}/join": {
        post: {
          summary: "Join a challenge",
          description: "Join a group challenge using its join code. Requires API key.",
          operationId: "joinChallenge",
          tags: ["Challenges"],
          security: [{ BearerAuth: [] }, { ApiKeyHeader: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["join_code"],
                  properties: {
                    join_code: { type: "string", example: "TIMER-1234" },
                  },
                },
              },
            },
          },
          responses: {
            "201": { description: "Joined successfully" },
            "401": { description: "Missing or invalid API key" },
            "403": { description: "Invalid join code" },
            "404": { description: "Challenge not found" },
          },
        },
      },
    },
    tags: [
      { name: "Timers", description: "Timer strategies, presets, URLs, and embeds" },
      { name: "Challenges", description: "Challenge management and leaderboards" },
    ],
  };

  return JSON.stringify(spec, null, 2);
}
```

- [ ] **Step 5: Add the main function and run it**

Add to `scripts/generate-docs.ts`:

```typescript
function main() {
  const public_dir = join(process.cwd(), "public");
  const api_dir = join(public_dir, "api");
  mkdirSync(api_dir, { recursive: true });

  const llms = generate_llms_txt();
  writeFileSync(join(public_dir, "llms.txt"), llms);
  console.log(`✓ Generated llms.txt (${llms.split("\n").length} lines)`);

  const llms_full = generate_llms_full_txt();
  writeFileSync(join(public_dir, "llms-full.txt"), llms_full);
  console.log(`✓ Generated llms-full.txt (${llms_full.split("\n").length} lines)`);

  const openapi = generate_openapi_json();
  writeFileSync(join(api_dir, "openapi.json"), openapi);
  console.log(`✓ Generated api/openapi.json`);

  console.log(`\nDocs generated from ${Object.keys(STRATEGIES).length} strategies, ${Object.keys(PRESETS).length} presets, ${REGISTRY_CATEGORY_SLUGS.length} categories`);
}

main();
```

- [ ] **Step 6: Test the script**

Run: `npx tsx scripts/generate-docs.ts`

Expected output:
```
✓ Generated llms.txt (XX lines)
✓ Generated llms-full.txt (XX lines)
✓ Generated api/openapi.json

Docs generated from 10 strategies, 28 presets, 6 categories
```

Verify the files exist and look correct:
```bash
head -20 public/llms.txt
head -20 public/llms-full.txt
cat public/api/openapi.json | python3 -m json.tool | head -20
```

- [ ] **Step 7: Commit**

```bash
git add scripts/generate-docs.ts
git commit -m "feat: add build-time documentation generator from timer registry"
```

---

### Task 2: Wire Up prebuild and .gitignore

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add prebuild script to package.json**

In `package.json`, add a `prebuild` script. Find the `"scripts"` section and add:

```json
"prebuild": "npx tsx scripts/generate-docs.ts",
```

This runs automatically before `npm run build`.

- [ ] **Step 2: Add generated files to .gitignore**

Append to `.gitignore`:

```
# Generated documentation (rebuilt from timer registry at build time)
public/llms.txt
public/llms-full.txt
public/api/openapi.json
```

- [ ] **Step 3: Remove the old files from git tracking**

```bash
git rm --cached public/llms.txt public/llms-full.txt public/api/openapi.json
```

- [ ] **Step 4: Generate fresh copies**

```bash
npx tsx scripts/generate-docs.ts
```

- [ ] **Step 5: Verify build works**

Run: `npm run build 2>&1 | tail -10`

Expected: prebuild script runs first showing the "Generated" lines, then Next.js build succeeds.

- [ ] **Step 6: Commit**

```bash
git add package.json .gitignore
git commit -m "feat: run doc generation as prebuild step, gitignore generated docs"
```

---

### Task 3: Update Developers Page to Import from Registry

**Files:**
- Modify: `src/app/developers/page.tsx`

- [ ] **Step 1: Add registry imports and a dynamic endpoint section**

At the top of `src/app/developers/page.tsx`, add the registry import:

```typescript
import { STRATEGIES, PRESETS, REGISTRY_CATEGORY_SLUGS } from "@/lib/timer-registry";
```

- [ ] **Step 2: Replace the hardcoded Endpoints section**

In the Endpoints `<div>`, after the existing endpoint entries for `/api/v1/timers`, add two new entries for the new endpoints. Find the existing `/api/v1/timers` entry and add after it:

```tsx
<div className="border-l-4 border-blue-500 pl-4">
  <div className="flex items-center gap-2 mb-1">
    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
      GET
    </span>
    <code className="text-sm font-mono">/api/v1/timer-presets</code>
    <span className="text-xs text-gray-500">public</span>
  </div>
  <p className="text-sm text-gray-600">
    List all {Object.keys(PRESETS).length} timer presets. Optional{" "}
    <code className="text-xs bg-gray-100 px-1 rounded">category</code> filter ({REGISTRY_CATEGORY_SLUGS.join(", ")}).
  </p>
</div>
```

- [ ] **Step 3: Update the timer types count in the /timers endpoint description**

Change the `/api/v1/timers` description from the hardcoded text to:

```tsx
<p className="text-sm text-gray-600">
  List all {Object.keys(STRATEGIES).length} available timer strategies with default configurations.
</p>
```

- [ ] **Step 4: Add timer-url preset support to existing endpoint descriptions**

Update the `/api/v1/timer-url` description to mention preset support:

```tsx
<p className="text-sm text-gray-600">
  Generate a shareable timer URL. Accepts strategy IDs or preset IDs (e.g. pomodoro, hiit).
  Params: <code className="text-xs bg-gray-100 px-1 rounded">type</code>,{" "}
  <code className="text-xs bg-gray-100 px-1 rounded">duration</code>,{" "}
  <code className="text-xs bg-gray-100 px-1 rounded">label</code>
</p>
```

- [ ] **Step 5: Add examples for new endpoints**

In the Examples section, add after the existing examples:

```tsx
<h3 className="font-medium text-gray-800 mb-2">List fitness presets (curl)</h3>
<pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
  {`curl "${BASE_URL}/timer-presets?category=fitness"`}
</pre>

<h3 className="font-medium text-gray-800 mb-2">Create a Pomodoro timer URL (curl)</h3>
<pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
  {`curl "${BASE_URL}/timer-url?type=pomodoro"`}
</pre>
```

- [ ] **Step 6: Verify the page renders**

Start dev server, navigate to `http://localhost:3002/developers`.

Expected: The page shows the updated endpoint list with preset support mentioned, correct timer/preset counts, and new examples.

- [ ] **Step 7: Commit**

```bash
git add src/app/developers/page.tsx
git commit -m "feat: developers page imports timer counts and preset info from registry"
```

---

### Task 4: Update Embeds Page to Import from Registry

**Files:**
- Modify: `src/app/developers/embeds/page.tsx`

- [ ] **Step 1: Add registry import**

At the top of `src/app/developers/embeds/page.tsx`:

```typescript
import { STRATEGIES } from "@/lib/timer-registry";
```

- [ ] **Step 2: Replace hardcoded timer type table with registry-driven one**

Find the Timer Types table in the embeds page. Replace the hardcoded table rows with a dynamic map over `STRATEGIES`:

```tsx
<tbody>
  {Object.values(STRATEGIES)
    .filter((s) => s.embedRoute || s.route)
    .map((s) => (
      <tr key={s.id} className="border-t">
        <td className="py-2 px-3 font-mono text-sm">{s.id}</td>
        <td className="py-2 px-3 text-sm">{s.name}</td>
        <td className="py-2 px-3 text-sm text-gray-600">{s.description}</td>
      </tr>
    ))}
</tbody>
```

- [ ] **Step 3: Verify the page renders**

Navigate to `http://localhost:3002/developers/embeds`.

Expected: Timer types table shows all 10 strategies instead of 4.

- [ ] **Step 4: Commit**

```bash
git add src/app/developers/embeds/page.tsx
git commit -m "feat: embeds page renders timer types from registry"
```

---

### Task 5: Final Verification

- [ ] **Step 1: Run the full build**

```bash
npm run build 2>&1 | head -20
```

Expected: prebuild runs first, generates docs, then Next.js build succeeds.

- [ ] **Step 2: Verify generated docs content**

```bash
grep -c "pomodoro\|HIIT\|meditation" public/llms-full.txt
```

Expected: Multiple matches showing presets are documented.

```bash
grep "timer-presets" public/api/openapi.json
```

Expected: The new endpoint appears in the OpenAPI spec.

- [ ] **Step 3: Check llms.txt mentions MCP**

```bash
grep -c "mcp\|MCP\|gotimer-mcp" public/llms.txt
```

Expected: MCP section is present.

- [ ] **Step 4: Commit any remaining fixes**

If any issues were found during verification, fix and commit.
