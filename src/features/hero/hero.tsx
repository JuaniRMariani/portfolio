import { ArrowDownRight, MousePointerClick } from "lucide-react"
import { profile, ui, tr, type Locale } from "@/content"
import { Reveal } from "@/components/editorial/reveal"
import { Annotation } from "@/components/editorial/annotation"
import { SocialLinks } from "@/components/social-links"
import { Magnetic } from "@/components/fx/magnetic"
import { SplitWords } from "@/components/fx/split-words"
import { HeroInteraction } from "./hero-interaction"

const NAME_LINES = ["Juan Ignacio", "Rodríguez Mariani"]

export function Hero({ locale }: { locale: Locale }) {
  const spec = [
    { k: locale === "en" ? "Role" : "Rol", v: locale === "en" ? "Software Engineer" : "Ingeniero de Software" },
    { k: locale === "en" ? "Base" : "Base", v: profile.location },
    { k: "Stack", v: "Laravel · Next.js · Linux · AI" },
  ]

  return (
    <HeroInteraction>
      <div className="relative mx-auto w-full max-w-6xl">
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="panel inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
              <span className="status-pulse size-2 rounded-full bg-primary" aria-hidden="true" />
              {tr(profile.status, locale)}
            </span>
            <Annotation className="hidden sm:inline">38.7183° S · 62.2663° W</Annotation>
          </div>
        </Reveal>

        {/* The real heading: visible until the particle twin has assembled
            over it (html[data-particles]), always present for SEO / AT. */}
        <h1
          id="hero-name"
          className="hero-name mt-8 font-display leading-[0.86] font-extrabold tracking-[-0.045em] uppercase sm:mt-10"
        >
          {NAME_LINES.map((line, i) => (
            <Reveal key={line} as="span" delay={0.2 + i * 0.12} className="block">
              <span
                data-line
                className={
                  i === 0
                    ? "block text-[clamp(2.6rem,10.5vw,9.5rem)] text-foreground"
                    : "text-ember block text-[clamp(2.6rem,10.5vw,9.5rem)]"
                }
              >
                {line}
              </span>
            </Reveal>
          ))}
        </h1>

        <div className="mt-8 grid gap-10 sm:mt-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="max-w-2xl font-sans text-lg leading-relaxed text-foreground/90 sm:text-2xl sm:leading-snug">
              <SplitWords text={tr(profile.headline, locale)} delay={0.5} />
            </p>

            <Reveal delay={0.75}>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <Magnetic>
                  <a
                    href="#projects"
                    data-cursor="view"
                    className="bg-ember group glow-ember inline-flex min-h-13 items-center gap-2 rounded-full px-7 py-3 font-mono text-sm font-bold tracking-wide text-primary-foreground uppercase transition-[filter] hover:brightness-110"
                  >
                    {tr(ui.hero.viewProjects, locale)}
                    <ArrowDownRight
                      className="size-4 transition-transform duration-300 group-hover:rotate-[-45deg]"
                      aria-hidden="true"
                    />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#contact"
                    className="panel inline-flex min-h-13 items-center rounded-full px-7 py-3 font-mono text-sm tracking-wide text-foreground uppercase transition-colors hover:text-primary"
                  >
                    {tr(ui.hero.getInTouch, locale)}
                  </a>
                </Magnetic>
                <SocialLinks />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.9}>
            <dl className="panel hidden rounded-xl p-5 font-mono text-xs lg:block">
              {spec.map((row, i) => (
                <div
                  key={row.k}
                  className={`flex items-baseline justify-between gap-6 py-2 ${i > 0 ? "border-t border-hairline" : ""}`}
                >
                  <dt className="tracking-[0.18em] text-muted-foreground uppercase">{row.k}</dt>
                  <dd className="text-right text-foreground">{row.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <div className="hero-hint pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex w-full max-w-6xl items-end justify-between px-4 sm:px-6">
        <span className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          <span className="relative block h-10 w-px overflow-hidden bg-hairline" aria-hidden="true">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-primary" />
          </span>
          {tr(ui.play.scroll, locale)}
        </span>
        <span className="particles-hint flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-primary uppercase">
          <MousePointerClick className="size-3.5" aria-hidden="true" />
          {tr(ui.play.heroHint, locale)}
        </span>
      </div>
    </HeroInteraction>
  )
}
