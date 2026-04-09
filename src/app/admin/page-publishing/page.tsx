"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { Button } from "@/components/ui/button";
import { PublishHistoryTimeline } from "@/components/admin/publish-history-timeline";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type TimerPage = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function days_in_state(page: TimerPage): number {
  const ref =
    page.status === "published" && page.published_at
      ? new Date(page.published_at)
      : new Date(page.updated_at);
  const now = new Date();
  return Math.floor((now.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ status }: { status: TimerPage["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      Draft
    </span>
  );
}

export default function AdminPagePublishingPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [pages, set_pages] = useState<TimerPage[]>([]);
  const [loading, set_loading] = useState(true);
  const [selected, set_selected] = useState<Set<string>>(new Set());
  const [action_loading, set_action_loading] = useState<Set<string>>(new Set());
  const [batch_loading, set_batch_loading] = useState(false);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) {
      router.push("/");
    }
  }, [auth_loading, authenticated, permission_ok, router]);

  const fetch_pages = useCallback(() => {
    if (auth_loading || !authenticated || !permission_ok) return;
    set_loading(true);
    fetch("/api/admin/timer-pages")
      .then((r) => r.json())
      .then((data) => set_pages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok]);

  useEffect(() => {
    fetch_pages();
  }, [fetch_pages]);

  function toggle_select(id: string) {
    set_selected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggle_all() {
    if (selected.size === pages.length) {
      set_selected(new Set());
    } else {
      set_selected(new Set(pages.map((p) => p.id)));
    }
  }

  async function publish_page(id: string) {
    set_action_loading((prev) => new Set(prev).add(id));
    try {
      await fetch(`/api/admin/timer-pages/${id}/publish`, { method: "POST" });
      await fetch_pages();
    } finally {
      set_action_loading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function unpublish_page(id: string) {
    set_action_loading((prev) => new Set(prev).add(id));
    try {
      await fetch(`/api/admin/timer-pages/${id}/publish`, { method: "DELETE" });
      await fetch_pages();
    } finally {
      set_action_loading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function batch_publish() {
    const draft_ids = pages
      .filter((p) => p.status === "draft" && selected.has(p.id))
      .map((p) => p.id);
    if (draft_ids.length === 0) return;
    set_batch_loading(true);
    try {
      await Promise.all(
        draft_ids.map((id) =>
          fetch(`/api/admin/timer-pages/${id}/publish`, { method: "POST" })
        )
      );
      set_selected(new Set());
      await fetch_pages();
    } finally {
      set_batch_loading(false);
    }
  }

  function export_csv() {
    window.location.href = "/api/admin/publish-history/export";
  }

  if (auth_loading || loading) {
    return (
      <main className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  const selected_draft_count = pages.filter(
    (p) => p.status === "draft" && selected.has(p.id)
  ).length;

  return (
    <main className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Publishing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the publish status of all timer pages.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.size > 0 && selected_draft_count > 0 && (
            <Button
              onClick={batch_publish}
              disabled={batch_loading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {batch_loading
                ? "Publishing..."
                : `Batch Publish (${selected_draft_count})`}
            </Button>
          )}
          <Button
            onClick={export_csv}
            variant="outline"
            size="sm"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      {pages.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center">
          <p className="text-gray-500">No timer pages found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === pages.length && pages.length > 0}
                      onChange={toggle_all}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Days in state
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pages.map((page) => {
                  const busy = action_loading.has(page.id);
                  return (
                    <React.Fragment key={page.id}>
                      <tr
                        className={`hover:bg-gray-50 transition-colors ${
                          selected.has(page.id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(page.id)}
                            onChange={() => toggle_select(page.id)}
                            className="rounded border-gray-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {page.title}
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                          /{page.slug}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={page.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {days_in_state(page)}d
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {page.status === "draft" ? (
                              <Button
                                size="sm"
                                disabled={busy}
                                onClick={() => publish_page(page.id)}
                                className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                              >
                                {busy ? "..." : "Publish"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                onClick={() => unpublish_page(page.id)}
                                className="h-7 px-3 text-xs text-gray-600"
                              >
                                {busy ? "..." : "Unpublish"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* History row */}
                      <tr
                        className={`${
                          selected.has(page.id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td />
                        <td colSpan={5} className="px-4 pb-3 pt-0">
                          <PublishHistoryTimeline page_slug={page.slug} />
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
