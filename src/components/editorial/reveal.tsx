"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "./animation-context"

interface RevealProps {
  children: ReactNode
  /** Seconds to wait after entering the viewport. */
  delay?: number
  className?: string
  /** Render as a span (block-level via class) where a div would be invalid HTML, e.g. inside headings. */
  as?: "div" | "span"
}

/**
 * Progressive reveal that never hides content from crawlers or no-JS
 * visitors: the static HTML carries no hiding styles — `data-reveal` is
 * only dimmed by CSS once `html[data-js]` is set (and motion is allowed).
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const { enabled } = useAnimation()
  const show = !enabled || inView
  const Component = as === "span" ? motion.span : motion.div

  return (
    <Component
      ref={ref}
      data-reveal
      className={className}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={enabled ? { delay: show ? delay : 0, duration: 0.5, ease: "easeOut" } : { duration: 0 }}
    >
      {children}
    </Component>
  )
}
