import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface GameHistoryGame {
  id: string | number;
  date: string;
  winner_name: string;
  winner_avatar?: string;
  loser_name: string;
  winner_score: number;
  loser_score: number;
  gif_url?: string;
  description?: string;
}

export function GameHistoryItem({
  game,
  is_my_win,
  on_edit,
  on_delete,
  className,
}: {
  game: GameHistoryGame;
  is_my_win?: boolean;
  on_edit?: () => void;
  on_delete?: () => void;
  className?: string;
}) {
  const point_delta = game.winner_score - game.loser_score;

  return (
    <div
      data-slot="game-history-item"
      className={cn(
        "flex gap-4 md:gap-6 bg-card p-4 md:p-6 rounded-[1.5rem] shadow-[var(--shadow-soft)] hover:scale-[1.01] transition-all duration-200",
        is_my_win && "bg-accent/5",
        className
      )}
    >
      {/* Date badge */}
      <div className="w-16 md:w-20 shrink-0 text-center">
        <p className="font-headline font-black text-xs md:text-sm text-muted-foreground uppercase">
          {game.date}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Avatar
            src={game.winner_avatar}
            fallback={game.winner_name.charAt(0)}
            size="sm"
          />
          <span className="font-medium text-sm">
            {game.winner_name} won vs {game.loser_name}
          </span>
          <Badge variant={is_my_win ? "win" : "loss"} size="sm">
            {is_my_win ? "WIN" : "LOSS"}
          </Badge>
        </div>

        {game.description && (
          <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
        )}

        {game.gif_url && (
          <div className="rounded-[0.75rem] overflow-hidden aspect-video max-w-[240px] mb-2">
            <img
              src={game.gif_url}
              alt="Game reaction"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Point delta */}
      <div className="shrink-0 text-right">
        <span
          className={cn(
            "font-headline font-black text-lg",
            is_my_win ? "text-emerald-600" : "text-secondary"
          )}
        >
          {is_my_win ? `+${point_delta}` : `-${point_delta}`}
        </span>
      </div>
    </div>
  );
}
