"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ScoreDisplay } from "@/components/challenges/score-display";
import { GameHistory } from "@/components/challenges/game-history";
import { ChallengeHistogram } from "@/components/challenges/challenge-histogram";
import { PlayOnceGif } from "@/components/challenges/play-once-gif";
import { ArrowLeft, Trophy, Scale } from "lucide-react";
import { compute_winner } from "@/lib/challenge-winner";
import { ChallengeSidebar } from "@/components/challenges/challenge-sidebar";
import { use_auth_status } from "hazo_auth/client";


type ChallengeData = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  status: string;
  closed_at?: string | null;
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

export default function PublicChallengeDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { authenticated } = use_auth_status();
  const [challenge, set_challenge] = useState<ChallengeData | null>(null);
  const [loading, set_loading] = useState(true);
  const [user_names, set_user_names] = useState<Record<string, string>>({});
  const [user_pictures, set_user_pictures] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetch(`/api/public/challenges/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        set_challenge(data);

        // Load user profiles
        const all_ids = data.participants.map((p: { user_id: string }) => p.user_id);
        if (all_ids.length > 0) {
          fetch("/api/public/user-profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_ids: all_ids, challenge_context: id }),
          })
            .then((res) => res.json())
            .then((profiles_data) => {
              if (profiles_data.profiles) {
                const names: Record<string, string> = {};
                const pictures: Record<string, string | null> = {};
                for (const p of profiles_data.profiles) {
                  names[p.user_id] = p.name || "Player";
                  pictures[p.user_id] = p.profile_picture_url || null;
                }
                for (const uid of profiles_data.not_found_ids || []) {
                  names[uid] = "Player";
                  pictures[uid] = null;
                }
                set_user_names(names);
                set_user_pictures(pictures);
              }
            })
            .catch(() => {
              // Fallback names
              const names: Record<string, string> = {};
              data.participants.forEach((p: { user_id: string }, i: number) => {
                names[p.user_id] = `Player ${i + 1}`;
              });
              set_user_names(names);
            });
        }
      })
      .catch(() => {
        router.push("/public-challenges");
      })
      .finally(() => set_loading(false));
  }, [id, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface pt-14 md:pt-20">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!challenge) return null;

  const player1 = challenge.participants[0];
  const player2 = challenge.participants[1];
  const player1_score = player1 ? challenge.scores[player1.user_id] || 0 : 0;
  const player2_score = player2 ? challenge.scores[player2.user_id] || 0 : 0;

  // Use the first participant as "current_user_id" for histogram display
  const display_user_id = player1?.user_id || "";
  const has_games = challenge.games.length > 0;

  const p1_name = player1 ? user_names[player1.user_id] || "Player 1" : "Player 1";
  const p2_name = player2 ? user_names[player2.user_id] || "Player 2" : "Player 2";
  const p1_winning = player1_score > player2_score;

  const is_closed = challenge.status === "completed";

  const winner_result = is_closed
    ? compute_winner([
        { name: p1_name, score: player1_score },
        { name: p2_name, score: player2_score },
      ])
    : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-14 md:pt-20">
      <div className="w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="w-full max-w-7xl mx-auto flex gap-6 px-4 md:px-6">
        <ChallengeSidebar mode="public" />
        <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center px-4 md:px-6 py-4">
          <Link
            href="/public-challenges"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-headline font-bold italic text-secondary">{challenge.name}</span>
          </Link>
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
                        This challenge was closed{" "}
                        {(() => {
                          const normalized = challenge.closed_at!.includes("T")
                            ? challenge.closed_at!
                            : challenge.closed_at!.replace(" ", "T") + "Z";
                          const diff = Date.now() - new Date(normalized).getTime();
                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                          if (days === 0) return "today";
                          if (days === 1) return "yesterday";
                          return `${days} days ago`;
                        })()}
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
                      <p className="text-xs text-muted-foreground mt-0.5">This challenge is closed</p>
                    )}
                  </div>
                </>
              )}
              {(!winner_result || winner_result.kind === "no_result") && (
                <p className="text-muted-foreground text-sm font-semibold">
                  This challenge is closed — no games were played
                </p>
              )}
            </div>
          </div>
        )}

        {/* Dark Hero Section */}
        <div className="mx-4 md:mx-6 rounded-[1rem] bg-gradient-to-br from-primary to-primary-container overflow-hidden relative shadow-[var(--shadow-soft-lg)]">
          {challenge.gif_url && (
            <div className="absolute inset-0 opacity-15">
              <PlayOnceGif src={challenge.gif_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="relative z-10 px-6 md:px-12 py-10 md:py-14">
            {/* FINAL stamp */}
            {is_closed && (
              <div className="flex justify-center mb-4">
                <span className="text-xs font-headline font-black uppercase tracking-[0.3em] text-primary-foreground/40 border border-primary-foreground/20 px-3 py-1 rounded-full">
                  Final
                </span>
              </div>
            )}
            <h1 className="text-center text-secondary font-headline font-bold text-sm uppercase tracking-widest mb-6">
              {challenge.name}
            </h1>

            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Player 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary-foreground/10 overflow-hidden flex items-center justify-center">
                  {player1 && user_pictures[player1.user_id] ? (
                    <img src={user_pictures[player1.user_id]!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl md:text-4xl font-headline font-black text-primary-foreground/60">
                      {p1_name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-primary-foreground font-headline font-bold text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">
                  {p1_name}
                </p>
              </div>

              {/* Scores */}
              <div className="flex items-baseline gap-3 md:gap-6">
                <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${
                  is_closed && winner_result?.kind === "win"
                    ? winner_result.winner_name === p1_name
                      ? "text-primary-foreground"
                      : "text-primary-foreground/30"
                    : p1_winning
                    ? "text-primary-foreground"
                    : "text-primary-foreground/50"
                }`}>
                  {player1_score}
                </span>
                <span className="text-secondary text-lg font-headline font-bold">vs</span>
                <span className={`text-6xl md:text-8xl lg:text-9xl font-headline font-black ${
                  is_closed && winner_result?.kind === "win"
                    ? winner_result.winner_name === p2_name
                      ? "text-primary-foreground"
                      : "text-primary-foreground/30"
                    : !p1_winning && player2_score > player1_score
                    ? "text-primary-foreground"
                    : "text-primary-foreground/50"
                }`}>
                  {player2_score}
                </span>
              </div>

              {/* Player 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary-foreground/10 overflow-hidden flex items-center justify-center">
                  {player2 && user_pictures[player2.user_id] ? (
                    <img src={user_pictures[player2.user_id]!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl md:text-4xl font-headline font-black text-primary-foreground/60">
                      {p2_name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-primary-foreground font-headline font-bold text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">
                  {p2_name}
                </p>
              </div>
            </div>

            {challenge.gif_url && (
              <div className="flex justify-center mt-6">
                <div className="w-40 md:w-56 h-28 md:h-36 rounded-xl overflow-hidden shadow-xl">
                  <PlayOnceGif src={challenge.gif_url} alt="Challenge theme" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {challenge.draws > 0 && (
              <p className="text-center text-primary-foreground/50 text-sm mt-4">
                {challenge.draws} draw{challenge.draws !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 space-y-6 pb-8">
          {/* Histogram */}
          {has_games && (
            <div className="bg-primary/[0.03] py-4 -mx-4 md:-mx-6 px-4 md:px-6 rounded-[1rem]">
              <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)]">
                <h3 className="font-headline font-bold mb-4">Score Progression</h3>
                <ChallengeHistogram
                  games={challenge.games}
                  current_user_id={display_user_id}
                  user_names={user_names}
                />
              </div>
            </div>
          )}

          {/* Game history — read-only */}
          <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-headline font-bold text-xl mb-4 uppercase tracking-wider">Game History</h3>
            <GameHistory
              games={challenge.games}
              participants={challenge.participants}
              current_user_id={display_user_id}
              user_names={user_names}
              user_pictures={user_pictures}
              challenge_id={challenge.id}
              challenge_name={challenge.name}
              scores={challenge.scores}
            />
          </div>

          {/* CTA */}
          <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] text-center border-l-4 border-l-secondary">
            <p className="text-muted-foreground mb-3">
              Want to track your own game challenges?
            </p>
            <Link
              href={authenticated ? "/challenges/create" : "/hazo_auth/login"}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold font-headline hover:scale-105 transition-all duration-200 shadow-lg shadow-secondary/20 no-underline"
            >
              {authenticated ? "Create your own challenge" : "Login to create your own challenge"}
            </Link>
          </div>
        </div>
      </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
