import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { get_db, get_challenge_scores } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const challenge_id = searchParams.get("challenge_id");
  const game_id = searchParams.get("game_id");

  if (!challenge_id || !game_id) {
    return new Response("Missing parameters", { status: 400 });
  }

  try {
    const db = get_db();

    const challenge = db
      .prepare(`SELECT name FROM game_challenges WHERE id = ? AND is_public = 1`)
      .get(challenge_id) as { name: string } | undefined;

    const game = db
      .prepare(`SELECT winner_id, is_draw, gif_url FROM challenge_games WHERE id = ? AND challenge_id = ?`)
      .get(game_id, challenge_id) as { winner_id: string | null; is_draw: number; gif_url: string | null } | undefined;

    if (!challenge || !game) {
      return new Response("Not found", { status: 404 });
    }

    const participants = db
      .prepare(`SELECT user_id, score_override FROM challenge_participants WHERE challenge_id = ?`)
      .all(challenge_id) as { user_id: string; score_override: number | null }[];

    const scores = get_challenge_scores(db, challenge_id, participants);

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

    let headline: string;
    if (game.is_draw) {
      headline = `Draw in the ${challenge.name} game!`;
    } else {
      const winner_name = game.winner_id ? name_map[game.winner_id] || "Someone" : "Someone";
      headline = `${winner_name} won the ${challenge.name} game!`;
    }

    const score_parts = participants.map(
      (p) => `${name_map[p.user_id] || "Player"} ${scores[p.user_id] || 0}`
    );
    const score_text = score_parts.join("  -  ");

    // Fetch the GIF as a static image for embedding
    let gif_src = game.gif_url;
    // Convert GIPHY animated URL to still frame for better OG rendering
    if (gif_src && gif_src.includes("giphy.com")) {
      // GIPHY fixed_height URLs look like: https://media0.giphy.com/media/{id}/200.gif?...
      // Replace with the still version by appending _s before the extension
      gif_src = gif_src.replace(/\/(\d+)\.gif/, "/$1_s.gif");
      // Also handle /giphy.gif pattern
      gif_src = gif_src.replace(/\/giphy\.gif/, "/giphy_s.gif");
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#1a1a2e",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {/* GIF image area */}
          {gif_src ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={gif_src}
                width={600}
                height={340}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
              }}
            >
              🏆
            </div>
          )}

          {/* Text overlay at bottom */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 30px",
              backgroundColor: "rgba(0,0,0,0.85)",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, display: "flex" }}>
              {headline}
            </div>
            <div style={{ fontSize: 22, opacity: 0.8, display: "flex", justifyContent: "space-between" }}>
              <span>{score_text}</span>
              <span style={{ opacity: 0.5 }}>gotimer.org</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
      }
    );
  } catch {
    return new Response("Error generating image", { status: 500 });
  }
}
