import { describe, it, expect } from "vitest";
import { resolve_theme } from "./theme";

describe("resolve_theme", () => {
  it("auto produces a spec with no hard background", () => {
    const spec = resolve_theme({ theme: "auto" });
    expect(spec.transparent).toBe(false);
    expect(spec.wrapper_class).toContain("bg-surface");
  });

  it("classroom uses high-contrast projector-friendly styling", () => {
    const spec = resolve_theme({ theme: "classroom" });
    expect(spec.wrapper_class).toMatch(/bg-(white|yellow|slate)/);
    expect(spec.oversized).toBe(true);
  });

  it("streaming sets transparent true", () => {
    const spec = resolve_theme({ theme: "streaming" });
    expect(spec.transparent).toBe(true);
  });

  it("bg=transparent overrides theme background", () => {
    const spec = resolve_theme({ theme: "dark", bg: "transparent" });
    expect(spec.transparent).toBe(true);
  });

  it("bg with hex value is applied as inline style", () => {
    const spec = resolve_theme({ theme: "light", bg: "#112233" });
    expect(spec.inline_style?.background).toBe("#112233");
  });

  it("rejects non-hex, non-transparent bg values (xss guard)", () => {
    const spec = resolve_theme({ theme: "light", bg: "red; url(javascript:alert(1))" });
    expect(spec.inline_style).toBeUndefined();
    expect(spec.transparent).toBe(false);
  });
});
