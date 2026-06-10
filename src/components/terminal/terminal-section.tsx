"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "./animation-context"
import { cn } from "@/lib/utils"

interface TerminalSectionProps {
  id: string
  command: string
  children: ReactNode
  className?: string
}

/**
 * A page section presented as a terminal command + its output.
 * The heading types in when scrolled into view; the output fades in
 * right after. Content is always complete in the static HTML.
 */
export function TerminalSection({ id, command, children, className }: TerminalSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const { enabled } = useAnimation()
  const show = !enabled || inView
  const chars = Array.from(command)
  const typeDuration = chars.length * 0.018

  return (
    <section id={id} ref={ref} className={cn("scroll-mt-20 py-12 sm:py-16", className)}>
      <h2 className="mb-7 font-mono text-sm text-muted-foreground sm:text-base">
        <span className="select-none text-prompt" aria-hidden="true">
          ${" "}
        </span>
        {enabled ? (
          <motion.span data-reveal aria-hidden="true" animate={{ opacity: 1 }} transition={{ duration: 0 }}>
            {chars.map((char, i) => (
              <motion.span
                key={i}
                animate={show ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: show ? i * 0.018 : 0, duration: 0 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ) : (
          <span aria-hidden="true">{command}</span>
        )}
        <span className="sr-only">{command}</span>
      </h2>
      <motion.div
        data-reveal
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={
          enabled ? { delay: show ? typeDuration + 0.1 : 0, duration: 0.4, ease: "easeOut" } : { duration: 0 }
        }
      >
        {children}
      </motion.div>
    </section>
  )
}
