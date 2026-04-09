import { Metadata } from "next";
import Link from "next/link";
import { get_db } from "@/lib/db";
import Navbar from "@/components/navbar";
import Breadcrumb from "@/components/breadcrumb";
import { ChallengeCard } from "@/components/leaderboard/challenge-card";
import { Trophy, Plus } from "lucide-react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ timer_type?: string }>;
}): Promise<Metadata> {
  const { timer_type } = await searchParams;
  const suffix = timer_type
    ? ` — ${timer_type.replace(/-/g, " ")} challenges`
    : "";
  return {
    title: `Leaderboard${suffix} | GoTimer`,
    description:
      "Browse public GoTimer challenges. See who is leading in countdown, chess clock, and round timer competitions. Start your own challenge today.",
    openGraph: {
      title: `GoTimer Leaderboard${suffix}`,
      description:
        "Public timer challenges ranked by activity. Join a challenge or start your own.",
    },
  };
}

type LeaderboardChallenge = {
  id: string;
  name: string;
  description: string;
  format: string;
  timer_type: string | null;
  participant_count: number;
  updated_at: string;
};

function get_public_challenges(timer_type?: string): LeaderboardChallenge[] {
  try {
    const db = get_db();
    let query = `
      SELECT
        gc.id,
        gc.name,
        gc.description,
        gc.format,
        gc.timer_type,
        gc.updated_at,
        COUNT(DISTINCT cp.user_id) as participant_count
      FROM game_challenges gc
      LEFT JOIN challenge_participants cp ON cp.challenge_id = gc.id
      WHERE gc.is_public = 1
    `;
    const params: unknown[] = [];

    if (timer_type) {
      query += ` AND gc.timer_type = ?`;
      params.push(timer_type);
    }

    query += ` GROUP BY gc.id ORDER BY gc.updated_at DESC LIMIT 50`;

    return db.prepare(query).all(...params) as LeaderboardChallenge[];
  } catch {
    return [];
  }
}

const TIMER_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "countdown", label: "Countdown" },
  { value: "chess-clock", label: "Chess Clock" },
  { value: "round-timer", label: "Round Timer" },
];

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ timer_type?: string }>;
}) {
  const { timer_type } = await searchParams;
  const challenges = get_public_challenges(timer_type);

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Leaderboard" }]} />

        {/* Header + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-7 h-7 text-primary" />
              Challenge Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse active public challenges and join the competition.
            </p>
          </div>
          <Link
            href="/challenges/create"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Start a Challenge
          </Link>
        </div>

        {/* Timer type filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TIMER_TYPE_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={opt.value ? `/leaderboard?timer_type=${opt.value}` : "/leaderboard"}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                (timer_type ?? "") === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:bg-muted"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {/* Challenge grid */}
        {challenges.length === 0 ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border text-center">
            <p className="text-muted-foreground mb-4">
              No public challenges found{timer_type ? ` for ${timer_type.replace(/-/g, " ")}` : ""}.
            </p>
            <Link
              href="/challenges/create"
              className="text-primary hover:underline font-medium"
            >
              Be the first to create one!
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {challenges.map((c) => (
              <ChallengeCard key={c.id} {...c} />
            ))}
          </div>
        )}

        {/* SEO content */}
        <section className="mt-12 text-sm text-muted-foreground space-y-2">
          <h2 className="text-lg font-semibold text-foreground">About the GoTimer Leaderboard</h2>
          <p>
            The GoTimer leaderboard showcases public challenges created by players around the world.
            Whether you prefer head-to-head 1v1 matches, group competitions with a join code, or solo
            session tracking — every format is represented here.
          </p>
          <p>
            Filter by timer type to find challenges for countdown timers, chess clocks, or round timers.
            Click any challenge to view its full standings and game history.
          </p>
        </section>
      </div>
    </main>
  );
}
