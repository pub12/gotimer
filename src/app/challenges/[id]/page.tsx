"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ScoreDisplay } from "@/components/challenges/score-display";
import { GameHistory } from "@/components/challenges/game-history";
import { AddGameDialog } from "@/components/challenges/add-game-dialog";
import { EditGameDialog } from "@/components/challenges/edit-game-dialog";
import { ChallengeHistogram } from "@/components/challenges/challenge-histogram";
import { TrashTalkBanner } from "@/components/challenges/trash-talk-banner";
import { PlayOnceGif } from "@/components/challenges/play-once-gif";
import { use_auth_status } from "hazo_auth/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Share2,
  Settings,
  Copy,
  Check,
} from "lucide-react";

type ChallengeData = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  status: string;
  gif_url: string | null;
  participants: { user_id: string; role: string }[];
  games: {
    id: string;
    winner_id: string | null;
    is_draw: number;
    notes: string;
    gif_url: string | null;
    played_at: string;
    created_by: string;
  }[];
  scores: Record<string, number>;
  draws: number;
};

export default function ChallengeDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { authenticated, loading: auth_loading } = use_auth_status();
  const [challenge, set_challenge] = useState<ChallengeData | null>(null);
  const [loading, set_loading] = useState(true);
  const [show_add_game, set_show_add_game] = useState(false);
  const [editing_game, set_editing_game] = useState<ChallengeData["games"][0] | null>(null);
  const [invite_url, set_invite_url] = useState<string | null>(null);
  const [copied, set_copied] = useState(false);
  const [current_user_id, set_current_user_id] = useState<string>("");
  const [user_names, set_user_names] = useState<Record<string, string>>({});
  const [user_pictures, set_user_pictures] = useState<Record<string, string | null>>({});

  const load_challenge = useCallback(async () => {
    try {
      const res = await fetch(`/api/challenges/${id}`);
      if (!res.ok) {
        router.push("/challenges");
        return;
      }
      const data = await res.json();
      set_challenge(data);
    } catch {
      router.push("/challenges");
    } finally {
      set_loading(false);
    }
  }, [id, router]);

  // Get current user
  useEffect(() => {
    if (auth_loading || !authenticated) return;
    fetch("/api/hazo_auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          set_current_user_id(data.user.id);
          // Pre-populate current user's name and picture from auth session
          const uid = data.user.id;
          const name = data.name || data.user.name || data.email?.split("@")[0] || "You";
          const pic = data.profile_picture_url || data.user.profile_picture_url || null;
          set_user_names((prev) => ({ ...prev, [uid]: name }));
          set_user_pictures((prev) => ({ ...prev, [uid]: pic }));
        }
      })
      .catch(() => {});
  }, [authenticated, auth_loading]);

  useEffect(() => {
    if (auth_loading) return;
    if (!authenticated) {
      localStorage.setItem("redirect_after_login", `/challenges/${id}`);
      router.push("/hazo_auth/login");
      return;
    }
    load_challenge();
  }, [authenticated, auth_loading, load_challenge, router, id]);

  // Load user profiles for participants
  useEffect(() => {
    if (!challenge || !current_user_id) return;

    // Ensure "opponent" placeholder always has a display name
    set_user_names((prev) => ({ ...prev, opponent: prev.opponent || "Opponent" }));

    const all_ids = challenge.participants.map((p) => p.user_id);

    fetch("/api/user-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ids: all_ids }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles) {
          // Merge with existing data (don't overwrite /me data)
          set_user_names((prev) => {
            const merged: Record<string, string> = { ...prev, opponent: "Opponent" };
            for (const profile of data.profiles) {
              merged[profile.user_id] =
                profile.name || profile.email?.split("@")[0] || prev[profile.user_id] || "Player";
            }
            for (const id of data.not_found_ids || []) {
              if (!merged[id]) merged[id] = "Player";
            }
            return merged;
          });
          set_user_pictures((prev) => {
            const merged = { ...prev };
            for (const profile of data.profiles) {
              merged[profile.user_id] = profile.profile_picture_url || prev[profile.user_id] || null;
            }
            for (const id of data.not_found_ids || []) {
              if (!merged[id]) merged[id] = null;
            }
            return merged;
          });
        }
      })
      .catch(() => {
        // Fallback: fill in missing names only
        set_user_names((prev) => {
          const merged = { ...prev };
          challenge.participants.forEach((p) => {
            if (!merged[p.user_id]) {
              merged[p.user_id] = p.user_id === current_user_id ? "You" : "Opponent";
            }
          });
          return merged;
        });
      });
  }, [challenge, current_user_id]);

  const handle_invite = async () => {
    try {
      const res = await fetch(`/api/challenges/${id}/invite`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        set_invite_url(data.invite_url);
      } else {
        toast.error("Failed to generate invite link");
      }
    } catch {
      toast.error("Failed to generate invite link");
    }
  };

  const copy_invite = () => {
    if (invite_url) {
      navigator.clipboard.writeText(invite_url);
      set_copied(true);
      setTimeout(() => set_copied(false), 2000);
    }
  };

  const handle_delete_game = async (game_id: string) => {
    try {
      const res = await fetch(`/api/challenges/${id}/games/${game_id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        load_challenge();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete game");
      }
    } catch {
      toast.error("Failed to delete game");
    }
  };

  if (loading || auth_loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!challenge) return null;

  const my_score = challenge.scores[current_user_id] || 0;
  const opponent_id = challenge.participants.find(
    (p) => p.user_id !== current_user_id
  )?.user_id;
  // Count "opponent" placeholder wins when no real opponent has joined yet
  const placeholder_opponent_wins = !opponent_id
    ? challenge.games.filter((g) => !g.is_draw && g.winner_id === "opponent").length
    : 0;
  const opponent_score = opponent_id
    ? challenge.scores[opponent_id] || 0
    : placeholder_opponent_wins;
  const am_winning = my_score > opponent_score;
  const has_games = challenge.games.length > 0;

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />

      <div className="w-full max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/challenges")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </button>

        {/* Challenge header */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate">
                {challenge.name}
              </h1>
              {challenge.description && (
                <p className="text-muted-foreground mt-1">
                  {challenge.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {challenge.created_by === current_user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/challenges/${id}/edit`)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Theme GIF */}
          {challenge.gif_url && (
            <div className="mb-4">
              <PlayOnceGif
                src={challenge.gif_url}
                alt="Challenge theme"
                className="w-full rounded-lg max-h-48 object-cover"
              />
            </div>
          )}

          {/* Score display */}
          <ScoreDisplay
            player1_name={user_names[current_user_id] || "You"}
            player2_name={
              opponent_id
                ? user_names[opponent_id] || "Opponent"
                : "Opponent"
            }
            player1_score={my_score}
            player2_score={opponent_score}
            player1_picture={user_pictures[current_user_id]}
            player2_picture={opponent_id ? user_pictures[opponent_id] : null}
            draws={challenge.draws}
          />

          {/* Trash talk banner */}
          {has_games && (
            <div className="mt-4">
              <TrashTalkBanner type={am_winning ? "win" : "lose"} />
            </div>
          )}
        </div>

        {/* Invite section */}
        {(invite_url || challenge.participants.length < 2) && (
          <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
            <h3 className="font-semibold mb-3">Invite a Friend</h3>
            {invite_url ? (
              <div>
                <div className="bg-muted rounded-lg p-3 text-sm font-mono break-all mb-3">
                  GoTimer.org: {challenge.name}
                </div>
                <Button onClick={copy_invite} variant="outline" className="w-full">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" /> Copy Link
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={handle_invite} variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Generate Invite Link
              </Button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            className="flex-1"
            onClick={() => set_show_add_game(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Game Result
          </Button>
          {!invite_url && challenge.participants.length >= 2 && (
            <Button variant="outline" onClick={handle_invite}>
              <Share2 className="w-4 h-4 mr-2" />
              Invite
            </Button>
          )}
        </div>

        {/* Histogram */}
        {has_games && (
          <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
            <h3 className="font-semibold mb-4">Game History Chart</h3>
            <ChallengeHistogram
              games={challenge.games}
              current_user_id={current_user_id}
              user_names={user_names}
            />
          </div>
        )}

        {/* Game history */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-8">
          <h3 className="font-semibold mb-4">Game History</h3>
          <GameHistory
            games={challenge.games}
            participants={challenge.participants}
            current_user_id={current_user_id}
            user_names={user_names}
            user_pictures={user_pictures}
            on_delete={handle_delete_game}
            on_edit={(game) => set_editing_game(game)}
          />
        </div>
      </div>

      {show_add_game && (
        <AddGameDialog
          challenge_id={id}
          participants={challenge.participants}
          user_names={user_names}
          user_pictures={user_pictures}
          on_game_added={() => {
            set_show_add_game(false);
            load_challenge();
          }}
          on_close={() => set_show_add_game(false)}
        />
      )}

      {editing_game && (
        <EditGameDialog
          challenge_id={id}
          game={editing_game}
          participants={challenge.participants}
          user_names={user_names}
          user_pictures={user_pictures}
          on_game_updated={() => {
            set_editing_game(null);
            load_challenge();
          }}
          on_close={() => set_editing_game(null)}
        />
      )}
    </main>
  );
}
