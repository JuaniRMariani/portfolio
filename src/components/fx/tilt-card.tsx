"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"
import { cn } from "@/lib/utils"

/**
 * 3D tilt toward the pointer plus a `.spotlight` glow that follows it
 * (writes --mx/--my). Renders a plain div under reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  as = "div",
}: {
  children: ReactNode
  className?: string
  /** Max tilt in degrees. */
  max?: number
  as?: "div" | "article" | "li"
}) {
  const { enabled } = useAnimation()
  const ref = useRef<HTMLElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 18 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const Component = as === "article" ? motion.article : as === "li" ? motion.li : motion.div

  function onMove(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width
    const ny = (event.clientY - rect.top) / rect.height
    el.style.setProperty("--mx", `${nx * 100}%`)
    el.style.setProperty("--my", `${ny * 100}%`)
    if (enabled && event.pointerType === "mouse") {
      px.set(nx)
      py.set(ny)
    }
  }
  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <Component
      ref={ref as React.Ref<never>}
      className={cn("spotlight", className)}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </Component>
  )
}
