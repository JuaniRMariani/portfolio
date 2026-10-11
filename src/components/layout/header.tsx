import Link from "next/link"
import { ui, tr, type Locale } from "@/content"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { SkipButton } from "@/components/editorial/skip-button"
import { AchievementsBadge } from "@/components/play/achievements"
import { TerminalButton } from "@/components/play/terminal-button"

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
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-5 sm:top-4">
      <div className="panel mx-auto flex h-14 max-w-6xl items-center gap-4 rounded-xl px-3 sm:px-4">
        <Link
          href={`/${locale}`}
          className="group flex shrink-0 items-baseline gap-1 font-display text-lg font-extrabold tracking-tight text-foreground"
        >
          JRM
          <span
            className="bg-ember size-2 rounded-full shadow-[0_0_10px_var(--ember)] transition-transform duration-500 group-hover:scale-150"
            aria-hidden="true"
          />
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-2">
          <TerminalButton label={tr(ui.play.terminal, locale)} />
          <AchievementsBadge />
          <span className="hidden sm:block">
            <SkipButton label={tr(ui.skipAnimation, locale)} />
          </span>
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}
