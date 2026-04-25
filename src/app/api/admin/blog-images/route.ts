import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { readdir, stat, unlink, mkdir } from "fs/promises";
import path from "path";
import { get_db } from "@/lib/db";
import {
  build_usage_map,
  type BlogPostRow,
} from "@/lib/blog-image-references";

const UPLOAD_DIR = path.join(process.cwd(), "data", "blog-images");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function list_image_files(): Promise<string[]> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const entries = await readdir(UPLOAD_DIR);
  return entries.filter((name) =>
    ALLOWED_EXT.has(path.extname(name).toLowerCase())
  );
}

async function require_admin(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });
  if (!auth.authenticated || !auth.permission_ok) return null;
  return auth;
}

export async function GET(request: NextRequest) {
  const auth = await require_admin(request);
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const filenames = await list_image_files();

  const db = get_db();
  const posts = db
    .prepare(`SELECT id, title, slug, content FROM blog_posts`)
    .all() as BlogPostRow[];

  const usage = build_usage_map(posts, filenames);

  const stats = await Promise.all(
    filenames.map(async (filename) => {
      const filepath = path.join(UPLOAD_DIR, filename);
      const s = await stat(filepath);
      return {
        filename,
        path: `/blog-images/${filename}`,
        size: s.size,
        uploaded_at: s.mtime.toISOString(),
        used_in: usage.get(filename) ?? [],
      };
    })
  );

  // Sort newest first
  stats.sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));

  return NextResponse.json({ images: stats });
}

export async function DELETE(request: NextRequest) {
  const auth = await require_admin(request);
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  if (searchParams.get("unused") !== "true") {
    return NextResponse.json(
      { error: "Only unused=true is supported" },
      { status: 400 }
    );
  }

  const filenames = await list_image_files();

  const db = get_db();
  const posts = db
    .prepare(`SELECT id, title, slug, content FROM blog_posts`)
    .all() as BlogPostRow[];

  const usage = build_usage_map(posts, filenames);
  const unused = filenames.filter((fn) => (usage.get(fn) ?? []).length === 0);

  let deleted = 0;
  for (const filename of unused) {
    try {
      await unlink(path.join(UPLOAD_DIR, filename));
      deleted += 1;
    } catch {
      // continue — file already gone or permission issue
    }
  }

  return NextResponse.json({ deleted });
}
