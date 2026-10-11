"use client"

import { useEffect, useState, type ComponentType } from "react"
import { useAnimation } from "@/components/editorial/animation-context"
import { fx } from "./scene/store"

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
    const onMove = (event: PointerEvent) => {
      fx.pointer.x = event.clientX
      fx.pointer.y = event.clientY
      fx.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      fx.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onMove)
    }
  }, [])

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
