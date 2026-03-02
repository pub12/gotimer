"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Swords } from "lucide-react";

type ChallengeCardProps = {
  id: string;
  name: string;
  my_wins: number;
  opponent_wins: number;
  draws: number;
  total_games: number;
  status: string;
  game_name?: string | null;
  player_names?: string[];
};

export function ChallengeCard({
  id,
  name,
  my_wins,
  opponent_wins,
  draws,
  total_games,
  status,
  game_name,
  player_names,
}: ChallengeCardProps) {
  const is_winning = my_wins > opponent_wins;
  const is_tied = my_wins === opponent_wins;

  return (
    <Link href={`/challenges/${id}`} className="no-underline">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                {game_name && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {game_name}
                  </span>
                )}
                {player_names && player_names.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {player_names.join(" vs ")}
                  </span>
                )}
              </div>
            </div>
            {status !== "active" && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                {status}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {is_winning ? (
                <Trophy className="w-5 h-5 text-primary" />
              ) : (
                <Swords className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-2xl font-bold">
                <span className={is_winning ? "text-primary" : ""}>
                  {my_wins}
                </span>
                <span className="text-muted-foreground mx-1">-</span>
                <span className={!is_winning && !is_tied ? "text-primary" : ""}>
                  {opponent_wins}
                </span>
              </span>
              {draws > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({draws} draw{draws !== 1 ? "s" : ""})
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {total_games} game{total_games !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
