"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { ExternalLink } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
  note?: string;
};

const REDIRECTS: Redirect[] = [
  {
    source: "/:path*",
    destination: "https://gotimer.org/:path*",
    permanent: true,
    note: "www → apex redirect",
  },
  {
    source: "/:path+/",
    destination: "/:path+",
    permanent: true,
    note: "Trailing slash removal",
  },
];

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

function parse_sitemap(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const url_pattern = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = url_pattern.exec(xml)) !== null) {
    const block = m[1];
    const get_tag = (tag: string) => {
      const found = block.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
      return found ? found[1].trim() : undefined;
    };
    entries.push({
      loc: get_tag("loc") ?? "",
      lastmod: get_tag("lastmod"),
      changefreq: get_tag("changefreq"),
      priority: get_tag("priority"),
    });
  }
  return entries;
}

export default function AdminSeoPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [sitemap_entries, set_sitemap_entries] = useState<SitemapEntry[]>([]);
  const [sitemap_loading, set_sitemap_loading] = useState(true);
  const [sitemap_error, set_sitemap_error] = useState("");

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (loading || !authenticated || !permission_ok) return;
    fetch("/sitemap.xml")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((xml) => {
        set_sitemap_entries(parse_sitemap(xml));
      })
      .catch((e) => set_sitemap_error(String(e)))
      .finally(() => set_sitemap_loading(false));
  }, [loading, authenticated, permission_ok]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-5xl space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">SEO Control Centre</h1>

      {/* Redirect Manager */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Redirect Manager</h2>
        <p className="text-sm text-gray-500 mb-4">
          Redirects defined in <code className="bg-gray-100 px-1 rounded">next.config.ts</code>. Edit the file to add or remove redirects.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Destination</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {REDIRECTS.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{r.source}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700 max-w-xs truncate">{r.destination}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.permanent
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.permanent ? "301 Permanent" : "302 Temporary"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{r.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sitemap Viewer */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Sitemap Viewer</h2>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            Open raw <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {sitemap_loading ? (
          <p className="text-gray-500 text-sm">Loading sitemap...</p>
        ) : sitemap_error ? (
          <p className="text-red-500 text-sm">Error loading sitemap: {sitemap_error}</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
              {sitemap_entries.length} URLs indexed
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">URL</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Last Modified</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Change Freq</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sitemap_entries.map((entry, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs font-mono text-blue-600">
                        <a href={entry.loc} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {entry.loc}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500">{entry.lastmod ?? "—"}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{entry.changefreq ?? "—"}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{entry.priority ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Internal Link Audit */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Internal Link Audit</h2>
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-400">
          Link audit coming soon — will scan published pages for broken or missing internal links.
        </div>
      </section>
    </main>
  );
}
