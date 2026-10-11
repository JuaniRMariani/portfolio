import { profile, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"
import { Reveal } from "@/components/editorial/reveal"
import { Portrait } from "./portrait"
import { ScrubLead } from "./scrub-lead"
import { HuntEmber } from "@/components/play/ember-hunt"

/** Bahía Blanca, Argentina. */
const COORDS = "38.7183° S · 62.2663° W"

/** Words in the lead that settle in ember instead of white. */
const ACCENTS = {
  en: ["fast", "scalable", "production"],
  es: ["rápidas", "escalables", "producción"],
}

export function About({ locale }: { locale: Locale }) {
  const [lead, ...rest] = profile.about

  return (
    <SectionShell id="about" index="01" title={tr(ui.nav.about, locale)}>
      <div className="relative grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
        <HuntEmber n={1} className="-top-8 left-[52%]" />
        <HuntEmber n={2} className="-bottom-12 right-[8%] lg:right-[42%]" />
        <div className="order-2 lg:order-1">
          <Annotation className="text-primary">{"// 01.1 — profile"}</Annotation>
          {lead && (
            <ScrubLead
              text={tr(lead, locale)}
              accents={ACCENTS[locale]}
              className="mt-4 font-display text-[clamp(1.5rem,3.2vw,2.55rem)] leading-[1.16] font-bold tracking-tight text-balance"
            />
          )}
          {rest.map((paragraph, i) => (
            <p key={i} className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              {tr(paragraph, locale)}
            </p>
          ))}

          <Reveal delay={0.15} className="mt-10">
            <p className="inline-flex max-w-full -rotate-2 items-center gap-4 rounded-md border-2 border-primary/80 bg-primary/5 px-4 py-3 text-primary shadow-[inset_0_0_0_3px_var(--background),inset_0_0_0_4px_oklch(0.74_0.22_46/0.45),0_0_40px_-12px_oklch(0.74_0.22_46/0.6)]">
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary font-display text-sm font-extrabold tracking-tight"
              >
                {profile.education.year}
              </span>
              <span className="min-w-0 font-mono text-[11px] leading-relaxed tracking-[0.16em] uppercase">
                <span className="block font-bold text-foreground">{tr(profile.education.degree, locale)}</span>
                {profile.education.institution} · {profile.education.year}
              </span>
            </p>
          </Reveal>
        </div>

        <div className="order-1 lg:sticky lg:top-28 lg:order-2">
          <Portrait alt={profile.name} location={profile.location} coords={COORDS} />
        </div>
      </div>
    </SectionShell>
  )
}
