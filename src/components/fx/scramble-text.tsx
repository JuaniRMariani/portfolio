"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useInView } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>_"

/**
 * Text that decodes from random glyphs into its real value — on entering
 * the viewport (`trigger="view"`) and/or on hover. The real text is what
 * SSR renders, so crawlers and no-JS readers always get it verbatim.
 */
export function ScrambleText({
  text,
  as = "span",
  className,
  trigger = "both",
  duration = 900,
}: {
  text: string
  as?: "span" | "p" | "div"
  className?: string
  trigger?: "view" | "hover" | "both"
  duration?: number
}) {
  const { enabled } = useAnimation()
  const Tag = as as "span"
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [output, setOutput] = useState(text)
  const frame = useRef(0)

  const run = useCallback(() => {
    if (!enabled) return
    cancelAnimationFrame(frame.current)
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const settled = Math.floor(progress * text.length)
      let next = ""
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        next += i < settled || char === " " ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      }
      setOutput(next)
      if (progress < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }, [enabled, text, duration])

  useEffect(() => {
    if (inView && trigger !== "hover") run()
  }, [inView, trigger, run])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return (
    <Tag
      ref={ref}
      className={className}
      onPointerEnter={trigger !== "view" ? run : undefined}
    >
      {output}
    </Tag>
  )
}
