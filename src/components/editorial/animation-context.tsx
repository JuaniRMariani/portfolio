"use client"

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react"

/* Session-scoped "skip animations" flag lives in sessionStorage; exposed
   to React via useSyncExternalStore so SSR snapshots stay consistent. */
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function readSkipped() {
  try {
    return sessionStorage.getItem("skip-anim") === "1"
  } catch {
    return false
  }
}

function writeSkipped() {
  try {
    sessionStorage.setItem("skip-anim", "1")
  } catch {
    // non-persistent skip is fine
  }
  listeners.forEach((listener) => listener())
}

/* prefers-reduced-motion as an external store: the server snapshot (false)
   is used during hydration, so SSR markup and the first client render agree. */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReduced(listener: () => void) {
  const query = window.matchMedia(REDUCED_QUERY)
  query.addEventListener("change", listener)
  return () => query.removeEventListener("change", listener)
}

function readReduced() {
  return window.matchMedia(REDUCED_QUERY).matches
}

interface AnimationState {
  /** Whether reveal animations should play. */
  enabled: boolean
  /** Permanently skip animations for this session. */
  skip: () => void
}

const AnimationContext = createContext<AnimationState>({ enabled: true, skip: () => {} })

export function AnimationProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribeReduced, readReduced, () => false)
  const skipped = useSyncExternalStore(subscribe, readSkipped, () => false)

  return (
    <AnimationContext.Provider value={{ enabled: !reducedMotion && !skipped, skip: writeSkipped }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  return useContext(AnimationContext)
}
