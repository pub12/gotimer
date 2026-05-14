/**
 * Format milliseconds as MM:SS.cs or H:MM:SS.cs.
 * Centiseconds are truncated (not rounded).
 */
export function format_stopwatch_time(ms: number): string {
  const total_cs = Math.floor(ms / 10);
  const cs = total_cs % 100;
  const total_seconds = Math.floor(total_cs / 100);
  const seconds = total_seconds % 60;
  const total_minutes = Math.floor(total_seconds / 60);
  const minutes = total_minutes % 60;
  const hours = Math.floor(total_minutes / 60);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const cc = String(cs).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mm}:${ss}.${cc}`;
  }
  return `${mm}:${ss}.${cc}`;
}
