/**
 * Generate mascot images for the GoTimer site UI using Runware API.
 * Uses the Adventure Explorers chibi toy figurine style.
 * Run with: npx tsx scripts/generate-mascot-images.ts
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const API = "https://api.runware.ai/v1";
const TOKEN = "BxkgqFxpT8uOBioCc0qa6wFqUOmUjcXy";
const STYLE = "chibi toy figurine cartoon style, oversized round head with large expressive eyes, short stubby body with big hands, detailed costume and accessories, bold clean black outlines, vibrant flat colors, collectible action figure aesthetic, kid-friendly but characterful design, simple white background, full body visible";
const NEG = "realistic, photorealistic, 3D render, nsfw, text, words, numbers, watermark, elongated body, tall thin proportions, mature adult, scary, violent, ugly";

const OUTPUT_DIR = path.resolve(__dirname, "../public/mascots");
const BLOG_DIR = path.resolve(__dirname, "../public/blog");

interface ImageJob {
  name: string;
  prompt: string;
  output_dir: string;
  filename: string;
}

const JOBS: ImageJob[] = [
  // Homepage / Timer pages — Drake with a stopwatch
  {
    name: "Drake with timer",
    prompt: "rugged male explorer in battered wide-brim fedora hat and worn leather jacket, holding a large round stopwatch timer in one hand, pointing at it with excited determined expression, bullwhip at belt",
    output_dir: OUTPUT_DIR,
    filename: "drake-timer.png",
  },
  // Blog / Study — Prof studying with books
  {
    name: "Prof studying",
    prompt: "elderly professor with wild white hair and round spectacles, worn tweed jacket with elbow patches, sitting at desk surrounded by books and a small tomato-shaped kitchen timer, focused scholarly expression, reading a large book",
    output_dir: OUTPUT_DIR,
    filename: "prof-studying.png",
  },
  // Challenges / Leaderboard — Scout celebrating victory
  {
    name: "Scout victory",
    prompt: "female archaeologist in khaki field jacket and cargo pants, holding a golden trophy cup high above head with one hand, excited triumphant expression, confetti falling around her",
    output_dir: OUTPUT_DIR,
    filename: "scout-victory.png",
  },
  // Empty state — Drake searching
  {
    name: "Drake searching",
    prompt: "rugged male explorer in battered wide-brim fedora hat and worn leather jacket, looking through binoculars with curious searching expression, standing on a small rock, bullwhip at belt",
    output_dir: OUTPUT_DIR,
    filename: "drake-searching.png",
  },
  // Blog Pomodoro article hero image
  {
    name: "Prof with pomodoro timer",
    prompt: "elderly professor with wild white hair and round spectacles, worn tweed jacket with elbow patches, holding a bright red tomato-shaped kitchen timer in one hand and pointing at it with the other hand, enthusiastic teaching expression, small chalkboard behind with '25:00' written on it",
    output_dir: BLOG_DIR,
    filename: "pomodoro-technique-guide-hero.jpg",
  },
  // Blog — Pomodoro cycle diagram placeholder (Prof at chalkboard)
  {
    name: "Prof at chalkboard",
    prompt: "elderly professor with wild white hair and round spectacles, worn tweed jacket with elbow patches, standing next to a large chalkboard with circular diagram drawn on it, pointing at the board with a wooden pointer, excited teaching expression",
    output_dir: BLOG_DIR,
    filename: "pomodoro-cycle-diagram.png",
  },
  // Blog — interruption strategy (Scout focused)
  {
    name: "Scout focused work",
    prompt: "female archaeologist in khaki field jacket and cargo pants, sitting at a desk with intense focus, one hand raised in 'stop' gesture to someone off-screen, other hand writing in notebook, determined concentrated expression",
    output_dir: BLOG_DIR,
    filename: "pomodoro-interruption-strategy.png",
  },
  // Blog — interval comparison (Drake with multiple timers)
  {
    name: "Drake with timers",
    prompt: "rugged male explorer in battered wide-brim fedora hat and worn leather jacket, juggling three different sized stopwatches and clocks in the air, playful amazed expression, bullwhip at belt",
    output_dir: BLOG_DIR,
    filename: "pomodoro-interval-comparison.png",
  },
  // Blog — minimal setup (Scout with notebook)
  {
    name: "Scout minimal setup",
    prompt: "female archaeologist in khaki field jacket and cargo pants, sitting cross-legged on floor with just a simple notebook and pencil and a small timer beside her, peaceful content expression, minimalist scene",
    output_dir: BLOG_DIR,
    filename: "pomodoro-minimal-setup.jpg",
  },
  // Board games page — all three playing a board game
  {
    name: "Group playing games",
    prompt: "three chibi characters sitting around a table playing a board game together: a rugged explorer in fedora, a female archaeologist in khaki jacket, and an elderly professor with wild white hair and spectacles, all laughing and having fun, game board and dice on table",
    output_dir: OUTPUT_DIR,
    filename: "group-board-game.png",
  },
];

async function generate_image(job: ImageJob): Promise<string | null> {
  const task_uuid = crypto.randomUUID();

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify([
        {
          taskType: "imageInference",
          taskUUID: task_uuid,
          positivePrompt: `${job.prompt} ${STYLE}`,
          negativePrompt: NEG,
          model: "runware:101@1",
          width: 1024,
          height: 1024,
          numberResults: 1,
          outputFormat: job.filename.endsWith(".jpg") ? "JPEG" : "PNG",
          outputType: "URL",
        },
      ]),
    });

    const data = await res.json();
    const url = data?.data?.[0]?.imageURL;

    if (!url) {
      console.error(`[FAIL] ${job.name}: No URL in response`, JSON.stringify(data).slice(0, 200));
      return null;
    }

    // Download the image
    const img_res = await fetch(url);
    const buffer = Buffer.from(await img_res.arrayBuffer());
    const out_path = path.join(job.output_dir, job.filename);
    fs.writeFileSync(out_path, buffer);
    console.log(`[OK] ${job.name} → ${out_path} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return out_path;
  } catch (err) {
    console.error(`[FAIL] ${job.name}:`, err);
    return null;
  }
}

async function main() {
  console.log(`Generating ${JOBS.length} mascot images...\n`);

  // Run 2 at a time to avoid rate limits
  for (let i = 0; i < JOBS.length; i += 2) {
    const batch = JOBS.slice(i, i + 2);
    const results = await Promise.all(batch.map((job) => generate_image(job)));
    const success = results.filter(Boolean).length;
    console.log(`  Batch ${Math.floor(i / 2) + 1}: ${success}/${batch.length} succeeded\n`);
  }

  console.log("Done!");
}

main();
