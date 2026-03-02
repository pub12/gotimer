import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

export function get_db(): Database.Database {
  if (!db) {
    const db_path = path.resolve(process.cwd(), "data", "hazo_auth.sqlite");
    db = new Database(db_path);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    init_challenge_tables(db);
    run_migrations(db);
  }
  return db;
}

// Note: db.exec() below is better-sqlite3's Database.exec() method for running SQL,
// NOT child_process.exec(). This is safe and standard usage.
function init_challenge_tables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_challenges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS challenge_participants (
      id TEXT PRIMARY KEY,
      challenge_id TEXT NOT NULL REFERENCES game_challenges(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'participant',
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(challenge_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS challenge_invitations (
      id TEXT PRIMARY KEY,
      challenge_id TEXT NOT NULL REFERENCES game_challenges(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      invited_by TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS challenge_games (
      id TEXT PRIMARY KEY,
      challenge_id TEXT NOT NULL REFERENCES game_challenges(id) ON DELETE CASCADE,
      winner_id TEXT,
      is_draw INTEGER NOT NULL DEFAULT 0,
      notes TEXT DEFAULT '',
      gif_url TEXT,
      played_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY,
      show_public_profile_pic INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

type Migration = { version: number; sql: string };

const migrations: Migration[] = [
  { version: 1, sql: `ALTER TABLE game_challenges ADD COLUMN gif_url TEXT` },
  { version: 2, sql: `ALTER TABLE game_challenges ADD COLUMN is_public INTEGER NOT NULL DEFAULT 1` },
  { version: 3, sql: `ALTER TABLE game_challenges ADD COLUMN game_id TEXT` },
  { version: 4, sql: `ALTER TABLE challenge_participants ADD COLUMN score_override INTEGER` },
  { version: 5, sql: `ALTER TABLE challenge_participants ADD COLUMN score_changed_by TEXT` },
  { version: 6, sql: `ALTER TABLE challenge_participants ADD COLUMN score_changed_at TEXT` },
  { version: 7, sql: `ALTER TABLE challenge_participants ADD COLUMN score_changed_from INTEGER` },
  { version: 8, sql: `ALTER TABLE game_challenges ADD COLUMN pending_opponent_score INTEGER` },
];

function run_migrations(db: Database.Database) {
  const applied = new Set(
    (db.prepare(`SELECT version FROM schema_migrations`).all() as { version: number }[])
      .map((r) => r.version)
  );

  for (const m of migrations) {
    if (applied.has(m.version)) continue;
    const run = db.transaction(() => {
      try {
        db.exec(m.sql);
      } catch {
        // Column/table already exists from before migration tracking
      }
      db.prepare(`INSERT INTO schema_migrations (version) VALUES (?)`).run(m.version);
    });
    run();
  }
}

/**
 * Get scores for all participants of a challenge.
 * Uses score_override if set, otherwise falls back to counting wins.
 */
export function get_challenge_scores(
  db: Database.Database,
  challenge_id: string,
  participants: { user_id: string; score_override?: number | null }[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const p of participants) {
    if (p.score_override != null) {
      scores[p.user_id] = p.score_override;
    } else {
      const wins = db
        .prepare(
          `SELECT COUNT(*) as count FROM challenge_games WHERE challenge_id = ? AND winner_id = ? AND is_draw = 0`
        )
        .get(challenge_id, p.user_id) as { count: number };
      scores[p.user_id] = wins.count;
    }
  }
  return scores;
}
