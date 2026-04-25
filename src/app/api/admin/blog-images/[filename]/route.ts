import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { access, rename, unlink } from "fs/promises";
import path from "path";
import { get_db } from "@/lib/db";
import {
  build_usage_map,
  rewrite_references,
  type BlogPostRow,
} from "@/lib/blog-image-references";

const UPLOAD_DIR = path.join(process.cwd(), "data", "blog-images");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function file_exists(filepath: string): Promise<boolean> {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function resolve_filename(basename: string, ext: string): Promise<string> {
  let filename = `${basename}${ext}`;
  let suffix = 2;
  while (await file_exists(path.join(UPLOAD_DIR, filename))) {
    filename = `${basename}-${suffix}${ext}`;
    suffix += 1;
  }
  return filename;
}

function safe_filename(raw: string): string | null {
  // Strip any path components and validate extension.
  const base = path.basename(raw);
  if (base !== raw) return null;
  const ext = path.extname(base).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  return base;
}

async function require_admin(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });
  if (!auth.authenticated || !auth.permission_ok) return null;
  return auth;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const auth = await require_admin(request);
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { filename: raw_filename } = await params;
  const old_filename = safe_filename(decodeURIComponent(raw_filename));
  if (!old_filename) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const old_path = path.join(UPLOAD_DIR, old_filename);
  if (!(await file_exists(old_path))) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const new_name_raw = body?.new_name;
  if (typeof new_name_raw !== "string" || !new_name_raw.trim()) {
    return NextResponse.json({ error: "new_name required" }, { status: 400 });
  }

  const basename = slugify(new_name_raw);
  if (!basename) {
    return NextResponse.json(
      { error: "Name must contain at least one letter or digit" },
      { status: 400 }
    );
  }

  const ext = path.extname(old_filename).toLowerCase();
  const new_filename = await resolve_filename(basename, ext);

  if (new_filename === old_filename) {
    return NextResponse.json({
      path: `/blog-images/${old_filename}`,
      filename: old_filename,
      posts_updated: 0,
    });
  }

  const new_path = path.join(UPLOAD_DIR, new_filename);

  const db = get_db();
  const posts = db
    .prepare(`SELECT id, title, slug, content FROM blog_posts`)
    .all() as BlogPostRow[];

  const affected = posts.filter((p) =>
    (build_usage_map([p], [old_filename]).get(old_filename) ?? []).length > 0
  );

  // Rename on disk first; if any DB write fails we'll rename back.
  await rename(old_path, new_path);

  try {
    const update_stmt = db.prepare(
      `UPDATE blog_posts SET content = ?, updated_at = datetime('now') WHERE id = ?`
    );
    const run_all = db.transaction((rows: BlogPostRow[]) => {
      for (const post of rows) {
        const new_content = rewrite_references(post.content, old_filename, new_filename);
        update_stmt.run(new_content, post.id);
      }
    });
    run_all(affected);
  } catch (err) {
    // Roll back the disk rename on DB failure.
    await rename(new_path, old_path).catch(() => {});
    return NextResponse.json(
      { error: "Failed to rewrite post references", detail: String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({
    path: `/blog-images/${new_filename}`,
    filename: new_filename,
    posts_updated: affected.length,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const auth = await require_admin(request);
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { filename: raw_filename } = await params;
  const filename = safe_filename(decodeURIComponent(raw_filename));
  if (!filename) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = path.join(UPLOAD_DIR, filename);
  if (!(await file_exists(filepath))) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const confirm = searchParams.get("confirm") === "true";

  const db = get_db();
  const posts = db
    .prepare(`SELECT id, title, slug, content FROM blog_posts`)
    .all() as BlogPostRow[];
  const used_in = build_usage_map(posts, [filename]).get(filename) ?? [];

  if (used_in.length > 0 && !confirm) {
    return NextResponse.json(
      {
        error: "File is in use. Pass confirm=true to delete anyway.",
        used_in,
      },
      { status: 409 }
    );
  }

  await unlink(filepath);
  return NextResponse.json({ deleted: filename, was_used_in: used_in.length });
}
