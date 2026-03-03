import { Metadata } from "next";
import { get_db, get_challenge_scores } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; gameId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, gameId } = await params;

  try {
    const db = get_db();

    const challenge = db
      .prepare(`SELECT name FROM game_challenges WHERE id = ? AND is_public = 1`)
      .get(id) as { name: string } | undefined;

    if (!challenge) {
      return { title: "Game Result - GoTimer" };
    }

    const game = db
      .prepare(`SELECT winner_id, is_draw, gif_url FROM challenge_games WHERE id = ? AND challenge_id = ?`)
      .get(gameId, id) as { winner_id: string | null; is_draw: number; gif_url: string | null } | undefined;

    if (!game) {
      return { title: `${challenge.name} - GoTimer` };
    }

    // Get participant scores
    const participants = db
      .prepare(`SELECT user_id, score_override FROM challenge_participants WHERE challenge_id = ?`)
      .all(id) as { user_id: string; score_override: number | null }[];

    const scores = get_challenge_scores(db, id, participants);

    // Get player names
    const player_ids = participants.map((p) => p.user_id);
    const placeholders = player_ids.map(() => "?").join(", ");
    const users = player_ids.length > 0
      ? (db
          .prepare(`SELECT id, name FROM hazo_users WHERE id IN (${placeholders})`)
          .all(...player_ids) as { id: string; name: string | null }[])
      : [];

    const name_map: Record<string, string> = {};
    for (const u of users) {
      name_map[u.id] = (u.name || "Player").split(" ")[0];
    }

    // Build title
    let title: string;
    if (game.is_draw) {
      title = `Draw in the ${challenge.name} game!`;
    } else {
      const winner_name = game.winner_id ? name_map[game.winner_id] || "Someone" : "Someone";
      title = `${winner_name} won the ${challenge.name} game!`;
    }

    // Build score description
    const score_parts = participants.map(
      (p) => `${name_map[p.user_id] || "Player"} ${scores[p.user_id] || 0}`
    );
    const description = `Score: ${score_parts.join(" - ")}`;

    const ogImage = game.gif_url || "/fight.jpg";

    return {
      title: `${title} - GoTimer`,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImage }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Game Result - GoTimer" };
  }
}

export default async function GameSharePage({ params }: Props) {
  const { id } = await params;
  redirect(`/public-challenges/${id}`);
}
