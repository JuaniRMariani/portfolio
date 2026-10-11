"use client"

import { useEffect, useRef } from "react"

const DURATION = 1100

/**
 * First-visit-per-session intro: counter 000→100 over the JRM mark, then a
 * clip-path wipe. Only shown when the inline head script set
 * `html[data-preload]` (JS on, motion allowed, not seen this session), so
 * crawlers and no-JS visitors never see it. CSS auto-hides it after 3s as
 * a safety net.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const html = document.documentElement
    if (!("preload" in html.dataset)) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - t, 3)
      if (counter.current) counter.current.textContent = Math.round(eased * 100).toString().padStart(3, "0")
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        root.current?.classList.add("preloader-out")
        window.setTimeout(() => {
          delete html.dataset.preload
        }, 900)
        try {
          sessionStorage.setItem("jrm-pre", "1")
        } catch {
          // shows again next load; harmless
        }
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="flex w-[min(28rem,80vw)] flex-col gap-4">
        <div className="flex items-end justify-between font-display font-extrabold tracking-tight">
          <span className="text-5xl text-foreground sm:text-7xl">
            JRM<span className="text-ember">.</span>
          </span>
          <span ref={counter} className="font-mono text-sm text-primary tabular-nums">
            000
          </span>
        </div>
        <span className="block h-px w-full overflow-hidden bg-hairline">
          <span ref={bar} className="bg-ember block h-full origin-left" style={{ transform: "scaleX(0)" }} />
        </span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          igniting · bahía blanca, ar
        </span>
      </div>
    </div>
  )
}
