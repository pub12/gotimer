declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function fire_sign_up_event(method: "email" | "google") {
  if (typeof window === "undefined") return;

  const already_fired = sessionStorage.getItem("ga_sign_up_fired");
  if (already_fired) return;

  if (window.gtag) {
    window.gtag("event", "sign_up", { method });
    sessionStorage.setItem("ga_sign_up_fired", "1");
  }
}

/**
 * Check if this user ID has been seen before. If not, fire sign_up event.
 * Call this after authentication is confirmed.
 */
export function check_new_user_sign_up(user_id: string, method: "email" | "google") {
  if (typeof window === "undefined") return;

  const key = "ga_known_users";
  const known = localStorage.getItem(key);
  const known_set = new Set(known ? known.split(",") : []);

  if (known_set.has(user_id)) return;

  known_set.add(user_id);
  localStorage.setItem(key, Array.from(known_set).join(","));

  if (window.gtag) {
    window.gtag("event", "sign_up", { method });
  }
}
