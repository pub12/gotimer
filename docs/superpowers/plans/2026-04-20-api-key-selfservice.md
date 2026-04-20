# API Key Self-Service + ChatGPT GPT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users generate and manage their own API keys from `/developers/keys`, add an admin overview page, and document ChatGPT GPT setup.

**Architecture:** New `api_keys` database table for per-user keys. User-facing CRUD API at `/api/user/api-keys`. Updated `validateApiKey` checks both admin keys (settings table) and user keys (api_keys table). Client pages use `hazo_auth` for authentication.

**Tech Stack:** TypeScript, Next.js App Router, better-sqlite3, hazo_auth, Lucide icons

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/db.ts` | Modify | Add migration v34 for api_keys table |
| `src/app/api/user/api-keys/route.ts` | Create | User key CRUD (GET/POST/DELETE) |
| `src/lib/api-auth.ts` | Modify | Check both admin and user keys |
| `src/app/developers/keys/page.tsx` | Create | User key management UI |
| `src/app/api/admin/all-api-keys/route.ts` | Create | Admin: list/revoke all user keys |
| `src/app/admin/api-keys/page.tsx` | Create | Admin key overview UI |
| `src/components/admin/sidebar.tsx` | Modify | Add API Keys nav link |
| `docs/chatgpt-gpt-config.md` | Create | GPT builder instructions |

---

### Task 1: Add api_keys Table Migration

**Files:**
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Add migration v34**

In `src/lib/db.ts`, find the `migrations` array (the last entry is version 33). Add a new entry after it:

```typescript
  { version: 34, sql: `
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
  ` },
```

- [ ] **Step 2: Verify migration runs**

Start the dev server briefly to trigger DB initialization:

Run: `PORT=3002 npx next dev --turbopack 2>&1 | head -15`

Expected: No migration errors. Kill the server after confirming.

Verify table exists:

Run: `sqlite3 data/hazo_auth.sqlite ".schema api_keys"`

Expected: Shows the CREATE TABLE statement.

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add api_keys table migration (v34) for per-user API keys"
```

---

### Task 2: Create User API Key Endpoints

**Files:**
- Create: `src/app/api/user/api-keys/route.ts`

- [ ] **Step 1: Create the route file**

Create `src/app/api/user/api-keys/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import crypto from "crypto";

const MAX_KEYS_PER_USER = 5;

type ApiKeyRow = {
  id: string;
  user_id: string;
  key: string;
  name: string;
  created_at: string;
};

// GET /api/user/api-keys — list current user's keys
export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, { strict: false });

  if (!auth.authenticated) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const db = get_db();
  const keys = db
    .prepare(`SELECT id, name, key, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC`)
    .all(auth.user_id) as ApiKeyRow[];

  const safe_keys = keys.map((k) => ({
    id: k.id,
    name: k.name,
    key_preview: k.key.slice(0, 12) + "...",
    created_at: k.created_at,
  }));

  return NextResponse.json({
    api_keys: safe_keys,
    limit: MAX_KEYS_PER_USER,
    remaining: MAX_KEYS_PER_USER - keys.length,
  });
}

// POST /api/user/api-keys — generate a new key
export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request, { strict: false });

  if (!auth.authenticated) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return NextResponse.json({ error: "name must be 100 characters or less" }, { status: 400 });
  }

  const db = get_db();

  // Check key count limit
  const count = db
    .prepare(`SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?`)
    .get(auth.user_id) as { count: number };

  if (count.count >= MAX_KEYS_PER_USER) {
    return NextResponse.json(
      { error: `Maximum ${MAX_KEYS_PER_USER} keys allowed. Delete an existing key first.` },
      { status: 400 },
    );
  }

  // Check duplicate name for this user
  const existing = db
    .prepare(`SELECT id FROM api_keys WHERE user_id = ? AND name = ?`)
    .get(auth.user_id, name.trim()) as { id: string } | undefined;

  if (existing) {
    return NextResponse.json({ error: "You already have a key with this name" }, { status: 409 });
  }

  const id = crypto.randomUUID();
  const key = `gtmr_${crypto.randomBytes(32).toString("hex")}`;

  db.prepare(
    `INSERT INTO api_keys (id, user_id, key, name) VALUES (?, ?, ?, ?)`
  ).run(id, auth.user_id, key, name.trim());

  return NextResponse.json(
    {
      api_key: {
        id,
        name: name.trim(),
        key,
        created_at: new Date().toISOString(),
      },
      warning: "This is the only time the full key will be shown. Store it securely.",
    },
    { status: 201 },
  );
}

// DELETE /api/user/api-keys?id=xxx — revoke a key
export async function DELETE(request: NextRequest) {
  const auth = await hazo_get_auth(request, { strict: false });

  if (!auth.authenticated) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key_id = searchParams.get("id");

  if (!key_id) {
    return NextResponse.json({ error: "id query parameter is required" }, { status: 400 });
  }

  const db = get_db();

  // Only delete keys belonging to this user
  const result = db
    .prepare(`DELETE FROM api_keys WHERE id = ? AND user_id = ?`)
    .run(key_id, auth.user_id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Verify endpoints work**

Start dev server, then test:

```bash
# This should return 401 (not logged in via curl)
curl -s http://localhost:3002/api/user/api-keys | python3 -m json.tool
```

Expected: `{ "error": "Login required" }`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/user/api-keys/route.ts
git commit -m "feat: add user API key CRUD endpoints (GET/POST/DELETE)"
```

---

### Task 3: Update API Key Validation to Check Both Tables

**Files:**
- Modify: `src/lib/api-auth.ts`

- [ ] **Step 1: Update validateApiKey to check user keys table**

Replace the entire contents of `src/lib/api-auth.ts`:

```typescript
import { NextRequest } from "next/server";
import { get_db } from "@/lib/db";

type ApiKeyRecord = {
  key: string;
  name: string;
  created_at: string;
};

export async function validateApiKey(
  request: NextRequest
): Promise<{ valid: boolean; key_name?: string; user_id?: string }> {
  // Check Authorization header (Bearer token) or X-API-Key header
  const auth_header = request.headers.get("Authorization");
  const x_api_key = request.headers.get("X-API-Key");

  let provided_key: string | null = null;

  if (auth_header && auth_header.startsWith("Bearer ")) {
    provided_key = auth_header.slice(7).trim();
  } else if (x_api_key) {
    provided_key = x_api_key.trim();
  }

  if (!provided_key) {
    return { valid: false };
  }

  try {
    const db = get_db();

    // Check admin keys first (settings table)
    const row = db
      .prepare(`SELECT value FROM settings WHERE key = 'api_keys'`)
      .get() as { value: string } | undefined;

    if (row) {
      const admin_keys: ApiKeyRecord[] = JSON.parse(row.value);
      const matched = admin_keys.find((k) => k.key === provided_key);
      if (matched) {
        return { valid: true, key_name: matched.name };
      }
    }

    // Check user keys (api_keys table)
    const user_key = db
      .prepare(`SELECT name, user_id FROM api_keys WHERE key = ?`)
      .get(provided_key) as { name: string; user_id: string } | undefined;

    if (user_key) {
      return { valid: true, key_name: user_key.name, user_id: user_key.user_id };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
}
```

- [ ] **Step 2: Verify existing challenge endpoints still work**

The challenge routes import `validateApiKey` — they should continue to work with admin keys. No changes needed to those routes since the return type is backward compatible (added optional `user_id` field).

- [ ] **Step 3: Commit**

```bash
git add src/lib/api-auth.ts
git commit -m "feat: validateApiKey checks both admin and user key tables"
```

---

### Task 4: Create User Key Management Page

**Files:**
- Create: `src/app/developers/keys/page.tsx`

- [ ] **Step 1: Create the key management page**

Create `src/app/developers/keys/page.tsx`:

```tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use_auth_status } from "hazo_auth/client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Key, Copy, Trash2, Plus, Check, AlertTriangle } from "lucide-react";

type ApiKeyEntry = {
  id: string;
  name: string;
  key_preview: string;
  created_at: string;
};

type KeysResponse = {
  api_keys: ApiKeyEntry[];
  limit: number;
  remaining: number;
};

export default function DeveloperKeysPage() {
  const router = useRouter();
  const { authenticated, loading: auth_loading } = use_auth_status();

  const [keys, set_keys] = useState<ApiKeyEntry[]>([]);
  const [limit, set_limit] = useState(5);
  const [remaining, set_remaining] = useState(5);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  // Create key state
  const [creating, set_creating] = useState(false);
  const [new_key_name, set_new_key_name] = useState("");
  const [new_key_full, set_new_key_full] = useState<string | null>(null);
  const [copied, set_copied] = useState(false);
  const [create_error, set_create_error] = useState<string | null>(null);

  // Delete state
  const [deleting_id, set_deleting_id] = useState<string | null>(null);

  const fetch_keys = useCallback(async () => {
    try {
      const res = await fetch("/api/user/api-keys");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/hazo_auth/login");
          return;
        }
        throw new Error("Failed to load keys");
      }
      const data: KeysResponse = await res.json();
      set_keys(data.api_keys);
      set_limit(data.limit);
      set_remaining(data.remaining);
    } catch {
      set_error("Failed to load API keys");
    } finally {
      set_loading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!auth_loading && !authenticated) {
      router.push("/hazo_auth/login");
      return;
    }
    if (!auth_loading && authenticated) {
      fetch_keys();
    }
  }, [auth_loading, authenticated, router, fetch_keys]);

  async function handle_create() {
    if (!new_key_name.trim()) return;
    set_create_error(null);

    const res = await fetch("/api/user/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: new_key_name.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      set_create_error(data.error || "Failed to create key");
      return;
    }

    set_new_key_full(data.api_key.key);
    set_new_key_name("");
    fetch_keys();
  }

  async function handle_delete(id: string) {
    set_deleting_id(id);
    const res = await fetch(`/api/user/api-keys?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetch_keys();
    }
    set_deleting_id(null);
  }

  function copy_key() {
    if (new_key_full) {
      navigator.clipboard.writeText(new_key_full);
      set_copied(true);
      setTimeout(() => set_copied(false), 2000);
    }
  }

  if (auth_loading || loading) {
    return (
      <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
        <Navbar />
        <p className="text-gray-500 mt-12">Loading...</p>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">API Keys</h1>
          <Link
            href="/developers"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            API Docs
          </Link>
        </div>
        <p className="text-gray-600 mb-8">
          Generate API keys to create challenges and use authenticated endpoints.
          Pass your key as{" "}
          <code className="bg-gray-100 px-1 rounded text-sm font-mono">
            Authorization: Bearer gtmr_...
          </code>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* New key reveal */}
        {new_key_full && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">
                  Copy your API key now — it won&apos;t be shown again
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white border rounded-lg px-3 py-2 text-sm font-mono break-all">
                {new_key_full}
              </code>
              <button
                onClick={copy_key}
                className="shrink-0 p-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <button
              onClick={() => set_new_key_full(null)}
              className="mt-3 text-sm text-yellow-700 hover:text-yellow-900"
            >
              I&apos;ve saved it — dismiss
            </button>
          </div>
        )}

        {/* Create key */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Your Keys ({keys.length} of {limit})
            </h2>
          </div>

          {remaining > 0 ? (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Key name (e.g. My App, MCP Server)"
                value={new_key_name}
                onChange={(e) => set_new_key_name(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handle_create()}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
              <button
                onClick={handle_create}
                disabled={!new_key_name.trim() || creating}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Key
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Maximum {limit} keys reached. Delete an existing key to create a new one.
            </p>
          )}

          {create_error && (
            <p className="text-sm text-red-600 mb-4">{create_error}</p>
          )}

          {/* Key list */}
          {keys.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              No API keys yet. Create one to get started.
            </p>
          ) : (
            <div className="divide-y">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {k.name}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {k.key_preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(k.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handle_delete(k.id)}
                      disabled={deleting_id === k.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Revoke key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage info */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-3">Using Your API Key</h2>
          <p className="text-gray-600 text-sm mb-3">
            Pass your key in the <code className="bg-gray-100 px-1 rounded font-mono">Authorization</code> header:
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl -X POST https://gotimer.org/api/v1/challenges \\
  -H "Authorization: Bearer gtmr_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"My Challenge"}'`}
          </pre>
          <p className="text-gray-600 text-sm mb-3">
            For MCP (AI assistant integration), set the environment variable:
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"],
      "env": {
        "GOTIMER_API_KEY": "gtmr_your_key_here"
      }
    }
  }
}`}
          </pre>
        </div>

        <div className="text-center mt-4">
          <Link href="/developers" className="text-blue-600 hover:text-blue-800">
            View API Documentation
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Start dev server, log in, navigate to `http://localhost:3002/developers/keys`.

Expected: Shows "API Keys" page with empty key list, create form, and usage instructions.

- [ ] **Step 3: Test the full flow**

1. Enter a key name and click "Create Key"
2. Verify the yellow box appears with the full key
3. Click copy button, verify clipboard
4. Click "I've saved it — dismiss"
5. Verify the key appears in the list with a preview
6. Click the trash icon, verify deletion
7. Try creating 5 keys, verify the 6th is blocked

- [ ] **Step 4: Commit**

```bash
git add src/app/developers/keys/page.tsx
git commit -m "feat: add user API key management page at /developers/keys"
```

---

### Task 5: Create Admin API Keys Overview

**Files:**
- Create: `src/app/api/admin/all-api-keys/route.ts`
- Create: `src/app/admin/api-keys/page.tsx`
- Modify: `src/components/admin/sidebar.tsx`

- [ ] **Step 1: Create the admin API endpoint**

Create `src/app/api/admin/all-api-keys/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

type AdminKeyRecord = {
  key: string;
  name: string;
  created_at: string;
};

// GET /api/admin/all-api-keys — list all keys (admin only)
export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();

  // Admin keys from settings table
  let admin_keys: { name: string; key_preview: string; created_at: string; source: string }[] = [];
  try {
    const row = db
      .prepare(`SELECT value FROM settings WHERE key = 'api_keys'`)
      .get() as { value: string } | undefined;

    if (row) {
      const parsed: AdminKeyRecord[] = JSON.parse(row.value);
      admin_keys = parsed.map((k) => ({
        name: k.name,
        key_preview: k.key.slice(0, 12) + "...",
        created_at: k.created_at,
        source: "admin",
      }));
    }
  } catch {
    // ignore parse errors
  }

  // User keys from api_keys table
  const user_keys = db
    .prepare(`SELECT api_keys.id, api_keys.name, api_keys.key, api_keys.user_id, api_keys.created_at FROM api_keys ORDER BY api_keys.created_at DESC`)
    .all() as { id: string; name: string; key: string; user_id: string; created_at: string }[];

  const user_key_entries = user_keys.map((k) => ({
    id: k.id,
    name: k.name,
    key_preview: k.key.slice(0, 12) + "...",
    user_id: k.user_id,
    created_at: k.created_at,
    source: "user" as const,
  }));

  return NextResponse.json({
    admin_keys,
    user_keys: user_key_entries,
    total: admin_keys.length + user_key_entries.length,
  });
}

// DELETE /api/admin/all-api-keys?id=xxx — revoke a user key (admin)
export async function DELETE(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const key_id = searchParams.get("id");

  if (!key_id) {
    return NextResponse.json({ error: "id query parameter is required" }, { status: 400 });
  }

  const db = get_db();
  const result = db.prepare(`DELETE FROM api_keys WHERE id = ?`).run(key_id);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create the admin page**

Create `src/app/admin/api-keys/page.tsx`:

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { Key, Trash2, Shield, User } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type AdminKey = {
  name: string;
  key_preview: string;
  created_at: string;
  source: "admin";
};

type UserKey = {
  id: string;
  name: string;
  key_preview: string;
  user_id: string;
  created_at: string;
  source: "user";
};

type KeysData = {
  admin_keys: AdminKey[];
  user_keys: UserKey[];
  total: number;
};

export default function AdminApiKeysPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [data, set_data] = useState<KeysData | null>(null);
  const [data_loading, set_data_loading] = useState(true);

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (loading || !authenticated || !permission_ok) return;
    fetch("/api/admin/all-api-keys")
      .then((r) => r.json())
      .then((d) => set_data(d))
      .catch(() => {})
      .finally(() => set_data_loading(false));
  }, [loading, authenticated, permission_ok]);

  async function handle_revoke(id: string) {
    const res = await fetch(`/api/admin/all-api-keys?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      set_data((prev) =>
        prev
          ? {
              ...prev,
              user_keys: prev.user_keys.filter((k) => k.id !== id),
              total: prev.total - 1,
            }
          : prev,
      );
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-5xl">
      <h1 className="font-headline text-2xl font-black text-foreground mb-2">API Keys</h1>
      <p className="text-muted-foreground text-sm mb-6">
        All API keys across admin and user accounts.
      </p>

      {data_loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : data ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {data.total} total keys ({data.admin_keys.length} admin, {data.user_keys.length} user)
          </p>

          <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-container">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Key</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Created</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.admin_keys.map((k, i) => (
                  <tr key={`admin-${i}`} className="border-b border-surface-container last:border-0">
                    <td className="p-3 font-medium text-foreground">{k.name}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{k.key_preview}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(k.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center text-muted-foreground text-xs">
                      Manage in settings
                    </td>
                  </tr>
                ))}
                {data.user_keys.map((k) => (
                  <tr key={k.id} className="border-b border-surface-container last:border-0">
                    <td className="p-3 font-medium text-foreground">{k.name}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{k.key_preview}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        <User className="w-3 h-3" /> User
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(k.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handle_revoke(k.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
                        title="Revoke key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.total === 0 && (
              <p className="p-6 text-center text-muted-foreground">No API keys exist yet.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-destructive">Failed to load API keys.</p>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Add API Keys to admin sidebar**

In `src/components/admin/sidebar.tsx`, add `Key` to the lucide-react import, then add the nav item to the third nav group (after Timer Health):

```typescript
{ label: "API Keys", href: "/admin/api-keys", icon: <Key className="w-4 h-4" /> },
```

- [ ] **Step 4: Verify admin page works**

Navigate to `http://localhost:3002/admin/api-keys` (must be logged in as admin).

Expected: Shows table with any existing admin keys and user keys.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/all-api-keys/route.ts src/app/admin/api-keys/page.tsx src/components/admin/sidebar.tsx
git commit -m "feat: add admin API keys overview page with user key management"
```

---

### Task 6: Create ChatGPT GPT Configuration Doc

**Files:**
- Create: `docs/chatgpt-gpt-config.md`

- [ ] **Step 1: Create the GPT configuration guide**

Create `docs/chatgpt-gpt-config.md`:

```markdown
# GoTimer ChatGPT GPT — Setup Guide

How to create and configure a custom GPT that uses GoTimer's API.

## Prerequisites

- ChatGPT Plus, Team, or Enterprise account (custom GPTs require a paid plan)
- GoTimer OpenAPI spec: https://gotimer.org/api/openapi.json

## Step-by-Step Setup

### 1. Open GPT Builder

Go to https://chatgpt.com/gpts/editor and click "Create a GPT".

### 2. Configure the GPT

**Name:** GoTimer

**Description:** Create timers, Pomodoro sessions, chess clocks, and more. Get shareable links for any timer type.

**Instructions (System Prompt):**

```
You are GoTimer, a helpful assistant that creates timers for users. You can:

1. Create live, shareable countdown timers for any purpose
2. List available timer types (strategies) and presets (pre-configured timers)
3. Generate embeddable timer widgets for websites

When a user asks for a timer:
- Use the timer-url endpoint to create a shareable link
- If they mention a specific activity (Pomodoro, HIIT, Tabata, meditation, cooking, eggs, etc.), use the matching preset ID as the type parameter
- If they want a simple countdown, use type=countdown with the appropriate duration
- Always return the shareable URL so they can open it immediately

Available preset IDs include: pomodoro, hiit, tabata, emom, stretching, rest-timer, meditation, breathing, sleep, fasting, study, adhd-focus, classroom, presentation, cooking, eggs, bread-proofing, film-development, long-exposure-calculator, stand-development, enlarger-timer, cyanotype, photo-walk

For embeds, use the timer-url/embed endpoint and return the HTML code.

Be concise. Return the timer link prominently. Don't over-explain unless asked.
```

### 3. Add the Action

1. Click "Create new action"
2. Set Authentication to "None"
3. Import the OpenAPI spec from URL: `https://gotimer.org/api/openapi.json`
4. ChatGPT will auto-detect all available endpoints

### 4. Test

Try these prompts in the preview:
- "Set a 5 minute timer"
- "I need a Pomodoro timer"
- "Give me a timer to boil eggs"
- "What timer presets do you have for fitness?"
- "Create an embed code for a dark-themed countdown timer"

### 5. Publish

Click "Save" and choose visibility:
- **Only me** — for testing
- **Anyone with a link** — share with specific people
- **Public** — list in GPT Store

## Notes

- All timer endpoints are public — no API key needed
- The GPT uses GoTimer's REST API, not the MCP server
- Timer URLs are live and synchronized — anyone opening the link sees the same countdown
- URLs expire after 24 hours
```

- [ ] **Step 2: Commit**

```bash
git add docs/chatgpt-gpt-config.md
git commit -m "docs: add ChatGPT GPT builder setup guide"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Run the full build**

Run: `npm run build 2>&1 | tail -10`

Expected: Build succeeds.

- [ ] **Step 2: Test the complete user key flow**

1. Start dev server
2. Log in as a regular user
3. Navigate to `/developers/keys`
4. Create a key, copy it
5. Use the key to create a challenge via curl:
```bash
curl -X POST http://localhost:3002/api/v1/challenges \
  -H "Authorization: Bearer gtmr_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Challenge"}'
```
Expected: Challenge created successfully.

- [ ] **Step 3: Test admin overview**

Navigate to `/admin/api-keys` as admin.
Expected: Shows the user key created in step 2.

- [ ] **Step 4: Commit any remaining fixes**

If any issues found during verification, fix and commit.
