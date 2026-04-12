import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "data", "blog-images");

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!/^[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = path.join(STORAGE_DIR, filename);

  if (!existsSync(filepath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const content_type = MIME_TYPES[ext] ?? "application/octet-stream";
  const buffer = await readFile(filepath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": content_type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
