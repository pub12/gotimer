/**
 * Seed script for Pomodoro Technique blog post.
 * Run with: npx tsx scripts/seed-blog-pomodoro.ts
 * Idempotent — uses INSERT OR REPLACE so it can be re-run safely.
 */
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const project_root = path.resolve(__dirname, "..");
const db_dir = path.resolve(project_root, "data");
const db_path = process.env.HAZO_CONNECT_SQLITE_PATH ?? path.resolve(db_dir, "gotimer.sqlite");

if (!fs.existsSync(db_dir)) {
  fs.mkdirSync(db_dir, { recursive: true });
}

const db = new Database(db_path);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Ensure blog tables exist
// Note: db.exec() below is better-sqlite3's Database.exec() method for running SQL,
// NOT child_process.exec(). This is safe and standard usage.
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    colour TEXT
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    category_id TEXT REFERENCES blog_categories(id),
    meta_title TEXT,
    meta_description TEXT,
    character_id TEXT,
    faq_json TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    publish_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Category ──
const category_id = crypto.randomUUID();
db.prepare(`INSERT OR IGNORE INTO blog_categories (id, slug, name, description, colour)
  VALUES (?, ?, ?, ?, ?)`).run(
  category_id,
  "productivity",
  "Productivity",
  "Tips, techniques, and tools to help you get more done",
  "#6366f1"
);

// Fetch category ID (may already exist)
const cat = db.prepare(`SELECT id FROM blog_categories WHERE slug = ?`).get("productivity") as { id: string };
const final_category_id = cat.id;

// ── Blog Post Content (MDX) ──
const content = `{/* FEATURE IMAGE PLACEHOLDER */}
<BlogImage src="/blog/pomodoro-technique-guide-hero.png" alt="The Pomodoro Technique — a kitchen timer next to a focused workspace" caption="The humble tomato timer that launched a global productivity movement." />

You've probably heard of the Pomodoro Technique. Maybe you've tried it. Maybe you bounced off it after a day because "25 minutes felt too short" or "the breaks ruined your flow."

Here's the thing: most Pomodoro guides are written by SaaS companies trying to sell you a $15/month subscription. They give you the Wikipedia version, slap a signup form at the bottom, and call it a day.

This guide is different. We built an actual [free Pomodoro timer](/pomodoro-timer) — no account required, no upsells — and we've watched thousands of people use it. Here's what actually works.

---

## What Is the Pomodoro Technique?

The Pomodoro Technique is a time management method created by Francesco Cirillo in the late 1980s. He used a tomato-shaped kitchen timer (pomodoro is Italian for tomato), and the name stuck.

The core idea is dead simple:

1. **Pick a task** you want to work on
2. **Set a timer** for 25 minutes
3. **Work on that one task** until the timer rings
4. **Take a 5-minute break**
5. **Repeat.** After 4 rounds, take a longer 15–30 minute break

That's it. No app required. No certification. No course.

{/* IMAGE PLACEHOLDER */}
<BlogImage src="/blog/pomodoro-cycle-diagram.png" alt="Diagram showing the Pomodoro cycle: 25 min work, 5 min break, repeat 4 times, then 15-30 min long break" caption="The classic Pomodoro cycle. Simple, but the magic is in the consistency." />

### Why It Works (the Science)

The technique works because it leverages three well-documented cognitive principles:

**Timeboxing creates urgency.** Parkinson's Law says work expands to fill the time available. A 25-minute box forces you to start, even when you don't feel like it. The timer isn't a suggestion — it's a deadline.

**Breaks prevent decision fatigue.** Your prefrontal cortex — the part of your brain responsible for focus, planning, and willpower — gets depleted over time. Short breaks allow partial recovery. Without them, you hit diminishing returns around the 45-minute mark.

**Single-tasking beats multitasking.** Research from Stanford shows that chronic multitaskers perform worse on every metric — including the tasks they think they're good at. The Pomodoro Technique forces you to commit to one thing at a time.

<Callout type="tip">
The Pomodoro Technique isn't about becoming a productivity robot. It's about creating a sustainable rhythm that protects your focus while respecting your brain's natural limits.
</Callout>

---

## How to Actually Do It (Step by Step)

Most guides give you the 5 steps above and stop. Here's what they leave out.

### Step 1: Write Down Your Task Before Starting the Timer

Don't just think about what you're going to do. **Write it down.** Physically. On paper, in a notes app, wherever. Be specific:

- Bad: "Work on report"
- Good: "Write the methodology section of Q2 report"

This tiny act of writing activates a different part of your brain and dramatically increases follow-through.

### Step 2: Set Your Timer

Use a real timer — not your phone's clock app buried under notifications. A dedicated timer matters because:

- It's always visible (ambient awareness of time)
- It doesn't tempt you with Instagram
- Starting it feels like a physical commitment

<TimerEmbed type="pomodoro" />

### Step 3: Work Until the Timer Rings

When the timer is running:

- **No email.** No Slack. No "quick check."
- If a thought pops up ("I need to reply to that email"), write it on a piece of paper and get back to work. Cirillo calls this the **"Inform, Negotiate, Call Back"** strategy.
- If someone interrupts you, say: "I'm in the middle of something. Can I get back to you in 15 minutes?" Most things can wait 15 minutes.

{/* IMAGE PLACEHOLDER */}
<BlogImage src="/blog/pomodoro-interruption-strategy.png" alt="Flowchart showing how to handle interruptions during a Pomodoro: internal (write it down) vs external (negotiate delay)" caption="How to handle interruptions without breaking your Pomodoro." />

### Step 4: Take Your Break (Actually Take It)

This is where most people fail. They finish a Pomodoro and think "I'm in the zone, I'll skip the break."

**Don't skip the break.** The break is not a reward — it's a necessary part of the system. During your 5-minute break:

- Stand up and stretch
- Get water or coffee
- Look out a window (the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds)
- **Don't** check social media — it's not restful, it's stimulating

### Step 5: Track Your Pomodoros

At the end of each day, count how many Pomodoros you completed. This gives you:

- A realistic sense of your daily capacity (most people can do 8–12 focused Pomodoros per day)
- Data to plan future work ("this project will take about 16 Pomodoros")
- Motivation through visible progress

---

## Which Interval Is Right for You?

Here's what nobody tells you: **25 minutes is a starting point, not a commandment.**

Different work types and different brains respond to different intervals. Use this guide to find your sweet spot:

{/* IMAGE PLACEHOLDER */}
<BlogImage src="/blog/pomodoro-interval-comparison.png" alt="Comparison table of different Pomodoro intervals: 15/3, 25/5, 50/10, and 90/20 minute work/break ratios" caption="There's no single 'correct' interval. Match the interval to your work type." />

### The Classic: 25 / 5

**Best for:** General knowledge work, email processing, writing first drafts, studying

**Why it works:** Short enough to not feel daunting. Long enough to make meaningful progress. The 5-minute break prevents the "I'll just keep going" trap.

**Try this if:** You're new to the technique, you struggle with procrastination, or your work involves lots of task-switching.

### The Short Sprint: 15 / 3

**Best for:** Tedious tasks you've been avoiding, ADHD-friendly work sessions, high-anxiety tasks

**Why it works:** The activation energy to start a 15-minute task is almost zero. "I can do anything for 15 minutes" is a powerful mental trick.

**Try this if:** You're dealing with executive function challenges, or you have a task you've been putting off for days.

### The Deep Worker: 50 / 10

**Best for:** Programming, design work, long-form writing, complex analysis

**Why it works:** Creative and analytical work often requires 10–15 minutes just to load context into your brain. A 25-minute Pomodoro gives you only 10–15 minutes of actual deep work. Doubling the interval gives you a proper runway.

**Try this if:** You consistently feel like 25 minutes cuts you off right when you're getting productive.

### The Ultramarathon: 90 / 20

**Best for:** Research sessions, creative projects, flow-state work

**Why it works:** This aligns with the body's ultradian rhythm — the natural 90-minute cycle of high and low alertness. It's not technically Pomodoro anymore, but the principle is the same.

**Try this if:** You're experienced with focus techniques and your work genuinely benefits from extended uninterrupted time.

<Callout type="info">
Not sure which interval to pick? Start with 25/5 for one week. If you consistently feel interrupted by the timer, move to 50/10. If 25 minutes feels too long, try 15/3. Let your experience guide you, not theory.
</Callout>

<TimerEmbed type="pomodoro" />

---

## Common Mistakes (and How to Fix Them)

### Mistake 1: Treating the Timer as the Enemy

If you're constantly watching the clock and feeling stressed, you're doing it wrong. The timer is a **container**, not a cage. If 25 minutes feels oppressive, shorten it. The point is to create rhythm, not anxiety.

### Mistake 2: Working Through Breaks

We covered this above, but it bears repeating. **Skipping breaks doesn't make you more productive.** It makes you less productive, slower, and more error-prone after about 90 minutes.

### Mistake 3: Using It for Everything

The Pomodoro Technique is not ideal for:

- Meetings (you can't pause a conversation)
- Creative brainstorming sessions (sometimes you need to follow a thread)
- Tasks that take less than 5 minutes (just do them)

Use it for focused, individual work. Don't force it where it doesn't fit.

### Mistake 4: Overcomplicating the System

You don't need:
- A special app with analytics dashboards
- A color-coded task categorization system
- A review process for your Pomodoro data

A timer and a piece of paper. That's the system. Everything else is procrastination disguised as productivity.

{/* IMAGE PLACEHOLDER */}
<BlogImage src="/blog/pomodoro-minimal-setup.png" alt="A minimal Pomodoro setup: laptop, notebook, pen, and a timer" caption="The only Pomodoro setup you actually need." />

---

## The Pomodoro Technique for Different Professions

### For Students

The Pomodoro Technique is almost unfairly effective for studying. Here's why:

- **Spaced repetition + Pomodoros = superpower.** Study one subject for 4 Pomodoros, switch to another, then come back. The breaks create natural spacing.
- **Exam prep:** Use each Pomodoro for a different topic. Track how many Pomodoros each subject needs. This replaces vague "I studied for 6 hours" with concrete "I did 12 Pomodoros across 4 subjects."

### For Programmers

Programming has a unique challenge: deep context loading. You need 10–15 minutes just to hold a complex system in your head.

- Use **50/10 intervals** for coding
- Use **25/5 intervals** for code review, documentation, and bug triage
- During breaks, stand up. Seriously. Programmers who sit for 8 hours straight are not heroic — they're damaging their bodies.

### For Writers

Writing and the Pomodoro Technique are a natural fit:

- **First drafts:** 25/5. Don't edit, just write. The timer gives you permission to be imperfect.
- **Editing:** 50/10. Editing requires more sustained attention to catch inconsistencies.
- **Research:** 25/5 with strict rules about not falling down rabbit holes. When you find something interesting but tangential, write it on your interruption list and keep going.

### For Remote Workers

If you work from home, the Pomodoro Technique solves one of the biggest remote work problems: **the blurred boundary between work and not-work.**

- Pomodoros give you a clear "I'm working now" signal
- Breaks give you guilt-free moments to throw in laundry, pet the dog, etc.
- Tracking Pomodoros helps answer "what did I even do today?"

---

## Tools vs. No Tools

### The Case for a Dedicated Timer

A dedicated timer (like the [GoTimer Pomodoro Timer](/pomodoro-timer)) offers advantages over your phone:

- **No distractions** — no notifications, no apps, no temptation
- **Visible progress** — see exactly where you are in your work session
- **Quick start** — one click, not three taps and a scroll
- **Browser-based** — works on any device, nothing to install

### The Case for Pen and Paper

Some Pomodoro purists insist on analog tools. There's merit to this:

- The physical act of crossing off a Pomodoro is satisfying
- Paper doesn't have a battery
- Writing engages different neural pathways than typing

### The Best Approach

Use a digital timer (for accuracy and convenience) with a paper tracking sheet (for engagement and satisfaction). Best of both worlds.

<TimerEmbed type="pomodoro" />

---

## Frequently Asked Questions

These are covered in the FAQ section below, but here are quick answers to the most common questions:

**"What if my task takes more than one Pomodoro?"** Good — most meaningful work does. Just keep going with fresh Pomodoros. The boundary between Pomodoros is a checkpoint, not a stop sign.

**"What if I finish my task before the timer ends?"** Use the remaining time for review, cleanup, or preparation for the next task. Don't start a new task mid-Pomodoro.

**"Does the Pomodoro Technique work with ADHD?"** Many people with ADHD find shorter intervals (15/3) extremely helpful. The external timer provides structure that internal motivation can't. However, it's not a substitute for professional treatment.

**"Can I use the Pomodoro Technique in an open office?"** Yes, but you'll need to set expectations with colleagues. A visible timer or a "do not disturb" sign helps. Noise-canceling headphones are your friend.

---

## Start Your First Pomodoro Now

You've read the guide. You know the theory. Now do the only thing that matters: **start a timer and work for 25 minutes.**

Don't optimize your system first. Don't download an app. Don't watch a YouTube video about it. Just start.

<TimerEmbed type="pomodoro" />

The Pomodoro Technique works not because it's clever, but because it's simple enough to actually use. The best productivity system is the one you'll do tomorrow, and the day after that, and the day after that.

Set the timer. Do the work. Take the break. Repeat.`;

// ── FAQ Items ──
const faq_items = [
  {
    question: "What is the Pomodoro Technique?",
    answer: "The Pomodoro Technique is a time management method where you work in focused 25-minute intervals (called Pomodoros) separated by 5-minute breaks. After completing 4 Pomodoros, you take a longer 15-30 minute break. It was created by Francesco Cirillo in the late 1980s and is named after the tomato-shaped kitchen timer he used."
  },
  {
    question: "How long is a Pomodoro session?",
    answer: "A classic Pomodoro session is 25 minutes of focused work followed by a 5-minute break. However, you can adjust the intervals to suit your work type: 15/3 for short sprints, 50/10 for deep work like programming, or 90/20 for extended creative sessions."
  },
  {
    question: "Does the Pomodoro Technique actually work?",
    answer: "Yes, research supports the principles behind it. Timeboxing creates urgency (Parkinson's Law), regular breaks prevent cognitive fatigue, and single-tasking outperforms multitasking according to Stanford research. Most people can sustain 8-12 focused Pomodoros per day."
  },
  {
    question: "What should I do during Pomodoro breaks?",
    answer: "During your 5-minute breaks, stand up and stretch, get water, or look away from your screen (the 20-20-20 rule). Avoid checking social media or email — these are stimulating, not restful. During longer 15-30 minute breaks, take a walk, eat a snack, or do a non-screen activity."
  },
  {
    question: "Can I change the 25-minute Pomodoro interval?",
    answer: "Absolutely. The 25-minute interval is a starting point, not a rule. Try 15-minute intervals if you struggle with procrastination or have ADHD, 50-minute intervals for deep work like programming or writing, or 90-minute intervals to match your body's natural ultradian rhythm."
  },
  {
    question: "What if I get interrupted during a Pomodoro?",
    answer: "For internal interruptions (your own thoughts), write them down on paper and return to your task. For external interruptions, use the 'Inform, Negotiate, Call Back' strategy: tell the person you're in the middle of something and ask if you can get back to them in 15 minutes. If the interruption can't wait, void the Pomodoro and start a new one."
  },
  {
    question: "Is the Pomodoro Technique good for studying?",
    answer: "The Pomodoro Technique is extremely effective for studying. It naturally creates spaced repetition when you rotate subjects across Pomodoros, and tracking Pomodoros gives you concrete data ('12 Pomodoros across 4 subjects') instead of vague time estimates ('I studied for 6 hours')."
  },
  {
    question: "Do I need a special app for the Pomodoro Technique?",
    answer: "No. All you need is a timer and a way to track your completed Pomodoros. A free online timer like GoTimer's Pomodoro Timer combined with a pen and paper is the simplest and most effective setup. Avoid overcomplicating the system with analytics dashboards — simplicity is the point."
  }
];

// ── Insert Post ──
const post_id = crypto.randomUUID();
const now = new Date().toISOString();

db.prepare(`INSERT OR REPLACE INTO blog_posts
  (id, slug, title, content, category_id, meta_title, meta_description, faq_json, status, publish_date, created_at, updated_at)
  VALUES (
    COALESCE((SELECT id FROM blog_posts WHERE slug = ?), ?),
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )`).run(
  "the-complete-guide-to-the-pomodoro-technique",  // lookup slug
  post_id,                                          // fallback id
  "the-complete-guide-to-the-pomodoro-technique",   // slug
  "The Complete Guide to the Pomodoro Technique",   // title
  content,
  final_category_id,
  "The Complete Guide to the Pomodoro Technique | GoTimer",  // meta_title (60 chars)
  "Learn the Pomodoro method step by step: find your ideal interval, avoid common mistakes, and start your first focused work session with a free online timer.", // meta_description (160 chars)
  JSON.stringify(faq_items),
  "published",
  now,
  now,
  now
);

console.log("[OK] Blog post seeded: the-complete-guide-to-the-pomodoro-technique");
console.log("[OK] Category seeded: Productivity");

db.close();
