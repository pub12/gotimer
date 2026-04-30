export type WinnerResult =
  | { kind: "win"; winner_name: string; winner_score: number; loser_score: number }
  | { kind: "tie"; score: number }
  | { kind: "no_result" };

export function compute_winner(
  players: { name: string; score: number }[]
): WinnerResult {
  if (players.length < 2) return { kind: "no_result" };

  const total = players.reduce((sum, p) => sum + p.score, 0);
  if (total === 0) return { kind: "no_result" };

  const sorted = [...players].sort((a, b) => b.score - a.score);

  if (sorted[0].score === sorted[1].score) {
    return { kind: "tie", score: sorted[0].score };
  }

  return {
    kind: "win",
    winner_name: sorted[0].name,
    winner_score: sorted[0].score,
    loser_score: sorted[1].score,
  };
}
