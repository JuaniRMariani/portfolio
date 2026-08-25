import { profile, ui, tr, type Locale } from "@/content"
import { Reveal } from "@/components/editorial/reveal"
import { SocialLinks } from "@/components/social-links"

const NAME_LINES = ["Juan Ignacio", "Rodríguez Mariani"]

function VideoBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
        src="https://xenova.com.ar/media/ai/videos/hero-bg.mp4"
      />
      {/* Gradients to blend video with background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.85)_100%)]" />
    </div>
  )
}

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-visible px-4 pt-40 pb-28 text-center min-h-[85vh]">
      <VideoBackdrop />

      <Reveal delay={0.1}>
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-primary backdrop-blur-md shadow-xl">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          {tr(profile.status, locale)}
        </div>
      </Reveal>

      <h1 className="font-display font-extrabold tracking-tight uppercase flex flex-col items-center z-10 relative">
        {NAME_LINES.map((line, i) => (
          <Reveal key={line} as="span" delay={0.2 + i * 0.15} className="block">
            <span
              className={`block text-[clamp(2rem,7vw,5.5rem)] leading-[1] tracking-tighter ${
                i === NAME_LINES.length - 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400" : "text-foreground"
              }`}
            >
              {line}
            </span>
          </Reveal>
        ))}
      </h1>

      <Reveal delay={0.5}>
        <p className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {tr(profile.headline, locale)}
        </p>
      </Reveal>

      <Reveal delay={0.7}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-3 font-mono text-sm font-bold tracking-wide text-primary-foreground uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_oklch(0.72_0.19_50/0.5)]"
          >
            {tr(ui.hero.viewProjects, locale)}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center rounded-full border border-border/80 bg-background/50 backdrop-blur-md px-8 py-3 font-mono text-sm tracking-wide text-foreground uppercase transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
          >
            {tr(ui.hero.getInTouch, locale)}
          </a>
        </div>
      </Reveal>
      
      <Reveal delay={0.8}>
        <div className="mt-8 flex justify-center">
          <SocialLinks />
        </div>
      </Reveal>
    </section>
  )
}
