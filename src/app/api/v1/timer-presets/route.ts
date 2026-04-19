import { NextRequest, NextResponse } from "next/server";
import {
  PRESETS,
  REGISTRY_CATEGORY_SLUGS,
} from "@/lib/timer-registry";

// GET /api/v1/timer-presets?category=fitness — public, no auth required
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (category && !REGISTRY_CATEGORY_SLUGS.includes(category)) {
    return NextResponse.json(
      {
        status: "error",
        error: `Invalid category. Must be one of: ${REGISTRY_CATEGORY_SLUGS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const all_presets = Object.values(PRESETS);
  const filtered = category
    ? all_presets.filter((p) => p.category === category)
    : all_presets;

  const presets = filtered.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    strategy: p.strategy,
    category: p.category,
    default_config: p.defaultConfig,
  }));

  return NextResponse.json({
    status: "ok",
    data: {
      presets,
      categories: REGISTRY_CATEGORY_SLUGS,
    },
  });
}
