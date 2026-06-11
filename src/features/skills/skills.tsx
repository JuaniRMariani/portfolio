import { skills, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"

export function Skills({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="skills" index="05" title={tr(ui.nav.skills, locale)}>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {skills.map((group, i) => (
          <div key={group.id}>
            <h3 className="flex items-baseline gap-3 font-display text-base font-bold text-foreground">
              <span className="font-mono text-xs font-bold text-primary" aria-hidden="true">
                5.{i + 1}
              </span>
              {tr(group.title, locale)}
            </h3>
            {tr(group.note, locale) && (
              <p className="mt-1">
                <Annotation>{tr(group.note, locale)}</Annotation>
              </p>
            )}
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-sm border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
