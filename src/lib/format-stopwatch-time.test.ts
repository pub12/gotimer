import { describe, it, expect } from "vitest";
import { format_stopwatch_time } from "./format-stopwatch-time";

describe("format_stopwatch_time", () => {
  it("formats 0ms as 00:00.00", () => {
    expect(format_stopwatch_time(0)).toBe("00:00.00");
  });

  it("formats 999ms as 00:00.99", () => {
    expect(format_stopwatch_time(999)).toBe("00:00.99");
  });

  it("formats 1000ms as 00:01.00", () => {
    expect(format_stopwatch_time(1000)).toBe("00:01.00");
  });

  it("formats 59990ms as 00:59.99", () => {
    expect(format_stopwatch_time(59990)).toBe("00:59.99");
  });

  it("formats 60000ms as 01:00.00", () => {
    expect(format_stopwatch_time(60000)).toBe("01:00.00");
  });

  it("formats 3599990ms as 59:59.99", () => {
    expect(format_stopwatch_time(3599990)).toBe("59:59.99");
  });

  it("formats exactly 1 hour as 1:00:00.00", () => {
    expect(format_stopwatch_time(3600000)).toBe("1:00:00.00");
  });

  it("formats 23h 59m 59.99s correctly", () => {
    expect(format_stopwatch_time(86399990)).toBe("23:59:59.99");
  });

  it("truncates centiseconds (does not round)", () => {
    // 1009ms → 1.00 seconds (centisecond digit is 0, not rounded from 09ms → 01cs)
    expect(format_stopwatch_time(1009)).toBe("00:01.00");
  });
});
