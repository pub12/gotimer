"use client";

import React from "react";
import Image from "next/image";
import { Trophy, Handshake, Trash2, Pencil, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Game = {
  id: string;
  winner_id: string | null;
  is_draw: number;
  notes: string;
  gif_url: string | null;
  played_at: string;
  created_by: string;
};

type Participant = {
  user_id: string;
  role: string;
};

type GameHistoryProps = {
  games: Game[];
  participants: Participant[];
  current_user_id: string;
  user_names: Record<string, string>;
  user_pictures?: Record<string, string | null>;
  on_delete?: (game_id: string) => void;
  on_edit?: (game: Game) => void;
  challenge_id?: string;
  challenge_name?: string;
  scores?: Record<string, number>;
};

async function handle_share(
  challenge_id: string,
  challenge_name: string,
  game: Game,
  user_names: Record<string, string>,
  scores: Record<string, number>,
  participants: Participant[]
) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://gotimer.org";
  const game_url = `${origin}/public-challenges/${challenge_id}/game/${game.id}`;

  let title: string;
  if (game.is_draw) {
    title = `Draw in the ${challenge_name} game!`;
  } else {
    const winner_name = game.winner_id ? user_names[game.winner_id] || "Someone" : "Someone";
    title = `${winner_name} won the ${challenge_name} game!`;
  }

  const score_parts = participants.map(
    (p) => `${user_names[p.user_id] || "Player"} ${scores[p.user_id] || 0}`
  );
  const score_text = `Score: ${score_parts.join(" - ")}`;

  if (navigator.share) {
    try {
      await navigator.share({ text: `${title}\n${score_text}\n${game_url}` });
    } catch {
      // User cancelled or share failed — ignore
    }
  } else {
    await navigator.clipboard.writeText(`${title}\n${score_text}\n${game_url}`);
  }
}

export function GameHistory({
  games,
  participants,
  current_user_id,
  user_names,
  user_pictures,
  on_delete,
  on_edit,
  challenge_id,
  challenge_name,
  scores,
}: GameHistoryProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No games recorded yet. Add your first game!
      </div>
    );
  }

  const can_share = challenge_id && challenge_name && scores;

  return (
    <div className="space-y-3">
      {games.map((game) => {
        const is_my_win =
          !game.is_draw && game.winner_id === current_user_id;
        const winner_name = game.winner_id
          ? user_names[game.winner_id] || "Unknown"
          : null;

        return (
          <div
            key={game.id}
            className={`p-4 rounded-lg border ${
              is_my_win
                ? "border-primary/30 bg-primary/5"
                : game.is_draw
                ? "border-muted bg-muted/30"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {game.is_draw ? (
                  <Handshake className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Trophy
                    className={`w-4 h-4 ${
                      is_my_win ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                )}
                {!game.is_draw && game.winner_id && user_pictures?.[game.winner_id] && (
                  <Image
                    src={user_pictures[game.winner_id]!}
                    alt={winner_name || "Winner"}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                <span className="font-medium">
                  {game.is_draw ? "Draw" : `${winner_name} won`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(game.played_at).toLocaleDateString()}
                </span>
                {can_share && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      handle_share(
                        challenge_id,
                        challenge_name,
                        game,
                        user_names,
                        scores,
                        participants
                      )
                    }
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                )}
                {on_edit && game.created_by === current_user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => on_edit(game)}
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                )}
                {on_delete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => on_delete(game.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
            {game.notes && (
              <p className="text-sm text-muted-foreground mt-2">
                {game.notes}
              </p>
            )}
            {game.gif_url && (
              <img
                src={game.gif_url}
                alt="Game reaction"
                className="mt-2 rounded-lg max-h-40 max-w-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
