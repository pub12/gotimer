import { NextRequest, NextResponse } from "next/server";
import { verify_blog_api_key, unauthorized_response } from "@/lib/blog-api-auth";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * API key-authenticated image upload endpoint.
 * Downloads an image from a URL and stores it locally for use in blog posts.
 *
 * POST /api/blog/images — Download and store a blog image
 */

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "data", "blog-images");

function get_extension(content_type: string): string {
  switch (content_type) {
    case "image/jpeg": return ".jpg";
    case "image/webp": return ".webp";
    default: return ".png";
  }
}

function sanitize_filename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  if (!verify_blog_api_key(request)) {
    return unauthorized_response();
  }

  const body = await request.json();
  const { image_url, filename, alt } = body;

  if (!image_url || typeof image_url !== "string" || !image_url.startsWith("http")) {
    return NextResponse.json(
      { error: "Valid image_url required" },
      { status: 400 }
    );
  }

  const res = await fetch(image_url);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to download image from URL" },
      { status: 400 }
    );
  }

  const remote_type = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!ALLOWED_TYPES.includes(remote_type)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${remote_type}. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image exceeds 5MB limit" },
      { status: 400 }
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  let final_filename: string;
  if (filename) {
    final_filename = sanitize_filename(filename);
    // Ensure it has a valid extension
    if (!/\.(png|jpe?g|webp)$/i.test(final_filename)) {
      final_filename += get_extension(remote_type);
    }
  } else {
    final_filename = `${randomUUID()}${get_extension(remote_type)}`;
  }

  await writeFile(path.join(UPLOAD_DIR, final_filename), buffer);

  const image_path = `/blog-images/${final_filename}`;

  return NextResponse.json({
    success: true,
    path: image_path,
    alt: alt ?? "",
  }, { status: 201 });
}
