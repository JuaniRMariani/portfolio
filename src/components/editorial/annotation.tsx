import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Small CAD-style annotation label: uppercase mono, wide tracking.
 * Used for figure numbers, dates, coordinates and other marginalia.
 */
export function Annotation({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase", className)}>
      {children}
    </span>
  )
}
