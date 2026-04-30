import { describe, it, expect } from "vitest";
import { compute_winner } from "./challenge-winner";

describe("compute_winner", () => {
  it("returns no_result when all scores are zero", () => {
    const result = compute_winner([
      { name: "Alex", score: 0 },
      { name: "Jordan", score: 0 },
    ]);
    expect(result).toEqual({ kind: "no_result" });
  });

  it("returns no_result for empty array", () => {
    expect(compute_winner([])).toEqual({ kind: "no_result" });
  });

  it("returns no_result for single participant", () => {
    expect(compute_winner([{ name: "Alex", score: 5 }])).toEqual({ kind: "no_result" });
  });

  it("returns win for clear winner", () => {
    const result = compute_winner([
      { name: "Alex", score: 7 },
      { name: "Jordan", score: 5 },
    ]);
    expect(result).toEqual({ kind: "win", winner_name: "Alex", winner_score: 7, loser_score: 5 });
  });

  it("picks winner regardless of input order", () => {
    const result = compute_winner([
      { name: "Jordan", score: 5 },
      { name: "Alex", score: 7 },
    ]);
    expect(result).toEqual({ kind: "win", winner_name: "Alex", winner_score: 7, loser_score: 5 });
  });

  it("returns tie when top two scores are equal", () => {
    const result = compute_winner([
      { name: "Alex", score: 4 },
      { name: "Jordan", score: 4 },
    ]);
    expect(result).toEqual({ kind: "tie", score: 4 });
  });

  it("group format — highest scorer wins", () => {
    const result = compute_winner([
      { name: "A", score: 3 },
      { name: "B", score: 7 },
      { name: "C", score: 5 },
    ]);
    expect(result).toEqual({ kind: "win", winner_name: "B", winner_score: 7, loser_score: 5 });
  });

  it("group format — tie when top two are equal", () => {
    const result = compute_winner([
      { name: "A", score: 5 },
      { name: "B", score: 5 },
      { name: "C", score: 3 },
    ]);
    expect(result).toEqual({ kind: "tie", score: 5 });
  });
});
