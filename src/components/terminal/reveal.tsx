"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "./animation-context"

interface RevealProps {
  children: ReactNode
  /** Seconds to wait after entering the viewport. */
  delay?: number
  className?: string
}

/**
 * Progressive reveal that never hides content from crawlers or no-JS
 * visitors: the static HTML carries no hiding styles — `data-reveal` is
 * only dimmed by CSS once `html[data-js]` is set (and motion is allowed).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const { enabled } = useAnimation()
  const show = !enabled || inView

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={enabled ? { delay: show ? delay : 0, duration: 0.45, ease: "easeOut" } : { duration: 0 }}
    >
      {children}
    </motion.div>
  )
}
