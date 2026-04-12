/**
 * Regenerate mascot images with transparent backgrounds.
 * Run with: npx tsx scripts/generate-mascot-transparent.ts
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const API = "https://api.runware.ai/v1";
const TOKEN = "BxkgqFxpT8uOBioCc0qa6wFqUOmUjcXy";
const STYLE = "chibi toy figurine cartoon style, oversized round head with large expressive eyes, short stubby body with big hands, detailed costume and accessories, bold clean black outlines, vibrant flat colors, collectible action figure aesthetic, kid-friendly but characterful design, transparent background, PNG with alpha transparency, isolated character, no background, full body visible";
const NEG = "realistic, photorealistic, 3D render, nsfw, text, words, numbers, watermark, elongated body, tall thin proportions, mature adult, scary, violent, ugly, white background, gray background, colored background, gradient background, scenery behind character";

const OUTPUT_DIR = path.resolve(__dirname, "../public/mascots");
const BLOG_DIR = path.resolve(__dirname, "../public/blog");

interface ImageJob {
  name: string;
  prompt: string;
  output_dir: string;
  filename: string;
}

const JOBS: ImageJob[] = [
  {
    name: "Drake with timer",
    prompt: "rugged male explorer in battered wide-brim fedora hat and worn leather jacket, holding a large round stopwatch timer in one hand, pointing at it with excited determined expression, bullwhip at belt, isolated character on transparent background",
    output_dir: OUTPUT_DIR,
    filename: "drake-timer.png",
  },
  {
    name: "Prof studying",
    prompt: "elderly professor with wild white hair and round spectacles, worn tweed jacket with elbow patches, sitting at desk reading a large book with a small tomato-shaped kitchen timer beside him, focused scholarly expression, isolated on transparent background",
    output_dir: OUTPUT_DIR,
    filename: "prof-studying.png",
  },
  {
    name: "Scout victory",
    prompt: "female archaeologist in khaki field jacket and cargo pants, holding a golden trophy cup high above head with one hand, excited triumphant expression, confetti falling, isolated character on transparent background",
    output_dir: OUTPUT_DIR,
    filename: "scout-victory.png",
  },
  {
    name: "Drake searching",
    prompt: "rugged male explorer in battered wide-brim fedora hat and worn leather jacket, looking through binoculars with curious searching expression, standing on a small rock, bullwhip at belt, isolated character on transparent background",
    output_dir: OUTPUT_DIR,
    filename: "drake-searching.png",
  },
  {
    name: "Group playing games",
    prompt: "three chibi characters sitting around a table playing a board game: a rugged explorer in fedora, a female archaeologist in khaki, and an elderly professor with wild white hair and spectacles, all laughing, game board and dice on table, isolated on transparent background",
    output_dir: OUTPUT_DIR,
    filename: "group-board-game.png",
  },
  {
    name: "Prof with pomodoro timer",
    prompt: "elderly professor with wild white hair and round spectacles, worn tweed jacket with elbow patches, holding a bright red tomato-shaped kitchen timer, enthusiastic teaching expression, isolated character on transparent background",
    output_dir: BLOG_DIR,
    filename: "pomodoro-technique-guide-hero.png",
  },
  {
    name: "Prof at chalkboard",
    prompt: "elderly professor with wild white hair and round spectacles, worn tweed jacket, standing next to a chalkboard with circular diagram drawn on it, pointing with wooden pointer, excited teaching expression, isolated on transparent background",
    output_dir: BLOG_DIR,
    filename: "pomodoro-cycle-diagram.png",
  },
  {
    name: "Scout focused work",
    prompt: "female archaeologist in khaki field jacket and cargo pants, sitting at desk with intense focus, one hand raised in stop gesture, other hand writing in notebook, determined concentrated expression, isolated on transparent background",
    output_dir: BLOG_DIR,
    filename: "pomodoro-interruption-strategy.png",
  },
  {
    name: "Drake with timers",
    prompt: "rugged male explorer in battered wide-brim fedora hat and worn leather jacket, juggling three different sized stopwatches and clocks in the air, playful amazed expression, bullwhip at belt, isolated on transparent background",
    output_dir: BLOG_DIR,
    filename: "pomodoro-interval-comparison.png",
  },
  {
    name: "Scout minimal setup",
    prompt: "female archaeologist in khaki field jacket and cargo pants, sitting cross-legged with just a notebook and pencil and a small timer, peaceful content expression, isolated on transparent background",
    output_dir: BLOG_DIR,
    filename: "pomodoro-minimal-setup.png",
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
          outputFormat: "PNG",
          outputType: "URL",
        },
      ]),
    });

    const data = await res.json();
    const url = data?.data?.[0]?.imageURL;

    if (!url) {
      console.error(`[FAIL] ${job.name}: No URL`, JSON.stringify(data).slice(0, 200));
      return null;
    }

    const img_res = await fetch(url);
    const buffer = Buffer.from(await img_res.arrayBuffer());
    const out_path = path.join(job.output_dir, job.filename);
    fs.writeFileSync(out_path, buffer);
    console.log(`[OK] ${job.name} → ${job.filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return out_path;
  } catch (err) {
    console.error(`[FAIL] ${job.name}:`, err);
    return null;
  }
}

async function main() {
  console.log(`Regenerating ${JOBS.length} images with transparent backgrounds...\n`);

  for (let i = 0; i < JOBS.length; i += 2) {
    const batch = JOBS.slice(i, i + 2);
    await Promise.all(batch.map((job) => generate_image(job)));
    console.log("");
  }

  console.log("Done! Now resize for web...");
}

main();
