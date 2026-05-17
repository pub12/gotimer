"use client";

import React from "react";
import type { PourOverRecipe } from "@/lib/coffee-recipes";

export function PourSchedule({ recipe }: { recipe: PourOverRecipe }) {
  return (
    <div className="w-full max-w-md mx-auto mt-2 px-4 text-xs space-y-1.5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>
          {recipe.coffee_g}g coffee · {recipe.water_g}g water · {recipe.temp_c}°C
        </span>
        <span>{recipe.ratio}</span>
      </div>
      <div className="border-t border-border/40" />
      <ul className="space-y-1">
        {recipe.stages.map((stage, idx) => (
          <li
            key={`${stage.name}-${idx}`}
            className="flex items-center justify-between gap-3 text-muted-foreground"
          >
            <span className="truncate">
              <span className="font-medium text-foreground">{stage.name}</span>
              {stage.pour_g > 0 ? (
                <>
                  {" "}· +{stage.pour_g}g → {stage.cumulative_g}g
                </>
              ) : (
                <> · hold</>
              )}
            </span>
            <span className="tabular-nums">{stage.duration}s</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
