"use client"

import { useRef, useSyncExternalStore } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "./animation-context"
import { Cursor } from "./cursor"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

/** False during SSR/hydration, true after — without effect-driven state. */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

interface TypeLineProps {
  text: string
  /** Seconds before typing starts once visible. */
  delay?: number
  withCursor?: boolean
  className?: string
}

/**
 * A "$ command" line with a character-by-character typing effect.
 * The full text is always present in the static HTML; only after
 * hydration (and only with motion allowed) do characters stagger in.
 */
export function TypeLine({ text, delay = 0, withCursor = false, className }: TypeLineProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const { enabled } = useAnimation()
  const mounted = useMounted()

  const animating = enabled && mounted
  const show = !enabled || inView
  const chars = Array.from(text)

  return (
    <p ref={ref} className={cn("font-mono", className)}>
      <span className="select-none text-prompt" aria-hidden="true">
        ${" "}
      </span>
      {animating ? (
        <motion.span data-reveal aria-hidden="true" animate={{ opacity: 1 }} transition={{ duration: 0 }}>
          {chars.map((char, i) => (
            <motion.span
              key={i}
              animate={show ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: show ? delay + i * 0.025 : 0, duration: 0 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ) : (
        <span aria-hidden="true">{text}</span>
      )}
      <span className="sr-only">{text}</span>
      {withCursor && <Cursor />}
    </p>
  )
}
