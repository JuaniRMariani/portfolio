import { cn } from "@/lib/utils"

export function Cursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "cursor-blink ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-primary",
        className,
      )}
    />
  )
}
