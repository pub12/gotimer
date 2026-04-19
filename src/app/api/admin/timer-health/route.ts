import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import fs from "fs";
import path from "path";

import { STRATEGIES, PRESETS } from "@/lib/timer-registry";
import { STRATEGY_REGISTRY } from "@/lib/timer-strategies";
import {
  validate_registry_consistency,
  validate_against_strategy_registry,
  validate_routes,
} from "@/lib/timer-registry-validator";

type HealthEntry = {
  id: string;
  name: string;
  kind: "strategy" | "preset";
  category?: string;
  strategy?: string;
  in_registry: boolean;
  has_route: boolean;
  in_api: boolean;
};

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request, {
    required_permissions: ["admin_view_all_games"],
    strict: false,
  });

  if (!auth.authenticated || !auth.permission_ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Run all three validation checks
  const consistency = validate_registry_consistency();
  const strategy_cross = validate_against_strategy_registry(
    Object.keys(STRATEGY_REGISTRY),
  );
  const app_dir = path.join(process.cwd(), "src", "app");
  const routes = await validate_routes(app_dir);

  const errors = [
    ...consistency.errors,
    ...strategy_cross.errors,
    ...routes.errors,
  ];
  const warnings = [
    ...consistency.warnings,
    ...strategy_cross.warnings,
    ...routes.warnings,
  ];

  // Build entries for strategies
  const entries: HealthEntry[] = [];

  const api_timer_ids = new Set(Object.keys(STRATEGIES));

  for (const [id, strategy] of Object.entries(STRATEGIES)) {
    const route_dir = path.join(app_dir, ...strategy.route.split("/").filter(Boolean));
    entries.push({
      id,
      name: strategy.name,
      kind: "strategy",
      in_registry: true,
      has_route: fs.existsSync(route_dir),
      in_api: api_timer_ids.has(id),
    });
  }

  // Build entries for presets
  for (const [id, preset] of Object.entries(PRESETS)) {
    const route_dir = path.join(app_dir, ...preset.route.split("/").filter(Boolean));
    entries.push({
      id,
      name: preset.name,
      kind: "preset",
      category: preset.category,
      strategy: preset.strategy,
      in_registry: true,
      has_route: fs.existsSync(route_dir),
      in_api: false, // presets are not directly in the /api/v1/timers response
    });
  }

  // Check for orphan strategies (in STRATEGY_REGISTRY but not in timer-registry)
  const registry_strategy_ids = new Set(Object.keys(STRATEGIES));
  for (const key of Object.keys(STRATEGY_REGISTRY)) {
    if (!registry_strategy_ids.has(key)) {
      entries.push({
        id: key,
        name: key,
        kind: "strategy",
        in_registry: false,
        has_route: false,
        in_api: false,
      });
    }
  }

  return NextResponse.json({ entries, errors, warnings });
}
