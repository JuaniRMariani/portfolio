import { Mail } from "lucide-react"
import { profile, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { SocialLinks } from "@/components/social-links"

export function Contact({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="contact" index="06" title={tr(ui.nav.contact, locale)}>
      <h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground uppercase sm:text-5xl">
        {tr(ui.contact.heading, locale)}
      </h3>
      <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
        {tr(ui.contact.body, locale)}
      </p>
      <a
        href={`mailto:${profile.links.email}`}
        className="link-sweep mt-7 inline-block max-w-full font-display text-[clamp(1.2rem,4.5vw,2.5rem)] font-bold break-all text-primary"
      >
        {profile.links.email}
      </a>
      <div className="mt-9 flex flex-wrap items-center gap-4">
        <a
          href={`mailto:${profile.links.email}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-mono text-sm font-bold tracking-wide text-primary-foreground uppercase transition-opacity hover:opacity-90"
        >
          <Mail className="size-4" aria-hidden="true" />
          {tr(ui.contact.cta, locale)}
        </a>
        <SocialLinks />
      </div>
    </SectionShell>
  )
}
