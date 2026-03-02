"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { ScoreDisplay } from "@/components/challenges/score-display";
import { GameHistory } from "@/components/challenges/game-history";
import { ChallengeHistogram } from "@/components/challenges/challenge-histogram";
import { PlayOnceGif } from "@/components/challenges/play-once-gif";
import { ArrowLeft } from "lucide-react";

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

export default function PublicChallengeDetailClient({ id }: { id: string }) {
  const router = useRouter();
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
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Loading...</p>
      </main>
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

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />

      <div className="w-full max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/public-challenges")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Challenges
        </button>

        {/* Challenge header */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
          <div className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {challenge.name}
            </h1>
            {challenge.description && (
              <p className="text-muted-foreground mt-1">
                {challenge.description}
              </p>
            )}
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
            player1_name={player1 ? user_names[player1.user_id] || "Player 1" : "Player 1"}
            player2_name={player2 ? user_names[player2.user_id] || "Player 2" : "Player 2"}
            player1_score={player1_score}
            player2_score={player2_score}
            player1_picture={player1 ? user_pictures[player1.user_id] : null}
            player2_picture={player2 ? user_pictures[player2.user_id] : null}
            draws={challenge.draws}
          />
        </div>

        {/* Histogram */}
        {has_games && (
          <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
            <h3 className="font-semibold mb-4">Game History Chart</h3>
            <ChallengeHistogram
              games={challenge.games}
              current_user_id={display_user_id}
              user_names={user_names}
            />
          </div>
        )}

        {/* Game history — read-only (no delete handler) */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
          <h3 className="font-semibold mb-4">Game History</h3>
          <GameHistory
            games={challenge.games}
            participants={challenge.participants}
            current_user_id={display_user_id}
            user_names={user_names}
            user_pictures={user_pictures}
          />
        </div>

        {/* CTA */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-8 text-center">
          <p className="text-muted-foreground mb-3">
            Want to track your own game challenges?
          </p>
          <Link
            href="/hazo_auth/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity no-underline font-medium"
          >
            Login to create your own challenge
          </Link>
        </div>
      </div>
    </main>
  );
}
