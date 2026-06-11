"use client"

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react"
import { useReducedMotion } from "motion/react"

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

interface AnimationState {
  /** Whether reveal animations should play. */
  enabled: boolean
  /** Permanently skip animations for this session. */
  skip: () => void
}

const AnimationContext = createContext<AnimationState>({ enabled: true, skip: () => {} })

export function AnimationProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
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
