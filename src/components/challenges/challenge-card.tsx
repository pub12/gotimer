"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Swords, MoreHorizontal, Scale } from "lucide-react";
import { compute_winner } from "@/lib/challenge-winner";

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
  is_creator?: boolean;
  closed_at?: string | null;
  on_close_toggle?: () => void;
};

function format_closed_at(closed_at: string): string {
  const normalized = closed_at.includes("T") ? closed_at : closed_at.replace(" ", "T") + "Z";
  const diff = Date.now() - new Date(normalized).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Closed today";
  if (days === 1) return "Closed yesterday";
  return `Closed ${days} days ago`;
}

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
  is_creator,
  closed_at,
  on_close_toggle,
}: ChallengeCardProps) {
  const [menu_open, set_menu_open] = useState(false);

  const is_closed = status === "completed";
  const is_winning = my_wins > opponent_wins;
  const is_tied = my_wins === opponent_wins;
  const winner_result = is_closed
    ? compute_winner([
        { name: player_names?.[0] || "You", score: my_wins },
        { name: player_names?.[1] || "Opponent", score: opponent_wins },
      ])
    : null;

  return (
    <div className="relative">
      <Link href={`/challenges/${id}`} className="no-underline block">
        <Card
          className={`hover:shadow-lg transition-shadow cursor-pointer ${
            is_closed ? "border-l-4 border-l-accent bg-accent/[0.03]" : ""
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-8">
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
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    is_closed
                      ? "bg-accent/10 text-accent font-medium"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {is_closed ? "Closed" : status}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {is_closed ? (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  {winner_result?.kind === "win" && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Trophy className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-accent font-headline font-bold text-sm truncate">
                        {winner_result.winner_name} won
                      </span>
                    </div>
                  )}
                  {winner_result?.kind === "tie" && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Scale className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-headline font-bold text-sm">Draw</span>
                    </div>
                  )}
                  {winner_result?.kind === "no_result" && (
                    <p className="text-muted-foreground font-headline font-bold text-sm mb-0.5">
                      No result
                    </p>
                  )}
                  {closed_at && (
                    <p className="text-xs text-muted-foreground">{format_closed_at(closed_at)}</p>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className={`text-4xl font-headline font-black tabular-nums ${
                    winner_result?.kind === "win" && winner_result.winner_name === (player_names?.[0] || "You")
                      ? "text-foreground"
                      : winner_result?.kind === "win"
                      ? "text-muted-foreground/30"
                      : "text-foreground/80"
                  }`}>{my_wins}</span>
                  <span className="text-muted-foreground font-headline font-bold text-lg">—</span>
                  <span className={`text-4xl font-headline font-black tabular-nums ${
                    winner_result?.kind === "win" && winner_result.winner_name === (player_names?.[1] || "Opponent")
                      ? "text-foreground"
                      : winner_result?.kind === "win"
                      ? "text-muted-foreground/30"
                      : "text-foreground/80"
                  }`}>{opponent_wins}</span>
                </div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </Link>

      {is_creator && (
        <>
          {menu_open && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => set_menu_open(false)}
            />
          )}
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                set_menu_open(!menu_open);
              }}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors border-none bg-transparent cursor-pointer"
              aria-label="Challenge options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menu_open && (
              <div className="absolute right-0 top-8 bg-card border rounded-lg shadow-lg py-1 min-w-[168px]">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    set_menu_open(false);
                    on_close_toggle?.();
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-none bg-transparent cursor-pointer"
                >
                  {is_closed ? "Reopen challenge" : "Close challenge"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
