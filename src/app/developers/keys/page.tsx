"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { use_auth_status } from "hazo_auth/client";
import { Key, Copy, Trash2, Plus, Check, AlertTriangle } from "lucide-react";

type ApiKeyEntry = {
  id: string;
  name: string;
  key_preview: string;
  created_at: string;
};

export default function ApiKeysPage() {
  const router = useRouter();
  const { authenticated, loading: auth_loading } = use_auth_status();

  const [keys, set_keys] = useState<ApiKeyEntry[]>([]);
  const [limit, set_limit] = useState(5);
  const [remaining, set_remaining] = useState(5);
  const [new_key_name, set_new_key_name] = useState("");
  const [new_key_full, set_new_key_full] = useState<string | null>(null);
  const [copied, set_copied] = useState(false);
  const [create_error, set_create_error] = useState<string | null>(null);
  const [deleting_id, set_deleting_id] = useState<string | null>(null);
  const [loading, set_loading] = useState(true);

  const fetch_keys = useCallback(async () => {
    try {
      const res = await fetch("/api/user/api-keys");
      if (!res.ok) return;
      const data = await res.json();
      set_keys(data.api_keys ?? []);
      set_limit(data.limit ?? 5);
      set_remaining(data.remaining ?? 0);
    } finally {
      set_loading(false);
    }
  }, []);

  useEffect(() => {
    if (auth_loading) return;
    if (!authenticated) {
      router.push("/hazo_auth/login");
      return;
    }
    fetch_keys();
  }, [auth_loading, authenticated, router, fetch_keys]);

  async function handle_create(e: React.FormEvent) {
    e.preventDefault();
    set_create_error(null);
    const name = new_key_name.trim();
    if (!name) return;

    const res = await fetch("/api/user/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      set_create_error(data.error ?? "Failed to create key");
      return;
    }

    set_new_key_full(data.api_key.key);
    set_new_key_name("");
    await fetch_keys();
  }

  async function handle_delete(id: string) {
    set_deleting_id(id);
    try {
      const res = await fetch(`/api/user/api-keys?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetch_keys();
      }
    } finally {
      set_deleting_id(null);
    }
  }

  function handle_copy() {
    if (!new_key_full) return;
    navigator.clipboard.writeText(new_key_full);
    set_copied(true);
    setTimeout(() => set_copied(false), 2000);
  }

  if (auth_loading || (!authenticated && !auth_loading)) {
    return (
      <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
        <Navbar />
        <div className="w-full max-w-3xl mx-auto text-center py-20 text-gray-500">Loading...</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">API Keys</h1>
          <Link href="/developers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            API Docs
          </Link>
        </div>
        <p className="text-gray-600 mb-8">
          Create and manage API keys to authenticate with the GoTimer API. Keys grant access to
          protected endpoints like challenge creation and management.
        </p>

        {/* New Key Reveal */}
        {new_key_full && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 font-medium">
                Copy your API key now — it won&apos;t be shown again
              </p>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <code className="flex-1 bg-yellow-100 border border-yellow-200 rounded-lg p-3 text-sm font-mono break-all">
                {new_key_full}
              </code>
              <button
                onClick={handle_copy}
                className="flex-shrink-0 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 p-2 rounded-lg transition-colors"
                title="Copy key"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={() => set_new_key_full(null)}
              className="text-yellow-700 hover:text-yellow-900 text-sm underline"
            >
              I&apos;ve saved it — dismiss
            </button>
          </div>
        )}

        {/* Key List Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Keys ({keys.length} of {limit})
          </h2>

          {/* Create form */}
          <form onSubmit={handle_create} className="flex gap-2 mb-4">
            <input
              type="text"
              value={new_key_name}
              onChange={(e) => set_new_key_name(e.target.value)}
              placeholder="Key name (e.g. My App)"
              maxLength={100}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={remaining === 0}
            />
            <button
              type="submit"
              disabled={remaining === 0 || !new_key_name.trim()}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Create Key
            </button>
          </form>

          {create_error && (
            <p className="text-red-600 text-sm mb-4">{create_error}</p>
          )}

          {/* Key list */}
          {loading ? (
            <p className="text-gray-500 text-sm py-4 text-center">Loading keys...</p>
          ) : keys.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              No API keys yet. Create one to get started.
            </p>
          ) : (
            <div className="divide-y">
              {keys.map((k) => (
                <div key={k.id} className="flex items-center gap-3 py-3">
                  <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{k.name}</p>
                    <p className="text-xs text-gray-500">
                      <code className="font-mono">{k.key_preview}</code>
                      {" · "}
                      {new Date(k.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handle_delete(k.id)}
                    disabled={deleting_id === k.id}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
                    title="Delete key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Info Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-3">Using Your API Key</h2>
          <p className="text-gray-600 text-sm mb-3">
            Pass your key as a Bearer token in the <code className="bg-gray-100 px-1 rounded text-xs font-mono">Authorization</code> header:
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
{`curl https://gotimer.org/api/v1/challenges \\
  -H "Authorization: Bearer gtmr_your_api_key_here"`}
          </pre>

          <p className="text-gray-600 text-sm mb-3">
            For the GoTimer MCP server, set your key as an environment variable:
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
{`{
  "mcpServers": {
    "gotimer": {
      "command": "npx",
      "args": ["-y", "gotimer-mcp"],
      "env": {
        "GOTIMER_API_KEY": "gtmr_your_api_key_here"
      }
    }
  }
}`}
          </pre>

          <Link href="/developers" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View full API documentation
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
