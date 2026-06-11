import { experience, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"

export function Experience({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="experience" index="02" title={tr(ui.nav.experience, locale)}>
      <div className="space-y-10 border-l border-hairline pl-5 sm:pl-7">
        {experience.map((job) => (
          <article key={job.company} className="relative">
            <span
              className="absolute top-2 -left-[23px] size-2 bg-primary sm:-left-[31px]"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-lg font-bold text-foreground">{job.company}</h3>
              <span className="font-mono text-sm text-primary">{tr(job.role, locale)}</span>
            </div>
            <p className="mt-1">
              <Annotation>{tr(job.period, locale)}</Annotation>
            </p>
            <ul className="mt-3 space-y-2">
              {job.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="select-none font-mono text-primary/70" aria-hidden="true">
                    —
                  </span>
                  <span className="font-sans leading-relaxed text-muted-foreground">{tr(bullet, locale)}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionShell>
  )
}
