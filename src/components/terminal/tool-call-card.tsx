"use client"

import { useId, useState, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolCallCardProps {
  tool: string
  arg: string
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

/**
 * A Claude Code style tool call: "● Task(cuonti)" with collapsible
 * output. The body is always present in the DOM — collapsing is purely
 * visual, so crawlers and find-in-page read everything.
 */
export function ToolCallCard({ tool, arg, defaultOpen = false, children, className }: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <div className={cn("scanlines overflow-hidden rounded-lg border border-border bg-card/70", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 py-3 text-left font-mono text-sm transition-colors hover:bg-secondary/60"
      >
        <span className="glow-green text-term-green" aria-hidden="true">
          ●
        </span>
        <span className="font-bold text-foreground">{tool}</span>
        <span className="truncate text-muted-foreground">({arg})</span>
        <ChevronRight
          className={cn("ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-90")}
          aria-hidden="true"
        />
      </button>
      <div
        id={bodyId}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 py-4 sm:px-5 sm:py-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
