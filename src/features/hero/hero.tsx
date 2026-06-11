import { profile, ui, tr, type Locale } from "@/content"
import { Reveal } from "@/components/editorial/reveal"
import { Annotation } from "@/components/editorial/annotation"
import { SocialLinks } from "@/components/social-links"

const NAME_LINES = ["Juan Ignacio", "Rodríguez", "Mariani"]

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative -mx-4 overflow-hidden px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="blueprint-grid absolute inset-0 -z-10" aria-hidden="true" />

      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-hairline pb-3">
          <Annotation>{tr(ui.hero.kicker, locale)}</Annotation>
          <Annotation className="hidden sm:inline">38.72°S / 62.27°W — {profile.location}</Annotation>
        </div>
      </Reveal>

      <h1 className="mt-10 font-display font-extrabold tracking-tight uppercase">
        {NAME_LINES.map((line, i) => (
          <Reveal key={line} as="span" delay={0.1 + i * 0.14} className="block">
            <span
              className={`block text-[clamp(2.6rem,9.5vw,6.75rem)] leading-[0.98] ${
                i === NAME_LINES.length - 1 ? "text-primary" : "text-foreground"
              }`}
            >
              {line}
            </span>
          </Reveal>
        ))}
      </h1>

      <Reveal delay={0.55}>
        <p className="mt-7 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {tr(profile.headline, locale)}
        </p>
      </Reveal>

      <Reveal delay={0.7}>
        <p className="mt-5 flex items-center gap-2.5 font-mono text-xs text-muted-foreground sm:text-sm">
          <span className="status-pulse size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          {tr(profile.status, locale)}
        </p>
      </Reveal>

      <Reveal delay={0.85}>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-mono text-sm font-bold tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            {tr(ui.hero.viewProjects, locale)}
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center rounded-sm border border-border px-5 py-2.5 font-mono text-sm tracking-wide text-foreground uppercase transition-colors hover:border-primary hover:text-primary"
          >
            {tr(ui.hero.getInTouch, locale)}
          </a>
          <SocialLinks />
        </div>
      </Reveal>
    </section>
  )
}
