"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { usePlay } from "@/components/play/achievements"
import { fx } from "./scene/store"

/** Palette temperature the ember field eases toward while a section is centered. */
const HEAT: Record<string, number> = {
  top: 0.75,
  about: 0.45,
  services: 0.6,
  experience: 0.5,
  projects: 0.9,
  "how-i-work": 0.65,
  skills: 0.55,
  contact: 0.85,
}

/**
 * Scroll progress bar + CAD-style HUD (current section, scroll %, cursor
 * coordinates). Also drives the shader temperature per section and the
 * "the-end" achievement.
 */
export function ScrollHud({ labels }: { labels: Record<string, string> }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  const { unlock } = usePlay()
  const [section, setSection] = useState("top")
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ids = Object.keys(HEAT)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id || "top"
          setSection(id)
          fx.heat = HEAT[id] ?? 0.6
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    const loop = () => {
      if (readout.current) {
        const pct = Math.round(fx.scroll * 100).toString().padStart(3, "0")
        const x = Math.max(0, Math.round(fx.pointer.x)).toString().padStart(4, "0")
        const y = Math.max(0, Math.round(fx.pointer.y)).toString().padStart(4, "0")
        readout.current.textContent = `${pct}% · X${x} Y${y}`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(
    () =>
      scrollYProgress.on("change", (value) => {
        if (value > 0.985) unlock("the-end")
      }),
    [scrollYProgress, unlock],
  )

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="bg-ember fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left shadow-[0_0_12px_var(--ember)]"
        style={{ scaleX }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-4 left-4 z-40 hidden items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase md:flex"
      >
        <span className="status-pulse size-1.5 rounded-full bg-primary" />
        <span className="text-primary">{labels[section] ?? labels.top}</span>
        <span className="h-px w-8 bg-hairline" />
        <span ref={readout} className="tabular-nums">
          000% · X0000 Y0000
        </span>
      </div>
    </>
  )
}
