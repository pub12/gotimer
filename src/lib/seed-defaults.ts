/**
 * Auto-seed default data on first startup.
 * Only runs when tables are empty — safe to call on every app start.
 *
 * Note: db.exec() and db.prepare() below are better-sqlite3's Database methods
 * for running SQL, NOT child_process.exec(). This is safe and standard usage.
 */
import type Database from "better-sqlite3";
import crypto from "crypto";

export function seed_defaults(db: Database.Database) {
  seed_timer_pages(db);
  seed_blog_defaults(db);
}

// ─── Timer Pages ────────────────────────────────────────────────────────────

function seed_timer_pages(db: Database.Database) {
  const count = (db.prepare(`SELECT COUNT(*) as c FROM timer_pages`).get() as { c: number }).c;
  if (count > 0) return;

  const now = new Date().toISOString();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO timer_pages (id, slug, title, intro_html, faq_json, meta_title, meta_description, timer_type, timer_config_json, status, published_at, created_at, updated_at)
    VALUES (?, ?, ?, '', '[]', ?, ?, ?, ?, 'published', ?, ?, ?)
  `);

  const pages: [string, string, string, string, string, string][] = [
    ["5-minute-timer", "Free 5 Minute Timer Online", "Free 5 Minute Timer Online — Countdown | GoTimer", "Start a free 5 minute countdown timer instantly. No signup needed.", "countdown", JSON.stringify({ duration: 300 })],
    ["10-minute-timer", "Free 10 Minute Timer Online", "Free 10 Minute Timer Online — Countdown | GoTimer", "Start a free 10 minute countdown timer. Great for focused work sessions and quick breaks.", "countdown", JSON.stringify({ duration: 600 })],
    ["15-minute-timer", "Free 15 Minute Timer Online", "Free 15 Minute Timer Online — Countdown | GoTimer", "Start a free 15 minute countdown timer instantly. Perfect for short tasks and timed activities.", "countdown", JSON.stringify({ duration: 900 })],
    ["20-minute-timer", "Free 20 Minute Timer Online", "Free 20 Minute Timer Online — Countdown | GoTimer", "Start a free 20 minute countdown timer. Ideal for focused work, exercise, and study sessions.", "countdown", JSON.stringify({ duration: 1200 })],
    ["25-minute-timer", "Free 25 Minute Timer Online", "Free 25 Minute Timer Online — Countdown | GoTimer", "Start a free 25 minute countdown timer. The classic Pomodoro work interval.", "countdown", JSON.stringify({ duration: 1500 })],
    ["30-minute-timer", "Free 30 Minute Timer Online", "Free 30 Minute Timer Online — Countdown | GoTimer", "Start a free 30 minute countdown timer. Perfect for meetings, workouts, and study blocks.", "countdown", JSON.stringify({ duration: 1800 })],
    ["45-minute-timer", "Free 45 Minute Timer Online", "Free 45 Minute Timer Online — Countdown | GoTimer", "Start a free 45 minute countdown timer. Great for class periods and extended focus sessions.", "countdown", JSON.stringify({ duration: 2700 })],
    ["60-minute-timer", "Free 60 Minute Timer Online", "Free 60 Minute Timer Online — Countdown | GoTimer", "Start a free 60 minute countdown timer. Perfect for hour-long sessions and meetings.", "countdown", JSON.stringify({ duration: 3600 })],
    ["pomodoro-timer", "Free Pomodoro Timer Online — 25/5 Focus Sessions", "Free Pomodoro Timer Online — 25/5 Focus Sessions | GoTimer", "Free online Pomodoro timer with 25-minute focus sessions and 5-minute breaks. No signup needed.", "pomodoro", JSON.stringify({ work: 1500, break: 300, long_break: 900, rounds: 4 })],
    ["hiit-timer", "Free HIIT Timer Online — Interval Training", "Free HIIT Timer Online — Interval Training | GoTimer", "Free online HIIT interval timer with customizable work/rest periods. Perfect for home workouts.", "interval", JSON.stringify({ work: 30, rest: 10, rounds: 10 })],
    ["meditation-timer", "Free Meditation Timer Online", "Free Meditation Timer Online — Mindfulness | GoTimer", "Free online meditation timer with gentle alerts. Perfect for mindfulness and breathing exercises.", "countdown", JSON.stringify({ duration: 600 })],
    ["breathing-timer", "Free Breathing Exercise Timer", "Free Breathing Exercise Timer — Box Breathing | GoTimer", "Free online breathing exercise timer. Practice box breathing and relaxation techniques.", "countdown", JSON.stringify({ duration: 240 })],
    ["cooking-timer", "Free Cooking Timer Online", "Free Cooking Timer Online — Kitchen Timer | GoTimer", "Free online cooking timer for recipes and baking. Set multiple timers for different dishes.", "countdown", JSON.stringify({ duration: 600 })],
    ["egg-timer", "Free Egg Timer Online", "Free Egg Timer Online — Perfect Eggs Every Time | GoTimer", "Free online egg timer. Get perfect soft, medium, or hard boiled eggs every time.", "countdown", JSON.stringify({ duration: 360 })],
    ["fasting-timer", "Free Intermittent Fasting Timer", "Free Intermittent Fasting Timer — IF Tracker | GoTimer", "Free online intermittent fasting timer. Track your fasting windows for 16:8, 18:6, and more.", "countdown", JSON.stringify({ duration: 57600 })],
    ["study-timer", "Free Study Timer Online", "Free Study Timer Online — Timed Study Sessions | GoTimer", "Free online study timer with timed study blocks and break reminders. Stay focused and productive.", "pomodoro", JSON.stringify({ work: 1500, break: 300, long_break: 900, rounds: 4 })],
    ["classroom-timer", "Free Classroom Timer Online", "Free Classroom Timer for Teachers | GoTimer", "Free online classroom timer for teachers. Time activities, transitions, and group work.", "countdown", JSON.stringify({ duration: 300 })],
    ["presentation-timer", "Free Presentation Timer Online", "Free Presentation Timer — Keep Talks on Schedule | GoTimer", "Free online presentation timer. Keep talks, meetings, and pitches on schedule.", "countdown", JSON.stringify({ duration: 1800 })],
    ["adhd-focus-timer", "Free ADHD Focus Timer", "Free ADHD Focus Timer — Low-Distraction | GoTimer", "Free online ADHD focus timer with minimal distractions. Short intervals designed for neurodivergent focus.", "countdown", JSON.stringify({ duration: 900 })],
    ["sleep-timer", "Free Sleep Timer Online", "Free Sleep Timer — Wind Down for Better Sleep | GoTimer", "Free online sleep timer. Wind down with timed relaxation sessions for better sleep.", "countdown", JSON.stringify({ duration: 1800 })],
  ];

  const run = db.transaction(() => {
    for (const [slug, title, meta_title, meta_desc, timer_type, config] of pages) {
      insert.run(crypto.randomUUID(), slug, title, meta_title, meta_desc, timer_type, config, now, now, now);
    }
  });
  run();

  // eslint-disable-next-line no-console
  console.log(`[seed] Auto-seeded ${pages.length} timer pages`);
}

// ─── Blog Defaults ──────────────────────────────────────────────────────────

function seed_blog_defaults(db: Database.Database) {
  const cat_count = (db.prepare(`SELECT COUNT(*) as c FROM blog_categories`).get() as { c: number }).c;
  if (cat_count === 0) {
    const cat_id = crypto.randomUUID();
    db.prepare(`INSERT INTO blog_categories (id, slug, name, description, colour) VALUES (?, ?, ?, ?, ?)`)
      .run(cat_id, "productivity", "Productivity", "Tips, techniques, and tools to help you get more done", "#6366f1");
    // eslint-disable-next-line no-console
    console.log(`[seed] Auto-seeded blog category: Productivity`);
  }
}
