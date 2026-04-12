"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { Timer, Gamepad2, FileText, BookOpen, Users } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type Stats = {
  active_challenges: number;
  published_pages: number;
  draft_pages: number;
  published_blog: number;
  draft_blog: number;
};

type MetricCardProps = {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  badge_color: string;
};

function MetricCard({ label, value, sub, icon, accent, badge_color }: MetricCardProps) {
  return (
    <div className={`bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-5 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${accent} rounded-l-xl`} />
      <div className="pl-3">
        <div className="flex items-center gap-2 mb-2">
          <span className={`p-2 rounded-lg ${badge_color}`}>{icon}</span>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
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
      <h1 className="text-2xl font-headline font-black text-foreground mb-2">Analytics Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Site metrics and content counts.</p>

      {stats_loading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Timer Starts"
            value="Setup required"
            sub="Analytics events not yet implemented"
            icon={<Timer className="w-4 h-4 text-purple-600" />}
            accent="bg-purple-400"
            badge_color="bg-purple-50"
          />
          <MetricCard
            label="Active Challenges"
            value={stats.active_challenges}
            icon={<Gamepad2 className="w-4 h-4 text-orange-600" />}
            accent="bg-orange-400"
            badge_color="bg-orange-50"
          />
          <MetricCard
            label="Published Pages"
            value={stats.published_pages}
            sub={`${stats.draft_pages} draft`}
            icon={<FileText className="w-4 h-4 text-blue-600" />}
            accent="bg-blue-400"
            badge_color="bg-blue-50"
          />
          <MetricCard
            label="Blog Posts Published"
            value={stats.published_blog}
            sub={`${stats.draft_blog} draft`}
            icon={<BookOpen className="w-4 h-4 text-green-600" />}
            accent="bg-green-400"
            badge_color="bg-green-50"
          />
          <MetricCard
            label="Total Users"
            value="Setup required"
            sub="User analytics not yet available"
            icon={<Users className="w-4 h-4 text-muted-foreground" />}
            accent="bg-muted-foreground"
            badge_color="bg-surface-container-low"
          />
        </div>
      ) : (
        <p className="text-red-500">Failed to load analytics.</p>
      )}
    </main>
  );
}
