import { Mail } from "lucide-react"
import { profile, ui, tr, type Locale } from "@/content"
import { TerminalSection } from "@/components/terminal/terminal-section"
import { SocialLinks } from "@/components/social-links"
import { Cursor } from "@/components/terminal/cursor"

export function Contact({ locale }: { locale: Locale }) {
  return (
    <TerminalSection id="contact" command="claude /contact">
      <div className="scanlines rounded-lg border border-border bg-card/70 px-5 py-8 text-center sm:px-8 sm:py-10">
        <h3 className="glow font-display text-2xl text-foreground sm:text-4xl">
          {tr(ui.contact.heading, locale)}
        </h3>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
          {tr(ui.contact.body, locale)}
        </p>
        <div className="mt-7 flex flex-col items-center gap-4">
          <a
            href={`mailto:${profile.links.email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded bg-primary px-5 py-2.5 font-mono text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="size-4" aria-hidden="true" />
            {tr(ui.contact.cta, locale)}
          </a>
          <SocialLinks />
        </div>
        <p className="mt-8 font-mono text-xs text-term-dim">
          {profile.links.email}
          <Cursor className="ml-1.5 h-[1em] w-[0.45em]" />
        </p>
      </div>
    </TerminalSection>
  )
}
