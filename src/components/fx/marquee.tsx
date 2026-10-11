"use client"

import { useRef, type ReactNode } from "react"
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"
import { fx } from "./scene/store"
import { cn } from "@/lib/utils"

/**
 * Infinite horizontal marquee whose speed and skew react to scroll
 * velocity. Children are rendered twice; the copy is aria-hidden.
 */
export function Marquee({
  children,
  speed = 60,
  className,
  reverse = false,
}: {
  children: ReactNode
  /** Base speed in px/s. */
  speed?: number
  className?: string
  reverse?: boolean
}) {
  const { enabled } = useAnimation()
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const velocity = useSpring(0, { stiffness: 120, damping: 30 })
  const skew = useTransform(velocity, [-40, 40], [8, -8])

  useAnimationFrame((_, delta) => {
    if (!enabled || !track.current) return
    velocity.set(fx.velocity)
    const half = track.current.scrollWidth / 2
    const direction = reverse ? -1 : 1
    const boost = 1 + Math.min(6, Math.abs(fx.velocity) * 0.25)
    let next = x.get() - direction * speed * boost * (delta / 1000)
    if (next <= -half) next += half
    if (next > 0) next -= half
    x.set(next)
  })

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div ref={track} className="flex w-max" style={{ x, skewX: enabled ? skew : 0 }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
