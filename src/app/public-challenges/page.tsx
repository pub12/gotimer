import Link from "next/link";
import { get_db, get_challenge_scores } from "@/lib/db";
import Navbar from "@/components/navbar";
import Breadcrumb from "@/components/breadcrumb";
import { Trophy, Users, Gamepad2 } from "lucide-react";

type Challenge = {
  id: string;
  name: string;
  description: string;
  status: string;
  total_games: number;
  game_name: string | null;
  participants: { user_id: string; role: string }[];
  scores: Record<string, number>;
};

function get_public_challenges(): { challenges: Challenge[]; user_names: Record<string, string> } {
  try {
    const db = get_db();
    const rows = db
      .prepare(
        `SELECT gc.*, g.name as game_name,
          (SELECT COUNT(*) FROM challenge_games cg WHERE cg.challenge_id = gc.id) as total_games
         FROM game_challenges gc
         LEFT JOIN games g ON gc.game_id = g.id
         WHERE gc.is_public = 1
         ORDER BY gc.updated_at DESC`
      )
      .all() as (Record<string, unknown> & { id: string; total_games: number; game_name: string | null })[];

    const all_user_ids = new Set<string>();
    const challenges: Challenge[] = rows.map((c) => {
      const participants = db
        .prepare(
          `SELECT cp.user_id, cp.role, cp.score_override FROM challenge_participants cp WHERE cp.challenge_id = ?`
        )
        .all(c.id) as { user_id: string; role: string; score_override: number | null }[];

      const scores = get_challenge_scores(db, c.id, participants);
      for (const p of participants) all_user_ids.add(p.user_id);

      return {
        id: c.id,
        name: c.name as string,
        description: c.description as string,
        status: c.status as string,
        total_games: c.total_games,
        game_name: c.game_name,
        participants,
        scores,
      };
    });

    // Fetch user names
    const user_names: Record<string, string> = {};
    if (all_user_ids.size > 0) {
      const ids = Array.from(all_user_ids);
      const placeholders = ids.map(() => "?").join(", ");
      const users = db
        .prepare(`SELECT id, name FROM hazo_users WHERE id IN (${placeholders})`)
        .all(...ids) as { id: string; name: string | null }[];
      for (const u of users) {
        user_names[u.id] = (u.name || "Player").split(" ")[0];
      }
    }

    return { challenges, user_names };
  } catch {
    return { challenges: [], user_names: {} };
  }
}

export default function PublicChallengesPage() {
  const { challenges, user_names } = get_public_challenges();

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Public Challenges" }]} />
        <h1 className="text-2xl font-bold mb-2">Public Challenges</h1>
        <p className="text-muted-foreground mb-6">
          Browse competitive board game matchups. See scores, game history, and rivalries between players.
        </p>

        {challenges.length === 0 ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border text-center">
            <p className="text-muted-foreground mb-4">No public challenges yet.</p>
            <Link
              href="/hazo_auth/login"
              className="text-primary hover:underline font-medium"
            >
              Login to create the first one!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((c) => {
              const player_names = c.participants.map(
                (p) => user_names[p.user_id] || "Player"
              );
              const score_display = c.participants
                .map(
                  (p) =>
                    `${user_names[p.user_id] || "Player"}: ${c.scores[p.user_id] || 0}`
                )
                .join(" vs ");

              return (
                <Link
                  key={c.id}
                  href={`/public-challenges/${c.id}`}
                  className="block bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow no-underline text-foreground"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{c.name}</h3>
                        {c.game_name && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground flex-shrink-0">
                            {c.game_name}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            c.status === "active"
                              ? "bg-green-100 text-green-700"
                              : c.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {c.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{player_names.join(" vs ")}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Gamepad2 className="w-3.5 h-3.5" />
                          {c.total_games} game{c.total_games !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          {score_display || "No games yet"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* SEO content for crawlers */}
        <section className="mt-12 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground mb-2">About Public Challenges</h2>
          <p>
            Public challenges on GoTimer let players share their competitive board game matchups
            with the community. Each challenge tracks wins, losses, and draws between two players
            across multiple games. Create your own challenge, invite a friend, and make it public
            to show off your rivalry.
          </p>
        </section>
      </div>
    </main>
  );
}
