import * as React from "react"

import { cn } from "@/lib/utils"

const headingSizes = {
  h1: "text-3xl md:text-5xl",
  h2: "text-2xl md:text-4xl",
  h3: "text-xl md:text-2xl",
} as const

function SectionHeader({
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  title: string
  subtitle?: string
  align?: "left" | "center"
  as?: "h1" | "h2" | "h3"
}) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className
      )}
      {...props}
    >
      <Tag
        className={cn(
          "font-headline font-black tracking-[-0.02em] text-foreground",
          headingSizes[Tag]
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className="text-muted-foreground text-base mt-2">{subtitle}</p>
      )}
    </div>
  )
}

export { SectionHeader }
