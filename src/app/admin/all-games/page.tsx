"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { use_hazo_auth } from "hazo_auth/client";
import { Trophy, Users, Gamepad2 } from "lucide-react";

const REQUIRED_PERMISSIONS: string[] = ["admin_view_all_games"];

type Challenge = {
  id: string;
  name: string;
  description: string;
  status: string;
  is_public: number;
  total_games: number;
  participants: { user_id: string; role: string }[];
  scores: Record<string, number>;
};

export default function AdminAllGamesPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });
  const [challenges, set_challenges] = useState<Challenge[]>([]);
  const [user_names, set_user_names] = useState<Record<string, string>>({});
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) {
      router.push("/");
    }
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;

    fetch("/api/admin/all-challenges")
      .then((res) => res.json())
      .then(async (data) => {
        set_challenges(data);

        // Collect all unique user IDs
        const user_ids = new Set<string>();
        for (const c of data) {
          for (const p of c.participants) {
            user_ids.add(p.user_id);
          }
        }

        if (user_ids.size > 0) {
          const profiles_res = await fetch("/api/user-profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_ids: Array.from(user_ids) }),
          });
          const profiles_data = await profiles_res.json();
          if (profiles_data.profiles) {
            const names: Record<string, string> = {};
            for (const p of profiles_data.profiles) {
              names[p.user_id] = p.name || p.email?.split("@")[0] || "Player";
            }
            set_user_names(names);
          }
        }
      })
      .catch(() => {})
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok]);

  if (auth_loading || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">All Games (Admin)</h1>

        {challenges.length === 0 ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border text-center">
            <p className="text-muted-foreground">No challenges found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((c) => {
              const player_names = c.participants.map(
                (p) => user_names[p.user_id] || "Player"
              );
              const score_display = c.participants
                .map((p) => `${user_names[p.user_id] || "Player"}: ${c.scores[p.user_id] || 0}`)
                .join(" vs ");

              return (
                <Link
                  key={c.id}
                  href={c.is_public ? `/public-challenges/${c.id}` : "#"}
                  className="block bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow no-underline text-foreground"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{c.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            c.status === "active"
                              ? "bg-green-100 text-green-700"
                              : c.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {c.status}
                        </span>
                        {c.is_public ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            public
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            private
                          </span>
                        )}
                      </div>
                      {c.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {c.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {player_names.join(" vs ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gamepad2 className="w-3.5 h-3.5" />
                          {c.total_games} game{c.total_games !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          {score_display || "No games yet"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
