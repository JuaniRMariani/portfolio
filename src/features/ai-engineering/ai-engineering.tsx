import { aiEngineering, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"

export function AiEngineering({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="how-i-work" index="04" title={tr(ui.nav.ai, locale)}>
      <p className="max-w-2xl font-sans text-lg leading-relaxed text-foreground">
        {tr(aiEngineering.intro, locale)}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {aiEngineering.practices.map((practice, i) => (
          <div
            key={practice.title.en}
            className="rounded-sm border border-border bg-card/40 p-5 transition-colors hover:border-primary/60"
          >
            <Annotation className="text-primary">4.{i + 1}</Annotation>
            <h3 className="mt-2 font-display text-base font-bold text-foreground">{tr(practice.title, locale)}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              {tr(practice.detail, locale)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
        {aiEngineering.tools.map((tool) => (
          <div key={tool.name} className="bg-card/80 p-5">
            <h3 className="font-mono text-sm font-bold text-primary">{tool.name}</h3>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">{tr(tool.detail, locale)}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
