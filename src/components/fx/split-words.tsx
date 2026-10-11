"use client"

import { Fragment, useRef } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"

/**
 * Splits text into words that rise out of a mask one after another.
 * Words are real text in SSR; hiding only happens via `data-reveal` CSS.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.035,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const { enabled } = useAnimation()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const show = !enabled || inView
  const words = text.split(" ")

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              data-reveal
              className="inline-block"
              animate={show ? { opacity: 1, y: "0%", rotate: 0 } : { opacity: 0, y: "110%", rotate: 4 }}
              transition={
                enabled ? { delay: show ? delay + i * stagger : 0, duration: 0.9, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }
              }
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  )
}
