import { describe, it, expect } from "vitest";
import { stopwatchStrategy } from "./stopwatch";

describe("stopwatchStrategy", () => {
  describe("initial_state", () => {
    it("returns correct default shape", () => {
      const s = stopwatchStrategy.initial_state({});
      expect(s.start_timestamp_ms).toBeNull();
      expect(s.accumulated_ms).toBe(0);
      expect(s.laps).toEqual([]);
      expect(s.running).toBe(false);
    });
  });

  describe("is_complete", () => {
    it("is never complete", () => {
      expect(stopwatchStrategy.is_complete(stopwatchStrategy.initial_state({}))).toBe(false);
    });
  });

  describe("tick", () => {
    it("returns the same reference when not running", () => {
      const s = stopwatchStrategy.initial_state({});
      expect(stopwatchStrategy.tick(s)).toBe(s);
    });

    it("returns a new object when running (re-render trigger)", () => {
      const s = { ...stopwatchStrategy.initial_state({}), running: true, start_timestamp_ms: Date.now() };
      expect(stopwatchStrategy.tick(s)).not.toBe(s);
    });
  });

  describe("on_action: start", () => {
    it("sets running=true and captures start_timestamp_ms", () => {
      const before = Date.now();
      const s = stopwatchStrategy.initial_state({});
      const next = stopwatchStrategy.on_action!(s, "start");
      expect(next.running).toBe(true);
      expect(next.start_timestamp_ms).toBeGreaterThanOrEqual(before);
      expect(next.accumulated_ms).toBe(0);
    });

    it("does not reset accumulated_ms (resume after pause)", () => {
      const s = { ...stopwatchStrategy.initial_state({}), accumulated_ms: 5000, running: false };
      const next = stopwatchStrategy.on_action!(s, "start");
      expect(next.accumulated_ms).toBe(5000);
    });
  });

  describe("on_action: pause", () => {
    it("sets running=false and accumulates elapsed", () => {
      const five_sec_ago = Date.now() - 5000;
      const s = {
        ...stopwatchStrategy.initial_state({}),
        running: true,
        start_timestamp_ms: five_sec_ago,
        accumulated_ms: 0,
      };
      const next = stopwatchStrategy.on_action!(s, "pause");
      expect(next.running).toBe(false);
      expect(next.start_timestamp_ms).toBeNull();
      expect(next.accumulated_ms).toBeGreaterThanOrEqual(4900);
      expect(next.accumulated_ms).toBeLessThanOrEqual(5100);
    });

    it("adds to existing accumulated_ms", () => {
      const two_sec_ago = Date.now() - 2000;
      const s = {
        ...stopwatchStrategy.initial_state({}),
        running: true,
        start_timestamp_ms: two_sec_ago,
        accumulated_ms: 3000,
      };
      const next = stopwatchStrategy.on_action!(s, "pause");
      expect(next.accumulated_ms).toBeGreaterThanOrEqual(4900);
    });
  });

  describe("on_action: lap", () => {
    it("adds first lap with correct total_ms and split_ms", () => {
      const five_sec_ago = Date.now() - 5000;
      const s = {
        ...stopwatchStrategy.initial_state({}),
        running: true,
        start_timestamp_ms: five_sec_ago,
        accumulated_ms: 0,
      };
      const next = stopwatchStrategy.on_action!(s, "lap");
      expect(next.laps).toHaveLength(1);
      expect(next.laps[0].n).toBe(1);
      expect(next.laps[0].total_ms).toBeGreaterThanOrEqual(4900);
      expect(next.laps[0].split_ms).toBe(next.laps[0].total_ms);
    });

    it("split_ms equals difference from previous lap", () => {
      const ten_sec_ago = Date.now() - 10000;
      const s = {
        ...stopwatchStrategy.initial_state({}),
        running: true,
        start_timestamp_ms: ten_sec_ago,
        accumulated_ms: 0,
        laps: [{ n: 1, total_ms: 5000, split_ms: 5000 }],
      };
      const next = stopwatchStrategy.on_action!(s, "lap");
      expect(next.laps).toHaveLength(2);
      expect(next.laps[1].n).toBe(2);
      expect(next.laps[1].split_ms).toBeGreaterThanOrEqual(4900);
      expect(next.laps[1].total_ms - 5000).toBeCloseTo(next.laps[1].split_ms, -1);
    });
  });

  describe("on_action: clear_laps", () => {
    it("empties the laps array", () => {
      const s = {
        ...stopwatchStrategy.initial_state({}),
        laps: [
          { n: 1, total_ms: 3000, split_ms: 3000 },
          { n: 2, total_ms: 7000, split_ms: 4000 },
        ],
      };
      const next = stopwatchStrategy.on_action!(s, "clear_laps");
      expect(next.laps).toEqual([]);
    });
  });

  describe("get_display", () => {
    it("returns 0 primary_time when idle", () => {
      const d = stopwatchStrategy.get_display(stopwatchStrategy.initial_state({}));
      expect(d.primary_time).toBe(0);
      expect(d.extra?.elapsed_ms).toBe(0);
    });

    it("returns live elapsed when running", () => {
      const five_sec_ago = Date.now() - 5000;
      const s = {
        ...stopwatchStrategy.initial_state({}),
        running: true,
        start_timestamp_ms: five_sec_ago,
        accumulated_ms: 0,
      };
      const d = stopwatchStrategy.get_display(s);
      expect(d.primary_time).toBeGreaterThanOrEqual(4);
      expect(d.extra?.elapsed_ms as number).toBeGreaterThanOrEqual(4900);
    });

    it("returns accumulated_ms when paused", () => {
      const s = {
        ...stopwatchStrategy.initial_state({}),
        running: false,
        start_timestamp_ms: null,
        accumulated_ms: 12345,
      };
      const d = stopwatchStrategy.get_display(s);
      expect(d.extra?.elapsed_ms).toBe(12345);
    });

    it("includes laps in extra", () => {
      const laps = [{ n: 1, total_ms: 3000, split_ms: 3000 }];
      const s = { ...stopwatchStrategy.initial_state({}), laps };
      const d = stopwatchStrategy.get_display(s);
      expect(d.extra?.laps).toEqual(laps);
    });
  });
});
