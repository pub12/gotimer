import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = get_db();
  const categories = db
    .prepare(`SELECT * FROM blog_categories ORDER BY name ASC`)
    .all();

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { slug, name, description, colour } = body as {
    slug?: string;
    name?: string;
    description?: string;
    colour?: string;
  };

  if (!slug || !name) {
    return NextResponse.json({ error: "slug and name are required" }, { status: 400 });
  }

  const db = get_db();

  // Check for duplicate slug
  const existing = db
    .prepare(`SELECT id FROM blog_categories WHERE slug = ?`)
    .get(slug);

  if (existing) {
    return NextResponse.json({ error: "A category with that slug already exists" }, { status: 409 });
  }

  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO blog_categories (id, slug, name, description, colour)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, slug, name, description ?? null, colour ?? null);

  const category = db
    .prepare(`SELECT * FROM blog_categories WHERE id = ?`)
    .get(id);

  return NextResponse.json(category, { status: 201 });
}
