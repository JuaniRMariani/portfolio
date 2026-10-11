"use client"

import { useEffect, useRef, useState } from "react"
import { useAnimation } from "@/components/editorial/animation-context"

/**
 * Custom ember cursor: a crisp dot plus a lagging ring. Any element with
 * `data-cursor="<label>"` (view, play, copy, drag…) morphs the ring into a
 * labelled pill; plain links/buttons just grow it. Fine pointers only.
 */
export function Cursor() {
  const { enabled } = useAnimation()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: fine)").matches) return
    document.documentElement.classList.add("has-fx-cursor")

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let visible = false

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!visible) {
        visible = true
        rx = x
        ry = y
        setActive(true)
      }
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role=button], input, textarea, summary",
      )
      setLabel(target?.dataset.cursor ?? "")
      setHovering(!!target)
    }
    const onLeave = () => {
      visible = false
      setActive(false)
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove("has-fx-cursor")
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize = label ? 76 : hovering ? 52 : 34
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden [@media(pointer:fine)]:block">
      <div
        ref={ring}
        className="absolute top-0 left-0 will-change-transform"
        style={{ opacity: active ? 1 : 0, transition: "opacity .3s" }}
      >
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-mono text-[10px] font-bold tracking-[0.16em] uppercase"
          style={{
            width: ringSize,
            height: ringSize,
            scale: pressed ? 0.85 : 1,
            transition: "width .35s cubic-bezier(.16,1,.3,1), height .35s cubic-bezier(.16,1,.3,1), background-color .3s, scale .2s",
            borderColor: label || hovering ? "var(--ember)" : "oklch(0.96 0.012 75 / 0.45)",
            backgroundColor: label ? "var(--ember)" : hovering ? "oklch(0.74 0.22 46 / 0.12)" : "transparent",
            color: "var(--primary-foreground)",
          }}
        >
          {label}
        </div>
      </div>
      <div
        ref={dot}
        className="absolute top-0 left-0 will-change-transform"
        style={{ opacity: active && !label ? 1 : 0, transition: "opacity .2s" }}
      >
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_10px_var(--ember)]" />
      </div>
    </div>
  )
}
