"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useAnimation } from "@/components/editorial/animation-context"
import { fx } from "./scene/store"

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Smooth-scroll to a selector or element; falls back to native when Lenis is off. */
export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 })
  else el.scrollIntoView({ behavior: "smooth", block: "start" })
}

/** Pause/resume page scrolling (e.g. while a game or the terminal owns input). */
export function setScrollLocked(locked: boolean) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

/**
 * Lenis smooth scrolling bridged to GSAP's ticker + ScrollTrigger, and
 * page scroll progress/velocity mirrored into the fx store for the shader.
 * Disabled entirely under reduced motion / skipped animations.
 */
export function SmoothScroll() {
  const { enabled } = useAnimation()

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      fx.scroll = max > 0 ? window.scrollY / max : 0
    }

    if (!enabled) {
      window.addEventListener("scroll", updateProgress, { passive: true })
      updateProgress()
      return () => window.removeEventListener("scroll", updateProgress)
    }

    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -80 } })
    lenis = instance
    instance.on("scroll", (event: Lenis) => {
      fx.velocity = event.velocity
      updateProgress()
      ScrollTrigger.update()
    })
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [enabled])

  return null
}
