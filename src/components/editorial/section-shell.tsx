"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "./animation-context"
import { cn } from "@/lib/utils"

interface SectionShellProps {
  id: string
  /** Two-digit editorial index, e.g. "01". */
  index: string
  title: string
  children: ReactNode
  className?: string
}

/**
 * Numbered editorial section: `01 ── ABOUT ───────────── +`.
 * The heading and body fade in on scroll; all content is always
 * complete in the static HTML (animation is a reveal on top).
 */
export function SectionShell({ id, index, title, children, className }: SectionShellProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const { enabled } = useAnimation()
  const show = !enabled || inView

  return (
    <section id={id} ref={ref} className={cn("scroll-mt-24 py-14 sm:py-20", className)}>
      <motion.div
        data-reveal
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={enabled ? { duration: 0.5, ease: "easeOut" } : { duration: 0 }}
      >
        <h2 className="flex items-center gap-3 sm:gap-4">
          <span className="font-mono text-sm font-bold text-primary" aria-hidden="true">
            {index}
          </span>
          <span className="font-display text-xl font-bold tracking-wide text-foreground uppercase sm:text-2xl">
            {title}
          </span>
          <span className="h-px min-w-6 flex-1 bg-hairline" aria-hidden="true" />
          <span className="font-mono text-sm text-muted-foreground/60 select-none" aria-hidden="true">
            +
          </span>
        </h2>
      </motion.div>
      <motion.div
        data-reveal
        className="mt-8"
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={enabled ? { delay: show ? 0.15 : 0, duration: 0.5, ease: "easeOut" } : { duration: 0 }}
      >
        {children}
      </motion.div>
    </section>
  )
}
