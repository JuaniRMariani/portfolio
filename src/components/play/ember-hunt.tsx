"use client"

import { useState, useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "motion/react"
import { tr, type L } from "@/content"
import { useAnimation } from "@/components/editorial/animation-context"
import { emitFx } from "@/components/fx/scene/store"
import { usePlay } from "./achievements"

export const EMBER_COUNT = 5
const STORAGE_KEY = "jrm-embers"

const COPY = {
  label: { en: "Catch the ember", es: "Atrapá la brasa" },
  first: { en: "Ember caught · 1/5 — four more hide before Experience", es: "Brasa atrapada · 1/5 — quedan cuatro antes de Experiencia" },
  progress: { en: "Ember caught", es: "Brasa atrapada" },
} satisfies Record<string, L<string>>

/* Collected embers live outside React, persisted best-effort. */
const EMPTY: ReadonlySet<number> = new Set()
let collected: ReadonlySet<number> | null = null
const listeners = new Set<() => void>()

function read() {
  if (!collected) {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
      collected = new Set(Array.isArray(raw) ? raw.filter((n) => typeof n === "number") : [])
    } catch {
      collected = new Set()
    }
  }
  return collected
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function collect(n: number) {
  const next = new Set(read()).add(n)
  collected = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  } catch {
    // progress just won't persist
  }
  listeners.forEach((listener) => listener())
  return next.size
}

const SPARKS = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2)

/**
 * One of five tiny drifting embers hidden in the first sections. Tap or
 * click to catch it; catching all five unlocks "ember-hunt".
 */
export function HuntEmber({ n, className }: { n: number; className?: string }) {
  const { enabled } = useAnimation()
  const { unlock, toast, locale } = usePlay()
  const caught = useSyncExternalStore(subscribe, read, () => EMPTY).has(n)
  const [bursting, setBursting] = useState(false)

  if (caught && !bursting) return null

  function onCatch() {
    if (caught) return
    const total = collect(n)
    setBursting(true)
    window.setTimeout(() => setBursting(false), 700)
    navigator.vibrate?.(18)
    if (total >= EMBER_COUNT) {
      unlock("ember-hunt")
      emitFx("burst")
    } else {
      toast(total === 1 ? tr(COPY.first, locale) : `${tr(COPY.progress, locale)} · ${total}/${EMBER_COUNT}`)
    }
  }

  return (
    <button
      type="button"
      onClick={onCatch}
      aria-label={`${tr(COPY.label, locale)} ${n + 1}/${EMBER_COUNT}`}
      data-cursor="catch"
      className={`group absolute z-30 flex size-11 cursor-pointer items-center justify-center rounded-full ${className ?? ""}`}
    >
      <AnimatePresence>
        {!caught && (
          <motion.span
            key="ember"
            aria-hidden="true"
            className="hunt-ember relative block size-2.5 rounded-full bg-amber transition-transform duration-300 group-hover:scale-150"
            style={{ animationDelay: `${n * -1.3}s` }}
            exit={{ scale: 3, opacity: 0, transition: { duration: 0.3 } }}
          />
        )}
      </AnimatePresence>
      {bursting &&
        enabled &&
        SPARKS.map((angle, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute size-1.5 rounded-full bg-amber shadow-[0_0_8px_var(--ember)]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 36, y: Math.sin(angle) * 36, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
    </button>
  )
}
