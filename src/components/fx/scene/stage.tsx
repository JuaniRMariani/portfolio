"use client"

import { useEffect, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { PerformanceMonitor } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { EmberField } from "./ember-field"
import { NameParticles, Sparks } from "./name-particles"
import { fx } from "./store"

/** Re-renders a single frame whenever the scene is static (reduced motion / skipped). */
function StaticFrameKick({ live }: { live: boolean }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    if (live) return
    const id = window.setTimeout(() => invalidate(), 50)
    return () => window.clearTimeout(id)
  }, [live, invalidate])
  return null
}

/**
 * The single fixed WebGL canvas behind the whole page: ember-field shader
 * background + hero name particles + bloom. Loaded lazily (see FxLayer).
 */
export default function Stage({ live, onReady }: { live: boolean; onReady?: () => void }) {
  const [dpr, setDpr] = useState(1)
  const [hidden, setHidden] = useState(false)
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  const maxDpr = coarse ? 1 : 1.5

  useEffect(() => {
    fx.live = live
  }, [live])

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  return (
    <Canvas
      flat
      linear
      className="!fixed inset-0 z-0 !h-dvh !w-screen"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
      dpr={[0.75, Math.min(dpr, maxDpr)]}
      frameloop={hidden ? "never" : live ? "always" : "demand"}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
      onCreated={() => onReady?.()}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(maxDpr)}
        onDecline={() => setDpr(0.75)}
        flipflops={3}
        onFallback={() => setDpr(0.75)}
      >
        <EmberField />
        <Sparks count={coarse ? 180 : 420} />
        <NameParticles />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.42} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
        </EffectComposer>
        <StaticFrameKick live={live} />
      </PerformanceMonitor>
    </Canvas>
  )
}
