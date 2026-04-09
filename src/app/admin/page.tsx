"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use_hazo_auth } from "hazo_auth/client";
import { FileText, BookOpen, Gamepad2, Clock } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type Stats = {
  active_challenges: number;
  published_pages: number;
  draft_pages: number;
  published_blog: number;
  draft_blog: number;
  draft_pages_list: { id: string; slug: string; title: string; updated_at: string }[];
};

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [stats, set_stats] = useState<Stats | null>(null);
  const [stats_loading, set_stats_loading] = useState(true);

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (loading || !authenticated || !permission_ok) return;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => set_stats(data))
      .catch(() => {})
      .finally(() => set_stats_loading(false));
  }, [loading, authenticated, permission_ok]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {stats_loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Published Pages"
              value={stats.published_pages}
              sub={`${stats.draft_pages} draft`}
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              color="bg-blue-50"
            />
            <StatCard
              label="Active Challenges"
              value={stats.active_challenges}
              icon={<Gamepad2 className="w-5 h-5 text-orange-600" />}
              color="bg-orange-50"
            />
            <StatCard
              label="Blog Posts"
              value={stats.published_blog}
              sub={`${stats.draft_blog} draft`}
              icon={<BookOpen className="w-5 h-5 text-green-600" />}
              color="bg-green-50"
            />
            <StatCard
              label="Timer Starts"
              value="Setup required"
              icon={<Clock className="w-5 h-5 text-purple-600" />}
              color="bg-purple-50"
            />
          </div>

          {stats.draft_pages_list.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Publishing Queue</h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {stats.draft_pages_list.map((page) => (
                  <div key={page.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{page.title}</p>
                      <p className="text-xs text-gray-400">/{page.slug}</p>
                    </div>
                    <Link
                      href={`/admin/timer-pages/${page.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-red-500">Failed to load stats.</p>
      )}
    </main>
  );
}
