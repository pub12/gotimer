import * as React from "react";
import { Smile, Lightbulb, PartyPopper } from "lucide-react";

import { cn } from "@/lib/utils";

const mood_icons = {
  happy: Smile,
  thinking: Lightbulb,
  celebrating: PartyPopper,
} as const;

const size_classes = {
  sm: "w-16 h-16",
  md: "w-[120px] h-[120px]",
  lg: "w-[200px] h-[200px]",
} as const;

const icon_sizes = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
} as const;

export function MascotPlaceholder({
  mood = "happy",
  size = "md",
  alt,
  className,
}: {
  mood?: "happy" | "thinking" | "celebrating";
  size?: "sm" | "md" | "lg";
  alt: string;
  className?: string;
}) {
  const Icon = mood_icons[mood];

  return (
    <div
      data-slot="mascot-placeholder"
      role="img"
      aria-label={alt}
      className={cn(
        "flex items-center justify-center rounded-[1.5rem] bg-accent/10",
        size_classes[size],
        className
      )}
    >
      <Icon className={cn("text-accent/60", icon_sizes[size])} />
    </div>
  );
}
