"use client"

import { SquareTerminal } from "lucide-react"
import { openTerminal } from "./events"

export function TerminalButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openTerminal}
      aria-label={label}
      title={`${label} ( / )`}
      className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <SquareTerminal className="size-3.5" aria-hidden="true" />
      <kbd className="hidden font-mono sm:inline">/</kbd>
    </button>
  )
}
