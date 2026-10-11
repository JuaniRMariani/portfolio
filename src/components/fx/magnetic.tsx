"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"
import { cn } from "@/lib/utils"

/**
 * Pulls its child toward the pointer while hovered and springs back on
 * leave. Wrap CTAs and icon buttons; no-op under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const { enabled } = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })

  function onMove(event: React.PointerEvent) {
    if (!enabled || event.pointerType !== "mouse" || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
