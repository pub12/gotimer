# Unified Timer Registry

Single source of truth for all timer definitions. Every consumer — API, MCP, sitemap, categories, admin health checks — reads from one registry file.

## Problem

Timer definitions are scattered across four locations:
- `src/app/api/v1/timers/route.ts` — hardcoded 4-item array (what MCP sees)
- `src/lib/timer-strategies/index.ts` — `STRATEGY_REGISTRY` with 10 strategies
- `src/lib/site-categories.ts` — `SITE_CATEGORIES` with 24 preset timers across 6 categories
- `src/app/sitemap.ts` — manually maintained URL list

Adding a new timer requires updating all four files independently. Forgetting one causes silent drift — the MCP server only exposes 4 of 10+ timer types.

## Design

### Registry Structure

New file: `src/lib/timer-registry.ts`

Two tiers of definitions:

**Strategies** — the 10 timer engines:
```typescript
interface StrategyDefinition {
  id: string;                    // matches STRATEGY_REGISTRY key
  name: string;                  // "Countdown Timer"
  description: string;           // human-readable, used by MCP
  defaultConfig: Record<string, number | string | boolean>;
  supportedParams: string[];     // params create_timer accepts
  route: string;                 // "/countdown"
  setupRoute?: string;           // "/countdown-setup" (if exists)
  sitemapPriority: number;       // 0.8
}
```

**Presets** — the 24+ specialized timers (preconfigured strategies):
```typescript
interface PresetDefinition {
  id: string;                    // "pomodoro", "hiit", "meditation"
  name: string;                  // "Pomodoro Timer"
  description: string;           // human-readable, used by MCP
  strategy: string;              // ref to parent strategy id
  defaultConfig: Record<string, number | string | boolean>;  // overrides
  category: string;              // "productivity", "fitness"
  route: string;                 // "/productivity/pomodoro"
  sitemapPriority: number;       // 0.7
}
```

**Categories** — the 6 groupings (metadata only, timers derived from presets):
```typescript
interface CategoryDefinition {
  slug: string;                  // "fitness"
  name: string;                  // "Fitness"
  emoji: string;
  icon: string;                  // icon component name, resolved at import
  heading: string;
  description: string;
  heroCta: string;
  heroCtaHref: string;
  gridHeading: string;
  featuredTimers: string[];      // preset ids
  accent?: string;
  faq?: Array<{ question: string; answer: string }>;
}
```

Exported constants:
- `TIMER_STRATEGIES: StrategyDefinition[]`
- `TIMER_PRESETS: PresetDefinition[]`
- `TIMER_CATEGORIES: CategoryDefinition[]`

Helper functions:
- `get_strategy_def(id: string)` — lookup strategy by id
- `get_preset_def(id: string)` — lookup preset by id
- `get_category_def(slug: string)` — lookup category by slug
- `get_presets_by_category(category: string)` — filter presets
- `get_presets_by_strategy(strategy: string)` — filter presets
- `resolve_timer(id: string)` — returns strategy or preset (for `create_timer` to accept either)

### Consumers

#### 1. API: `GET /api/v1/timers`

Rewrite to read from `TIMER_STRATEGIES`. Returns all 10 strategy types with metadata and default configs. No hardcoded array.

#### 2. MCP: `list_timer_types` tool

Calls `/api/v1/timers` as before. Now returns all 10 strategies instead of 4.

#### 3. MCP: new `list_timer_presets` tool

New API endpoint: `GET /api/v1/timer-presets?category=fitness`

Returns presets from `TIMER_PRESETS`, optionally filtered by category. Response shape:
```json
{
  "status": "ok",
  "data": {
    "presets": [
      {
        "id": "hiit",
        "name": "HIIT Timer",
        "description": "Configurable high-intensity interval training",
        "strategy": "interval",
        "category": "fitness",
        "default_config": { "work": 30, "rest": 15, "rounds": 8 }
      }
    ],
    "categories": ["board-games", "photography", "fitness", "wellness", "productivity", "kitchen"]
  }
}
```

New MCP tool in `gotimer-mcp/index.js`:
```javascript
{
  name: "list_timer_presets",
  description: "Lists pre-configured timer presets by category. Categories: board-games, photography, fitness, wellness, productivity, kitchen.",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: ["board-games", "photography", "fitness", "wellness", "productivity", "kitchen"],
        description: "Filter presets by category. Omit to list all presets."
      }
    },
    required: []
  }
}
```

#### 4. MCP: `create_timer` enhancement

The `create_timer` tool's `type` parameter accepts both strategy ids (`countdown`, `interval`) and preset ids (`pomodoro`, `hiit`, `meditation`). The API endpoint resolves preset ids to their parent strategy + default config before generating the URL.

Update the `type` enum in the MCP tool's inputSchema to include all valid ids, or remove the enum constraint and document accepted values in the description.

The API endpoint (`/api/v1/timer-url`) handles resolution:
1. Check if `type` matches a strategy id — use directly
2. Check if `type` matches a preset id — resolve to parent strategy, merge preset defaults with any user overrides
3. Unknown type — return error

#### 5. Sitemap: `src/app/sitemap.ts`

Replace the hardcoded timer/category URLs with iteration over the registry:
```typescript
import { TIMER_STRATEGIES, TIMER_PRESETS, TIMER_CATEGORIES } from "@/lib/timer-registry";

// Strategy routes
const strategy_routes = TIMER_STRATEGIES.flatMap(s => [
  { url: `${base}${s.route}`, priority: s.sitemapPriority },
  ...(s.setupRoute ? [{ url: `${base}${s.setupRoute}`, priority: s.sitemapPriority }] : []),
]);

// Category landing pages
const category_routes = TIMER_CATEGORIES.map(c => ({
  url: `${base}/${c.slug}`, priority: 0.9,
}));

// Preset sub-pages
const preset_routes = TIMER_PRESETS.map(p => ({
  url: `${base}${p.route}`, priority: p.sitemapPriority,
}));
```

Non-timer static routes (blog, studio, privacy, etc.) remain hardcoded — they don't belong in the timer registry.

#### 6. Site Categories: `src/lib/site-categories.ts`

This file is replaced. Its data migrates into `timer-registry.ts` under `TIMER_CATEGORIES` and `TIMER_PRESETS`. 

A compatibility shim exports `SITE_CATEGORIES` in the old shape, derived from the registry, so existing pages don't break during migration. The shim is removed once all consumers are updated.

```typescript
// Compatibility — remove after migration
export const SITE_CATEGORIES = build_site_categories_from_registry();
```

The `LucideIcon` imports move to the category definitions. Since the registry is a `.ts` file (not JSON), icon imports work directly.

### Validation

#### Dev-time startup check

New file: `src/lib/timer-registry-validator.ts`

Runs on `next dev` startup (imported in root layout or instrumentation). Checks:

1. **Strategy coverage**: Every key in `STRATEGY_REGISTRY` has a matching entry in `TIMER_STRATEGIES`. Every `TIMER_STRATEGIES` entry has a matching key in `STRATEGY_REGISTRY`.
2. **Preset references**: Every preset's `strategy` field matches a valid strategy id.
3. **Category references**: Every preset's `category` field matches a valid category slug. Every category's `featuredTimers` entries match preset ids in that category.
4. **Route existence**: Every strategy and preset `route` corresponds to an existing directory under `src/app/`. (Uses `fs.existsSync` — dev only, never runs in browser.)
5. **No orphan routes**: Timer-related route directories under `src/app/` that don't have a registry entry are flagged as warnings.

Behavior:
- In development (`NODE_ENV === 'development'`): logs warnings to console with clear formatting. Throws on critical errors (missing strategy coverage).
- In production: does not run. Zero cost.

```typescript
export function validate_timer_registry(): { errors: string[]; warnings: string[] }
```

#### Admin health dashboard

New admin page: `src/app/admin/timer-health/page.tsx`

Displays a table with one row per timer (strategies + presets). Columns:

| Timer | Type | In Registry | Has Strategy | Has Route | In Sitemap | In MCP |
|-------|------|-------------|--------------|-----------|------------|--------|

Each cell shows a green checkmark or red X. The page calls `validate_timer_registry()` server-side and also checks the live API responses from `/api/v1/timers` and `/api/v1/timer-presets` to confirm MCP visibility.

This page fits alongside existing admin pages (`/admin/seo`, `/admin/settings`, etc.).

### Migration Path

1. Create `src/lib/timer-registry.ts` with all strategy, preset, and category definitions
2. Create `src/lib/timer-registry-validator.ts`
3. Update `src/app/api/v1/timers/route.ts` to read from registry
4. Create `src/app/api/v1/timer-presets/route.ts` (new endpoint)
5. Update `src/app/api/v1/timer-url/route.ts` to resolve preset ids
6. Update `src/app/sitemap.ts` to iterate registry
7. Add compatibility shim to `site-categories.ts`, then migrate consumers
8. Update `gotimer-mcp/index.js`: add `list_timer_presets` tool, update `create_timer` type handling
9. Create `src/app/admin/timer-health/page.tsx`
10. Wire up dev-time validator in instrumentation or root layout

### What Does NOT Change

- `STRATEGY_REGISTRY` in `timer-strategies/index.ts` — stays as-is, holds runtime logic
- Individual strategy files (countdown.ts, chess-clock.ts, etc.) — untouched
- Timer page components and routes — untouched
- Database schema — untouched
- Challenge-related MCP tools — untouched
- `timer-url-encoder.ts` — untouched

### File Changes Summary

| File | Action |
|------|--------|
| `src/lib/timer-registry.ts` | Create |
| `src/lib/timer-registry-validator.ts` | Create |
| `src/app/api/v1/timers/route.ts` | Modify — read from registry |
| `src/app/api/v1/timer-presets/route.ts` | Create |
| `src/app/api/v1/timer-url/route.ts` | Modify — resolve preset ids |
| `src/app/sitemap.ts` | Modify — iterate registry |
| `src/lib/site-categories.ts` | Modify — derive from registry |
| `src/app/admin/timer-health/page.tsx` | Create |
| `gotimer-mcp/index.js` | Modify — add list_timer_presets, update create_timer |
| `gotimer-mcp/README.md` | Modify — document new tool |
