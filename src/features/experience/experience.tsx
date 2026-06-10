import { experience, tr, type Locale } from "@/content"
import { TerminalSection } from "@/components/terminal/terminal-section"

export function Experience({ locale }: { locale: Locale }) {
  return (
    <TerminalSection id="experience" command="git log --work --oneline">
      <div className="space-y-9 border-l border-border pl-5 sm:pl-6">
        {experience.map((job) => (
          <article key={job.company} className="relative">
            <span
              className="absolute top-1.5 -left-[26px] size-2.5 rounded-full border border-primary bg-background sm:-left-[30px]"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-sm">
              <span className="text-term-yellow">{job.hash}</span>
              <h3 className="text-base font-bold text-foreground">{job.company}</h3>
              <span className="text-primary">{tr(job.role, locale)}</span>
            </div>
            <p className="mt-1 font-mono text-xs text-term-dim">{tr(job.period, locale)}</p>
            <ul className="mt-3 space-y-2">
              {job.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="select-none font-mono text-term-green" aria-hidden="true">
                    +
                  </span>
                  <span className="font-sans leading-relaxed text-muted-foreground">{tr(bullet, locale)}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </TerminalSection>
  )
}
