"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { usePlay } from "@/components/play/achievements"
import { useAnimation } from "@/components/editorial/animation-context"
import { emitFx, fx } from "@/components/fx/scene/store"

/** Hold this long (ms) for a fully charged blast. */
const FULL_CHARGE = 1100

/**
 * Hero shell: reports how far the hero has scrolled away (particles lift
 * off as it leaves) and turns taps on empty hero space into shockwaves.
 * Holding charges the blast (ring grows, phone buzzes) — release to fire.
 */
export function HeroInteraction({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const { unlock } = usePlay()
  const { enabled } = useAnimation()
  const blasts = useRef(0)
  const press = useRef<{ id: number; at: number; x: number; y: number } | null>(null)
  const [charge, setCharge] = useState<{ x: number; y: number } | null>(null)

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
    if (event.button > 0 || (event.target as HTMLElement).closest("a, button")) return
    const rect = ref.current?.getBoundingClientRect()
    press.current = { id: event.pointerId, at: performance.now(), x: event.clientX, y: event.clientY }
    if (enabled && rect) setCharge({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  function cancel() {
    press.current = null
    setCharge(null)
  }

  function onPointerUp(event: React.PointerEvent) {
    const p = press.current
    if (!p || p.id !== event.pointerId) return cancel()
    const held = Math.min(1, (performance.now() - p.at) / FULL_CHARGE)
    cancel()
    fx.shock.x = (p.x / window.innerWidth) * 2 - 1
    fx.shock.y = -((p.y / window.innerHeight) * 2 - 1)
    fx.shockPower = 1 + held * 2
    emitFx("shock")
    if (held > 0.3) navigator.vibrate?.(Math.round(30 + held * 60))
    blasts.current += held > 0.6 ? 2 : 1
    if (blasts.current >= 2) unlock("scatter")
  }

  return (
    <section
      id="top"
      ref={ref}
      data-cursor="boom"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={cancel}
      onPointerLeave={(event) => event.pointerType === "mouse" && cancel()}
      onContextMenu={(event) => press.current && event.preventDefault()}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-28 pb-24 [-webkit-touch-callout:none] sm:px-6"
    >
      {charge && (
        <span
          aria-hidden="true"
          className="charge-ring pointer-events-none absolute z-20 size-28 rounded-full"
          style={{ left: charge.x, top: charge.y, animationDuration: `${FULL_CHARGE}ms` }}
        />
      )}
      {children}
    </section>
  )
}
