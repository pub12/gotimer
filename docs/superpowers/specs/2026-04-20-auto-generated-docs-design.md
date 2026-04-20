# Auto-Generated Documentation from Timer Registry

Single source of truth: the timer registry generates all public documentation at build time. No manual doc maintenance needed when timers are added or changed.

## Problem

Documentation files (`llms.txt`, `llms-full.txt`, `openapi.json`, `/developers` page) are manually maintained and already outdated — they list 3-4 timer types when the registry has 10 strategies and 24 presets. Adding a new timer requires updating 4+ files independently.

## Design

### Build Script

New file: `scripts/generate-docs.ts`

Runs at build time via `prebuild` script in `package.json`. Imports the timer registry and writes three files to `public/`.

Static prose hardcoded in the script as template strings:
- Site description (2-3 sentences about GoTimer)
- Contact info

Everything else auto-generated from the registry:
- Timer strategies with descriptions and default configs
- Presets grouped by category
- Category listings with FAQ entries
- API endpoints with curl and JavaScript examples
- MCP tool list and setup instructions
- "Who is it for" list derived from category names
- Page URLs derived from registry routes

### Output: `public/llms.txt` (~100 lines)

Short-form for quick LLM context window consumption:
- Site description
- All 10 strategies (name + one-line description + URL)
- All 6 categories with preset names and counts
- MCP availability note with npm package name and install config
- Key URLs (API base, developer docs, sitemap, OpenAPI spec)
- Last-updated date (set to build date)

### Output: `public/llms-full.txt` (~400 lines)

Full documentation for deep LLM context:
- Everything in llms.txt, expanded
- Each strategy: full description, default config object, supported params
- Each category: heading, description, all presets with defaults
- API endpoint reference: all public endpoints with curl examples and response shapes
  - `GET /api/v1/timers` — list strategies
  - `GET /api/v1/timer-presets?category=fitness` — list presets
  - `GET /api/v1/timer-url?type=pomodoro` — create live timer URL
  - `GET /api/v1/timer-url/embed?type=countdown&theme=dark` — generate embed code
  - `GET /api/v1/challenges` — list public challenges
  - `POST /api/v1/challenges` — create challenge (requires API key)
  - `POST /api/v1/challenges/:id/join` — join challenge (requires API key)
- MCP setup: Claude Desktop JSON config snippet
- MCP tool reference: all tools with parameter descriptions
- Embed documentation: supported params, size options, HTML example
- FAQ: aggregated from all category FAQ arrays in the registry
- "Who is it for" section: derived from category names and descriptions
- Pages table: all strategy routes, category routes, preset routes

### Output: `public/api/openapi.json`

Updated OpenAPI 3.0.3 spec with:
- `/timers` endpoint — response schema listing all 10 strategies
- `/timer-presets` endpoint — new, with optional `category` query parameter and response schema
- `/timer-url` endpoint — updated `type` parameter description to accept both strategy IDs and preset IDs
- `/timer-url/embed` endpoint — same type parameter update, plus theme/size/controls params
- New schemas: `TimerPreset` (id, name, description, strategy, category, default_config)
- Updated `TimerType` schema to reflect all 10 strategies
- Existing challenge endpoints unchanged

### Developers Page: Direct Registry Import

`src/app/developers/page.tsx` imports `STRATEGIES`, `PRESETS`, `REGISTRY_CATEGORY_SLUGS` from `@/lib/timer-registry` and renders timer/preset tables dynamically instead of hardcoded lists. The page structure and prose remain manual but all data tables are registry-driven.

`src/app/developers/embeds/page.tsx` imports timer type list from registry for the supported types section.

### Build Integration

In `package.json`, add:
```json
"prebuild": "npx tsx scripts/generate-docs.ts"
```

The `prebuild` script runs automatically before `next build`. In development, docs can be regenerated manually with `npx tsx scripts/generate-docs.ts`.

### Script Structure

```
scripts/generate-docs.ts
├── import registry (STRATEGIES, PRESETS, CATEGORIES)
├── generate_llms_txt() → writes public/llms.txt
├── generate_llms_full_txt() → writes public/llms-full.txt  
├── generate_openapi_json() → writes public/api/openapi.json
└── main() → calls all three, logs summary
```

Each generator function is independent and produces its output as a string, then writes to disk. This makes it easy to test or extend.

## File Changes

| File | Action |
|------|--------|
| `scripts/generate-docs.ts` | Create |
| `package.json` | Modify — add `prebuild` script |
| `public/llms.txt` | Overwritten at build time (remove from git tracking) |
| `public/llms-full.txt` | Overwritten at build time (remove from git tracking) |
| `public/api/openapi.json` | Overwritten at build time (remove from git tracking) |
| `src/app/developers/page.tsx` | Modify — import from registry |
| `src/app/developers/embeds/page.tsx` | Modify — import timer types from registry |

Note: The generated files in `public/` should be added to `.gitignore` since they're build artifacts. They'll be generated fresh on each deploy.

## What Does NOT Change

- Timer registry (`src/lib/timer-registry.ts`) — untouched, this is the source
- MCP server (`gotimer-mcp/index.js`) — already reads from the API
- MCP README (`gotimer-mcp/README.md`) — stays manually maintained (it's an npm package README, separate from the site docs)
- Sitemap (`src/app/sitemap.ts`) — already reads from registry
- Admin health dashboard — unchanged
