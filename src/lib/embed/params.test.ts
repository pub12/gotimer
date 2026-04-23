import { describe, it, expect } from "vitest";
import { parse_embed_params, RESERVED_KEYS, apply_started_offset } from "./params";

function sp(query: string): URLSearchParams {
  return new URLSearchParams(query);
}

describe("parse_embed_params", () => {
  it("returns sensible defaults when no params are set", () => {
    const p = parse_embed_params(sp(""), "countdown");
    expect(p.label).toBe("countdown");
    expect(p.theme).toBe("auto");
    expect(p.controls).toBe("full");
    expect(p.branding).toBe("full");
    expect(p.bg).toBeUndefined();
    expect(p.config).toEqual({});
  });

  it("extracts reserved params and routes the rest to config", () => {
    const p = parse_embed_params(
      sp("label=Pomodoro&duration=1500&theme=dark"),
      "countdown",
    );
    expect(p.label).toBe("Pomodoro");
    expect(p.theme).toBe("dark");
    expect(p.config).toEqual({ duration: 1500 });
  });

  it("coerces numeric and boolean values in config", () => {
    const p = parse_embed_params(
      sp("duration=1500&autostart=true&increment=0.5"),
      "chess-clock",
    );
    expect(p.config).toEqual({ duration: 1500, increment: 0.5 });
    expect(p.autostart).toBe(true);
  });

  it("exports the full reserved key list", () => {
    expect(RESERVED_KEYS.has("type")).toBe(true);
    expect(RESERVED_KEYS.has("label")).toBe(true);
    expect(RESERVED_KEYS.has("bg")).toBe(true);
    expect(RESERVED_KEYS.has("pro_token")).toBe(true);
  });
});

describe("apply_started_offset", () => {
  it("returns config unchanged if no started value", () => {
    expect(apply_started_offset({ duration: 300 }, undefined)).toEqual({ duration: 300 });
  });

  it("subtracts elapsed seconds from duration", () => {
    const thirty_sec_ago = new Date(Date.now() - 30_000).toISOString();
    const result = apply_started_offset({ duration: 300 }, thirty_sec_ago);
    expect((result.duration as number) >= 269).toBe(true);
    expect((result.duration as number) <= 271).toBe(true);
  });

  it("clamps to zero rather than going negative", () => {
    const hour_ago = new Date(Date.now() - 3_600_000).toISOString();
    const result = apply_started_offset({ duration: 60 }, hour_ago);
    expect(result.duration).toBe(0);
  });

  it("ignores malformed started values", () => {
    const result = apply_started_offset({ duration: 300 }, "not-a-date");
    expect(result.duration).toBe(300);
  });
});
