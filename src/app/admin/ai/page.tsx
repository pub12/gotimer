"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { Save, CheckCircle, ExternalLink } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type CrawlerRule = {
  bot: string;
  status: "allowed" | "partially_allowed" | "unknown";
  note: string;
};

const CRAWLER_RULES: CrawlerRule[] = [
  { bot: "Googlebot", status: "allowed", note: "All pages except /admin, /api, /hazo_auth" },
  { bot: "GPTBot (OpenAI)", status: "allowed", note: "All pages except /admin, /api, /hazo_auth" },
  { bot: "ClaudeBot (Anthropic)", status: "allowed", note: "All pages except /admin, /api, /hazo_auth" },
  { bot: "PerplexityBot", status: "allowed", note: "All pages except /admin, /api, /hazo_auth" },
  { bot: "* (all other bots)", status: "allowed", note: "All pages except /admin, /api, /hazo_auth" },
];

const STATUS_STYLES: Record<CrawlerRule["status"], string> = {
  allowed: "bg-green-100 text-green-700",
  partially_allowed: "bg-yellow-100 text-yellow-700",
  unknown: "bg-gray-100 text-gray-500",
};

export default function AdminAiPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [llms_content, set_llms_content] = useState("");
  const [fetch_loading, set_fetch_loading] = useState(true);
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (loading || !authenticated || !permission_ok) return;
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: { settings: Record<string, string> }) => {
        set_llms_content(data.settings?.llms_txt_content ?? "");
      })
      .catch(() => {})
      .finally(() => set_fetch_loading(false));
  }, [loading, authenticated, permission_ok]);

  async function handle_save() {
    set_saving(true);
    set_error("");
    set_saved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ llms_txt_content: llms_content }),
      });
      if (!res.ok) throw new Error("Save failed");
      set_saved(true);
      setTimeout(() => set_saved(false), 3000);
    } catch {
      set_error("Failed to save. Please try again.");
    } finally {
      set_saving(false);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-3xl space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">AI &amp; Discoverability</h1>

      {/* llms.txt Editor */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-800">llms.txt Editor</h2>
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            View live <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Content is stored in the database. The <code className="bg-gray-100 px-1 rounded">/llms.txt</code> and{" "}
          <code className="bg-gray-100 px-1 rounded">/llms-full.txt</code> files in <code className="bg-gray-100 px-1 rounded">public/</code> serve the static versions.
          Editing here updates the database record (key: <code className="bg-gray-100 px-1 rounded">llms_txt_content</code>) which can be served via API.
        </p>

        {fetch_loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <>
            <textarea
              value={llms_content}
              onChange={(e) => set_llms_content(e.target.value)}
              rows={16}
              placeholder="# GoTimer&#10;&#10;> A timer and challenge management tool..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 resize-y"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handle_save}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#e55a2b] disabled:opacity-50 border-none cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save llms.txt"}
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Saved
                </span>
              )}
            </div>
          </>
        )}
      </section>

      {/* AI Crawler Status */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-1">AI Crawler Status</h2>
        <p className="text-xs text-gray-400 mb-4">
          Rules defined in <code className="bg-gray-100 px-1 rounded">src/app/robots.ts</code>. Edit that file to change crawler access.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bot / Crawler</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CRAWLER_RULES.map((rule, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{rule.bot}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[rule.status]}`}>
                      {rule.status === "allowed"
                        ? "Allowed"
                        : rule.status === "partially_allowed"
                        ? "Partial"
                        : "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{rule.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
