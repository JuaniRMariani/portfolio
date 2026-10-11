import { ArrowUpRight } from "lucide-react"
import { profile, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"
import { Marquee } from "@/components/fx/marquee"
import { Magnetic } from "@/components/fx/magnetic"
import { SocialLinks } from "@/components/social-links"
import { CopyEmail, FullBleed, TerminalHint } from "./contact-fx"

/* Bilingual on purpose: each locale leads with its own language. */
const BAND = {
  en: ["Let's build something", "Hablemos"],
  es: ["Construyamos algo", "Let's talk"],
} as const

const BAND_TYPE =
  "font-display text-[clamp(4.25rem,15vw,13rem)] leading-[0.95] font-extrabold tracking-tighter whitespace-nowrap uppercase"

function EmberDot() {
  return (
    <span className="mx-[0.25em] inline-block size-[0.16em] shrink-0 rounded-full bg-primary shadow-[0_0_0.4em_var(--ember)]" />
  )
}

export function Contact({ locale }: { locale: Locale }) {
  const [lead, echo] = BAND[locale]
  const ticker = [tr(profile.status, locale), profile.location, "UTC−3", "remote-friendly"]

  return (
    <SectionShell id="contact" index="07" title={tr(ui.nav.contact, locale)}>
      {/* velocity-reactive giant band (decorative — the heading below carries the message) */}
      <FullBleed className="border-y border-hairline py-6 sm:py-10">
        <div aria-hidden="true">
          <Marquee speed={70}>
            <span className={`${BAND_TYPE} flex items-center pr-[0.25em]`}>
              <span className="text-transparent [-webkit-text-stroke:2px_var(--ember)]">{lead}</span>
              <EmberDot />
              <span className="text-ember">{echo}</span>
              <EmberDot />
            </span>
          </Marquee>
          <Marquee speed={30} reverse className="mt-3 sm:mt-5">
            <span className="flex items-center font-mono text-[11px] tracking-[0.28em] whitespace-nowrap text-muted-foreground uppercase">
              {ticker.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="px-5">{item}</span>
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </span>
          </Marquee>
        </div>
      </FullBleed>

      <div className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div>
          <Annotation className="text-primary">{"// open channel"}</Annotation>
          <h3 className="mt-3 font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.88] font-extrabold tracking-tighter text-foreground uppercase">
            {tr(ui.contact.heading, locale)}
            <span className="text-primary">.</span>
          </h3>
          <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-muted-foreground">
            {tr(ui.contact.body, locale)}
          </p>
        </div>

        <div className="flex flex-col items-start gap-6 lg:items-end">
          <p className="inline-flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
            <span className="status-pulse size-2 rounded-full bg-primary" aria-hidden="true" />
            {tr(profile.status, locale)}
          </p>
          <Magnetic strength={0.3}>
            <a
              href={`mailto:${profile.links.email}`}
              className="group bg-ember glow-ember inline-flex min-h-14 items-center gap-3 rounded-full px-8 font-mono text-sm font-bold tracking-[0.14em] text-primary-foreground uppercase transition-[filter,box-shadow] duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(0.74_0.22_46/0.6),0_18px_60px_-10px_oklch(0.74_0.22_46/0.8)]"
            >
              {tr(ui.contact.cta, locale)}
              <ArrowUpRight
                className="size-5 transition-transform duration-300 group-hover:rotate-45"
                aria-hidden="true"
              />
            </a>
          </Magnetic>
          <SocialLinks />
        </div>
      </div>

      <div className="mt-16 border-t border-hairline pt-8 sm:mt-20">
        <Annotation>Fig. 07 — email</Annotation>
        <div className="mt-3">
          <CopyEmail email={profile.links.email} />
        </div>
      </div>

      <TerminalHint text={tr(ui.play.hint, locale)} className="mt-10" />
    </SectionShell>
  )
}
