/**
 * Seeded RNG + group-shuffling logic for the classroom group generator.
 *
 * Three modes:
 *   - by_count: split into N groups, sizes balanced
 *   - by_size:  groups of K students, remainder distributed to earlier groups
 *
 * Avoid-previous-pairs: tracks the last shuffle's pairings in localStorage and
 * biases the next shuffle to minimize repeat pairs (greedy retry).
 */

// ---------------------------------------------------------------------------
// Seeded RNG — Mulberry32 (small, deterministic, good distribution)
// ---------------------------------------------------------------------------

export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string to a 32-bit signed integer (FNV-1a variant). */
export function string_seed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}

// ---------------------------------------------------------------------------
// Shuffle
// ---------------------------------------------------------------------------

function shuffle_in_place<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Distribution
// ---------------------------------------------------------------------------

export type GroupMode = "by_count" | "by_size";

export interface ShuffleOptions {
  names: string[];
  mode: GroupMode;
  /** When mode=by_count, target N groups. When mode=by_size, target K per group. */
  target: number;
  seed?: number | string;
  /** Previous pairings to avoid repeating (set of "a||b" sorted strings). */
  avoid_pairs?: Set<string>;
  /** Number of retries to minimize repeat pairs. Default 10. */
  retries?: number;
}

export interface ShuffleResult {
  groups: string[][];
  /** Pairs that repeat from previous shuffle (count). */
  repeat_count: number;
}

function distribute(
  names: string[],
  mode: GroupMode,
  target: number,
): string[][] {
  const n = names.length;
  if (n === 0 || target <= 0) return [];
  let group_count: number;
  if (mode === "by_count") {
    group_count = Math.min(target, n);
  } else {
    group_count = Math.max(1, Math.ceil(n / target));
  }
  const groups: string[][] = Array.from({ length: group_count }, () => []);
  for (let i = 0; i < n; i++) {
    groups[i % group_count].push(names[i]);
  }
  return groups;
}

function pairs_in_group(group: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i];
      const b = group[j];
      out.push(a < b ? `${a}||${b}` : `${b}||${a}`);
    }
  }
  return out;
}

export function count_repeats(groups: string[][], avoid: Set<string>): number {
  let total = 0;
  for (const g of groups) {
    for (const p of pairs_in_group(g)) {
      if (avoid.has(p)) total++;
    }
  }
  return total;
}

export function collect_pairs(groups: string[][]): string[] {
  const out: string[] = [];
  for (const g of groups) out.push(...pairs_in_group(g));
  return out;
}

export function shuffle_into_groups(opts: ShuffleOptions): ShuffleResult {
  const { names, mode, target, avoid_pairs, retries = 10 } = opts;
  if (names.length === 0) {
    return { groups: [], repeat_count: 0 };
  }

  // Build base seed. If none given, use time-based randomness.
  const base_seed =
    typeof opts.seed === "string"
      ? string_seed(opts.seed)
      : typeof opts.seed === "number"
        ? opts.seed
        : (Math.random() * 2 ** 31) | 0;

  let best: string[][] = [];
  let best_repeat = Infinity;
  const tries = avoid_pairs && avoid_pairs.size > 0 ? retries : 1;

  for (let attempt = 0; attempt < tries; attempt++) {
    const rng = mulberry32(base_seed + attempt);
    const shuffled = shuffle_in_place([...names], rng);
    const groups = distribute(shuffled, mode, target);
    const repeats = avoid_pairs ? count_repeats(groups, avoid_pairs) : 0;
    if (repeats < best_repeat) {
      best = groups;
      best_repeat = repeats;
      if (repeats === 0) break;
    }
  }

  return { groups: best, repeat_count: best_repeat === Infinity ? 0 : best_repeat };
}
