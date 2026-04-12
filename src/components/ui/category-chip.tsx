"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function CategoryChip({
  label,
  active = false,
  onClick,
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  label: string
  active?: boolean
  icon?: LucideIcon
}) {
  return (
    <button
      data-slot="category-chip"
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105",
        active
          ? "bg-accent/15 text-accent font-semibold"
          : "bg-surface-container text-muted-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </button>
  )
}

export { CategoryChip }
