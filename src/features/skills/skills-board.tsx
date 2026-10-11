"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Play, RotateCcw, X } from "lucide-react"
import type { Locale } from "@/content"
import { Annotation } from "@/components/editorial/annotation"
import { useAnimation } from "@/components/editorial/animation-context"
import { Magnetic } from "@/components/fx/magnetic"
import { emitFx } from "@/components/fx/scene/store"
import { scrollToTarget } from "@/components/fx/smooth-scroll"
import { usePlay } from "@/components/play/achievements"
import { BREAKOUT_EVENT } from "@/components/play/events"
import { cn } from "@/lib/utils"
import type { BreakoutResult } from "./breakout-engine"
import { SkillsBreakout } from "./skills-breakout"

export interface SkillGroupView {
  id: string
  title: string
  note: string
  items: string[]
}

/* group tints: CSS var for the DOM chips, hex for the canvas bricks */
const TINTS = [
  { css: "var(--ember)", hex: "#ff7a29" },
  { css: "var(--amber)", hex: "#f8b82e" },
  { css: "var(--coral)", hex: "#f2483a" },
  { css: "var(--frost)", hex: "#3db4de" },
  { css: "var(--foreground)", hex: "#f6efe6" },
]

const STRINGS = {
  en: {
    launch: "click · tap · space to launch",
    paused: "paused — click or space to resume",
    score: "SCORE",
    lives: "LIVES",
    combo: "COMBO",
    hint: "← → / drag · P pause · Esc exit",
    won: "Stack overflow ✓",
    wonSub: "Every skill shipped to production.",
    lost: "Segfault ✗",
    lostSub: "The stack fell through. Again?",
    retry: "Retry",
    finalScore: "Final score",
    bestCombo: "best combo",
    total: (skills: number, groups: number) => `${skills} skills · ${groups} groups · 1 ball`,
  },
  es: {
    launch: "click · tap · espacio para lanzar",
    paused: "pausa — click o espacio para seguir",
    score: "PUNTOS",
    lives: "VIDAS",
    combo: "COMBO",
    hint: "← → / arrastrá · P pausa · Esc salir",
    won: "Stack overflow ✓",
    wonSub: "Todos los skills en producción.",
    lost: "Segfault ✗",
    lostSub: "Se cayó el stack. ¿Otra?",
    retry: "Reintentar",
    finalScore: "Puntaje final",
    bestCombo: "mejor combo",
    total: (skills: number, groups: number) => `${skills} skills · ${groups} grupos · 1 pelota`,
  },
} as const

export function SkillsBoard({
  groups,
  locale,
  playLabel,
  exitLabel,
}: {
  groups: SkillGroupView[]
  locale: Locale
  playLabel: string
  exitLabel: string
}) {
  const t = STRINGS[locale]
  const { enabled } = useAnimation()
  const { unlock } = usePlay()
  const [playing, setPlaying] = useState(false)
  const [round, setRound] = useState(0)
  const [result, setResult] = useState<BreakoutResult | null>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const retryRef = useRef<HTMLButtonElement>(null)

  const bricks = useMemo(
    () => groups.flatMap((group, g) => group.items.map((label) => ({ label, color: TINTS[g % TINTS.length].hex }))),
    [groups],
  )
  const text = useMemo(() => ({ launch: t.launch, paused: t.paused, score: t.score, lives: t.lives, combo: t.combo }), [t])
  const totalSkills = bricks.length

  const start = useCallback(() => {
    setResult(null)
    setRound((r) => r + 1)
    setPlaying(true)
    requestAnimationFrame(() => arenaRef.current?.focus({ preventScroll: true }))
  }, [])

  const exit = useCallback(() => {
    setPlaying(false)
    setResult(null)
    requestAnimationFrame(() => playRef.current?.focus({ preventScroll: true }))
  }, [])

  const handleEnd = useCallback(
    (res: BreakoutResult) => {
      setResult(res)
      if (res.won) {
        unlock("breakout")
        emitFx("burst")
      }
      requestAnimationFrame(() => retryRef.current?.focus({ preventScroll: true }))
    },
    [unlock],
  )

  // the terminal can launch the game from anywhere on the page
  useEffect(() => {
    const onLaunch = () => {
      start()
      scrollToTarget("#skills")
    }
    window.addEventListener(BREAKOUT_EVENT, onLaunch)
    return () => window.removeEventListener(BREAKOUT_EVENT, onLaunch)
  }, [start])

  // Esc leaves the game
  useEffect(() => {
    if (!playing) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") exit()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [playing, exit])

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Annotation>{`// ${t.total(totalSkills, groups.length)}`}</Annotation>
        {playing ? (
          <button
            type="button"
            onClick={exit}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-5 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            <X className="size-4" aria-hidden="true" />
            {exitLabel}
          </button>
        ) : (
          <Magnetic>
            <button
              ref={playRef}
              type="button"
              data-cursor="play"
              onClick={start}
              className="glow-ember bg-ember group inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full px-6 font-mono text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase transition-transform hover:scale-[1.04] active:scale-[0.98] motion-reduce:transition-none"
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
              {playLabel}
            </button>
          </Magnetic>
        )}
      </div>

      {/* The list always stays in the DOM; while playing it is only visually hidden. */}
      <div className={cn(playing && "sr-only")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, g) => (
            <SkillGroupCard key={group.id} group={group} index={g} tint={TINTS[g % TINTS.length].css} interactive={enabled} />
          ))}
        </div>
      </div>

      {playing && (
        <div
          ref={arenaRef}
          tabIndex={-1}
          role="group"
          aria-label={playLabel}
          className="panel ember-border relative h-[min(72svh,620px)] min-h-[440px] rounded-2xl outline-none"
          data-active="true"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <SkillsBreakout key={round} bricks={bricks} text={text} reducedMotion={!enabled} onEnd={handleEnd} />
          <p className="pointer-events-none absolute right-0 bottom-3 left-0 hidden text-center sm:block" aria-hidden="true">
            <Annotation className="text-[10px] opacity-70">{t.hint}</Annotation>
          </p>

          <AnimatePresence>
            {result && (
              <motion.div
                key="end"
                role="status"
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-background/70 px-6 text-center backdrop-blur-sm"
                initial={enabled ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: enabled ? 0.4 : 0 }}
              >
                <motion.p
                  className={cn(
                    "font-display text-[clamp(2.4rem,9vw,5.5rem)] leading-[0.85] font-extrabold tracking-tight uppercase",
                    result.won ? "text-ember text-glow" : "text-coral",
                  )}
                  initial={enabled ? { scale: 0.7, rotate: -4 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                >
                  {result.won ? t.won : t.lost}
                </motion.p>
                <p className="max-w-sm font-sans text-sm text-muted-foreground">{result.won ? t.wonSub : t.lostSub}</p>
                <p className="font-mono text-xs tracking-[0.18em] text-foreground uppercase">
                  {t.finalScore} <span className="text-amber">{String(result.score).padStart(5, "0")}</span>
                  <span className="text-muted-foreground"> · {t.bestCombo} ×{result.maxCombo}</span>
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    ref={retryRef}
                    type="button"
                    data-cursor="play"
                    onClick={start}
                    className="bg-ember inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 font-mono text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase"
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    {t.retry}
                  </button>
                  <button
                    type="button"
                    onClick={exit}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-5 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
                  >
                    <X className="size-4" aria-hidden="true" />
                    {exitLabel}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

function SkillGroupCard({
  group,
  index,
  tint,
  interactive,
}: {
  group: SkillGroupView
  index: number
  tint: string
  interactive: boolean
}) {
  return (
    <div
      className="panel spotlight group/card relative flex flex-col rounded-xl p-5 sm:p-6"
      style={{ "--tint": tint } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="absolute top-0 left-6 h-px w-16 bg-[var(--tint)] opacity-70 transition-[width] duration-500 group-hover/card:w-28 motion-reduce:transition-none"
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-baseline gap-3 font-display text-lg font-extrabold tracking-tight text-foreground uppercase">
          <span className="font-mono text-xs font-bold text-[var(--tint)]" aria-hidden="true">
            6.{index + 1}
          </span>
          {group.title}
        </h3>
        <Annotation className="shrink-0 pt-1 text-[10px]">{String(group.items.length).padStart(2, "0")}</Annotation>
      </div>
      {group.note && (
        <p className="mt-1.5">
          <Annotation className="normal-case tracking-[0.06em]">{group.note}</Annotation>
        </p>
      )}
      <ul className="mt-5 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li key={item}>
            {interactive ? (
              <Magnetic strength={0.25}>
                <SkillChip label={item} />
              </Magnetic>
            ) : (
              <SkillChip label={item} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-xs text-muted-foreground transition-[color,border-color,box-shadow] duration-300 hover:border-[var(--tint)] hover:text-foreground hover:shadow-[0_0_22px_-4px_var(--tint)]">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--tint)] opacity-70" />
      {label}
    </span>
  )
}
