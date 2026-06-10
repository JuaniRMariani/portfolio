"use client"

import { useAnimation } from "./animation-context"

export function SkipButton({ label }: { label: string }) {
  const { enabled, skip } = useAnimation()
  if (!enabled) return null

  return (
    <button
      type="button"
      onClick={skip}
      className="cursor-pointer rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {label}
    </button>
  )
}
