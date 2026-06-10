import Link from "next/link"
import { ui, tr, type Locale } from "@/content"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { SkipButton } from "@/components/terminal/skip-button"

export function Header({ locale }: { locale: Locale }) {
  const navItems = [
    { href: "#about", label: tr(ui.nav.about, locale) },
    { href: "#experience", label: tr(ui.nav.experience, locale) },
    { href: "#projects", label: tr(ui.nav.projects, locale) },
    { href: "#ai-engineering", label: tr(ui.nav.ai, locale) },
    { href: "#skills", label: tr(ui.nav.skills, locale) },
    { href: "#contact", label: tr(ui.nav.contact, locale) },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-4xl items-center gap-3 px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-term-red/80" />
          <span className="size-2.5 rounded-full bg-term-yellow/80" />
          <span className="size-2.5 rounded-full bg-term-green/80" />
        </div>
        <Link
          href={`/${locale}`}
          className="truncate font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {tr(ui.terminal.sessionTitle, locale)}
        </Link>
        <nav className="ml-auto hidden items-center gap-4 font-mono text-xs lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <SkipButton label={tr(ui.skipAnimation, locale)} />
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}
