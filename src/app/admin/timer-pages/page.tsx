"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use_hazo_auth } from "hazo_auth/client";
import { Plus, Pencil, ExternalLink } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type TimerPage = {
  id: string;
  slug: string;
  title: string;
  timer_type: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function StatusBadge({ status }: { status: TimerPage["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container text-muted-foreground">
      Draft
    </span>
  );
}

function TimerTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    countdown: "bg-blue-100 text-blue-800",
    interval: "bg-red-100 text-red-800",
    stopwatch: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[type] ?? "bg-surface-container text-muted-foreground"
      }`}
    >
      {type}
    </span>
  );
}

export default function AdminTimerPagesPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [pages, set_pages] = useState<TimerPage[]>([]);
  const [loading, set_loading] = useState(true);

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

  if (auth_loading || loading) {
    return (
      <main className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-headline font-black text-foreground">Timer Pages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage SEO timer pages for organic search traffic.
          </p>
        </div>
        <Link
          href="/admin/timer-pages/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors no-underline text-sm"
        >
          <Plus className="w-4 h-4" />
          New Timer Page
        </Link>
      </div>

      {/* Table */}
      {pages.length === 0 ? (
        <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-10 text-center">
          <p className="text-muted-foreground mb-4">No timer pages yet.</p>
          <Link
            href="/admin/timer-pages/new"
            className="text-blue-600 hover:text-blue-800 font-medium no-underline"
          >
            Create your first timer page
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-surface-container-low">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timer Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{page.title}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/{page.slug}</td>
                    <td className="px-4 py-3">
                      <TimerTypeBadge type={page.timer_type} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/timer-pages/${page.id}`}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs no-underline"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium text-xs no-underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
