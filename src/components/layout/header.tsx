import Link from "next/link"
import { ui, tr, type Locale } from "@/content"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { SkipButton } from "@/components/editorial/skip-button"

export function Header({ locale }: { locale: Locale }) {
  const navItems = [
    { href: "#about", label: tr(ui.nav.about, locale) },
    { href: "#experience", label: tr(ui.nav.experience, locale) },
    { href: "#projects", label: tr(ui.nav.projects, locale) },
    { href: "#how-i-work", label: tr(ui.nav.ai, locale) },
    { href: "#skills", label: tr(ui.nav.skills, locale) },
    { href: "#contact", label: tr(ui.nav.contact, locale) },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-13 max-w-5xl items-center gap-4 px-4">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-baseline gap-1.5 font-display text-base font-extrabold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          JRM
          <span className="size-1.5 translate-y-px bg-primary" aria-hidden="true" />
        </Link>
        <nav className="ml-auto hidden items-center gap-5 lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-primary"
            >
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
