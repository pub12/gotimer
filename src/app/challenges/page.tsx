"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { OverallHistogram } from "@/components/challenges/overall-histogram";
import { ScoreDisplay } from "@/components/challenges/score-display";
import { ChallengeHistogram } from "@/components/challenges/challenge-histogram";
import { use_auth_status } from "hazo_auth/client";
import { Plus, Trophy, Target, Users, Swords } from "lucide-react";

type Challenge = {
  id: string;
  name: string;
  description: string;
  status: string;
  my_wins: number;
  opponent_wins: number;
  draws: number;
  total_games: number;
  created_at: string;
  participants: { user_id: string; role: string }[];
};

export default function ChallengesPage() {
  const router = useRouter();
  const { authenticated, loading: auth_loading } = use_auth_status();
  const [challenges, set_challenges] = useState<Challenge[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    if (auth_loading) return;
    if (!authenticated) {
      set_loading(false);
      return;
    }

    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        set_challenges(Array.isArray(data) ? data : []);
      })
      .catch(() => set_challenges([]))
      .finally(() => set_loading(false));
  }, [authenticated, auth_loading]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />

      <div className="w-full max-w-3xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <Trophy className="inline w-8 h-8 md:w-10 md:h-10 text-primary mr-2 align-middle" />
            Game Challenges
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Create challenges with friends, track wins, and settle who&apos;s really
            the best once and for all.
          </p>
        </div>

        {!authenticated && !auth_loading && (
          <>
            {/* Demo preview */}
            <div className="mb-8">
              {/* Fake challenge cards */}
              <div className="space-y-3 mb-6">
                <DemoCard name="Chess Showdown" my_wins={7} opponent_wins={5} draws={2} total_games={14} />
                <DemoCard name="Ping Pong Masters" my_wins={3} opponent_wins={6} draws={0} total_games={9} />
                <DemoCard name="Settlers of Catan" my_wins={4} opponent_wins={4} draws={1} total_games={9} />
              </div>

              {/* Fake challenge detail */}
              <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
                <h3 className="text-xl font-bold mb-1">Chess Showdown</h3>
                <p className="text-sm text-muted-foreground mb-2">Best of 20 - who&apos;s the real chess master?</p>
                <ScoreDisplay
                  player1_name="Alex"
                  player2_name="Jordan"
                  player1_score={7}
                  player2_score={5}
                  draws={2}
                />
                <div className="mt-2 p-3 rounded-lg text-center text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  &ldquo;Champions aren&apos;t made in the gyms. Champions are made from something they have deep inside them - a desire, a dream, a vision.&rdquo;
                </div>
              </div>

              {/* Fake histogram */}
              <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
                <h3 className="font-semibold mb-4">Game History Chart</h3>
                <ChallengeHistogram
                  games={DEMO_GAMES}
                  current_user_id="demo-alex"
                  user_names={{ "demo-alex": "Alex", "demo-jordan": "Jordan" }}
                />
              </div>

              {/* Fake game history */}
              <div className="bg-card rounded-xl p-6 shadow-sm border mb-6">
                <h3 className="font-semibold mb-4">Recent Games</h3>
                <div className="space-y-2">
                  <DemoGameRow winner="Alex" date="Feb 22" is_win={true} />
                  <DemoGameRow winner="Jordan" date="Feb 20" is_win={false} />
                  <DemoGameRow winner="" date="Feb 18" is_win={false} is_draw={true} />
                  <DemoGameRow winner="Alex" date="Feb 15" is_win={true} notes="Epic endgame comeback!" />
                  <DemoGameRow winner="Alex" date="Feb 12" is_win={true} />
                </div>
              </div>
            </div>

            {/* Sign in CTA */}
            <div className="text-center py-8">
              <div className="bg-card rounded-xl p-8 shadow-sm border">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Sign in to get started
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create challenges, invite friends, and track your victories.
                </p>
                <Button onClick={() => {
                  localStorage.setItem("redirect_after_login", "/challenges");
                  router.push("/hazo_auth/login");
                }}>
                  Login with Google
                </Button>
              </div>
            </div>
          </>
        )}

        {authenticated && (
          <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Challenges</h2>
              <Button onClick={() => router.push("/challenges/create")}>
                <Plus className="w-4 h-4 mr-2" />
                New Challenge
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading challenges...
              </div>
            ) : challenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-card rounded-xl p-8 shadow-sm border">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No challenges yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first challenge and invite a friend to start
                    competing!
                  </p>
                  <Button onClick={() => router.push("/challenges/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Challenge cards */}
                <div className="space-y-3 mb-8">
                  {challenges.map((c) => (
                    <ChallengeCard
                      key={c.id}
                      id={c.id}
                      name={c.name}
                      my_wins={c.my_wins}
                      opponent_wins={c.opponent_wins}
                      draws={c.draws}
                      total_games={c.total_games}
                      status={c.status}
                    />
                  ))}
                </div>

                {/* Overall histogram */}
                {challenges.some(
                  (c) => c.my_wins + c.opponent_wins + c.draws > 0
                ) && (
                  <div className="bg-card rounded-xl p-6 shadow-sm border mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Overall Performance
                    </h3>
                    <OverallHistogram challenges={challenges} />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* How it works */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-8">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-medium mb-1">Create a Challenge</h4>
              <p className="text-sm text-muted-foreground">
                Name your challenge and describe what game you&apos;re playing.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-medium mb-1">Invite a Friend</h4>
              <p className="text-sm text-muted-foreground">
                Share an invite link - they just need to log in and accept.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-medium mb-1">Track Games</h4>
              <p className="text-sm text-muted-foreground">
                Record results, add GIFs, and see who dominates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Demo data and components for unauthenticated preview ---

const DEMO_GAMES = [
  { id: "d1", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-05T10:00:00Z" },
  { id: "d2", winner_id: "demo-jordan", is_draw: 0, played_at: "2026-02-07T10:00:00Z" },
  { id: "d3", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-09T10:00:00Z" },
  { id: "d4", winner_id: "demo-jordan", is_draw: 0, played_at: "2026-02-10T10:00:00Z" },
  { id: "d5", winner_id: null, is_draw: 1, played_at: "2026-02-12T10:00:00Z" },
  { id: "d6", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-14T10:00:00Z" },
  { id: "d7", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-15T10:00:00Z" },
  { id: "d8", winner_id: "demo-jordan", is_draw: 0, played_at: "2026-02-16T10:00:00Z" },
  { id: "d9", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-18T10:00:00Z" },
  { id: "d10", winner_id: null, is_draw: 1, played_at: "2026-02-19T10:00:00Z" },
  { id: "d11", winner_id: "demo-jordan", is_draw: 0, played_at: "2026-02-20T10:00:00Z" },
  { id: "d12", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-21T10:00:00Z" },
  { id: "d13", winner_id: "demo-jordan", is_draw: 0, played_at: "2026-02-22T10:00:00Z" },
  { id: "d14", winner_id: "demo-alex", is_draw: 0, played_at: "2026-02-23T10:00:00Z" },
];

function DemoCard({ name, my_wins, opponent_wins, draws, total_games }: {
  name: string; my_wins: number; opponent_wins: number; draws: number; total_games: number;
}) {
  const is_winning = my_wins > opponent_wins;
  const is_tied = my_wins === opponent_wins;
  return (
    <div className="bg-card rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">{name}</h4>
        <span className="text-sm text-muted-foreground">
          {total_games} game{total_games !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        {is_winning ? (
          <Trophy className="w-5 h-5 text-primary" />
        ) : (
          <Swords className="w-5 h-5 text-muted-foreground" />
        )}
        <span className="text-2xl font-bold">
          <span className={is_winning ? "text-primary" : ""}>{my_wins}</span>
          <span className="text-muted-foreground mx-1">-</span>
          <span className={!is_winning && !is_tied ? "text-primary" : ""}>{opponent_wins}</span>
        </span>
        {draws > 0 && (
          <span className="text-sm text-muted-foreground">
            ({draws} draw{draws !== 1 ? "s" : ""})
          </span>
        )}
      </div>
    </div>
  );
}

function DemoGameRow({ winner, date, is_win, is_draw, notes }: {
  winner: string; date: string; is_win: boolean; is_draw?: boolean; notes?: string;
}) {
  return (
    <div className={`p-3 rounded-lg border ${
      is_draw ? "border-muted bg-muted/30" : is_win ? "border-primary/30 bg-primary/5" : "border-border"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className={`w-4 h-4 ${is_draw ? "text-muted-foreground" : is_win ? "text-primary" : "text-muted-foreground"}`} />
          <span className="font-medium text-sm">
            {is_draw ? "Draw" : `${winner} won`}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      {notes && <p className="text-xs text-muted-foreground mt-1">{notes}</p>}
    </div>
  );
}
