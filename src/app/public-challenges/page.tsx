"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Trophy, Users, Gamepad2 } from "lucide-react";

type Challenge = {
  id: string;
  name: string;
  description: string;
  status: string;
  total_games: number;
  participants: { user_id: string; role: string }[];
  scores: Record<string, number>;
};

export default function PublicChallengesPage() {
  const [challenges, set_challenges] = useState<Challenge[]>([]);
  const [user_names, set_user_names] = useState<Record<string, string>>({});
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    fetch("/api/public/challenges")
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
          const profiles_res = await fetch("/api/public/user-profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_ids: Array.from(user_ids) }),
          });
          const profiles_data = await profiles_res.json();
          if (profiles_data.profiles) {
            const names: Record<string, string> = {};
            for (const p of profiles_data.profiles) {
              names[p.user_id] = p.name || "Player";
            }
            set_user_names(names);
          }
        }
      })
      .catch(() => {})
      .finally(() => set_loading(false));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Public Challenges</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading challenges...</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border text-center">
            <p className="text-muted-foreground mb-4">No public challenges yet.</p>
            <Link
              href="/hazo_auth/login"
              className="text-primary hover:underline font-medium"
            >
              Login to create the first one!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((c) => {
              const player_names = c.participants.map(
                (p) => user_names[p.user_id] || "Player"
              );
              const score_display = c.participants
                .map(
                  (p) =>
                    `${user_names[p.user_id] || "Player"}: ${c.scores[p.user_id] || 0}`
                )
                .join(" vs ");

              return (
                <Link
                  key={c.id}
                  href={`/public-challenges/${c.id}`}
                  className="block bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow no-underline text-foreground"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{c.name}</h3>
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
                      </div>
                      {c.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {c.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{player_names.join(" vs ")}</span>
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
