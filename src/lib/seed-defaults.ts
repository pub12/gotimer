/**
 * Auto-seed default data on first startup.
 * Only runs when tables are empty — safe to call on every app start.
 *
 * Timer pages use TIMER_PAGES from src/lib/timer-page-content.ts as the single
 * source of truth. The same data is used by scripts/seed-timer-pages.ts to
 * refresh existing rows on each deploy.
 *
 * Note: db.exec() and db.prepare() below are better-sqlite3's Database methods
 * for running SQL, NOT child_process.exec(). This is safe and standard usage.
 */
import type Database from "better-sqlite3";
import crypto from "crypto";
import { TIMER_PAGES } from "./timer-page-content";

export function seed_defaults(db: Database.Database) {
  seed_timer_pages(db);
  seed_blog_defaults(db);
}

// ─── Timer Pages ────────────────────────────────────────────────────────────

function seed_timer_pages(db: Database.Database) {
  const count = (db.prepare(`SELECT COUNT(*) as c FROM timer_pages`).get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO timer_pages
      (id, slug, title, intro_html, faq_json, meta_title, meta_description,
       timer_type, timer_config_json, status, published_at, category_slug,
       created_at, updated_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const run = db.transaction(() => {
    for (const page of TIMER_PAGES) {
      insert.run(
        crypto.randomUUID(),
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
    }
  });
  run();

  console.log(`[seed] Auto-seeded ${TIMER_PAGES.length} timer pages from timer-page-content.ts`);
}

// ─── Blog Defaults ──────────────────────────────────────────────────────────

function seed_blog_defaults(db: Database.Database) {
  const cat_count = (db.prepare(`SELECT COUNT(*) as c FROM blog_categories`).get() as { c: number }).c;
  if (cat_count === 0) {
    const cat_id = crypto.randomUUID();
    db.prepare(`INSERT INTO blog_categories (id, slug, name, description, colour) VALUES (?, ?, ?, ?, ?)`)
      .run(cat_id, "productivity", "Productivity", "Tips, techniques, and tools to help you get more done", "#6366f1");
    console.log(`[seed] Auto-seeded blog category: Productivity`);
  }
}
