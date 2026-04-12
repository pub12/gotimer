"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const avatarSizeVariants = cva(
  "relative rounded-full shadow-[var(--shadow-soft)] overflow-hidden shrink-0",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
        xl: "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

function Avatar({
  className,
  src,
  fallback,
  size,
  rank,
  alt,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof avatarSizeVariants> & {
    src?: string
    fallback: string
    rank?: number
    alt?: string
  }) {
  return (
    <div className={cn("relative inline-flex", className)} {...props}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(avatarSizeVariants({ size }))}
      >
        {src && (
          <AvatarPrimitive.Image
            src={src}
            alt={alt || fallback}
            className="h-full w-full object-cover"
          />
        )}
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center bg-surface-container text-on-surface-variant font-headline font-black text-sm"
        >
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {rank !== undefined && (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-[10px] font-bold shadow-[var(--shadow-soft)]">
          {rank}
        </span>
      )}
    </div>
  )
}

export { Avatar, avatarSizeVariants }
