# Phase 1 — Embed + Watermark Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the existing `/embed/[type]` route into a URL-parameter-driven embed system (transparent bg, fonts, size, accent, message, watermark variants, Pro token gating, iframe resizer, analytics), and ship it with a public docs page so integrators can copy-paste embed URLs. This is the foundation every downstream acquisition track builds on.

**Architecture:** A central param registry (`src/lib/embed/params.ts`) parses and validates every URL param in one place. The embed page (`src/app/embed/[type]/page.tsx`) pulls resolved params and feeds them to `TimerEmbed`, which renders the timer and a new `EmbedWatermark` component. Watermark gating uses an HMAC-signed Pro token so the "hide watermark" path is free to ship without a billing system behind it yet. A small public JS snippet (`/embed.js`) lets host pages auto-size iframes via `postMessage`.

**Tech Stack:** Next.js 16 App Router (Turbopack), Tailwind v4, Radix UI, TypeScript (strict). Vitest for tests (added in Task 0). Crypto via Node's `node:crypto` for HMAC. No new runtime dependencies beyond vitest devDeps.

**Domain:** `gotimer.org` everywhere.

---

## File Structure

**New files (create):**
```
src/lib/embed/params.ts                    -- Central URL param schema + parser + validator
src/lib/embed/theme.ts                     -- Theme resolution (light/dark/classroom/streaming/transparent)
src/lib/embed/watermark-config.ts          -- Watermark variant config + resolver
src/lib/embed/pro-tokens.ts                -- HMAC-signed Pro token verify/issue
src/lib/embed/params.test.ts               -- Unit tests for param parser
src/lib/embed/theme.test.ts                -- Unit tests for theme resolver
src/lib/embed/watermark-config.test.ts     -- Unit tests for watermark config
src/lib/embed/pro-tokens.test.ts           -- Unit tests for HMAC
src/components/timer/embed-watermark.tsx   -- Watermark component (all variants)
src/components/timer/embed-message.tsx     -- Optional message + expired_message banner
src/app/embed.js/route.ts                  -- Public iframe resizer JS endpoint
src/app/docs/embed/page.tsx                -- Public embed params documentation
vitest.config.ts                           -- Vitest configuration
```

**Modified files:**
```
package.json                               -- Add vitest + @vitest/ui + jsdom devDeps and "test" script
src/app/embed/[type]/page.tsx              -- Consume resolved params from new registry
src/components/timer/timer-embed.tsx       -- Accept new params, render watermark via new component, support transparent bg / font / size / accent / message
src/lib/ga-events.ts                       -- Add fire_watermark_click event
```

Each file has a single responsibility. Keeping the param schema in one file means adding future params (Track 4 seasonal, Track 2 platform-specific) only touches that file.

---

# Task 0: Install and configure Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/embed/.gitkeep` (placeholder so git tracks the dir)

- [ ] **Step 1: Install vitest + jsdom**

Run:
```bash
npm install --save-dev vitest @vitest/ui jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
```

Expected: five packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add `test` scripts to `package.json`**

In `package.json`, add under `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 3: Create `vitest.config.ts`**

File: `vitest.config.ts` at repo root:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "gotimer-mcp/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 4: Create placeholder embed lib dir**

Run:
```bash
mkdir -p src/lib/embed && touch src/lib/embed/.gitkeep
```

- [ ] **Step 5: Smoke test — write and run a trivial test**

Create `src/lib/embed/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 6: Delete smoke test and commit**

```bash
rm src/lib/embed/smoke.test.ts
git add package.json package-lock.json vitest.config.ts src/lib/embed/.gitkeep
git commit -m "chore: add vitest + jsdom test setup"
```

---

# Task 1: Central embed param schema and parser

The existing embed page parses params inline in `src/app/embed/[type]/page.tsx:51-57` with ad-hoc coercion. Centralising this means new params (bg, message, pro_token, etc.) go in one place and every consumer gets consistent behaviour.

**Files:**
- Create: `src/lib/embed/params.ts`
- Create: `src/lib/embed/params.test.ts`

- [ ] **Step 1: Write failing test for basic param parsing**

File: `src/lib/embed/params.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { parse_embed_params, RESERVED_KEYS } from "./params";

function sp(query: string): URLSearchParams {
  return new URLSearchParams(query);
}

describe("parse_embed_params", () => {
  it("returns sensible defaults when no params are set", () => {
    const p = parse_embed_params(sp(""), "countdown");
    expect(p.label).toBe("countdown");
    expect(p.theme).toBe("auto");
    expect(p.controls).toBe("full");
    expect(p.branding).toBe("full");
    expect(p.bg).toBeUndefined();
    expect(p.config).toEqual({});
  });

  it("extracts reserved params and routes the rest to config", () => {
    const p = parse_embed_params(
      sp("label=Pomodoro&duration=1500&theme=dark"),
      "countdown",
    );
    expect(p.label).toBe("Pomodoro");
    expect(p.theme).toBe("dark");
    expect(p.config).toEqual({ duration: 1500 });
  });

  it("coerces numeric and boolean values in config", () => {
    const p = parse_embed_params(
      sp("duration=1500&autostart=true&increment=0.5"),
      "chess-clock",
    );
    expect(p.config).toEqual({ duration: 1500, increment: 0.5 });
    expect(p.autostart).toBe(true);
  });

  it("exports the full reserved key list", () => {
    expect(RESERVED_KEYS.has("type")).toBe(true);
    expect(RESERVED_KEYS.has("label")).toBe(true);
    expect(RESERVED_KEYS.has("bg")).toBe(true);
    expect(RESERVED_KEYS.has("pro_token")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npm test -- src/lib/embed/params.test.ts`
Expected: FAIL — "Cannot find module './params'"

- [ ] **Step 3: Implement `params.ts` minimally**

File: `src/lib/embed/params.ts`
```ts
export const RESERVED_KEYS = new Set<string>([
  "type",
  "started",
  "label",
  "theme",
  "controls",
  "branding",
  "autostart",
  "bg",
  "font",
  "size",
  "accent",
  "message",
  "expired_message",
  "on_expire",
  "repeat",
  "evergreen",
  "pro_token",
]);

export type Theme = "auto" | "light" | "dark" | "classroom" | "streaming" | "darkroom";
export type Controls = "full" | "minimal" | "none";
export type Branding = "full" | "minimal" | "corner" | "hidden";
export type SizePreset = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface EmbedParams {
  type: string;
  label: string;
  theme: Theme;
  controls: Controls;
  branding: Branding;
  autostart: boolean;
  started?: string;

  bg?: string;              // "transparent" | hex e.g. "#ff0000"
  font?: string;            // google font name e.g. "Inter"
  size?: SizePreset;
  accent?: string;          // hex e.g. "#00aaff"
  message?: string;
  expired_message?: string;
  on_expire?: string;       // "redirect:URL" | "repeat" | "stop"
  repeat?: string;          // "daily" | "weekly" | "Nm" | "Ns"
  evergreen: boolean;

  pro_token?: string;

  config: Record<string, unknown>;
}

function coerce(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}

function string_or(v: string | null, fallback: string): string {
  return v && v.length > 0 ? v : fallback;
}

function enum_or<T extends string>(v: string | null, allowed: readonly T[], fallback: T): T {
  if (v && (allowed as readonly string[]).includes(v)) return v as T;
  return fallback;
}

const THEMES: readonly Theme[] = ["auto", "light", "dark", "classroom", "streaming", "darkroom"];
const CONTROLS: readonly Controls[] = ["full", "minimal", "none"];
const BRANDING: readonly Branding[] = ["full", "minimal", "corner", "hidden"];
const SIZES: readonly SizePreset[] = ["xs", "sm", "md", "lg", "xl", "full"];

export function parse_embed_params(sp: URLSearchParams, type: string): EmbedParams {
  const config: Record<string, unknown> = {};
  sp.forEach((value, key) => {
    if (!RESERVED_KEYS.has(key)) {
      config[key] = coerce(value);
    }
  });

  const size_raw = sp.get("size");

  return {
    type,
    label: string_or(sp.get("label"), type),
    theme: enum_or(sp.get("theme"), THEMES, "auto"),
    controls: enum_or(sp.get("controls"), CONTROLS, "full"),
    branding: enum_or(sp.get("branding"), BRANDING, "full"),
    autostart: sp.get("autostart") === "true" || sp.get("autostart") === "1",
    started: sp.get("started") || undefined,

    bg: sp.get("bg") || undefined,
    font: sp.get("font") || undefined,
    size: size_raw && (SIZES as readonly string[]).includes(size_raw) ? (size_raw as SizePreset) : undefined,
    accent: sp.get("accent") || undefined,
    message: sp.get("message") || undefined,
    expired_message: sp.get("expired_message") || undefined,
    on_expire: sp.get("on_expire") || undefined,
    repeat: sp.get("repeat") || undefined,
    evergreen: sp.get("evergreen") === "1" || sp.get("evergreen") === "true",

    pro_token: sp.get("pro_token") || undefined,

    config,
  };
}

/**
 * Adjust duration-based config keys for an already-started timer so the
 * remaining time is correct on page load.
 */
export function apply_started_offset(
  config: Record<string, unknown>,
  started_iso: string | undefined,
): Record<string, unknown> {
  if (!started_iso) return config;
  const started = new Date(started_iso);
  if (isNaN(started.getTime())) return config;
  const elapsed = Math.floor((Date.now() - started.getTime()) / 1000);
  const next = { ...config };
  if (typeof next.duration === "number") {
    next.duration = Math.max(0, (next.duration as number) - elapsed);
  }
  if (typeof next.duration_per_player === "number") {
    next.duration_per_player = Math.max(
      0,
      (next.duration_per_player as number) - elapsed,
    );
  }
  return next;
}
```

- [ ] **Step 4: Run tests, confirm they pass**

Run: `npm test -- src/lib/embed/params.test.ts`
Expected: 4 passing tests.

- [ ] **Step 5: Add test coverage for `apply_started_offset`**

Add to `src/lib/embed/params.test.ts`:
```ts
import { apply_started_offset } from "./params";

describe("apply_started_offset", () => {
  it("returns config unchanged if no started value", () => {
    expect(apply_started_offset({ duration: 300 }, undefined)).toEqual({ duration: 300 });
  });

  it("subtracts elapsed seconds from duration", () => {
    const thirty_sec_ago = new Date(Date.now() - 30_000).toISOString();
    const result = apply_started_offset({ duration: 300 }, thirty_sec_ago);
    expect((result.duration as number) >= 269).toBe(true);
    expect((result.duration as number) <= 271).toBe(true);
  });

  it("clamps to zero rather than going negative", () => {
    const hour_ago = new Date(Date.now() - 3_600_000).toISOString();
    const result = apply_started_offset({ duration: 60 }, hour_ago);
    expect(result.duration).toBe(0);
  });

  it("ignores malformed started values", () => {
    const result = apply_started_offset({ duration: 300 }, "not-a-date");
    expect(result.duration).toBe(300);
  });
});
```

Run: `npm test -- src/lib/embed/params.test.ts`
Expected: 8 passing tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/embed/params.ts src/lib/embed/params.test.ts
git commit -m "feat(embed): central URL param schema with expanded field set"
```

---

# Task 2: Theme resolver

**Files:**
- Create: `src/lib/embed/theme.ts`
- Create: `src/lib/embed/theme.test.ts`

- [ ] **Step 1: Write failing test**

File: `src/lib/embed/theme.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { resolve_theme } from "./theme";

describe("resolve_theme", () => {
  it("auto produces a spec with no hard background", () => {
    const spec = resolve_theme({ theme: "auto" });
    expect(spec.transparent).toBe(false);
    expect(spec.wrapper_class).toContain("bg-surface");
  });

  it("classroom uses high-contrast projector-friendly styling", () => {
    const spec = resolve_theme({ theme: "classroom" });
    expect(spec.wrapper_class).toMatch(/bg-(white|yellow|slate)/);
    expect(spec.oversized).toBe(true);
  });

  it("streaming sets transparent true", () => {
    const spec = resolve_theme({ theme: "streaming" });
    expect(spec.transparent).toBe(true);
  });

  it("bg=transparent overrides theme background", () => {
    const spec = resolve_theme({ theme: "dark", bg: "transparent" });
    expect(spec.transparent).toBe(true);
  });

  it("bg with hex value is applied as inline style", () => {
    const spec = resolve_theme({ theme: "light", bg: "#112233" });
    expect(spec.inline_style?.background).toBe("#112233");
  });

  it("rejects non-hex, non-transparent bg values (xss guard)", () => {
    const spec = resolve_theme({ theme: "light", bg: "red; url(javascript:alert(1))" });
    expect(spec.inline_style).toBeUndefined();
    expect(spec.transparent).toBe(false);
  });
});
```

- [ ] **Step 2: Run, confirm failure**

Run: `npm test -- src/lib/embed/theme.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `theme.ts`**

File: `src/lib/embed/theme.ts`
```ts
import type { Theme } from "./params";

export interface ThemeSpec {
  transparent: boolean;
  wrapper_class: string;
  oversized: boolean;
  inline_style?: { background?: string; color?: string };
}

const HEX_RE = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export function resolve_theme(input: {
  theme: Theme;
  bg?: string;
  accent?: string;
}): ThemeSpec {
  const base = base_for(input.theme);

  if (input.bg === "transparent" || input.theme === "streaming") {
    base.transparent = true;
    base.wrapper_class = base.wrapper_class.replace(/bg-\S+/g, "").trim() + " bg-transparent";
  } else if (input.bg && HEX_RE.test(input.bg)) {
    base.inline_style = { ...(base.inline_style || {}), background: input.bg };
    base.wrapper_class = base.wrapper_class.replace(/bg-\S+/g, "").trim();
  }

  return base;
}

function base_for(theme: Theme): ThemeSpec {
  switch (theme) {
    case "classroom":
      return {
        transparent: false,
        wrapper_class: "bg-white text-black",
        oversized: true,
      };
    case "streaming":
      return {
        transparent: true,
        wrapper_class: "bg-transparent text-white",
        oversized: false,
      };
    case "dark":
      return {
        transparent: false,
        wrapper_class: "bg-neutral-950 text-white",
        oversized: false,
      };
    case "light":
      return {
        transparent: false,
        wrapper_class: "bg-white text-neutral-900",
        oversized: false,
      };
    case "darkroom":
      return {
        transparent: false,
        wrapper_class: "bg-red-950 text-red-50",
        oversized: false,
      };
    case "auto":
    default:
      return {
        transparent: false,
        wrapper_class: "bg-surface text-foreground",
        oversized: false,
      };
  }
}
```

- [ ] **Step 4: Run, confirm passing**

Run: `npm test -- src/lib/embed/theme.test.ts`
Expected: 6 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/embed/theme.ts src/lib/embed/theme.test.ts
git commit -m "feat(embed): theme resolver supporting classroom, streaming, transparent bg"
```

---

# Task 3: Pro-token HMAC issuance and verification

Pro tokens let us gate "hide watermark" (and future paid features) behind a signed string without needing a database lookup on every embed request. Ship the infra now, attach to a billing tier later.

**Files:**
- Create: `src/lib/embed/pro-tokens.ts`
- Create: `src/lib/embed/pro-tokens.test.ts`

- [ ] **Step 1: Write failing test**

File: `src/lib/embed/pro-tokens.test.ts`
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { issue_pro_token, verify_pro_token } from "./pro-tokens";

const SECRET = "test-secret-please-override";

describe("pro tokens", () => {
  beforeEach(() => {
    process.env.GOTIMER_PRO_TOKEN_SECRET = SECRET;
  });

  it("round-trips a valid token", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: 60 });
    const result = verify_pro_token(token);
    expect(result.valid).toBe(true);
    expect(result.user_id).toBe("user_123");
  });

  it("rejects tokens signed with a different secret", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: 60 });
    process.env.GOTIMER_PRO_TOKEN_SECRET = "a-different-secret";
    const result = verify_pro_token(token);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("signature_mismatch");
  });

  it("rejects expired tokens", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: -1 });
    const result = verify_pro_token(token);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("expired");
  });

  it("rejects malformed tokens", () => {
    expect(verify_pro_token("garbage").valid).toBe(false);
    expect(verify_pro_token("").valid).toBe(false);
    expect(verify_pro_token("a.b").valid).toBe(false);
  });

  it("throws when secret env var is missing", () => {
    delete process.env.GOTIMER_PRO_TOKEN_SECRET;
    expect(() => issue_pro_token("user_123")).toThrow(/GOTIMER_PRO_TOKEN_SECRET/);
  });
});
```

- [ ] **Step 2: Run, confirm failure**

Run: `npm test -- src/lib/embed/pro-tokens.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `pro-tokens.ts`**

File: `src/lib/embed/pro-tokens.ts`
```ts
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET_ENV = "GOTIMER_PRO_TOKEN_SECRET";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64url_decode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function get_secret(): string {
  const secret = process.env[SECRET_ENV];
  if (!secret) throw new Error(`${SECRET_ENV} is not set`);
  return secret;
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", get_secret()).update(payload).digest());
}

export interface IssueOptions {
  ttl_seconds?: number;
}

/** Issue a Pro token. Format: `<payload_b64>.<sig_b64>` where payload is JSON `{u,e}`. */
export function issue_pro_token(user_id: string, opts: IssueOptions = {}): string {
  const ttl = opts.ttl_seconds ?? DEFAULT_TTL_SECONDS;
  const payload_json = JSON.stringify({ u: user_id, e: Math.floor(Date.now() / 1000) + ttl });
  const payload = b64url(payload_json);
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export type VerifyResult =
  | { valid: true; user_id: string }
  | { valid: false; reason: "malformed" | "signature_mismatch" | "expired" };

export function verify_pro_token(token: string): VerifyResult {
  if (!token || typeof token !== "string") return { valid: false, reason: "malformed" };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [payload, sig] = parts;
  if (!payload || !sig) return { valid: false, reason: "malformed" };

  const expected_sig = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected_sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "signature_mismatch" };
  }

  let parsed: { u?: string; e?: number };
  try {
    parsed = JSON.parse(b64url_decode(payload).toString("utf8"));
  } catch {
    return { valid: false, reason: "malformed" };
  }
  if (!parsed.u || !parsed.e) return { valid: false, reason: "malformed" };
  if (parsed.e < Math.floor(Date.now() / 1000)) return { valid: false, reason: "expired" };

  return { valid: true, user_id: parsed.u };
}
```

- [ ] **Step 4: Run, confirm passing**

Run: `npm test -- src/lib/embed/pro-tokens.test.ts`
Expected: 5 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/embed/pro-tokens.ts src/lib/embed/pro-tokens.test.ts
git commit -m "feat(embed): HMAC-signed pro tokens for watermark gating"
```

---

# Task 4: Watermark config resolver

Separates the **policy** (which variant, is it hideable?) from the **rendering** (next task). Makes it testable without React.

**Files:**
- Create: `src/lib/embed/watermark-config.ts`
- Create: `src/lib/embed/watermark-config.test.ts`

- [ ] **Step 1: Write failing test**

File: `src/lib/embed/watermark-config.test.ts`
```ts
import { describe, it, expect, beforeEach } from "vitest";
import { resolve_watermark } from "./watermark-config";
import { issue_pro_token } from "./pro-tokens";

describe("resolve_watermark", () => {
  beforeEach(() => {
    process.env.GOTIMER_PRO_TOKEN_SECRET = "test-secret";
  });

  it("defaults to full variant", () => {
    const wm = resolve_watermark({ branding: "full" });
    expect(wm.show).toBe(true);
    expect(wm.variant).toBe("full");
    expect(wm.link_text).toContain("GoTimer");
  });

  it("streaming theme forces corner variant", () => {
    const wm = resolve_watermark({ branding: "full", theme: "streaming" });
    expect(wm.variant).toBe("corner");
  });

  it("classroom theme forces top-right position", () => {
    const wm = resolve_watermark({ branding: "full", theme: "classroom" });
    expect(wm.position).toBe("top-right");
    expect(wm.variant).toBe("minimal");
  });

  it("ignores branding=hidden when no pro_token is present", () => {
    const wm = resolve_watermark({ branding: "hidden" });
    expect(wm.show).toBe(true);
    expect(wm.variant).toBe("minimal");
  });

  it("honours branding=hidden when a valid pro_token is present", () => {
    const token = issue_pro_token("user_123");
    const wm = resolve_watermark({ branding: "hidden", pro_token: token });
    expect(wm.show).toBe(false);
  });

  it("ignores branding=hidden when pro_token is invalid", () => {
    const wm = resolve_watermark({ branding: "hidden", pro_token: "fake.token" });
    expect(wm.show).toBe(true);
  });

  it("link target is always gotimer.org with utm params", () => {
    const wm = resolve_watermark({ branding: "full" });
    expect(wm.href).toContain("gotimer.org");
    expect(wm.href).toContain("utm_source=embed");
    expect(wm.href).toContain("utm_medium=watermark");
  });
});
```

- [ ] **Step 2: Run, confirm failure**

Run: `npm test -- src/lib/embed/watermark-config.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `watermark-config.ts`**

File: `src/lib/embed/watermark-config.ts`
```ts
import { verify_pro_token } from "./pro-tokens";
import type { Branding, Theme } from "./params";

export type WatermarkVariant = "full" | "minimal" | "corner";
export type WatermarkPosition = "bottom-center" | "bottom-right" | "top-right";

export interface WatermarkSpec {
  show: boolean;
  variant: WatermarkVariant;
  position: WatermarkPosition;
  link_text: string;
  href: string;
}

const BASE_URL = "https://gotimer.org/?utm_source=embed&utm_medium=watermark";

export function resolve_watermark(input: {
  branding: Branding;
  theme?: Theme;
  pro_token?: string;
  label?: string;
}): WatermarkSpec {
  const hidden_requested = input.branding === "hidden";
  const token_ok = hidden_requested && input.pro_token
    ? verify_pro_token(input.pro_token).valid
    : false;

  if (hidden_requested && token_ok) {
    return {
      show: false,
      variant: "minimal",
      position: "bottom-center",
      link_text: "",
      href: BASE_URL,
    };
  }

  if (input.theme === "streaming") {
    return {
      show: true,
      variant: "corner",
      position: "bottom-right",
      link_text: "gotimer.org",
      href: BASE_URL,
    };
  }

  if (input.theme === "classroom") {
    return {
      show: true,
      variant: "minimal",
      position: "top-right",
      link_text: "gotimer.org",
      href: BASE_URL,
    };
  }

  if (input.branding === "minimal" || hidden_requested) {
    return {
      show: true,
      variant: "minimal",
      position: "bottom-center",
      link_text: "GoTimer.org",
      href: BASE_URL,
    };
  }

  if (input.branding === "corner") {
    return {
      show: true,
      variant: "corner",
      position: "bottom-right",
      link_text: "gotimer.org",
      href: BASE_URL,
    };
  }

  return {
    show: true,
    variant: "full",
    position: "bottom-center",
    link_text: "⏱ Powered by GoTimer — Free online timers",
    href: BASE_URL,
  };
}
```

- [ ] **Step 4: Run, confirm passing**

Run: `npm test -- src/lib/embed/watermark-config.test.ts`
Expected: 7 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/embed/watermark-config.ts src/lib/embed/watermark-config.test.ts
git commit -m "feat(embed): watermark config resolver with pro-token gating"
```

---

# Task 5: Watermark React component

**Files:**
- Create: `src/components/timer/embed-watermark.tsx`

- [ ] **Step 1: Implement the component**

File: `src/components/timer/embed-watermark.tsx`
```tsx
"use client";

import React from "react";
import type { WatermarkSpec } from "@/lib/embed/watermark-config";

interface Props {
  spec: WatermarkSpec;
  onClick?: () => void;
}

const POSITION_CLASSES: Record<WatermarkSpec["position"], string> = {
  "bottom-center": "fixed bottom-2 left-1/2 -translate-x-1/2",
  "bottom-right": "fixed bottom-2 right-3",
  "top-right": "fixed top-3 right-4",
};

const VARIANT_CLASSES: Record<WatermarkSpec["variant"], string> = {
  full: "text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1",
  minimal: "text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors px-2 py-1",
  corner:
    "text-[10px] px-2 py-1 rounded bg-black/60 text-white/90 hover:bg-black/80 transition-colors shadow-sm",
};

export function EmbedWatermark({ spec, onClick }: Props) {
  if (!spec.show) return null;
  return (
    <a
      href={spec.href}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className={`${POSITION_CLASSES[spec.position]} ${VARIANT_CLASSES[spec.variant]} z-50 pointer-events-auto`}
      data-testid="embed-watermark"
    >
      {spec.link_text}
    </a>
  );
}
```

Note: no test file. The component is a thin renderer over `WatermarkSpec`, which is already thoroughly tested. Visual QA happens in Task 11.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/embed-watermark.tsx
git commit -m "feat(embed): EmbedWatermark component with three variants"
```

---

# Task 6: Watermark click analytics event

**Files:**
- Modify: `src/lib/ga-events.ts`

- [ ] **Step 1: Add the new GA event function**

Edit `src/lib/ga-events.ts`, append at end of file (after `check_new_user_sign_up`):
```ts
export function fire_watermark_click(embed_type: string, variant: string) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag("event", "watermark_click", { embed_type, variant });
}

export function fire_embed_view(embed_type: string, theme: string, branding: string) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;

  const key = `ga_embed_view_${embed_type}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  window.gtag("event", "embed_view", { embed_type, theme, branding });
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ga-events.ts
git commit -m "feat(analytics): watermark_click and embed_view GA events"
```

---

# Task 7: Embed message / expired-message component

**Files:**
- Create: `src/components/timer/embed-message.tsx`

- [ ] **Step 1: Implement the component**

File: `src/components/timer/embed-message.tsx`
```tsx
"use client";

import React from "react";

interface Props {
  message?: string;
  expired_message?: string;
  is_complete: boolean;
}

/**
 * Renders a message above the timer. Uses `expired_message` when the timer has
 * completed, otherwise `message`. Both are plain text — no HTML injection.
 */
export function EmbedMessage({ message, expired_message, is_complete }: Props) {
  const text = is_complete && expired_message ? expired_message : message;
  if (!text) return null;
  return (
    <div
      className="text-center text-lg md:text-xl font-medium mb-3 max-w-2xl"
      data-testid="embed-message"
    >
      {text}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/embed-message.tsx
git commit -m "feat(embed): EmbedMessage with expired_message fallback"
```

---

# Task 8: Wire new params into `TimerEmbed`

Replace the existing hard-coded watermark block in `src/components/timer/timer-embed.tsx:56-77` with the new watermark + message components and honour theme/bg/accent/font/size params.

**Files:**
- Modify: `src/components/timer/timer-embed.tsx`

- [ ] **Step 1: Rewrite `timer-embed.tsx` end-to-end**

Replace entire file `src/components/timer/timer-embed.tsx` with:
```tsx
"use client";

import React, { Suspense, useEffect } from "react";
import { TimerProvider, useTimer } from "./timer-provider";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { EmbedWatermark } from "./embed-watermark";
import { EmbedMessage } from "./embed-message";
import type { TimerStrategy } from "@/lib/timer-strategies/types";
import type { TimerDisplayVariant } from "./timer-display";
import type { EmbedParams } from "@/lib/embed/params";
import { resolve_theme } from "@/lib/embed/theme";
import { resolve_watermark } from "@/lib/embed/watermark-config";
import { fire_embed_view, fire_watermark_click } from "@/lib/ga-events";

interface TimerEmbedProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strategy: TimerStrategy<any>;
  config: unknown;
  params: EmbedParams;
  display_variant?: TimerDisplayVariant;
  show_skip?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<EmbedParams["size"]>, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-none w-full",
};

function InjectFont({ font }: { font?: string }) {
  if (!font) return null;
  const safe = font.replace(/[^a-zA-Z0-9 \-]/g, "");
  if (!safe) return null;
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(safe)}:wght@400;600;700&display=swap`;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={href} />
      <style>{`.gotimer-embed-root{font-family:'${safe}',system-ui,sans-serif}`}</style>
    </>
  );
}

function EmbedInner({
  params,
  display_variant = "ring",
  show_skip,
}: {
  params: EmbedParams;
  display_variant?: TimerDisplayVariant;
  show_skip?: boolean;
}) {
  const { machine } = useTimer();
  const { display } = machine;
  const is_complete = display.progress <= 0;

  const theme_spec = resolve_theme({
    theme: params.theme,
    bg: params.bg,
    accent: params.accent,
  });
  const watermark_spec = resolve_watermark({
    branding: params.branding,
    theme: params.theme,
    pro_token: params.pro_token,
    label: params.label,
  });

  useEffect(() => {
    fire_embed_view(params.type, params.theme, params.branding);
  }, [params.type, params.theme, params.branding]);

  const size_class = params.size ? SIZE_CLASSES[params.size] : "max-w-sm";
  const accent_style: React.CSSProperties = params.accent
    ? ({ ["--gotimer-accent"]: params.accent } as React.CSSProperties)
    : {};

  return (
    <div
      className={`gotimer-embed-root flex flex-col items-center justify-center min-h-screen p-4 ${theme_spec.wrapper_class} ${theme_spec.oversized ? "text-2xl" : ""}`}
      style={{ ...theme_spec.inline_style, ...accent_style }}
    >
      <InjectFont font={params.font} />
      <div className={`flex flex-col items-center gap-4 w-full ${size_class}`}>
        <EmbedMessage
          message={params.message}
          expired_message={params.expired_message}
          is_complete={is_complete}
        />
        <TimerDisplay
          time={display.primary_time}
          progress={display.progress}
          variant={display_variant}
          color={params.accent || display.ring_color}
          phase_label={display.phase_label}
        />
        {params.controls !== "none" && <TimerControls show_skip={show_skip} />}
      </div>
      <EmbedWatermark
        spec={watermark_spec}
        onClick={() => fire_watermark_click(params.type, watermark_spec.variant)}
      />
    </div>
  );
}

export function TimerEmbed({ strategy, config, params, display_variant, show_skip }: TimerEmbedProps) {
  return (
    <Suspense>
      <TimerProvider strategy={strategy} config={config}>
        <EmbedInner params={params} display_variant={display_variant} show_skip={show_skip} />
      </TimerProvider>
    </Suspense>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/timer/timer-embed.tsx
git commit -m "feat(embed): TimerEmbed consumes EmbedParams with theme/watermark/message"
```

---

# Task 9: Update `/embed/[type]/page.tsx` to use the new params pipeline

**Files:**
- Modify: `src/app/embed/[type]/page.tsx`

- [ ] **Step 1: Rewrite the page**

Replace `src/app/embed/[type]/page.tsx` with:
```tsx
"use client";

import React, { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { TimerEmbed } from "@/components/timer/timer-embed";
import { get_strategy } from "@/lib/timer-strategies";
import { parse_embed_params, apply_started_offset } from "@/lib/embed/params";

function EmbedContent({ type }: { type: string }) {
  const search_params = useSearchParams();
  const strategy = get_strategy(type);

  if (!strategy) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-surface">
        <p className="text-muted-foreground text-sm">
          Unknown timer type: <code>{type}</code>
        </p>
      </div>
    );
  }

  const params = parse_embed_params(search_params, type);
  const config = apply_started_offset(params.config, params.started);

  return <TimerEmbed strategy={strategy} config={config} params={params} />;
}

export default function EmbedPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  return (
    <Suspense>
      <EmbedContent type={type} />
    </Suspense>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual smoke test — start dev server**

Run: `npm run dev`
Open each URL and visually confirm:

| URL | Expect |
|---|---|
| `http://localhost:3000/embed/countdown?duration=60` | Countdown starts at 01:00, full watermark at bottom |
| `http://localhost:3000/embed/countdown?duration=60&theme=streaming&bg=transparent` | Transparent bg, corner watermark bottom-right |
| `http://localhost:3000/embed/countdown?duration=60&theme=classroom` | White bg, oversized, top-right watermark |
| `http://localhost:3000/embed/countdown?duration=60&message=Back+in+a+minute&branding=minimal` | Message above timer, minimal watermark |
| `http://localhost:3000/embed/countdown?duration=60&accent=%23ff00ff&font=Orbitron` | Magenta ring, Orbitron font |
| `http://localhost:3000/embed/countdown?duration=60&branding=hidden` | Watermark still visible (no token) |

Close dev server once all six pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/embed/[type]/page.tsx
git commit -m "feat(embed): embed route uses central param pipeline"
```

---

# Task 10: Public iframe resizer script at `/embed.js`

Host pages include `<script src="https://gotimer.org/embed.js">` once; iframes auto-size to content height via `postMessage`. This is what makes the embed feel native instead of fixed-height.

**Files:**
- Create: `src/app/embed.js/route.ts`
- Modify: `src/components/timer/timer-embed.tsx` (add postMessage emitter)

- [ ] **Step 1: Create the public script route**

File: `src/app/embed.js/route.ts`
```ts
import { NextResponse } from "next/server";

const SCRIPT = `(function(){
  var handler = function(e){
    if (!e.data || e.data.source !== 'gotimer') return;
    if (e.data.type !== 'resize') return;
    var frames = document.querySelectorAll('iframe[src*="gotimer.org/embed/"]');
    for (var i=0; i<frames.length; i++){
      var f = frames[i];
      if (f.contentWindow === e.source){
        f.style.height = e.data.height + 'px';
      }
    }
  };
  window.addEventListener('message', handler, false);
})();`;

export async function GET() {
  return new NextResponse(SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
```

- [ ] **Step 2: Add postMessage emitter to `TimerEmbed`**

In `src/components/timer/timer-embed.tsx`, add a new effect inside `EmbedInner` after the existing `useEffect`:
```tsx
useEffect(() => {
  if (typeof window === "undefined") return;
  if (window.parent === window) return; // not iframed
  const emit = () => {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ source: "gotimer", type: "resize", height }, "*");
  };
  emit();
  const observer = new ResizeObserver(emit);
  observer.observe(document.documentElement);
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 3: Verify the script loads**

Start dev: `npm run dev`
In another terminal: `curl -s http://localhost:3000/embed.js | head -5`
Expected: JavaScript IIFE starting with `(function(){`.

- [ ] **Step 4: Manual iframe resize test**

Create a throwaway file `/tmp/gotimer-iframe-test.html`:
```html
<!doctype html>
<html><body>
  <h1>Iframe resize test</h1>
  <iframe src="http://localhost:3000/embed/countdown?duration=60" width="400" style="border:1px solid #ccc"></iframe>
  <script src="http://localhost:3000/embed.js"></script>
</body></html>
```
Open in browser. Iframe should self-size to timer content (not stay at default 150px).

Delete `/tmp/gotimer-iframe-test.html` when done.

- [ ] **Step 5: Commit**

```bash
git add src/app/embed.js/route.ts src/components/timer/timer-embed.tsx
git commit -m "feat(embed): public /embed.js iframe resizer + postMessage emitter"
```

---

# Task 11: Public embed documentation page at `/docs/embed`

This is the page integrators land on. It ranks for "embed gotimer" and explains every URL param with live copy-paste examples.

**Files:**
- Create: `src/app/docs/embed/page.tsx`

- [ ] **Step 1: Create the docs page**

File: `src/app/docs/embed/page.tsx`
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed a GoTimer on your site — URL params, iframe sizing, themes",
  description:
    "Every GoTimer URL embeds as an iframe. Customise theme, colors, fonts, watermark, messages, and more via URL parameters. Free. No signup.",
  alternates: { canonical: "https://gotimer.org/docs/embed" },
};

export default function EmbedDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Embed a GoTimer on your site</h1>
      <p>
        Every GoTimer works as an iframe. Grab a URL, paste it into your site,
        the OBS browser source, a Notion embed block, Google Slides, a
        classroom projector — anywhere. All customisation happens via URL
        parameters. No account needed.
      </p>

      <h2>Quickstart</h2>
      <pre><code>{`<iframe src="https://gotimer.org/embed/countdown?duration=300"
  width="400" height="400" frameborder="0"></iframe>`}</code></pre>

      <p>
        For auto-resizing, add the resizer script once per page:
      </p>
      <pre><code>{`<script src="https://gotimer.org/embed.js"></script>`}</code></pre>

      <h2>Parameters</h2>

      <h3>Core</h3>
      <ul>
        <li><code>label</code> — display label, defaults to timer type</li>
        <li><code>controls</code> — <code>full</code> | <code>minimal</code> | <code>none</code></li>
        <li><code>autostart</code> — <code>1</code> starts immediately</li>
        <li><code>started</code> — ISO timestamp; duration is offset by elapsed time</li>
      </ul>

      <h3>Appearance</h3>
      <ul>
        <li><code>theme</code> — <code>auto</code> | <code>light</code> | <code>dark</code> | <code>classroom</code> | <code>streaming</code> | <code>darkroom</code></li>
        <li><code>bg</code> — <code>transparent</code> or a hex colour like <code>%23112233</code></li>
        <li><code>accent</code> — hex colour for the timer ring</li>
        <li><code>font</code> — Google Font name, e.g. <code>Orbitron</code></li>
        <li><code>size</code> — <code>xs</code> | <code>sm</code> | <code>md</code> | <code>lg</code> | <code>xl</code> | <code>full</code></li>
      </ul>

      <h3>Messages</h3>
      <ul>
        <li><code>message</code> — text shown above the timer while running</li>
        <li><code>expired_message</code> — text shown when the timer hits zero</li>
      </ul>

      <h3>Watermark</h3>
      <ul>
        <li><code>branding</code> — <code>full</code> | <code>minimal</code> | <code>corner</code> | <code>hidden</code> (hidden requires <code>pro_token</code>)</li>
      </ul>

      <h2>Platform recipes</h2>

      <h3>OBS / Twitch browser source</h3>
      <pre><code>{`https://gotimer.org/embed/countdown?duration=300&theme=streaming&bg=transparent&message=Back+in+5+minutes&branding=corner`}</code></pre>

      <h3>Notion embed block</h3>
      <pre><code>{`https://gotimer.org/embed/countdown?duration=1500&label=Pomodoro&theme=light`}</code></pre>

      <h3>Classroom projector</h3>
      <pre><code>{`https://gotimer.org/embed/countdown?duration=300&theme=classroom&autostart=1`}</code></pre>
    </main>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Visual check**

Start dev: `npm run dev`
Open `http://localhost:3000/docs/embed`
Expected: legible docs page with code blocks.

- [ ] **Step 4: Commit**

```bash
git add src/app/docs/embed/page.tsx
git commit -m "docs(embed): public URL param reference with platform recipes"
```

---

# Task 12: Sitemap integration

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add `/docs/embed` to static routes**

In `src/app/sitemap.ts`, add to the `static_routes` array (around line 13):
```ts
{ url: `${base}/docs/embed`, lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
```

- [ ] **Step 2: Verify sitemap output**

Run: `npm run dev`
Open: `http://localhost:3000/sitemap.xml`
Search for `gotimer.org/docs/embed` — should appear.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "seo(sitemap): add /docs/embed to sitemap"
```

---

# Task 13: End-to-end embed test against a real platform

Final validation. Zero code — this is the checkpoint that proves the foundation is real.

**Files:** none

- [ ] **Step 1: Deploy to preview (Vercel / staging / wherever)**

Deploy the current branch to a publicly reachable URL — the next tests require HTTPS and cross-origin embeds.

- [ ] **Step 2: Notion embed test**

In a Notion page, type `/embed` and paste:
```
https://<your-staging-domain>/embed/countdown?duration=60&theme=light&label=Test
```
Expected: timer renders inside Notion, watermark visible, ticks down.

- [ ] **Step 3: OBS browser source test**

In OBS, add Browser Source with URL:
```
https://<your-staging-domain>/embed/countdown?duration=300&theme=streaming&bg=transparent&message=Starting+soon&branding=corner
```
Width 800, Height 600. Expected: transparent background over your scene, corner-chip watermark.

- [ ] **Step 4: Google Slides embed test**

In a Google Slide, Insert → Video → By URL, paste the Notion URL (Slides doesn't iframe — this likely won't work directly, but check if it renders a thumbnail). Document the result for the later "Timer for Google Slides" landing page.

- [ ] **Step 5: Verify GA events firing**

Open GA Realtime. Load the embed. Confirm `embed_view` event fires once per session. Click the watermark. Confirm `watermark_click` fires with `embed_type` and `variant` parameters.

- [ ] **Step 6: Post-launch commit (changelog)**

```bash
git commit --allow-empty -m "chore: Phase 1 embed foundations verified end-to-end"
```

---

# Self-Review

**Spec coverage:** Both tracks covered.

*Track 1 (Watermarks):*
- Three variants (full / minimal / corner) — Task 4, 5
- `hidden` gated by Pro token — Task 3, 4
- Theme-aware positioning (streaming / classroom) — Task 4
- Analytics events — Task 6

*Track 6 (Embed infrastructure):*
- Expanded URL params — Task 1
- Transparent bg — Task 2
- Font / size / accent — Task 2, 8
- Message / expired_message — Task 7, 8
- Wired into page — Task 9
- iframe resizer — Task 10
- Docs page — Task 11
- Sitemap — Task 12

**Deferred from Track 6 to later phases (explicit):**
- `on_expire=redirect:URL` — deferred to Track 3 (stream widget) where it actually gets used
- `repeat=daily|weekly|Nm` — deferred to Track 4 (seasonal)
- `evergreen=1` — deferred to Track 2 (Shopify landing page) where it's the key differentiator
- oEmbed endpoint — deferred to Track 2 (Notion integration)
- Dynamic OG image generator — deferred to Track 4 (seasonal) where every event page needs one

Reason: ship the foundations minimal and get them validated on real platforms (Task 13) before layering more. The param schema in Task 1 already reserves slots for these keys, so adding them later is pure addition, not refactor.

**Placeholders:** None. Every step has exact code or exact commands.

**Type consistency:** `EmbedParams` defined in Task 1 is the single type used in Tasks 4, 5, 7, 8, 9. `WatermarkSpec` defined in Task 4 is used in Task 5. `ThemeSpec` defined in Task 2 is used in Task 8.

**Environment:** Requires `GOTIMER_PRO_TOKEN_SECRET` env var in production. Add to your deployment env vars before shipping Task 13.

---

# Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-24-phase1-embed-foundations.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for this plan because the 13 tasks are sequential but each is self-contained.

**2. Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints for review.

**Which approach?**
