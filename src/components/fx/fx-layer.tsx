"use client"

import { useEffect, useState, type ComponentType } from "react"
import { useAnimation } from "@/components/editorial/animation-context"
import { fx } from "./scene/store"
import { startDeviceTilt } from "./device-tilt"

type StageComponent = ComponentType<{ live: boolean; onReady?: () => void }>

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/**
 * Mounts the WebGL stage after the page is idle so the static HTML paints
 * first, and feeds pointer state into the shared fx store. Sets
 * `html[data-fx-ready]` once the canvas exists (hero crossfades on it).
 */
export function FxLayer() {
  const { enabled } = useAnimation()
  const [Stage, setStage] = useState<StageComponent | null>(null)

  useEffect(() => {
    const setPoint = (clientX: number, clientY: number) => {
      fx.pointer.x = clientX
      fx.pointer.y = clientY
      fx.mouse.x = (clientX / window.innerWidth) * 2 - 1
      fx.mouse.y = -((clientY / window.innerHeight) * 2 - 1)
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen") setPoint(event.clientX, event.clientY)
    }
    // Touch events keep firing while the page scrolls (pointer events get
    // cancelled), so a finger dragged across the hero carves the particles.
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) setPoint(touch.clientX, touch.clientY)
    }
    const onTouchEnd = () => {
      fx.pointer.x = -9999
      fx.pointer.y = -9999
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("pointerdown", onPointer, { passive: true })
    window.addEventListener("touchstart", onTouch, { passive: true })
    window.addEventListener("touchmove", onTouch, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("touchcancel", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("touchstart", onTouch)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [])

  // Phones: tilting the device steers the ember field, particles and cards.
  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: coarse)").matches) return
    return startDeviceTilt()
  }, [enabled])

  useEffect(() => {
    if (!supportsWebGL()) return
    let cancelled = false
    const load = () =>
      import("./scene/stage").then((mod) => {
        if (!cancelled) setStage(() => mod.default)
      })
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 300)
    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])

  if (!Stage) return null
  return <Stage live={enabled} onReady={() => (document.documentElement.dataset.fxReady = "")} />
}
