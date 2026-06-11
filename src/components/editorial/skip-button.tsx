"use client"

import { useAnimation } from "./animation-context"

export function SkipButton({ label }: { label: string }) {
  const { enabled, skip } = useAnimation()
  if (!enabled) return null

  return (
    <button
      type="button"
      onClick={skip}
      className="cursor-pointer rounded-sm border border-border px-2 py-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase transition-colors hover:border-primary hover:text-primary"
    >
      {label}
    </button>
  )
}
