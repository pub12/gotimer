/**
 * Encode/decode timer state in URL params for live sharing.
 * When someone opens a shared URL, the timer reconstructs its state
 * based on when it was started and the current time.
 */

export function encode_live_timer(params: {
  type: string;
  started: Date;
  config: Record<string, unknown>;
}): string {
  const search = new URLSearchParams();
  search.set("type", params.type);
  search.set("started", params.started.toISOString());

  // Encode config as individual params for readability
  for (const [key, value] of Object.entries(params.config)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  }

  return search.toString();
}

export function decode_live_timer(
  searchParams: URLSearchParams
): {
  type: string;
  started: Date;
  config: Record<string, unknown>;
  elapsed_seconds: number;
  is_expired: boolean;
} | null {
  const type = searchParams.get("type");
  const started_str = searchParams.get("started");

  if (!type || !started_str) {
    return null;
  }

  const started = new Date(started_str);
  if (isNaN(started.getTime())) {
    return null;
  }

  // Build config from remaining params
  const config: Record<string, unknown> = {};
  const reserved_keys = new Set(["type", "started"]);

  searchParams.forEach((value, key) => {
    if (!reserved_keys.has(key)) {
      // Try to parse numbers and booleans
      if (value === "true") {
        config[key] = true;
      } else if (value === "false") {
        config[key] = false;
      } else if (/^\d+$/.test(value)) {
        config[key] = parseInt(value, 10);
      } else if (/^\d+\.\d+$/.test(value)) {
        config[key] = parseFloat(value);
      } else {
        config[key] = value;
      }
    }
  });

  const elapsed_seconds = Math.floor((Date.now() - started.getTime()) / 1000);

  // Consider expired if elapsed > 24 hours (86400 seconds)
  const is_expired = elapsed_seconds > 86400;

  return {
    type,
    started,
    config,
    elapsed_seconds: Math.max(0, elapsed_seconds),
    is_expired,
  };
}
