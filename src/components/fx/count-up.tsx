"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"

/**
 * Counts a metric like "50+" or "10+" up from zero when it scrolls into
 * view. SSR and no-JS render the final value; non-numeric values pass through.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const { enabled } = useAnimation()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!enabled || !inView || !match) return
    const [, prefix, digits, suffix] = match
    const controls = animate(0, Number(digits), {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(`${prefix}${Math.round(latest)}${suffix}`),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, inView, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
