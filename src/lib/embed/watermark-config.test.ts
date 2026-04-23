import { describe, it, expect, beforeEach } from "vitest";
import { resolve_watermark } from "./watermark-config";
import { issue_pro_token } from "./pro-tokens";

describe("resolve_watermark", () => {
  beforeEach(() => {
    process.env.GOTIMER_PRO_TOKEN_SECRET = "test-secret";
  });

  it("defaults to full variant", () => {
    const wm = resolve_watermark({ branding: "full" });
    expect(wm.show).toBe(true);
    expect(wm.variant).toBe("full");
    expect(wm.link_text).toContain("GoTimer");
  });

  it("streaming theme forces corner variant", () => {
    const wm = resolve_watermark({ branding: "full", theme: "streaming" });
    expect(wm.variant).toBe("corner");
  });

  it("classroom theme forces top-right position", () => {
    const wm = resolve_watermark({ branding: "full", theme: "classroom" });
    expect(wm.position).toBe("top-right");
    expect(wm.variant).toBe("minimal");
  });

  it("ignores branding=hidden when no pro_token is present", () => {
    const wm = resolve_watermark({ branding: "hidden" });
    expect(wm.show).toBe(true);
    expect(wm.variant).toBe("minimal");
  });

  it("honours branding=hidden when a valid pro_token is present", () => {
    const token = issue_pro_token("user_123");
    const wm = resolve_watermark({ branding: "hidden", pro_token: token });
    expect(wm.show).toBe(false);
  });

  it("ignores branding=hidden when pro_token is invalid", () => {
    const wm = resolve_watermark({ branding: "hidden", pro_token: "fake.token" });
    expect(wm.show).toBe(true);
  });

  it("link target is always gotimer.org with utm params", () => {
    const wm = resolve_watermark({ branding: "full" });
    expect(wm.href).toContain("gotimer.org");
    expect(wm.href).toContain("utm_source=embed");
    expect(wm.href).toContain("utm_medium=watermark");
  });
});
