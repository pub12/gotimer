"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Trophy, Swords, ChevronLeft, ChevronRight } from "lucide-react";

type SidebarChallenge = {
  id: string;
  name: string;
  score_display: string;
  total_games: number;
  status: string;
};

interface ChallengeSidebarProps {
  /** "private" fetches user's challenges, "public" fetches public challenges */
  mode: "private" | "public";
}

export function ChallengeSidebar({ mode }: ChallengeSidebarProps) {
  const { id: current_id } = useParams<{ id: string }>();
  const [challenges, set_challenges] = useState<SidebarChallenge[]>([]);
  const [loading, set_loading] = useState(true);
  const [collapsed, set_collapsed] = useState(false);

  useEffect(() => {
    const url = mode === "private" ? "/api/challenges" : "/api/public/challenges";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.challenges || [];
        set_challenges(
          list.map((c: Record<string, unknown>) => ({
            id: c.id as string,
            name: c.name as string,
            score_display:
              mode === "private"
                ? `${c.my_wins ?? 0} - ${c.opponent_wins ?? 0}`
                : "",
            total_games: (c.total_games as number) ?? 0,
            status: (c.status as string) ?? "active",
          }))
        );
      })
      .catch(() => set_challenges([]))
      .finally(() => set_loading(false));
  }, [mode]);

  const base_path = mode === "private" ? "/challenges" : "/public-challenges";

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 transition-all duration-200 ${
        collapsed ? "w-10" : "w-64"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => set_collapsed(!collapsed)}
        className="self-end mb-2 p-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-muted-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {collapsed ? null : (
        <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-3 overflow-y-auto max-h-[calc(100vh-8rem)] sticky top-20">
          <h3 className="font-headline font-black text-xs uppercase tracking-widest text-muted-foreground px-2 mb-3">
            {mode === "private" ? "My Challenges" : "Public Challenges"}
          </h3>

          {loading ? (
            <p className="text-xs text-muted-foreground px-2">Loading...</p>
          ) : challenges.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2">No challenges found</p>
          ) : (
            <nav className="flex flex-col gap-1">
              {challenges.map((c) => {
                const is_active = c.id === current_id;
                return (
                  <Link
                    key={c.id}
                    href={`${base_path}/${c.id}`}
                    className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-[0.75rem] no-underline transition-all duration-150 ${
                      is_active
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                        : "text-foreground hover:bg-surface-container-high"
                    }`}
                  >
                    <span className={`text-sm font-semibold truncate ${is_active ? "text-primary-foreground" : ""}`}>
                      {c.name}
                    </span>
                    <div className={`flex items-center gap-2 text-xs ${is_active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {c.score_display && (
                        <>
                          <Trophy className="w-3 h-3" />
                          <span>{c.score_display}</span>
                        </>
                      )}
                      <Swords className="w-3 h-3" />
                      <span>{c.total_games} game{c.total_games !== 1 ? "s" : ""}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      )}
    </aside>
  );
}
