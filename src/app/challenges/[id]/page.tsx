"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ScoreDisplay } from "@/components/challenges/score-display";
import { GameHistory } from "@/components/challenges/game-history";
import { AddGameDialog } from "@/components/challenges/add-game-dialog";
import { EditGameDialog } from "@/components/challenges/edit-game-dialog";
import { ChallengeHistogram } from "@/components/challenges/challenge-histogram";
import { TrashTalkBanner } from "@/components/challenges/trash-talk-banner";
import { PlayOnceGif } from "@/components/challenges/play-once-gif";
import { GroupLeaderboard } from "@/components/challenges/group-leaderboard";
import { JoinDialog } from "@/components/challenges/join-dialog";
import { use_auth_status } from "hazo_auth/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Share2,
  Settings,
  Copy,
  Check,
  Trophy,
  Scale,
} from "lucide-react";
import { ChallengeSidebar } from "@/components/challenges/challenge-sidebar";
import { compute_winner } from "@/lib/challenge-winner";

function format_closed_at_relative(closed_at: string): string {
  const normalized = closed_at.includes("T") ? closed_at : closed_at.replace(" ", "T") + "Z";
  const diff = Date.now() - new Date(normalized).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

type ChallengeData = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  status: string;
  closed_at?: string | null;
  gif_url: string | null;
  format: string;
  timer_type: string | null;
  join_code: string | null;
  participants: { user_id: string; role: string; score?: number; games_played?: number }[];
  games: {
    id: string;
    winner_id: string | null;
    is_draw: number;
    notes: string;
    gif_url: string | null;
    played_at: string;
    created_by: string;
    points?: number;
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
  const [show_join_dialog, set_show_join_dialog] = useState(false);
  const [group_participants, set_group_participants] = useState<ChallengeData["participants"]>([]);
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

  // Load group participants with scores for group challenges
  useEffect(() => {
    if (!challenge || challenge.format !== "group") return;
    fetch(`/api/challenges/${id}/participants`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => set_group_participants(data))
      .catch(() => {});
  }, [challenge, id]);

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
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-surface pt-14 md:pt-20">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </>
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
  const is_closed = challenge.status === "completed";
  const my_name = user_names[current_user_id] || "You";
  const opponent_name = opponent_id ? user_names[opponent_id] || "Opponent" : "Opponent";
  const winner_result = is_closed
    ? compute_winner([
        { name: my_name, score: my_score },
        { name: opponent_name, score: opponent_score },
      ])
    : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-14 md:pt-20">
      <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="w-full max-w-7xl mx-auto flex gap-6 px-4 md:px-6">
        <ChallengeSidebar mode="private" />
        <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <button
            onClick={() => router.push("/challenges")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-headline font-bold italic text-secondary">{challenge.name}</span>
          </button>
          <div className="flex items-center gap-2">
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

        {/* Closed banner */}
        {is_closed && (
          <div className="mx-4 md:mx-6 mb-4 rounded-[1rem] bg-accent/10 border border-accent/20 px-5 py-4">
            <div className="flex items-center gap-3">
              {winner_result?.kind === "win" && (
                <>
                  <Trophy className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-accent font-semibold text-sm">
                      {winner_result.winner_name} won {winner_result.winner_score}–{winner_result.loser_score}
                    </p>
                    {challenge.closed_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This challenge was closed {format_closed_at_relative(challenge.closed_at)}
                      </p>
                    )}
                  </div>
                </>
              )}
              {winner_result?.kind === "tie" && (
                <>
                  <Scale className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground font-semibold text-sm">
                      Tied {winner_result.score}–{winner_result.score}
                    </p>
                    {challenge.closed_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This challenge was closed {format_closed_at_relative(challenge.closed_at)}
                      </p>
                    )}
                  </div>
                </>
              )}
              {winner_result?.kind === "no_result" && (
                <div>
                  <p className="text-muted-foreground text-sm font-semibold">Closed — no result</p>
                  {challenge.closed_at && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      This challenge was closed {format_closed_at_relative(challenge.closed_at)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dark Hero Section — head-to-head */}
        {challenge.format !== "group" && (
          <div className="mx-4 md:mx-6 rounded-[1rem] bg-gradient-to-br from-primary to-primary-container overflow-hidden relative shadow-[var(--shadow-soft-lg)]">
            {/* Background image overlay */}
            {challenge.gif_url && (
              <div className="absolute inset-0 opacity-15">
                <PlayOnceGif
                  src={challenge.gif_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="relative z-10 px-6 md:px-12 py-10 md:py-14">
              {is_closed && (
                <div className="flex justify-center mb-4">
                  <span className="text-xs font-headline font-black uppercase tracking-[0.3em] text-primary-foreground/40 border border-primary-foreground/20 px-3 py-1 rounded-full">
                    Final
                  </span>
                </div>
              )}
              {/* Competitors + Scores */}
              <div className="flex items-center justify-center gap-4 md:gap-8">
                {/* Player 1 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary-foreground/10 overflow-hidden flex items-center justify-center shadow-lg">
                    {user_pictures[current_user_id] ? (
                      <img src={user_pictures[current_user_id]!} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl md:text-4xl font-headline font-black text-primary-foreground/60">
                        {(user_names[current_user_id] || "Y")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-primary-foreground font-headline font-bold text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">
                      {user_names[current_user_id] || "You"}
                    </p>
                    <span className="text-primary-foreground/40 text-xs uppercase tracking-wider">P1</span>
                  </div>
                </div>

                {/* Scores */}
                <div className="flex items-baseline gap-3 md:gap-6">
                  <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${
                    is_closed && winner_result?.kind === "win"
                      ? winner_result.winner_name === my_name
                        ? "text-primary-foreground"
                        : "text-primary-foreground/30"
                      : am_winning
                      ? "text-primary-foreground"
                      : "text-primary-foreground/50"
                  }`}>
                    {my_score}
                  </span>
                  <span className="text-secondary text-lg md:text-xl font-headline font-bold">vs</span>
                  <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${
                    is_closed && winner_result?.kind === "win"
                      ? winner_result.winner_name === opponent_name
                        ? "text-primary-foreground"
                        : "text-primary-foreground/30"
                      : !am_winning && opponent_score > my_score
                      ? "text-primary-foreground"
                      : "text-primary-foreground/50"
                  }`}>
                    {opponent_score}
                  </span>
                </div>

                {/* Player 2 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary-foreground/10 overflow-hidden flex items-center justify-center shadow-lg">
                    {opponent_id && user_pictures[opponent_id] ? (
                      <img src={user_pictures[opponent_id]!} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl md:text-4xl font-headline font-black text-primary-foreground/60">
                        {(opponent_id ? user_names[opponent_id] || "O" : "O")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-primary-foreground font-headline font-bold text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">
                      {opponent_id ? user_names[opponent_id] || "Opponent" : "Opponent"}
                    </p>
                    <span className="text-primary-foreground/40 text-xs uppercase tracking-wider">P2</span>
                  </div>
                </div>
              </div>

              {/* Featured GIF (between scores, if exists) */}
              {challenge.gif_url && (
                <div className="flex justify-center mt-6">
                  <div className="w-48 md:w-64 h-32 md:h-44 rounded-xl overflow-hidden shadow-xl">
                    <PlayOnceGif
                      src={challenge.gif_url}
                      alt="Challenge theme"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Draws count */}
              {challenge.draws > 0 && (
                <p className="text-center text-primary-foreground/50 text-sm mt-4">
                  {challenge.draws} draw{challenge.draws !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Floating ADD GAME RESULT button — hidden when closed */}
        {challenge.status !== "completed" && (
          <div className="bg-primary/[0.03] py-4 -mx-4 md:-mx-6 px-4 md:px-6 rounded-[1rem] flex justify-center -mt-6 relative z-20 mb-6">
            <button
              onClick={() => set_show_add_game(true)}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-headline font-black text-base shadow-[var(--shadow-soft-lg)] hover:scale-105 transition-all duration-200 border-none cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Game Result
            </button>
          </div>
        )}

        {/* Group format header (non-hero) */}
        {challenge.format === "group" && (
          <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] mx-4 md:mx-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-headline font-black mb-2">
              {challenge.name}
            </h1>
            {challenge.description && (
              <p className="text-muted-foreground mb-4">{challenge.description}</p>
            )}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Leaderboard</h3>
              {challenge.join_code && (
                <div className="text-xs text-muted-foreground font-mono bg-surface-container-high px-2 py-1 rounded-[0.5rem]">
                  Code: {challenge.join_code}
                </div>
              )}
            </div>
            <GroupLeaderboard
              participants={group_participants.length > 0 ? group_participants.map((p) => ({ ...p, score: p.score ?? 0, games_played: p.games_played ?? 0 })) : challenge.participants.map((p) => ({ ...p, score: challenge.scores[p.user_id] ?? 0, games_played: 0 }))}
              user_names={user_names}
              user_pictures={user_pictures}
              current_user_id={current_user_id}
            />
            {challenge.join_code && !challenge.participants.some((p) => p.user_id === current_user_id) && (
              <div className="mt-4">
                <Button onClick={() => set_show_join_dialog(true)} className="w-full">
                  Join This Challenge
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Trash talk banner */}
        {challenge.format !== "group" && has_games && (
          <div className={`mx-4 md:mx-6 mb-6 border-l-4 ${am_winning ? "border-l-accent" : "border-l-destructive"} rounded-[0.25rem]`}>
            <TrashTalkBanner type={am_winning ? "win" : "lose"} />
          </div>
        )}

        {/* Content area */}
        <div className="px-4 md:px-6">
          {/* Invite section */}
          {(invite_url || challenge.participants.length < 2) && (
            <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] mb-6 border-l-4 border-l-secondary">
              <h3 className="font-semibold mb-3">Invite a Friend</h3>
              {invite_url ? (
                <div>
                  <div className="bg-surface-container-high rounded-[0.75rem] p-3 text-sm font-mono break-all mb-3">
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

          {/* Secondary actions */}
          {!invite_url && challenge.participants.length >= 2 && (
            <div className="flex gap-3 mb-6">
              <Button variant="outline" onClick={handle_invite} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          )}

          {/* Histogram */}
          {has_games && (
            <div className="bg-primary/[0.03] py-4 -mx-4 md:-mx-6 px-4 md:px-6 rounded-[1rem]">
              <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] mb-6">
                <h3 className="font-headline font-bold mb-4">Score Progression</h3>
                <ChallengeHistogram
                  games={challenge.games}
                  current_user_id={current_user_id}
                  user_names={user_names}
                />
              </div>
            </div>
          )}

          {/* Game history */}
          <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] mb-8">
            <h3 className="font-headline font-bold text-xl mb-4 uppercase tracking-wider">Game History</h3>
            <GameHistory
              games={challenge.games}
              participants={challenge.participants}
              current_user_id={current_user_id}
              user_names={user_names}
              user_pictures={user_pictures}
              on_delete={challenge.status !== "completed" ? handle_delete_game : undefined}
              on_edit={challenge.status !== "completed" ? (game) => set_editing_game(game) : undefined}
              challenge_id={id}
              challenge_name={challenge.name}
              scores={challenge.scores}
            />
          </div>
        </div>
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

      {show_join_dialog && (
        <JoinDialog
          challenge_id={id}
          on_joined={() => {
            set_show_join_dialog(false);
            load_challenge();
          }}
          on_close={() => set_show_join_dialog(false)}
        />
      )}
      </main>
      <Footer />
    </>
  );
}
