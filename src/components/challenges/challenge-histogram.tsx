"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Game = {
  id: string;
  winner_id: string | null;
  is_draw: number;
  played_at: string;
  points?: number;
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

  // Find the two player IDs (current user + opponent)
  const opponent_id = sorted
    .map((g) => g.winner_id)
    .find((id) => id && id !== current_user_id) || "opponent";

  const my_name = user_names[current_user_id] || "You";
  const opponent_name = user_names[opponent_id] || "Opponent";

  // Group games by date and compute cumulative scores
  const date_format = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  let my_total = 0;
  let opp_total = 0;

  // Start with zero point
  const data: { date: string; [key: string]: string | number }[] = [];

  // Group by date
  const by_date = new Map<string, Game[]>();
  for (const game of sorted) {
    const key = date_format(game.played_at);
    if (!by_date.has(key)) by_date.set(key, []);
    by_date.get(key)!.push(game);
  }

  // Add starting zero point
  const first_date = date_format(sorted[0].played_at);
  if (sorted.length > 0) {
    data.push({ date: first_date, [my_name]: 0, [opponent_name]: 0 });
  }

  for (const [date, date_games] of by_date) {
    for (const game of date_games) {
      const pts = game.points || 1;
      if (game.is_draw) continue;
      if (game.winner_id === current_user_id) {
        my_total += pts;
      } else if (game.winner_id) {
        opp_total += pts;
      }
    }
    // If the first date already has a zero entry, replace it
    if (data.length === 1 && data[0].date === date) {
      data[0][my_name] = my_total;
      data[0][opponent_name] = opp_total;
    } else {
      data.push({ date, [my_name]: my_total, [opponent_name]: opp_total });
    }
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} width={30} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-card border rounded-lg p-2 shadow-md text-sm">
                  <div className="font-medium mb-1">{label}</div>
                  {payload.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>{p.name}: {p.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Legend fontSize={12} />
          <Line
            type="monotone"
            dataKey={my_name}
            stroke="oklch(0.82 0.17 85)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey={opponent_name}
            stroke="oklch(0.5 0.02 260)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
