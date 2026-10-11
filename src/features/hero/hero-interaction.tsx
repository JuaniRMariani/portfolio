"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { usePlay } from "@/components/play/achievements"
import { emitFx, fx } from "@/components/fx/scene/store"

/**
 * Hero shell: reports how far the hero has scrolled away (particles lift
 * off as it leaves) and turns clicks on empty hero space into shockwaves.
 */
export function HeroInteraction({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const { unlock } = usePlay()
  const clicks = useRef(0)

  useEffect(() => {
    const update = () => {
      const el = ref.current
      if (!el) return
      fx.heroExit = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight * 0.85)))
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  function onPointerDown(event: React.PointerEvent) {
    if ((event.target as HTMLElement).closest("a, button")) return
    fx.shock.x = (event.clientX / window.innerWidth) * 2 - 1
    fx.shock.y = -((event.clientY / window.innerHeight) * 2 - 1)
    emitFx("shock")
    clicks.current += 1
    if (clicks.current >= 2) unlock("scatter")
  }

  return (
    <section
      id="top"
      ref={ref}
      data-cursor="boom"
      onPointerDown={onPointerDown}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6"
    >
      {children}
    </section>
  )
}
