import { profile, ui, tr, type Locale } from "@/content"
import { Reveal } from "@/components/editorial/reveal"
import { Annotation } from "@/components/editorial/annotation"
import { SocialLinks } from "@/components/social-links"

const NAME_LINES = ["Juan Ignacio", "Rodríguez", "Mariani"]

function HeroBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="hero-glow absolute inset-0" />

      {/* compass: concentric construction arcs, partially off-canvas */}
      <svg
        className="absolute -top-56 -right-56 h-[680px] w-[680px] sm:-top-44 sm:-right-36"
        viewBox="0 0 680 680"
        fill="none"
      >
        <circle cx="340" cy="340" r="120" stroke="var(--hairline)" strokeWidth="1" />
        <circle cx="340" cy="340" r="200" stroke="var(--hairline)" strokeWidth="1" />
        <circle cx="340" cy="340" r="280" stroke="var(--hairline)" strokeWidth="1" />
        <circle
          cx="340"
          cy="340"
          r="332"
          stroke="oklch(0.72 0.19 50 / 0.45)"
          strokeWidth="1.5"
          strokeDasharray="3 11"
        />
        <line x1="340" y1="0" x2="340" y2="680" stroke="var(--hairline)" strokeWidth="1" />
        <line x1="0" y1="340" x2="680" y2="340" stroke="var(--hairline)" strokeWidth="1" />
        <line x1="100" y1="100" x2="580" y2="580" stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="340" cy="340" r="4" fill="oklch(0.72 0.19 50)" />
        <circle cx="340" cy="140" r="3" stroke="oklch(0.72 0.19 50 / 0.7)" strokeWidth="1.5" />
      </svg>

      {/* section-cut hatching, bottom left */}
      <div className="hatch absolute bottom-8 -left-6 h-28 w-44 border border-hairline" />

      {/* vertical drawing-number label, right edge */}
      <span
        className="absolute right-3 bottom-10 hidden font-mono text-[10px] tracking-[0.32em] text-muted-foreground/50 uppercase lg:block"
        style={{ writingMode: "vertical-rl" }}
      >
        juanirmariani.com — DWG № 001 — rev. 2026
      </span>
    </div>
  )
}

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative -mx-4 overflow-hidden px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
      <HeroBackdrop />

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

      <Reveal delay={0.5}>
        <div className="mt-6 max-w-xl">
          <div className="ruler" />
          <div className="mt-1.5 flex justify-between">
            <Annotation className="text-muted-foreground/60">Scale 1:1</Annotation>
            <Annotation className="text-muted-foreground/60">{"UNS '26"}</Annotation>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.6}>
        <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground sm:text-xl">
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
