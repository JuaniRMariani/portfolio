"use client"

import { useEffect, useEffectEvent, useRef } from "react"
import { setScrollLocked } from "@/components/fx/smooth-scroll"
import { BreakoutGame, type BrickSpec, type BreakoutResult, type BreakoutText } from "./breakout-engine"

/**
 * Mounts the canvas engine. Purely decorative for assistive tech — the
 * skill list stays in the DOM; this is a bonus layer.
 */
export function SkillsBreakout({
  bricks,
  text,
  reducedMotion,
  onEnd,
}: {
  bricks: BrickSpec[]
  text: BreakoutText
  reducedMotion: boolean
  onEnd: (result: BreakoutResult) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleEnd = useEffectEvent((result: BreakoutResult) => onEnd(result))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let game: BreakoutGame | null = null
    let cancelled = false
    let locked = false

    // wait for Commit Mono so brick widths are measured with the real font
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(() => {
      if (cancelled) return
      game = new BreakoutGame({
        canvas,
        bricks,
        text,
        reducedMotion,
        onEnd: (result) => handleEnd(result),
        onKeyboard: () => {
          // arrow keys would otherwise scroll the page under Lenis
          locked = true
          setScrollLocked(true)
        },
      })
    })

    return () => {
      cancelled = true
      game?.destroy()
      if (locked) setScrollLocked(false)
    }
    // the engine owns its state; a new round remounts via `key`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full touch-none select-none" />
}
