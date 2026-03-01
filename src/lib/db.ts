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
  `);

  // Add gif_url column to game_challenges if it doesn't exist yet
  try {
    db.exec(`ALTER TABLE game_challenges ADD COLUMN gif_url TEXT`);
  } catch {
    // Column already exists
  }
}
