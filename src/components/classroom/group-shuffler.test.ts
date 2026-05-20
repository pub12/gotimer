import { describe, it, expect } from "vitest";
import { shuffle_into_groups } from "./group-shuffler";

describe("shuffle_into_groups: exclusions", () => {
  it("never places a 2-name exclusion together (by_size)", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let seed = 0; seed < 50; seed++) {
      const res = shuffle_into_groups({
        names,
        mode: "by_size",
        target: 4,
        seed,
        exclusions: [["A", "B"]],
      });
      expect(res.infeasible).toBeFalsy();
      const a_group = res.groups.find((g) => g.includes("A"));
      const b_group = res.groups.find((g) => g.includes("B"));
      expect(a_group).toBeDefined();
      expect(a_group).not.toBe(b_group);
    }
  });

  it("never places an N-way exclusion together", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    for (let seed = 0; seed < 50; seed++) {
      const res = shuffle_into_groups({
        names,
        mode: "by_size",
        target: 3,
        seed,
        exclusions: [["A", "B", "C"]],
      });
      expect(res.infeasible).toBeFalsy();
      const groups = res.groups;
      // No group contains two or more of A/B/C
      for (const g of groups) {
        const intersection = g.filter((n) => ["A", "B", "C"].includes(n));
        expect(intersection.length).toBeLessThanOrEqual(1);
      }
    }
  });

  it("honours multiple exclusion entries simultaneously", () => {
    const names = ["A", "B", "C", "D", "E", "F"];
    const res = shuffle_into_groups({
      names,
      mode: "by_size",
      target: 3,
      seed: 7,
      exclusions: [["A", "B"], ["C", "D"]],
    });
    expect(res.infeasible).toBeFalsy();
    const find = (n: string) => res.groups.findIndex((g) => g.includes(n));
    expect(find("A")).not.toBe(find("B"));
    expect(find("C")).not.toBe(find("D"));
  });

  it("respects exclusions in by_count mode", () => {
    const names = ["A", "B", "C", "D", "E", "F"];
    const res = shuffle_into_groups({
      names,
      mode: "by_count",
      target: 2,
      seed: 3,
      exclusions: [["A", "B"]],
    });
    expect(res.infeasible).toBeFalsy();
    expect(res.groups).toHaveLength(2);
    const a_group = res.groups.find((g) => g.includes("A"));
    expect(a_group?.includes("B")).toBe(false);
  });

  it("returns infeasible when constraint can't be satisfied", () => {
    // 4 students, groups of 2, ALL pairs forbidden -> impossible
    const res = shuffle_into_groups({
      names: ["A", "B", "C", "D"],
      mode: "by_size",
      target: 2,
      exclusions: [
        ["A", "B"],
        ["A", "C"],
        ["A", "D"],
        ["B", "C"],
        ["B", "D"],
        ["C", "D"],
      ],
    });
    expect(res.infeasible).toBe(true);
    expect(res.reason).toBeTruthy();
    expect(res.groups).toEqual([]);
  });

  it("ignores empty exclusions array (same as no exclusions)", () => {
    const res = shuffle_into_groups({
      names: ["A", "B", "C", "D"],
      mode: "by_size",
      target: 2,
      seed: 1,
      exclusions: [],
    });
    expect(res.infeasible).toBeFalsy();
    expect(res.groups.flat().sort()).toEqual(["A", "B", "C", "D"]);
  });

  it("ignores single-name exclusion entries", () => {
    // ["A"] alone is meaningless — should not constrain anything
    const res = shuffle_into_groups({
      names: ["A", "B", "C", "D"],
      mode: "by_size",
      target: 2,
      seed: 1,
      exclusions: [["A"]],
    });
    expect(res.infeasible).toBeFalsy();
    expect(res.groups.flat().sort()).toEqual(["A", "B", "C", "D"]);
  });

  it("is deterministic with the same seed and exclusions", () => {
    const opts = {
      names: ["A", "B", "C", "D", "E", "F"],
      mode: "by_size" as const,
      target: 3,
      seed: 42,
      exclusions: [["A", "B"]],
    };
    const r1 = shuffle_into_groups(opts);
    const r2 = shuffle_into_groups(opts);
    expect(r2.groups).toEqual(r1.groups);
  });
});
