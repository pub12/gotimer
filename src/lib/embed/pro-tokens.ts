import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET_ENV = "GOTIMER_PRO_TOKEN_SECRET";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function b64url_decode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function get_secret(): string {
  const secret = process.env[SECRET_ENV];
  if (!secret) throw new Error(`${SECRET_ENV} is not set`);
  return secret;
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", get_secret()).update(payload).digest());
}

export interface IssueOptions {
  ttl_seconds?: number;
}

export function issue_pro_token(user_id: string, opts: IssueOptions = {}): string {
  const ttl = opts.ttl_seconds ?? DEFAULT_TTL_SECONDS;
  const payload_json = JSON.stringify({ u: user_id, e: Math.floor(Date.now() / 1000) + ttl });
  const payload = b64url(payload_json);
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export type VerifyResult =
  | { valid: true; user_id: string }
  | { valid: false; reason: "malformed" | "signature_mismatch" | "expired" };

export function verify_pro_token(token: string): VerifyResult {
  if (!token || typeof token !== "string") return { valid: false, reason: "malformed" };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [payload, sig] = parts;
  if (!payload || !sig) return { valid: false, reason: "malformed" };

  const expected_sig = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected_sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "signature_mismatch" };
  }

  let parsed: { u?: string; e?: number };
  try {
    parsed = JSON.parse(b64url_decode(payload).toString("utf8"));
  } catch {
    return { valid: false, reason: "malformed" };
  }
  if (!parsed.u || !parsed.e) return { valid: false, reason: "malformed" };
  if (parsed.e < Math.floor(Date.now() / 1000)) return { valid: false, reason: "expired" };

  return { valid: true, user_id: parsed.u };
}
