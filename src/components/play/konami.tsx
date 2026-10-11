"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { AnimatePresence, animate, motion } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"
import { emitFx } from "@/components/fx/scene/store"
import { ui, tr } from "@/content"
import { usePlay } from "./achievements"

const SEQUENCE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"]
const STORM_MS = 1900

/** True when a key event comes from somewhere the user is typing. */
export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

/**
 * ↑↑↓↓←→←→BA — floods the ember field, unlocks "konami", shakes the page
 * (vertical only, so no horizontal overflow) and flashes a giant ember
 * title. The overlay is decorative; the toast carries the announcement.
 */
export function Konami() {
  const { enabled } = useAnimation()
  const { unlock, toast, locale } = usePlay()
  const [storm, setStorm] = useState(0)
  const progress = useRef(0)
  const timer = useRef(0)

  const fire = () => {
    emitFx("burst")
    unlock("konami")
    toast(tr(ui.terminal.konami, locale), tr(ui.terminal.konamiBody, locale))
    setStorm((n) => n + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStorm(0), STORM_MS)

    const main = document.querySelector<HTMLElement>("main")
    if (enabled && main) {
      animate(main, { y: [0, -14, 12, -9, 7, -4, 2, 0] }, { duration: 0.65, ease: "easeOut" }).then(() => {
        // drop the leftover transform so fixed descendants aren't re-parented
        main.style.transform = ""
      })
    }
  }

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (isTypingTarget(event.target)) return
    const key = event.key.toLowerCase()
    if (key === SEQUENCE[progress.current]) progress.current += 1
    else progress.current = key === SEQUENCE[0] ? 1 : 0
    if (progress.current === SEQUENCE.length) {
      progress.current = 0
      fire()
    }
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKey(event)
    window.addEventListener("keydown", listener)
    return () => {
      window.removeEventListener("keydown", listener)
      window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {storm > 0 && (
        <motion.div
          key={storm}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[130] flex flex-col items-center justify-center overflow-hidden px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: enabled ? 0.5 : 0 } }}
          transition={{ duration: enabled ? 0.2 : 0 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.74_0.22_46/0.32),oklch(0.13_0.05_262/0.55)_70%)]" />
          <motion.p
            className="text-ember text-glow relative text-center font-display text-[clamp(3rem,13vw,11rem)] leading-[0.85] font-extrabold tracking-tighter uppercase"
            initial={enabled ? { scale: 1.7, opacity: 0, filter: "blur(14px)" } : false}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {tr(ui.terminal.konami, locale)}
          </motion.p>
          <p className="relative mt-4 font-mono text-xs tracking-[0.4em] text-amber uppercase">↑ ↑ ↓ ↓ ← → ← → B A</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
