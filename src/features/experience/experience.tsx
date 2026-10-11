import { ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { GitGraph } from "./git-graph"

export function Experience({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="experience" index="03" title={tr(ui.nav.experience, locale)} kicker="// 03 — git log --graph">
      <GitGraph locale={locale} />
    </SectionShell>
  )
}
