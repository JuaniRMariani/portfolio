import { aiEngineering, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Orchestration, ProcessList } from "./orchestration"

export function AiEngineering({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="how-i-work" index="05" title={tr(ui.nav.ai, locale)} kicker="// 05 — agent orchestration">
      <p className="max-w-3xl font-sans text-[clamp(1.2rem,2.4vw,1.65rem)] leading-snug text-foreground text-balance">
        {tr(aiEngineering.intro, locale)}
      </p>
      <Orchestration locale={locale} />
      <ProcessList locale={locale} />
    </SectionShell>
  )
}
