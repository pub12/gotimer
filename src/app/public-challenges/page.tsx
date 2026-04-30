import Link from "next/link";
import Image from "next/image";
import { get_db, get_challenge_scores } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Trophy, Users, Gamepad2, Scale } from "lucide-react";
import { compute_winner } from "@/lib/challenge-winner";

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
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-14 md:pt-20">
      <div className="w-full bg-gradient-to-br from-primary to-primary/80 py-10 md:py-16 px-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-headline font-black text-primary-foreground mb-2">Public Challenges</h1>
            <p className="text-primary-foreground/70 text-lg">
              Browse competitive board game matchups. See scores, game history, and rivalries between players.
            </p>
          </div>
          <Image
            src="/mascots/scout-victory.png"
            alt="Scout celebrating with a trophy"
            width={140}
            height={140}
            className="hidden md:block w-28 lg:w-36 h-28 lg:h-36 object-contain drop-shadow-lg shrink-0"
          />
        </div>
      </div>
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto w-full">

        {challenges.length === 0 ? (
          <div className="bg-card rounded-[1rem] p-8 shadow-[var(--shadow-soft)] text-center">
            <Image
              src="/mascots/drake-searching.png"
              alt="Drake searching for challenges"
              width={140}
              height={140}
              className="w-28 h-28 object-contain mx-auto mb-4"
            />
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
                  className={`block bg-card rounded-[1rem] p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft-lg)] hover:-translate-y-0.5 transition-all duration-200 no-underline text-foreground border-l-4 ${
                    c.status === "active"
                      ? "border-l-status-active"
                      : c.status === "completed"
                      ? "border-l-accent"
                      : "border-l-surface-container-high"
                  }`}
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
                              ? "bg-status-active/10 text-status-active"
                              : c.status === "completed"
                              ? "bg-accent/10 text-accent"
                              : "bg-surface-container text-muted-foreground"
                          }`}
                        >
                          {c.status === "completed" ? "Closed" : c.status}
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
                        {c.status === "completed" ? (() => {
                          const players = c.participants.map((p) => ({
                            name: user_names[p.user_id] || "Player",
                            score: c.scores[p.user_id] || 0,
                          }));
                          if (players.length === 1) players.push({ name: "Opponent", score: 0 });
                          const wr = compute_winner(players);
                          if (wr.kind === "win") return (
                            <span key="winner" className="flex items-center gap-1 text-accent font-medium">
                              <Trophy className="w-3.5 h-3.5" />
                              {wr.winner_name} won {wr.winner_score}–{wr.loser_score}
                            </span>
                          );
                          if (wr.kind === "tie") return (
                            <span key="tie" className="flex items-center gap-1">
                              <Scale className="w-3.5 h-3.5" />
                              Tied {wr.score}–{wr.score}
                            </span>
                          );
                          return <span key="no-result">Closed — no result</span>;
                        })() : (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            {score_display || "No games yet"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* SEO content for crawlers */}
        <section className="mt-12 text-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">About Public Challenges</h2>
          <p className="text-muted-foreground">
            Public challenges on GoTimer let players share their competitive board game matchups
            with the community. Each challenge tracks wins, losses, and draws between two players
            across multiple games. Create your own challenge, invite a friend, and make it public
            to show off your rivalry.
          </p>
        </section>
      </div>
      </main>
      <Footer />
    </>
  );
}
