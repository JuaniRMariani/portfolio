"use client"

import { useEffect, useEffectEvent, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import { SquareTerminal, X } from "lucide-react"
import { experience, profile, projects, skills, ui, tr, type Locale } from "@/content"
import type { ProjectStatus } from "@/content/types"
import { useAnimation } from "@/components/editorial/animation-context"
import { emitFx } from "@/components/fx/scene/store"
import { scrollToTarget, setScrollLocked } from "@/components/fx/smooth-scroll"
import { cn } from "@/lib/utils"
import { ACHIEVEMENT_IDS, usePlay } from "./achievements"
import { TERMINAL_EVENT, startBreakout } from "./events"
import { Konami, isTypingTarget } from "./konami"

/* ─── Output model ─── */

type Tone = "fg" | "muted" | "ember" | "amber" | "coral" | "frost"
type Seg = string | { text: string; tone?: Tone; href?: string; cmd?: string }
interface Line {
  id: number
  segs: Seg[]
  tone?: Tone
  /** Echo of a typed command. */
  input?: boolean
  /** Big display headline (sudo hire-me). */
  big?: boolean
  /** Preformatted decorative art (hidden from AT). */
  art?: boolean
}
type Draft = Omit<Line, "id">
interface Step {
  at: number
  drafts?: Draft[]
  run?: () => void
}

const TONE: Record<Tone, string> = {
  fg: "text-foreground",
  muted: "text-muted-foreground",
  ember: "text-primary",
  amber: "text-amber",
  coral: "text-coral",
  frost: "text-frost",
}

const ln = (segs: Seg | Seg[], tone?: Tone, extra?: Partial<Draft>): Draft => ({
  segs: Array.isArray(segs) ? segs : [segs],
  tone,
  ...extra,
})
const BLANK: Draft = { segs: [" "] }

/** `backticked` words become clickable commands. */
function withCmds(text: string, tone: Tone = "ember"): Seg[] {
  return text.split("`").map((part, i) => (i % 2 ? { text: part, cmd: part, tone } : part))
}

/* ─── Static data ─── */

const SECTIONS: Record<string, string> = {
  top: "#top",
  about: "#about",
  services: "#services",
  experience: "#experience",
  projects: "#projects",
  "how-i-work": "#how-i-work",
  ai: "#how-i-work",
  skills: "#skills",
  contact: "#contact",
}
const SECTION_NAMES = ["about", "services", "experience", "projects", "how-i-work", "skills", "contact", "top"]

const FILES = ["about.md", "experience.log", "projects/", "skills.json", "contact.vcf", "cv.txt"]
const DOTFILES = [".secrets", ".ember"]

const COMPLETIONS = [
  "help",
  "whoami",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
  "open ",
  "sudo hire-me",
  "ember",
  "storm",
  "play",
  "breakout",
  "lang",
  "achievements",
  "ls",
  "cat ",
  "clear",
  "exit",
  "history",
  "pwd",
  "date",
  "echo ",
  "konami",
]
const KNOWN = [...new Set(COMPLETIONS.map((c) => c.trim().split(" ")[0]))]

const STATUS_GLYPH: Record<ProjectStatus, { glyph: string; tone: Tone }> = {
  production: { glyph: "●", tone: "ember" },
  "public-repo": { glyph: "◆", tone: "frost" },
  internal: { glyph: "■", tone: "muted" },
}

const EMBER_ART = String.raw`
              )
           ) \  (
          / ) (  \
         ( (  ) ) )
          \ \(_)/ /
       .---\_____/---.
       |  J · R · M  |
       '-------------'`

function levenshtein(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = temp
    }
  }
  return row[b.length]
}

function commonPrefix(values: string[]) {
  return values.reduce((acc, v) => {
    let i = 0
    while (i < acc.length && acc[i] === v[i]) i++
    return acc.slice(0, i)
  })
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Glass terminal command palette. Opens on `/` or `~` (outside inputs) or
 * the header button's TERMINAL_EVENT; Esc / backdrop closes. Modal dialog
 * with focus trap + focus restore. Tab autocompletes while there is input
 * to complete, otherwise it moves focus (so links stay keyboard reachable).
 */
export function Terminal({ locale }: { locale: Locale }) {
  const { enabled } = useAnimation()
  const { unlock, unlocked } = usePlay()
  const router = useRouter()
  const titleId = useId()
  const inputId = useId()
  const t = ui.terminal

  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState("")
  const [caretAtEnd, setCaretAtEnd] = useState(true)
  const [focused, setFocused] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const nextId = useRef(0)
  const timers = useRef(new Set<number>())
  const booted = useRef(false)
  const history = useRef<string[]>([])
  const historyIndex = useRef(-1)
  const draft = useRef("")

  /* ─── output plumbing ─── */

  function push(drafts: Draft[]) {
    const withIds = drafts.map((d) => ({ ...d, id: nextId.current++ }))
    setLines((prev) => [...prev, ...withIds].slice(-400))
  }

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current.clear()
  }

  /** Timed output; collapses to instant under reduced motion. */
  function schedule(steps: Step[]) {
    for (const step of steps) {
      const fire = () => {
        if (step.drafts) push(step.drafts)
        step.run?.()
      }
      if (!enabled || step.at === 0) {
        fire()
        continue
      }
      const id = window.setTimeout(() => {
        timers.current.delete(id)
        fire()
      }, step.at)
      timers.current.add(id)
    }
  }

  function boot() {
    const bootLines = tr(t.boot, locale)
    schedule([
      ...bootLines.map((text, i) => ({
        at: i * 120,
        drafts: [
          ln(text.startsWith("[ ok ]") ? [{ text: "[ ok ]", tone: "frost" as Tone }, text.slice(6)] : text, "muted"),
        ],
      })),
      { at: bootLines.length * 120 + 140, drafts: [BLANK, ln(withCmds(tr(t.welcome, locale)), "fg")] },
    ])
  }

  /* ─── open / close ─── */

  function show() {
    if (open) return
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOpen(true)
    unlock("terminal")
    if (!booted.current) {
      booted.current = true
      boot()
    }
  }

  function close() {
    clearTimers()
    setOpen(false)
  }

  const onGlobalKey = useEffectEvent((event: KeyboardEvent) => {
    if (open) {
      if (event.key === "Escape") close()
      return
    }
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
    if (event.key !== "/" && event.key !== "~") return
    if (isTypingTarget(event.target)) return
    event.preventDefault()
    show()
  })
  const onOpenEvent = useEffectEvent(() => show())

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => onGlobalKey(event)
    const onOpen = () => onOpenEvent()
    window.addEventListener("keydown", onKey)
    window.addEventListener(TERMINAL_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(TERMINAL_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    setScrollLocked(true)
    if (!enabled) html.style.overflow = "hidden"
    inputRef.current?.focus()
    const toRestore = restoreFocus.current
    return () => {
      setScrollLocked(false)
      html.style.overflow = previousOverflow
      toRestore?.focus({ preventScroll: true })
    }
  }, [open, enabled])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  // keep the newest output in view
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [lines])

  /* ─── commands ─── */

  function goTo(name: string) {
    const selector = SECTIONS[name]
    close()
    window.setTimeout(() => {
      if (document.querySelector(selector)) scrollToTarget(selector)
      else if (name === "top") window.scrollTo({ top: 0, behavior: enabled ? "smooth" : "auto" })
    }, 80)
  }

  function cv(): Draft[] {
    return [
      ln(profile.name.toUpperCase(), "ember"),
      ln(tr(profile.headline, locale), "amber"),
      ln(`${profile.location} · ${profile.links.email}`, "muted"),
      ln("────────────────────────────────", "muted"),
      ...experience.map((job) => ln([`${job.company} — ${tr(job.role, locale)} `, { text: `(${tr(job.period, locale)})`, tone: "muted" }])),
      ln(`${tr(profile.education.degree, locale)} — ${profile.education.institution} (${profile.education.year})`),
      ln(`stack: ${skills.slice(0, 3).flatMap((g) => g.items.slice(0, 3)).join(" · ")}`, "muted"),
      ln([{ text: "LinkedIn ↗", href: profile.links.linkedin, tone: "ember" }, "  ", { text: "GitHub ↗", href: profile.links.github, tone: "ember" }]),
    ]
  }

  function cat(file: string): Draft[] | null {
    switch (file.replace(/^\.\//, "")) {
      case "about.md":
        return run("about")
      case "experience.log":
        return run("experience")
      case "skills.json":
        return run("skills")
      case "contact.vcf":
        return run("contact")
      case "cv.txt":
        return cv()
      case "projects":
      case "projects/":
        return [ln(withCmds("cat: projects/: Is a directory — try `projects`"), "coral")]
      case ".secrets":
        return [ln(`${tr(t.secrets, locale)} ${unlocked.size}/${ACHIEVEMENT_IDS.length}.`, "amber"), ln(withCmds("→ `achievements`"), "muted")]
      case ".ember":
        emitFx("burst")
        return [ln(tr(t.ember, locale), "ember")]
      default:
        return null
    }
  }

  /** Returns output lines; side effects (burst, close, navigate) run inline. */
  function run(raw: string): Draft[] {
    const [headRaw = "", ...rest] = raw.trim().split(/\s+/)
    const head = headRaw.toLowerCase()
    const arg = rest.join(" ")

    switch (head) {
      case "":
        return []
      case "help":
      case "?":
      case "man": {
        const entries = Object.entries(t.commands)
        return [
          ln(tr(t.helpTitle, locale), "muted"),
          ...entries.map(([name, desc]) =>
            ln([{ text: name, cmd: name, tone: "ember" }, " ".repeat(Math.max(2, 15 - name.length)), tr(desc, locale)]),
          ),
          BLANK,
          ln(tr(t.helpFooter, locale), "muted"),
        ]
      }
      case "whoami":
        return [
          ln(profile.name, "fg", { big: true }),
          ln(tr(profile.headline, locale), "amber"),
          ln([{ text: `${tr(t.location, locale).padEnd(10)}`, tone: "muted" }, profile.location]),
          ln([{ text: `${tr(t.status, locale).padEnd(10)}`, tone: "muted" }, { text: `● ${tr(profile.status, locale)}`, tone: "ember" }]),
        ]
      case "about":
        return [
          ...profile.about.flatMap((p, i) => (i ? [BLANK, ln(tr(p, locale), "muted")] : [ln(tr(p, locale), "fg")])),
          BLANK,
          ln([
            { text: `${tr(t.education, locale)}: `, tone: "muted" },
            `${tr(profile.education.degree, locale)} — ${profile.education.institution} (${profile.education.year})`,
          ]),
        ]
      case "experience":
      case "work":
        return experience.flatMap((job, i) => [
          ...(i ? [BLANK] : []),
          ln([{ text: job.company, tone: "ember" }, ` — ${tr(job.role, locale)}`]),
          ln(tr(job.period, locale), "muted"),
          ...job.bullets.map((b) => ln(`  › ${tr(b, locale)}`, "muted")),
        ])
      case "projects": {
        const width = Math.max(...projects.map((p) => p.name.length)) + 2
        return [
          ...projects.flatMap((p) => {
            const status = STATUS_GLYPH[p.status]
            const link = p.links?.live ?? p.links?.github
            return [
              ln([
                { text: `${status.glyph} `, tone: status.tone },
                { text: p.name.padEnd(width), tone: "fg" },
                { text: tr(t.projectStatus[p.status], locale), tone: status.tone },
                ...(link ? ["  ", { text: "↗", href: link, tone: "ember" as Tone }] : []),
              ]),
              ln(`  ${tr(p.role, locale)}`, "muted"),
            ]
          }),
          BLANK,
          ln(withCmds("→ `open projects`"), "muted"),
        ]
      }
      case "skills":
      case "stack": {
        const width = Math.max(...skills.map((g) => tr(g.title, locale).length)) + 2
        return skills.map((g) => ln([{ text: tr(g.title, locale).padEnd(width), tone: "amber" }, g.items.join(" · ")]))
      }
      case "contact":
        return [
          ln([{ text: "email     ", tone: "muted" }, { text: profile.links.email, href: `mailto:${profile.links.email}`, tone: "ember" }]),
          ln([{ text: "github    ", tone: "muted" }, { text: profile.links.github.replace("https://", ""), href: profile.links.github, tone: "ember" }]),
          ln([{ text: "linkedin  ", tone: "muted" }, { text: "in/juan-ignacio-rodriguez-mariani", href: profile.links.linkedin, tone: "ember" }]),
          BLANK,
          ln(withCmds("psst: `sudo hire-me`"), "muted"),
        ]
      case "open":
      case "goto":
      case "cd": {
        const name = arg.toLowerCase().replace(/^[#/~]+/, "").replace(/\/$/, "")
        if (SECTIONS[name]) {
          goTo(name)
          return [ln(`${tr(t.opening, locale)} #${SECTIONS[name].slice(1)} …`, "frost")]
        }
        return [
          ln(
            [tr(t.openUsage, locale), ...SECTION_NAMES.flatMap((s, i) => [...(i ? [" "] : []), { text: s, cmd: `open ${s}`, tone: "ember" as Tone }])],
            "muted",
          ),
        ]
      }
      case "sudo": {
        const what = arg.toLowerCase()
        if (what === "hire-me" || what === "hire me" || what === "hireme") {
          schedule([
            { at: 0, drafts: [ln(tr(t.sudoPrompt, locale), "muted")] },
            { at: 650, drafts: [ln("••••••••", "muted")] },
            { at: 1200, drafts: [ln(tr(t.sudoCheck, locale), "frost")] },
            { at: 2100, drafts: [ln(tr(t.sudoGranted, locale), "ember", { big: true })], run: () => emitFx("burst") },
            { at: 2350, drafts: [ln(EMBER_ART, "ember", { art: true })] },
            {
              at: 2700,
              drafts: [
                ln(tr(t.sudoCta, locale), "fg"),
                ln([
                  { text: `→ ${tr(t.emailMe, locale)}: ${profile.links.email}`, href: `mailto:${profile.links.email}`, tone: "ember" },
                ]),
                ln([{ text: "→ LinkedIn ↗", href: profile.links.linkedin, tone: "ember" }]),
              ],
            },
          ])
          return []
        }
        if (what.startsWith("rm")) return [ln(tr(t.rmrf, locale), "coral")]
        return [ln(tr(t.sudoOther, locale), "coral")]
      }
      case "ember":
      case "storm":
      case "fire":
      case "burst":
        emitFx("burst")
        return [ln(tr(t.ember, locale), "ember")]
      case "play":
      case "breakout":
      case "game":
        close()
        window.setTimeout(startBreakout, 120)
        return [ln(tr(t.play, locale), "frost")]
      case "lang":
      case "locale": {
        const other = locale === "en" ? "es" : "en"
        close()
        window.setTimeout(() => router.push(`/${other}`), enabled ? 250 : 0)
        return [ln(tr(t.lang, locale), "frost")]
      }
      case "achievements":
      case "secrets": {
        const total = ACHIEVEMENT_IDS.length
        const filled = Math.round((unlocked.size / total) * 20)
        return [
          ln([
            { text: `${tr(t.achievementsTitle, locale)} ${unlocked.size}/${total}  `, tone: "muted" },
            { text: "█".repeat(filled), tone: "ember" },
            { text: "░".repeat(20 - filled), tone: "muted" },
          ]),
          ...ACHIEVEMENT_IDS.map((id) => {
            const done = unlocked.has(id)
            const meta = ui.achievements.items[id]
            return ln([
              { text: done ? "[x] " : "[ ] ", tone: done ? "ember" : "muted" },
              { text: done ? tr(meta.title, locale) : "???", tone: done ? "fg" : "muted" },
              { text: `  — ${tr(meta.hint, locale)}`, tone: "muted" },
            ])
          }),
        ]
      }
      case "ls":
      case "dir": {
        const all = /-\w*a/.test(arg)
        const files = all ? ["./", "../", ...DOTFILES, ...FILES] : FILES
        return [ln(files.map((f) => ({ text: f, tone: (f.endsWith("/") ? "frost" : f.startsWith(".") ? "amber" : "fg") as Tone })).flatMap((s, i) => (i ? ["   ", s] : [s])))]
      }
      case "cat":
      case "less":
      case "more": {
        if (!arg) return [ln(`${head}: missing file operand`, "coral")]
        return cat(arg) ?? [ln(`${head}: ${arg}: ${tr(t.noSuchFile, locale)}`, "coral")]
      }
      case "rm":
        return [ln(tr(t.rmrf, locale), "coral")]
      case "pwd":
        return [ln("/home/juani/bahia-blanca", "fg")]
      case "date":
        return [
          ln(
            `${new Date().toLocaleString(locale === "es" ? "es-AR" : "en-US", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "full", timeStyle: "short" })} (ART)`,
            "fg",
          ),
        ]
      case "echo":
        return [ln(arg || " ", "fg")]
      case "history":
        return history.current.map((h, i) => ln([{ text: `${String(i + 1).padStart(3)}  `, tone: "muted" }, { text: h, cmd: h, tone: "fg" }]))
      case "hello":
      case "hi":
      case "hola":
        return [ln(withCmds(locale === "es" ? "¡Hola! Probá `whoami`." : "Hey there! Try `whoami`."), "fg")]
      case "vim":
      case "vi":
      case "nano":
      case "emacs":
        return [ln(tr(t.vim, locale), "amber")]
      case "coffee":
      case "mate":
        return [ln(tr(t.coffee, locale), "amber")]
      case "konami":
        return [ln("↑ ↑ ↓ ↓ ← → ← → B A", "amber")]
      case "clear":
      case "cls":
        setLines([])
        return []
      case "exit":
      case "quit":
      case "q":
      case ":q":
        close()
        return []
      default: {
        const best = KNOWN.map((k) => ({ k, d: levenshtein(head, k) })).sort((a, b) => a.d - b.d)[0]
        const suggestion = best && best.d <= Math.max(2, Math.floor(head.length / 2)) ? best.k : "help"
        return [
          ln([{ text: `${tr(t.notFound, locale)} ${headRaw}`, tone: "coral" }]),
          ln([`${tr(t.didYouMean, locale)} `, { text: suggestion, cmd: suggestion, tone: "ember" }, "?"], "muted"),
        ]
      }
    }
  }

  function submit(raw: string) {
    const command = raw.trim()
    push([{ segs: [command], input: true }])
    setInput("")
    setCaretAtEnd(true)
    historyIndex.current = -1
    if (command) history.current = [...history.current.filter((h) => h !== command), command].slice(-50)
    const output = run(command)
    if (output.length) push(output)
  }

  function runFromClick(command: string) {
    submit(command)
    inputRef.current?.focus()
  }

  /* ─── input handling ─── */

  function browse(direction: -1 | 1) {
    const list = history.current
    if (!list.length) return
    if (historyIndex.current === -1) draft.current = input
    const next = (historyIndex.current === -1 ? list.length : historyIndex.current) + direction
    if (next >= list.length) {
      historyIndex.current = -1
      setInput(draft.current)
    } else {
      historyIndex.current = Math.max(0, next)
      setInput(list[historyIndex.current])
    }
    setCaretAtEnd(true)
  }

  /** Tab completion; returns true when it consumed the key. */
  function complete() {
    const value = input.replace(/^\s+/, "").toLowerCase()
    if (!value) return false
    let candidates: string[]
    if (value.startsWith("open ")) {
      candidates = SECTION_NAMES.filter((s) => s.startsWith(value.slice(5))).map((s) => `open ${s}`)
    } else if (value.startsWith("cat ")) {
      candidates = [...FILES, ...DOTFILES].filter((f) => f.startsWith(value.slice(4))).map((f) => `cat ${f}`)
    } else {
      candidates = COMPLETIONS.filter((c) => c.startsWith(value))
    }
    if (!candidates.length) return false
    if (candidates.length === 1) {
      setInput(candidates[0])
      return true
    }
    const prefix = commonPrefix(candidates)
    if (prefix.length > value.length) setInput(prefix)
    else push([ln(candidates.map((c) => c.trim().split(" ").pop() ?? c).join("   "), "muted")])
    return true
  }

  function syncCaret(el: HTMLInputElement) {
    setCaretAtEnd(el.selectionStart === el.value.length && el.selectionEnd === el.value.length)
  }

  function onInputKey(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      submit(input)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      browse(-1)
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      browse(1)
    } else if (event.key === "Tab" && !event.shiftKey && complete()) {
      event.preventDefault()
      event.stopPropagation()
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault()
      setLines([])
    } else if (event.ctrlKey && event.key.toLowerCase() === "c" && event.currentTarget.selectionStart === event.currentTarget.selectionEnd) {
      event.preventDefault()
      push([{ segs: [`${input}^C`], input: true }])
      setInput("")
    }
  }

  function onDialogKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      close()
      return
    }
    if (event.key !== "Tab" || !dialogRef.current) return
    const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (!nodes.length) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const fakeCaret = focused && caretAtEnd

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal"
            data-lenis-prevent
            className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: enabled ? 0.25 : 0 }}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={close} />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onKeyDown={onDialogKey}
              onClick={(event) => {
                // click anywhere (except controls / selecting text) focuses the prompt
                const target = event.target as HTMLElement
                if (target.closest("a, button, input")) return
                if (window.getSelection()?.toString()) return
                inputRef.current?.focus()
              }}
              className="panel relative flex h-[min(38rem,calc(100dvh-1.5rem))] w-full max-w-3xl flex-col overflow-hidden rounded-xl shadow-[0_40px_120px_-30px_oklch(0.74_0.22_46/0.45)]"
              style={{ transformPerspective: 1200 }}
              initial={enabled ? { opacity: 0, y: 40, scale: 0.94, rotateX: 10 } : false}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={enabled ? { opacity: 0, y: 24, scale: 0.96 } : { opacity: 0 }}
              transition={enabled ? { type: "spring", stiffness: 260, damping: 26 } : { duration: 0 }}
            >
              {/* atmosphere: ember glow + scanlines */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,oklch(0.74_0.22_46/0.16),transparent_70%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(0deg,oklch(1_0_0/0.5)_0,oklch(1_0_0/0.5)_1px,transparent_1px,transparent_3px)]"
              />

              {/* title bar */}
              <div className="relative flex items-center gap-3 border-b border-hairline py-1 pr-1 pl-4">
                <div aria-hidden="true" className="flex gap-2">
                  <span className="size-3 rounded-full bg-coral shadow-[0_0_10px_var(--coral)]" />
                  <span className="size-3 rounded-full bg-amber" />
                  <span className="size-3 rounded-full bg-frost/80" />
                </div>
                <h2
                  id={titleId}
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 truncate font-mono text-xs tracking-wide text-muted-foreground"
                >
                  <SquareTerminal className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{tr(t.title, locale)}</span>
                  <span className="sr-only"> — {tr(t.dialog, locale)}</span>
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label={tr(t.close, locale)}
                  className="flex size-11 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <div aria-hidden="true" className="bg-ember h-px opacity-50" />

              {/* output + prompt */}
              <div
                ref={logRef}
                className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[13px] leading-relaxed [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] sm:px-6"
              >
                <div role="log" aria-live="polite" aria-relevant="additions" className="space-y-0.5">
                  {lines.map((line) => (
                    <LineView key={line.id} line={line} enabled={enabled} onCommand={runFromClick} />
                  ))}
                </div>
                <form
                  className="mt-1 flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    submit(input)
                  }}
                >
                  <label htmlFor={inputId} className="sr-only">
                    {tr(t.inputLabel, locale)}
                  </label>
                  <Prompt />
                  <div className="relative min-w-0 flex-1">
                    <input
                      ref={inputRef}
                      id={inputId}
                      value={input}
                      onChange={(event) => {
                        setInput(event.target.value)
                        historyIndex.current = -1
                        syncCaret(event.currentTarget)
                      }}
                      onSelect={(event) => syncCaret(event.currentTarget)}
                      onKeyDown={onInputKey}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="send"
                      className="min-h-8 w-full bg-transparent text-foreground outline-none"
                      style={{ caretColor: fakeCaret ? "transparent" : "var(--primary)" }}
                    />
                    {fakeCaret && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 h-[1.25em] w-[1ch] -translate-y-1/2 bg-primary shadow-[0_0_14px_var(--ember)]"
                        style={{ left: `min(${input.length}ch, calc(100% - 1ch))` }}
                        animate={enabled ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
                        transition={enabled ? { duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" } : { duration: 0 }}
                      />
                    )}
                  </div>
                </form>
              </div>

              {/* status bar */}
              <div className="relative flex items-center justify-between gap-3 border-t border-hairline px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                <span className="hidden sm:inline">esc · tab · ↑↓</span>
                <span className="flex items-center gap-2">
                  <span className="status-pulse size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  zsh · utf-8
                </span>
                <span className="text-primary tabular-nums">
                  ◆ {unlocked.size}/{ACHIEVEMENT_IDS.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Konami />
    </>
  )
}

function Prompt() {
  return (
    <span aria-hidden="true" className="shrink-0 select-none">
      <span className="hidden text-primary sm:inline">juani@bahia-blanca</span>
      <span className="hidden text-muted-foreground sm:inline">:</span>
      <span className="text-frost">~</span>
      <span className="text-muted-foreground">$</span>
    </span>
  )
}

function LineView({ line, enabled, onCommand }: { line: Line; enabled: boolean; onCommand: (command: string) => void }) {
  return (
    <motion.div
      initial={enabled ? { opacity: 0, x: -8 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      aria-hidden={line.art || undefined}
      className={cn(
        "break-words whitespace-pre-wrap",
        TONE[line.tone ?? "fg"],
        line.big && "text-ember text-glow py-1 font-display text-2xl leading-tight font-extrabold tracking-tight uppercase sm:text-3xl",
        line.art && "overflow-x-auto py-1 leading-tight whitespace-pre",
      )}
    >
      {line.input && (
        <>
          <Prompt />{" "}
        </>
      )}
      {line.segs.map((seg, i) => {
        if (typeof seg === "string") return <span key={i}>{seg}</span>
        const tone = seg.tone ? TONE[seg.tone] : undefined
        if (seg.href) {
          const external = !seg.href.startsWith("mailto:")
          return (
            <a
              key={i}
              href={seg.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={cn("underline decoration-primary/50 underline-offset-4 transition-colors hover:text-amber hover:decoration-amber", tone)}
            >
              {seg.text}
            </a>
          )
        }
        if (seg.cmd) {
          const command = seg.cmd
          return (
            <button
              key={i}
              type="button"
              onClick={() => onCommand(command)}
              className={cn(
                "cursor-pointer underline decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-amber hover:decoration-solid",
                tone,
              )}
            >
              {seg.text}
            </button>
          )
        }
        return (
          <span key={i} className={tone}>
            {seg.text}
          </span>
        )
      })}
    </motion.div>
  )
}
