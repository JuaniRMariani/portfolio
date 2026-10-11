/**
 * Mutable, render-free state shared between the DOM and the WebGL scene.
 * Written by DOM listeners / ScrollTriggers, read every frame by the
 * scene — no React re-renders involved.
 */
export const fx = {
  /** Pointer in normalized device coords (-1..1, y up). */
  mouse: { x: 0, y: 0 },
  /** Pointer in CSS pixels. */
  pointer: { x: -9999, y: -9999 },
  /** Whole-page scroll progress 0..1. */
  scroll: 0,
  /** Signed scroll velocity (px/frame, smoothed by Lenis). */
  velocity: 0,
  /** 0 while the hero is in view → 1 once it has scrolled away. */
  heroExit: 0,
  /** Target palette temperature per section: 0 = cold navy, 1 = full ember. */
  heat: 0.6,
  /** performance.now() of the last global burst (konami, hire-me). */
  burstAt: -1e9,
  /** performance.now() of the last click shockwave on the hero. */
  shockAt: -1e9,
  /** Shockwave origin in NDC. */
  shock: { x: 0, y: 0 },
  /** Whether the canvas should animate (false = static frame). */
  live: true,
}

type Listener = (event: FxEvent) => void
export type FxEvent = "burst" | "shock" | "scatter"

const listeners = new Set<Listener>()

export function onFx(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function emitFx(event: FxEvent) {
  const now = performance.now()
  if (event === "burst") fx.burstAt = now
  if (event === "shock") fx.shockAt = now
  listeners.forEach((listener) => listener(event))
}
