import { fx } from "./scene/store"

type OrientationCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">
}

const RANGE = 28 // degrees of tilt for full deflection

/**
 * Streams phone tilt into `fx.tilt` (-1..1). The neutral pose is learned
 * from the first reading and drifts slowly toward however the visitor is
 * holding the phone, so tilting is always relative. iOS needs a
 * permission prompt from a user gesture — we ask on the first tap.
 * Returns a cleanup function.
 */
export function startDeviceTilt() {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return () => {}

  let baseBeta: number | null = null
  let baseGamma = 0
  let listening = false

  const onOrientation = (event: DeviceOrientationEvent) => {
    if (event.beta == null || event.gamma == null) return
    if (baseBeta === null) {
      baseBeta = event.beta
      baseGamma = event.gamma
    }
    baseBeta += (event.beta - baseBeta) * 0.004
    baseGamma += (event.gamma - baseGamma) * 0.004
    const tx = Math.max(-1, Math.min(1, (event.gamma - baseGamma) / RANGE))
    const ty = Math.max(-1, Math.min(1, -(event.beta - baseBeta) / RANGE))
    fx.tilt.x += (tx - fx.tilt.x) * 0.2
    fx.tilt.y += (ty - fx.tilt.y) * 0.2
  }

  const listen = () => {
    if (listening) return
    listening = true
    window.addEventListener("deviceorientation", onOrientation)
  }

  const ctor = window.DeviceOrientationEvent as OrientationCtor
  let onFirstTap: (() => void) | null = null
  if (typeof ctor.requestPermission === "function") {
    onFirstTap = () => {
      ctor
        .requestPermission?.()
        .then((state) => state === "granted" && listen())
        .catch(() => {})
    }
    window.addEventListener("touchend", onFirstTap, { once: true })
  } else {
    listen()
  }

  return () => {
    window.removeEventListener("deviceorientation", onOrientation)
    if (onFirstTap) window.removeEventListener("touchend", onFirstTap)
    fx.tilt.x = 0
    fx.tilt.y = 0
  }
}
