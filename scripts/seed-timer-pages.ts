/**
 * Seed script for all 20 timer pages.
 * Run with: npx tsx scripts/seed-timer-pages.ts
 * Idempotent — uses INSERT OR REPLACE so it can be re-run safely.
 *
 * Loads .env.local so HAZO_CONNECT_SQLITE_PATH is honoured. Without this, the
 * script writes to ./data/gotimer.sqlite while Next.js reads from whatever
 * the env file points at (e.g. ./data/hazo_auth.sqlite) — leaving the seed
 * silently writing to an unused DB file.
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { TIMER_PAGES } from "../src/lib/timer-page-content";

const project_root = path.resolve(__dirname, "..");
const db_dir = path.resolve(project_root, "data");

// Manually load .env.local (Node/tsx doesn't auto-load it the way Next.js does)
function load_dotenv(file_path: string) {
  if (!fs.existsSync(file_path)) return;
  for (const line of fs.readFileSync(file_path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
load_dotenv(path.resolve(project_root, ".env.local"));

// Resolve the DB path — env var wins; otherwise default to ./data/gotimer.sqlite.
// Relative paths in the env are resolved against project_root, not cwd.
const env_path = process.env.HAZO_CONNECT_SQLITE_PATH;
const db_path = env_path
  ? path.isAbsolute(env_path)
    ? env_path
    : path.resolve(project_root, env_path)
  : path.resolve(db_dir, "gotimer.sqlite");

console.log(`[seed] Target DB: ${db_path}`);

// Ensure data directory exists
if (!fs.existsSync(db_dir)) {
  fs.mkdirSync(db_dir, { recursive: true });
  console.log(`[CREATE] ${db_dir}`);
}

const db = new Database(db_path);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Ensure the timer_pages table exists (self-contained, no dependency on app code)
// Note: db.exec() below is better-sqlite3's Database.exec() method for running SQL,
// NOT child_process.exec(). This is safe and standard usage.
const create_tables_sql = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS timer_pages (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    intro_html TEXT NOT NULL DEFAULT '',
    faq_json TEXT NOT NULL DEFAULT '[]',
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    timer_type TEXT NOT NULL DEFAULT 'countdown',
    timer_config_json TEXT NOT NULL DEFAULT '{}',
    character_id TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    category_slug TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_timer_pages_slug ON timer_pages (slug);
`;
db.exec(create_tables_sql);
try {
  db.prepare(`ALTER TABLE timer_pages ADD COLUMN category_slug TEXT NOT NULL DEFAULT ''`).run();
} catch {
  // column already exists
}

// ---------------------------------------------------------------------------
// Insert all pages
// ---------------------------------------------------------------------------

const stmt = db.prepare(`
  INSERT OR REPLACE INTO timer_pages
    (id, slug, title, intro_html, faq_json, meta_title, meta_description, timer_type, timer_config_json, status, published_at, category_slug, created_at, updated_at)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

const insert_all = db.transaction(() => {
  for (const page of TIMER_PAGES) {
    const id = crypto.randomUUID();
    stmt.run(
      id,
      page.slug,
      page.title,
      page.intro_html,
      page.faq_json,
      page.meta_title,
      page.meta_description,
      page.timer_type,
      page.timer_config_json,
      page.status,
      page.published_at,
      page.category_slug ?? ""
    );
    console.log(`  Seeded: ${page.slug}`);
  }
});

insert_all();

console.log(`\nDone! ${TIMER_PAGES.length} timer pages seeded.`);
db.close();
