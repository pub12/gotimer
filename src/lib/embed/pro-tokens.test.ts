import { describe, it, expect, beforeEach } from "vitest";
import { issue_pro_token, verify_pro_token } from "./pro-tokens";

const SECRET = "test-secret-please-override";

describe("pro tokens", () => {
  beforeEach(() => {
    process.env.GOTIMER_PRO_TOKEN_SECRET = SECRET;
  });

  it("round-trips a valid token", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: 60 });
    const result = verify_pro_token(token);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.user_id).toBe("user_123");
    }
  });

  it("rejects tokens signed with a different secret", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: 60 });
    process.env.GOTIMER_PRO_TOKEN_SECRET = "a-different-secret";
    const result = verify_pro_token(token);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("signature_mismatch");
    }
  });

  it("rejects expired tokens", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: -1 });
    const result = verify_pro_token(token);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("expired");
    }
  });

  it("rejects malformed tokens", () => {
    expect(verify_pro_token("garbage").valid).toBe(false);
    expect(verify_pro_token("").valid).toBe(false);
    expect(verify_pro_token("a.b").valid).toBe(false);
  });

  it("throws when secret env var is missing", () => {
    delete process.env.GOTIMER_PRO_TOKEN_SECRET;
    expect(() => issue_pro_token("user_123")).toThrow(/GOTIMER_PRO_TOKEN_SECRET/);
  });
});
