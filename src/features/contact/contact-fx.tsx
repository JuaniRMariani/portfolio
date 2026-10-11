"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { ScrambleText } from "@/components/fx/scramble-text"
import { usePlay } from "@/components/play/achievements"
import { openTerminal } from "@/components/play/events"
import { ui, tr } from "@/content"
import { cn } from "@/lib/utils"

/**
 * Breaks out of the centered container to span the viewport. Width is
 * pinned to the html client width (excludes the scrollbar) so `w-screen`
 * never causes horizontal scroll on desktop.
 */
export function FullBleed({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      el.style.width = `${document.documentElement.clientWidth}px`
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden", className)}>
      {children}
    </div>
  )
}

/** Giant decoding email: click copies it (toast + achievement), mailto stays as a real link beside it. */
export function CopyEmail({ email }: { email: string }) {
  const { unlock, toast, locale } = usePlay()
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      window.location.href = `mailto:${email}`
      return
    }
    setCopied(true)
    toast(tr(ui.play.copied, locale))
    unlock("copy-email")
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2400)
  }

  return (
    <div>
      <button
        type="button"
        data-cursor="copy"
        onClick={copy}
        aria-label={`${email} — ${tr(ui.play.copyHint, locale)}`}
        className="group relative block max-w-full cursor-pointer rounded-sm py-2 text-left"
      >
        <ScrambleText
          text={email}
          trigger="hover"
          duration={700}
          className="block font-display text-[clamp(1.3rem,6.4vw,5.25rem)] leading-none font-extrabold tracking-tight break-all text-foreground transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary"
        />
        <span
          aria-hidden="true"
          className="bg-ember mt-3 block h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1">
        <span
          aria-live="polite"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-primary uppercase"
        >
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? tr(ui.play.copied, locale) : tr(ui.play.copyHint, locale)}
        </span>
        <a
          href={`mailto:${email}`}
          className="link-sweep inline-flex min-h-11 items-center font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          mailto:{email} ↗
        </a>
      </div>
    </div>
  )
}

/** "Press / for the terminal" hint — also a real button for touch users. */
export function TerminalHint({ text, className }: { text: string; className?: string }) {
  const [before, after] = text.includes(" / ") ? text.split(" / ") : [text, ""]
  return (
    <button
      type="button"
      onClick={openTerminal}
      className={cn(
        "group inline-flex min-h-11 cursor-pointer flex-wrap items-center gap-x-2 gap-y-1 rounded-md px-1 text-left font-mono text-xs text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <span className="status-pulse size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
      <span>{before}</span>
      {after && (
        <>
          <kbd className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-primary shadow-[0_2px_0_var(--border)] transition-colors group-hover:border-primary">
            /
          </kbd>
          <span>{after}</span>
        </>
      )}
    </button>
  )
}
