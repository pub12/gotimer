/**
 * Timer Registry Validator
 *
 * Validates the timer registry for consistency, cross-references against
 * STRATEGY_REGISTRY, and checks that route directories exist.
 */

import {
  STRATEGIES,
  PRESETS,
  CATEGORIES,
  REGISTRY_CATEGORY_SLUGS,
} from "./timer-registry";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// 1. Internal consistency
// ---------------------------------------------------------------------------

export function validate_registry_consistency(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const strategyIds = Object.keys(STRATEGIES);
  const presetIds = Object.keys(PRESETS);
  const categorySlugSet = new Set(REGISTRY_CATEGORY_SLUGS);

  // --- No duplicate strategy IDs (Record keys are unique by nature, but
  //     the id field inside might diverge from the key) ---
  const seenStrategyIds = new Set<string>();
  for (const [key, def] of Object.entries(STRATEGIES)) {
    if (def.id !== key) {
      errors.push(
        `Strategy key "${key}" does not match its id field "${def.id}"`,
      );
    }
    if (seenStrategyIds.has(def.id)) {
      errors.push(`Duplicate strategy ID: "${def.id}"`);
    }
    seenStrategyIds.add(def.id);
  }

  // --- No duplicate preset IDs ---
  const seenPresetIds = new Set<string>();
  for (const [key, def] of Object.entries(PRESETS)) {
    if (def.id !== key) {
      errors.push(
        `Preset key "${key}" does not match its id field "${def.id}"`,
      );
    }
    if (seenPresetIds.has(def.id)) {
      errors.push(`Duplicate preset ID: "${def.id}"`);
    }
    seenPresetIds.add(def.id);
  }

  // --- Every preset's strategy field matches a valid strategy ID ---
  for (const [key, preset] of Object.entries(PRESETS)) {
    if (!seenStrategyIds.has(preset.strategy)) {
      errors.push(
        `Preset "${key}" references unknown strategy "${preset.strategy}"`,
      );
    }
  }

  // --- Every preset's category field matches a valid category slug ---
  for (const [key, preset] of Object.entries(PRESETS)) {
    if (!categorySlugSet.has(preset.category)) {
      errors.push(
        `Preset "${key}" references unknown category "${preset.category}"`,
      );
    }
  }

  // --- Every category's featuredTimers entries are valid preset IDs in
  //     that category ---
  for (const [slug, cat] of Object.entries(CATEGORIES)) {
    for (const timerId of cat.featuredTimers) {
      const preset = PRESETS[timerId];
      if (!preset) {
        errors.push(
          `Category "${slug}" features unknown preset "${timerId}"`,
        );
      } else if (preset.category !== slug) {
        errors.push(
          `Category "${slug}" features preset "${timerId}" which belongs to category "${preset.category}"`,
        );
      }
    }
  }

  // --- Warn if a preset ID shadows a strategy ID ---
  for (const presetId of presetIds) {
    if (seenStrategyIds.has(presetId)) {
      warnings.push(
        `Preset ID "${presetId}" shadows strategy ID "${presetId}"`,
      );
    }
  }

  // --- Warn if a category has no presets ---
  for (const slug of REGISTRY_CATEGORY_SLUGS) {
    const presetsInCategory = Object.values(PRESETS).filter(
      (p) => p.category === slug,
    );
    if (presetsInCategory.length === 0) {
      warnings.push(`Category "${slug}" has no presets`);
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 2. Cross-reference against STRATEGY_REGISTRY
// ---------------------------------------------------------------------------

export function validate_against_strategy_registry(
  strategy_registry_keys: string[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const registryStrategyIds = new Set(Object.keys(STRATEGIES));
  const externalKeys = new Set(strategy_registry_keys);

  // Every key in STRATEGY_REGISTRY should have a matching timer registry entry
  for (const key of strategy_registry_keys) {
    if (!registryStrategyIds.has(key)) {
      errors.push(
        `STRATEGY_REGISTRY key "${key}" has no matching entry in timer registry STRATEGIES`,
      );
    }
  }

  // Every timer registry strategy should have a matching STRATEGY_REGISTRY key
  for (const id of Array.from(registryStrategyIds)) {
    if (!externalKeys.has(id)) {
      errors.push(
        `Timer registry strategy "${id}" has no matching key in STRATEGY_REGISTRY`,
      );
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 3. Route directory validation
// ---------------------------------------------------------------------------

export async function validate_routes(
  app_dir: string,
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Dynamic import to keep this file importable on client
  const fs = await import("fs");
  const path = await import("path");

  const checkedPaths = new Set<string>();

  function check_route(label: string, route: string) {
    // route is e.g. "/countdown" or "/board-games/countdown"
    // Map to directory under app_dir: strip leading slash
    const dirPath = path.join(app_dir, ...route.split("/").filter(Boolean));
    if (checkedPaths.has(dirPath)) return; // skip duplicates
    checkedPaths.add(dirPath);

    if (!fs.existsSync(dirPath)) {
      errors.push(`${label} route directory missing: ${dirPath}`);
    }
  }

  // Strategy routes
  for (const [id, strategy] of Object.entries(STRATEGIES)) {
    check_route(`Strategy "${id}"`, strategy.route);
  }

  // Preset routes
  for (const [id, preset] of Object.entries(PRESETS)) {
    check_route(`Preset "${id}"`, preset.route);
  }

  // Category routes (categories use the slug as the route)
  for (const slug of REGISTRY_CATEGORY_SLUGS) {
    check_route(`Category "${slug}"`, `/${slug}`);
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// 4. Run all dev validations
// ---------------------------------------------------------------------------

export async function run_dev_validation(
  strategy_registry_keys: string[],
  app_dir: string,
): Promise<void> {
  const results: Array<{ name: string; result: ValidationResult }> = [];

  // Run sync validations
  results.push({
    name: "Registry consistency",
    result: validate_registry_consistency(),
  });
  results.push({
    name: "Strategy registry cross-reference",
    result: validate_against_strategy_registry(strategy_registry_keys),
  });

  // Run async validation
  results.push({
    name: "Route directories",
    result: await validate_routes(app_dir),
  });

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const { name, result } of results) {
    for (const warning of result.warnings) {
      console.warn(`⚠️ [${name}] ${warning}`);
      totalWarnings++;
    }
    for (const error of result.errors) {
      console.error(`❌ [${name}] ${error}`);
      totalErrors++;
    }
  }

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log("✓ Timer registry validation passed with no issues");
  } else if (totalErrors === 0) {
    console.log(
      `✓ Timer registry validation passed with ${totalWarnings} warning(s)`,
    );
  }

  if (totalErrors > 0) {
    throw new Error(
      `Timer registry validation failed with ${totalErrors} error(s) and ${totalWarnings} warning(s)`,
    );
  }
}
