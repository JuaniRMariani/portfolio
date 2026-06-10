import { profile, tr, type Locale } from "@/content"
import { Reveal } from "@/components/terminal/reveal"
import { TypeLine } from "@/components/terminal/type-line"
import { SocialLinks } from "@/components/social-links"

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="hero-mesh -mx-4 px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
      <TypeLine text="claude --profile juani" withCursor className="text-sm text-foreground sm:text-base" />

      <Reveal delay={0.8}>
        <p className="mt-5 font-mono text-xs text-term-dim">
          ▸ {locale === "en" ? "Reading profile…" : "Leyendo perfil…"}
        </p>
      </Reveal>

      <Reveal delay={1.1}>
        <h1 className="glow mt-5 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          JUAN IGNACIO
          <br />
          RODRÍGUEZ MARIANI
        </h1>
      </Reveal>

      <Reveal delay={1.5}>
        <p className="mt-5 max-w-xl font-mono text-sm text-muted-foreground sm:text-base">
          {tr(profile.headline, locale)}
        </p>
      </Reveal>

      <Reveal delay={1.7}>
        <p className="mt-4 font-mono text-xs text-muted-foreground sm:text-sm">
          <span className="glow-green text-term-green" aria-hidden="true">
            ⏺{" "}
          </span>
          {tr(profile.status, locale)}
          <span className="text-term-dim"> · {profile.location}</span>
        </p>
      </Reveal>

      <Reveal delay={1.9} className="mt-7">
        <SocialLinks />
      </Reveal>
    </section>
  )
}
