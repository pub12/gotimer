"use client";

import React from "react";

type Participant = {
  user_id: string;
  role: string;
  score: number;
  games_played: number;
};

type GroupLeaderboardProps = {
  participants: Participant[];
  user_names: Record<string, string>;
  user_pictures: Record<string, string | null>;
  current_user_id: string;
};

export function GroupLeaderboard({
  participants,
  user_names,
  current_user_id,
}: GroupLeaderboardProps) {
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-3 pr-4 font-medium">Rank</th>
            <th className="pb-3 pr-4 font-medium">Player</th>
            <th className="pb-3 pr-4 font-medium text-right">Score</th>
            <th className="pb-3 font-medium text-right">Games Played</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const is_me = p.user_id === current_user_id;
            const display_name = user_names[p.user_id] || "Player";
            return (
              <tr
                key={p.user_id}
                className={`border-b last:border-0 ${is_me ? "bg-primary/5" : ""}`}
              >
                <td className="py-3 pr-4 font-semibold text-muted-foreground">
                  #{i + 1}
                </td>
                <td className="py-3 pr-4">
                  <span className={is_me ? "font-semibold" : ""}>{display_name}</span>
                  {is_me && (
                    <span className="ml-2 text-xs text-primary">(you)</span>
                  )}
                  {p.role === "creator" && (
                    <span className="ml-2 text-xs text-muted-foreground">creator</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right font-semibold">{p.score}</td>
                <td className="py-3 text-right text-muted-foreground">{p.games_played}</td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-muted-foreground">
                No participants yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
