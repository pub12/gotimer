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
    <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-headline text-2xl font-black text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
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
      <h1 className="font-headline text-2xl font-black text-foreground mb-6">Dashboard</h1>

      {stats_loading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Published Pages"
              value={stats.published_pages}
              sub={`${stats.draft_pages} draft`}
              icon={<FileText className="w-5 h-5 text-primary" />}
              color="bg-surface-container"
            />
            <StatCard
              label="Active Challenges"
              value={stats.active_challenges}
              icon={<Gamepad2 className="w-5 h-5 text-secondary" />}
              color="bg-surface-container"
            />
            <StatCard
              label="Blog Posts"
              value={stats.published_blog}
              sub={`${stats.draft_blog} draft`}
              icon={<BookOpen className="w-5 h-5 text-accent" />}
              color="bg-surface-container"
            />
            <StatCard
              label="Timer Starts"
              value="Setup required"
              icon={<Clock className="w-5 h-5 text-primary" />}
              color="bg-surface-container"
            />
          </div>

          {stats.draft_pages_list.length > 0 && (
            <section>
              <h2 className="font-headline text-lg font-black text-foreground mb-3">Publishing Queue</h2>
              <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] divide-y divide-surface-container">
                {stats.draft_pages_list.map((page) => (
                  <div key={page.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{page.title}</p>
                      <p className="text-xs text-muted-foreground">/{page.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="text-xs text-primary hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/timer-pages/${page.id}`}
                        className="text-xs text-secondary hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-destructive">Failed to load stats.</p>
      )}
    </main>
  );
}
