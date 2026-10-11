"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "./animation-context"
import { ScrambleText } from "@/components/fx/scramble-text"
import { cn } from "@/lib/utils"

interface SectionShellProps {
  id: string
  /** Two-digit editorial index, e.g. "01". */
  index: string
  title: string
  /** Optional mono kicker above the title. */
  kicker?: string
  children: ReactNode
  className?: string
}

/**
 * Numbered section: giant outlined index, decoding display title and a
 * hairline that draws in. All content is complete in the static HTML;
 * animation is a reveal on top.
 */
export function SectionShell({ id, index, title, kicker, children, className }: SectionShellProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  const { enabled } = useAnimation()
  const show = !enabled || inView
  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <section id={id} ref={ref} className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}>
      <div className="mb-10 flex items-end gap-4 sm:mb-14 sm:gap-6">
        <motion.span
          data-reveal
          aria-hidden="true"
          className="font-display text-[clamp(3.75rem,10vw,8rem)] leading-[0.8] font-extrabold tracking-tighter text-transparent select-none [-webkit-text-stroke:1.5px_var(--ember)]"
          animate={show ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 40, rotate: -6 }}
          transition={enabled ? { duration: 0.9, ease } : { duration: 0 }}
        >
          {index}
        </motion.span>
        <div className="min-w-0 flex-1 pb-1">
          <motion.p
            data-reveal
            className="font-mono text-[11px] tracking-[0.22em] text-primary uppercase"
            animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={enabled ? { delay: show ? 0.1 : 0, duration: 0.6, ease } : { duration: 0 }}
          >
            {kicker ?? `// ${index} — ${id.replace(/-/g, " ")}`}
          </motion.p>
          <h2 className="mt-1 font-display text-[clamp(1.9rem,5vw,3.6rem)] leading-none font-extrabold tracking-tight text-foreground uppercase">
            <ScrambleText text={title} trigger="both" />
          </h2>
          <motion.span
            aria-hidden="true"
            className="bg-ember mt-4 block h-px origin-left"
            animate={show ? { scaleX: 1 } : { scaleX: 0 }}
            initial={false}
            transition={enabled ? { delay: show ? 0.2 : 0, duration: 1.2, ease } : { duration: 0 }}
          />
        </div>
      </div>
      <motion.div
        data-reveal
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={enabled ? { delay: show ? 0.2 : 0, duration: 0.8, ease } : { duration: 0 }}
      >
        {children}
      </motion.div>
    </section>
  )
}
