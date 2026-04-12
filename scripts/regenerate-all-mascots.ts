/**
 * Regenerate ALL mascot images using the updated Pixar-quality prompts
 * from docs/design/adventure-explorers.md
 * Run with: npx tsx scripts/regenerate-all-mascots.ts
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const API = "https://api.runware.ai/v1";
const TOKEN = "BxkgqFxpT8uOBioCc0qa6wFqUOmUjcXy";

// Master Style Suffix — verbatim from adventure-explorers.md
const STYLE = `3D rendered chibi toy figurine, Pixar-quality CGI render, head is roughly half the total body height, big round chubby head with soft rosy cheeks, large round expressive eyes with bright white highlight reflections, tiny cute button nose, small cheerful mouth, short stubby arms and legs, chubby rounded hands, smooth warm skin with subtle soft-shading, warm soft studio lighting with a gentle rim light on the left, highly detailed fabric texture on costume including visible stitching and buckle details, standing upright on both feet facing slightly forward, pure white background, full body visible from top of hat to bottom of boots, no shadows on ground, ultra high quality render, sharp focus`;

// Master Negative Prompt — verbatim from adventure-explorers.md
const NEG = `2D illustration, flat art, anime, sketch, watercolor, painting, realistic human proportions, elongated body, tall figure, scary, dark, violent, ugly, deformed, blurry, low quality, text, words, numbers, watermark, logo, signature, multiple characters in one image, group shot, nsfw, checkered background, dark background, grey background`;

const MASCOT_DIR = path.resolve(__dirname, "../public/mascots");
const BLOG_DIR = path.resolve(__dirname, "../public/blog");

// Base character prompts from the doc
const DRAKE_BASE = `single male chibi character named Drake the Explorer, wearing a weathered cognac-brown wide-brim leather fedora hat with a dark brown hatband, wearing a warm tan-brown distressed leather jacket with a collar turned up slightly and rolled sleeves, wearing dark olive-green cargo pants with side pockets, wearing dark brown leather lace-up boots, a coiled brown leather bullwhip hanging from his left hip belt loop, a worn tan canvas satchel bag strap crossing his chest right-to-left, short dark brown hair peeking under hat brim, light warm tan skin tone with very slight stubble on chin`;

const SCOUT_BASE = `single female chibi character named Scout the Archaeologist, wearing a khaki safari field jacket with two large chest pockets with flap buttons and slightly rolled-up sleeves, wearing olive-green cargo pants with side zip pockets, wearing dark brown leather ankle boots, wearing a tan wide-brim safari hat with a dark band, long dark brown hair in a ponytail coming through the back of the hat, warm tan skin with rosy cheeks`;

const PROF_BASE = `single elderly male chibi character named Prof the Ancient Scholar, wearing a worn warm-brown tweed jacket with large tan elbow patches and visible herringbone texture, wearing a light blue collared shirt underneath with a loosely knotted dark green tie, wearing dark brown trousers, wearing brown leather oxford shoes, wild voluminous white and grey hair sticking out in all directions from sides and back of head bald on top, a thick white bushy mustache and short white beard, large round gold-framed spectacles with thick lenses sitting low on his nose, pale-fair wrinkled skin`;

interface ImageJob {
  name: string;
  prompt: string;
  dir: string;
  filename: string;
}

const JOBS: ImageJob[] = [
  // ── Site mascots ──
  {
    name: "Drake with timer (hero)",
    prompt: `${DRAKE_BASE}, holding a large shiny round pocket watch in his right hand showing it to the viewer, confident slightly smug expression with one eyebrow raised and a small smirk`,
    dir: MASCOT_DIR,
    filename: "drake-timer.png",
  },
  {
    name: "Prof studying (blog)",
    prompt: `${PROF_BASE}, sitting at a small wooden desk reading a large open red book, a small red tomato-shaped kitchen timer on the desk beside him, expression of focused concentration with eyes looking down at book`,
    dir: MASCOT_DIR,
    filename: "prof-studying.png",
  },
  {
    name: "Scout victory (leaderboard)",
    prompt: `${SCOUT_BASE}, holding a shiny golden trophy cup high above her head with her right hand, left hand on hip in a power pose, very wide excited sparkling eyes and a big open-mouthed joyful triumphant smile, small pieces of colorful confetti in the air around her`,
    dir: MASCOT_DIR,
    filename: "scout-victory.png",
  },
  {
    name: "Drake searching (empty state)",
    prompt: `${DRAKE_BASE}, looking through a pair of brass binoculars held with both hands, curious searching expression with one eyebrow raised, standing on a small grey rock`,
    dir: MASCOT_DIR,
    filename: "drake-searching.png",
  },
  {
    name: "Group board game",
    prompt: `three chibi toy figurine characters sitting around a small wooden table playing a colorful board game together, left character is a male explorer in a brown fedora hat and leather jacket, center character is a female in a khaki safari jacket with a ponytail, right character is an elderly man with wild white hair and round gold spectacles and a tweed jacket, all three are laughing with joyful expressions, colorful game board with small pieces and dice on the table, 3D rendered Pixar-quality CGI, warm soft studio lighting, pure white background, ultra high quality render, sharp focus`,
    dir: MASCOT_DIR,
    filename: "group-board-game.png",
  },
  // ── Blog article images ──
  {
    name: "Prof pomodoro hero",
    prompt: `${PROF_BASE}, holding a bright red shiny tomato-shaped kitchen timer in his raised right hand showing it proudly, left hand pointing at it, expression of delighted enthusiasm with wide eyes and open mouth as if teaching about it`,
    dir: BLOG_DIR,
    filename: "pomodoro-technique-guide-hero.png",
  },
  {
    name: "Prof at chalkboard",
    prompt: `${PROF_BASE}, standing next to a green chalkboard with a simple circular diagram drawn in white chalk, holding a wooden pointer in his right hand pointing at the diagram, expression of delighted surprise with wide eyes and open mouth as if just explained something`,
    dir: BLOG_DIR,
    filename: "pomodoro-cycle-diagram.png",
  },
  {
    name: "Scout focused work",
    prompt: `${SCOUT_BASE}, sitting at a small desk writing in a notebook with a pencil in her right hand, left hand raised palm-out in a stop gesture, determined focused expression with slightly furrowed brows, a small timer on the desk`,
    dir: BLOG_DIR,
    filename: "pomodoro-interruption-strategy.png",
  },
  {
    name: "Drake juggling timers",
    prompt: `${DRAKE_BASE}, juggling three different sized clocks and stopwatches in the air above his head, looking up at them with an amazed wide-eyed playful grin, arms raised`,
    dir: BLOG_DIR,
    filename: "pomodoro-interval-comparison.png",
  },
  {
    name: "Scout minimal setup",
    prompt: `${SCOUT_BASE}, sitting cross-legged on the ground with a simple small notebook and pencil in her lap and a small round timer beside her, peaceful content expression with a gentle closed-mouth smile and relaxed eyes`,
    dir: BLOG_DIR,
    filename: "pomodoro-minimal-setup.png",
  },
];

async function generate(job: ImageJob): Promise<boolean> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify([{
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: `${job.prompt}, ${STYLE}`,
        negativePrompt: NEG,
        model: "runware:101@1",
        width: 1024, height: 1024,
        numberResults: 1, outputFormat: "PNG", outputType: "URL",
      }]),
    });
    const data = await res.json() as { data?: { imageURL: string }[] };
    const url = data?.data?.[0]?.imageURL;
    if (!url) { console.error(`[FAIL] ${job.name}`); return false; }

    const img = await fetch(url);
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(path.join(job.dir, job.filename), buf);
    console.log(`[OK] ${job.name} → ${job.filename}`);
    return true;
  } catch (e) {
    console.error(`[FAIL] ${job.name}:`, e);
    return false;
  }
}

async function main() {
  console.log(`Generating ${JOBS.length} images with Pixar-quality prompts...\n`);
  // 2 at a time
  for (let i = 0; i < JOBS.length; i += 2) {
    const batch = JOBS.slice(i, i + 2);
    await Promise.all(batch.map(generate));
  }
  console.log("\nDone! Run background removal + resize next.");
}

main();
