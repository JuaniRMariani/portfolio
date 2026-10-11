import Link from "next/link"
import { ui, tr, type Locale } from "@/content"

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const other: Locale = locale === "en" ? "es" : "en"

  return (
    <Link
      href={`/${other}`}
      aria-label={tr(ui.switchLocale, locale)}
      className="flex min-h-9 items-center rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {other.toUpperCase()}
    </Link>
  )
}
