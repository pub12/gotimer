"use client";

import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Game = {
  id: string;
  winner_id: string | null;
  is_draw: number;
  played_at: string;
};

type ChallengeHistogramProps = {
  games: Game[];
  current_user_id: string;
  user_names: Record<string, string>;
};

export function ChallengeHistogram({
  games,
  current_user_id,
  user_names,
}: ChallengeHistogramProps) {
  if (games.length === 0) return null;

  // Sort games chronologically
  const sorted = [...games].sort(
    (a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
  );

  const data = sorted.map((game, idx) => {
    const is_my_win = game.winner_id === current_user_id;
    const is_draw = game.is_draw === 1;
    const winner_name = game.winner_id
      ? user_names[game.winner_id] || "Unknown"
      : "Draw";

    return {
      name: `#${idx + 1}`,
      value: 1,
      winner: winner_name,
      type: is_draw ? "draw" : is_my_win ? "win" : "loss",
      date: new Date(game.played_at).toLocaleDateString(),
    };
  });

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" fontSize={12} interval="preserveStartEnd" />
          <YAxis hide />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border rounded-lg p-2 shadow-md text-sm">
                  <div className="font-medium">{d.winner}</div>
                  <div className="text-muted-foreground">{d.date}</div>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.type === "win"
                    ? "oklch(0.82 0.17 85)"
                    : entry.type === "draw"
                    ? "oklch(0.7 0.02 85)"
                    : "oklch(0.5 0.02 260)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
