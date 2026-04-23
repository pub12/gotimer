import { describe, it, expect, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
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

  it("returns malformed (not throw) when secret is missing during verify", () => {
    const token = issue_pro_token("user_123", { ttl_seconds: 60 });
    delete process.env.GOTIMER_PRO_TOKEN_SECRET;
    const result = verify_pro_token(token);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("malformed");
    }
  });

  it("rejects wrong-length signatures in constant time", () => {
    // Signature with wrong length (not 43 chars)
    const result = verify_pro_token("eyJ1IjoidXNlcl8xMjMifQ.short");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("signature_mismatch");
    }
  });

  it("rejects payload with non-string user_id", () => {
    const payload_json = JSON.stringify({ u: 123, e: Math.floor(Date.now() / 1000) + 60 });
    const payload = Buffer.from(payload_json, "utf8").toString("base64")
      .replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const sig = createHmac("sha256", SECRET).update(payload).digest().toString("base64")
      .replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const result = verify_pro_token(`${payload}.${sig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("malformed");
    }
  });

  it("rejects payload with string expiry (coercion guard)", () => {
    const payload_json = JSON.stringify({ u: "user_123", e: "9999999999" });
    const payload = Buffer.from(payload_json, "utf8").toString("base64")
      .replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const sig = createHmac("sha256", SECRET).update(payload).digest().toString("base64")
      .replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    const result = verify_pro_token(`${payload}.${sig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe("malformed");
    }
  });
});
