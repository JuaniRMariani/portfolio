"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "motion/react"
import { Trophy, Lock, X } from "lucide-react"
import { ui, tr, type Locale } from "@/content"
import { cn } from "@/lib/utils"

export const ACHIEVEMENT_IDS = [
  "scatter",
  "terminal",
  "konami",
  "breakout",
  "copy-email",
  "hidden-ember",
  "the-end",
] as const
export type AchievementId = (typeof ACHIEVEMENT_IDS)[number]

const STORAGE_KEY = "jrm-achievements"

interface Toast {
  id: number
  title: string
  body?: string
  trophy: boolean
}

interface PlayState {
  unlocked: ReadonlySet<AchievementId>
  unlock: (id: AchievementId) => void
  toast: (title: string, body?: string) => void
  locale: Locale
}

const PlayContext = createContext<PlayState>({
  unlocked: new Set(),
  unlock: () => {},
  toast: () => {},
  locale: "en",
})

export function usePlay() {
  return useContext(PlayContext)
}

function readStored(): AchievementId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
    return Array.isArray(raw) ? raw.filter((id): id is AchievementId => ACHIEVEMENT_IDS.includes(id)) : []
  } catch {
    return []
  }
}

/* Unlocked set lives outside React (hydrated lazily from localStorage) and
   is exposed via useSyncExternalStore so SSR renders an empty, stable set. */
const EMPTY: ReadonlySet<AchievementId> = new Set()
let unlockedStore: ReadonlySet<AchievementId> | null = null
const storeListeners = new Set<() => void>()

function getUnlocked() {
  if (!unlockedStore) unlockedStore = new Set(readStored())
  return unlockedStore
}

function subscribeUnlocked(listener: () => void) {
  storeListeners.add(listener)
  return () => {
    storeListeners.delete(listener)
  }
}

/** Adds an achievement; returns the new count, or 0 if it was already unlocked. */
function addUnlocked(id: AchievementId) {
  const current = getUnlocked()
  if (current.has(id)) return 0
  const next = new Set(current).add(id)
  unlockedStore = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  } catch {
    // progress just won't persist
  }
  storeListeners.forEach((listener) => listener())
  return next.size
}

/**
 * Achievements + toasts. Progress persists per browser (best effort —
 * storage may be blocked) and every unlock pops a toast.
 */
export function PlayProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const unlocked = useSyncExternalStore(subscribeUnlocked, getUnlocked, () => EMPTY)
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++nextId.current
    setToasts((list) => [...list.slice(-2), { ...toast, id }])
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200)
  }, [])

  const unlock = useCallback(
    (id: AchievementId) => {
      const count = addUnlocked(id)
      if (!count) return
      const meta = ui.achievements.items[id]
      push({
        title: `${tr(ui.achievements.unlocked, locale)} · ${count}/${ACHIEVEMENT_IDS.length}`,
        body: tr(meta.title, locale),
        trophy: true,
      })
    },
    [locale, push],
  )

  const toast = useCallback((title: string, body?: string) => push({ title, body, trophy: false }), [push])

  const value = useMemo(() => ({ unlocked, unlock, toast, locale }), [unlocked, unlock, toast, locale])

  return (
    <PlayContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 bottom-4 z-[150] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="panel flex items-start gap-3 rounded-lg p-3.5"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-md",
                  t.trophy ? "bg-ember text-primary-foreground glow-ember" : "bg-primary/15 text-primary",
                )}
              >
                <Trophy className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-primary uppercase">{t.title}</p>
                {t.body && <p className="mt-0.5 font-sans text-sm text-foreground">{t.body}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PlayContext.Provider>
  )
}

/** Header badge "◆ 3/7" that opens the achievements panel. */
export function AchievementsBadge() {
  const { unlocked, locale } = usePlay()
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    const onClick = (event: MouseEvent) => {
      if (panel.current && !panel.current.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("mousedown", onClick)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("mousedown", onClick)
    }
  }, [open])

  const total = ACHIEVEMENT_IDS.length
  return (
    <div ref={panel} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={tr(ui.achievements.label, locale)}
        className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Trophy className={cn("size-3.5", unlocked.size > 0 && "text-primary")} aria-hidden="true" />
        <span className="tabular-nums">
          {unlocked.size}/{total}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="panel absolute top-[calc(100%+0.6rem)] right-0 w-[min(20rem,calc(100vw-2rem))] rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
                {tr(ui.achievements.label, locale)} · {unlocked.size}/{total}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tr(ui.achievements.close, locale)}
                className="flex size-8 cursor-pointer items-center justify-center rounded text-muted-foreground hover:text-primary"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
              <div className="bg-ember h-full transition-[width] duration-700" style={{ width: `${(unlocked.size / total) * 100}%` }} />
            </div>
            <ul className="mt-3 space-y-2">
              {ACHIEVEMENT_IDS.map((id) => {
                const done = unlocked.has(id)
                const meta = ui.achievements.items[id]
                return (
                  <li key={id} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded",
                        done ? "bg-ember text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? <Trophy className="size-3" aria-hidden="true" /> : <Lock className="size-3" aria-hidden="true" />}
                    </span>
                    <div>
                      <p className={cn("font-sans text-sm", done ? "text-foreground" : "text-muted-foreground")}>
                        {done ? tr(meta.title, locale) : "???"}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">{tr(meta.hint, locale)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
