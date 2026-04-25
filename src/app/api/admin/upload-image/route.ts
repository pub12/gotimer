import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { randomUUID } from "crypto";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "data", "blog-images");

function get_extension(content_type: string): string {
  switch (content_type) {
    case "image/png": return ".png";
    case "image/jpeg": return ".jpg";
    case "image/webp": return ".webp";
    default: return ".png";
  }
}

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

async function save_image(
  buffer: Buffer,
  content_type: string,
  friendly_name: string | null
): Promise<{ path: string; filename: string }> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = get_extension(content_type);
  const basename = friendly_name ? slugify(friendly_name) : "";
  const filename = basename
    ? await resolve_filename(basename, ext)
    : `${randomUUID()}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  await writeFile(filepath, buffer);
  return { path: `/blog-images/${filename}`, filename };
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const content_type = request.headers.get("content-type") ?? "";

  // JSON body with { url: "https://..." } — download and store
  if (content_type.includes("application/json")) {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to download image" }, { status: 400 });
    }

    const remote_type = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!ALLOWED_TYPES.includes(remote_type)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${remote_type}. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const array_buffer = await res.arrayBuffer();
    const buffer = Buffer.from(array_buffer);

    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: "Image exceeds 5MB limit" }, { status: 400 });
    }

    const saved = await save_image(buffer, remote_type, null);
    return NextResponse.json(saved, { status: 201 });
  }

  // Multipart form data — direct file upload
  if (content_type.includes("multipart/form-data")) {
    const form_data = await request.formData();
    const file = form_data.get("file");
    const name_raw = form_data.get("name");
    const friendly_name =
      typeof name_raw === "string" && name_raw.trim() ? name_raw.trim() : null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file field required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image exceeds 5MB limit" }, { status: 400 });
    }

    const array_buffer = await file.arrayBuffer();
    const buffer = Buffer.from(array_buffer);

    // If friendly_name is present but slugifies to empty, reject rather than silently falling back to UUID.
    if (friendly_name !== null && !friendly_name.replace(/[^a-z0-9]/gi, "")) {
      return NextResponse.json(
        { error: "Name must contain at least one letter or digit" },
        { status: 400 }
      );
    }

    const saved = await save_image(buffer, file.type, friendly_name);
    return NextResponse.json(saved, { status: 201 });
  }

  return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
}
