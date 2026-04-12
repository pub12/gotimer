import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { get_db } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Trophy, Plus, Search, Users, Clock } from "lucide-react";

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
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-14 md:pt-20">
      {/* Navy Header Band */}
      <div className="w-full bg-gradient-to-br from-primary to-primary/80 py-10 md:py-16 px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-5">
            <Image
              src="/mascots/scout-victory.png"
              alt="Scout celebrating with a trophy"
              width={100}
              height={100}
              className="hidden md:block w-20 lg:w-24 h-20 lg:h-24 object-contain drop-shadow-lg"
            />
            <div>
              <h1 className="text-3xl md:text-5xl font-headline font-black text-primary-foreground mb-2">Leaderboard</h1>
              <p className="text-primary-foreground/70 text-lg">Public timer challenges ranked by activity</p>
            </div>
          </div>
          <div className="hidden lg:flex bg-white/10 rounded-full px-4 py-2 items-center gap-2">
            <Search className="size-4 text-primary-foreground/60" />
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium w-48 text-primary-foreground placeholder:text-primary-foreground/40"
              placeholder="Find champions..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col lg:flex-row flex-grow p-6 lg:p-8 gap-8 max-w-screen-2xl mx-auto w-full">
        {/* Main Column */}
        <div className="flex-grow space-y-12">
          {/* Timer type filter */}
          <div className="flex flex-wrap gap-2">
            {TIMER_TYPE_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={opt.value ? `/leaderboard?timer_type=${opt.value}` : "/leaderboard"}
                className={`px-4 py-2 rounded-full text-sm font-bold font-headline transition-colors ${
                  (timer_type ?? "") === opt.value
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "bg-surface-container-highest text-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>

          {/* Champion Podium */}
          {challenges.length >= 3 ? (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 2nd Place */}
              <div className="order-2 md:order-1 flex flex-col items-center">
                <Link href={`/public-challenges/${challenges[1].id}`} className="w-full no-underline group">
                  <div className="relative w-full aspect-[4/5] bg-surface-container rounded-[1rem] overflow-hidden hover:shadow-[var(--shadow-soft-lg)] transition-shadow">
                    <div className="absolute top-4 left-4 z-10 bg-surface/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      #2 Silver
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-highest flex items-center justify-center">
                      <span className="text-8xl font-headline font-black text-muted-foreground/10">2</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white font-headline font-bold truncate">{challenges[1].name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <Users className="size-3" /> {challenges[1].participant_count} players
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 1st Place */}
              <div className="order-1 md:order-2 flex flex-col items-center md:-translate-y-4">
                <Link href={`/public-challenges/${challenges[0].id}`} className="w-full no-underline group">
                  <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-accent to-accent/70 rounded-[1rem] overflow-hidden shadow-[var(--shadow-soft-lg)] md:scale-105 z-10">
                    <div className="absolute top-4 left-4 z-10 bg-surface px-4 py-1.5 rounded-full text-sm font-black text-accent shadow-lg flex items-center gap-1.5">
                      <Trophy className="size-3.5" />
                      #1 LEGEND
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                      <span className="text-9xl font-headline font-black text-primary-foreground/10">1</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/90 to-transparent p-6 pt-12">
                      <p className="text-white text-xl font-headline font-black tracking-tight truncate">{challenges[0].name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-accent text-sm font-bold flex items-center gap-1">
                          <Users className="size-3" /> {challenges[0].participant_count} players
                        </p>
                        <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">
                          {challenges[0].format}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 3rd Place */}
              <div className="order-3 flex flex-col items-center">
                <Link href={`/public-challenges/${challenges[2].id}`} className="w-full no-underline group">
                  <div className="relative w-full aspect-[4/5] bg-surface-container rounded-[1rem] overflow-hidden hover:shadow-[var(--shadow-soft-lg)] transition-shadow">
                    <div className="absolute top-4 left-4 z-10 bg-surface/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      #3 Bronze
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
                      <span className="text-8xl font-headline font-black text-muted-foreground/10">3</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white font-headline font-bold truncate">{challenges[2].name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <Users className="size-3" /> {challenges[2].participant_count} players
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          ) : challenges.length === 0 ? (
            <div className="bg-surface-container-low rounded-[1rem] p-12 text-center">
              <Trophy className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 text-lg">
                No public challenges found{timer_type ? ` for ${timer_type.replace(/-/g, " ")}` : ""}.
              </p>
              <Link
                href="/challenges/create"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-bold font-headline hover:scale-105 transition-all duration-200 shadow-lg shadow-secondary/20 no-underline"
              >
                <Plus className="size-5" />
                Start a Challenge
              </Link>
            </div>
          ) : null}

          {/* Global Arena Table */}
          {challenges.length > 0 && (
            <section className="bg-surface-container-low rounded-[1rem] p-6 md:p-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tighter">Global Arena</h2>
                  <p className="text-muted-foreground font-medium">Top challenges this week</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-muted-foreground/60 font-headline text-xs uppercase tracking-widest">
                      <th className="px-4 pb-2">Rank</th>
                      <th className="px-4 pb-2">Challenge</th>
                      <th className="px-4 pb-2">Format</th>
                      <th className="px-4 pb-2">Players</th>
                      <th className="px-4 pb-2 hidden sm:table-cell">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.map((c, i) => (
                      <tr key={c.id} className="bg-card group hover:bg-surface-container-highest transition-colors cursor-pointer rounded-[1rem] shadow-sm">
                        <td className="px-4 py-4 rounded-l-[1rem]">
                          <span className="text-lg font-black font-headline">{i + 1}</span>
                        </td>
                        <td className="px-4 py-4">
                          <Link href={`/public-challenges/${c.id}`} className="no-underline">
                            <span className="font-headline font-bold text-foreground group-hover:text-secondary transition-colors">
                              {c.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-secondary/10 text-secondary text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            {c.format}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="size-4" />
                            {c.participant_count}
                          </span>
                        </td>
                        <td className="px-4 py-4 rounded-r-[1rem] hidden sm:table-cell">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {new Date(c.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SEO content */}
          <section className="text-sm text-muted-foreground space-y-2">
            <h2 className="text-lg font-headline font-black text-foreground">About the GoTimer Leaderboard</h2>
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
      </div>
      </main>
      <Footer />
    </>
  );
}
