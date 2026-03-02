"use client";

import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type OverallHistogramProps = {
  challenges: {
    id: string;
    name: string;
    my_wins: number;
    opponent_wins: number;
    draws: number;
  }[];
};

export function OverallHistogram({ challenges }: OverallHistogramProps) {
  if (challenges.length === 0) return null;

  const data = challenges
    .filter((c) => c.my_wins + c.opponent_wins + c.draws > 0)
    .map((c) => ({
      name: c.name.length > 8 ? c.name.slice(0, 8) + "..." : c.name,
      "My Wins": c.my_wins,
      "Opponent Wins": c.opponent_wins,
      Draws: c.draws,
    }));

  if (data.length === 0) return null;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" fontSize={12} interval="preserveStartEnd" />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar
            dataKey="My Wins"
            fill="oklch(0.82 0.17 85)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Opponent Wins"
            fill="oklch(0.5 0.02 260)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Draws"
            fill="oklch(0.7 0.02 85)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
