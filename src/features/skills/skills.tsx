import { skills, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { SkillsBoard } from "./skills-board"

export function Skills({ locale }: { locale: Locale }) {
  const groups = skills.map((group) => ({
    id: group.id,
    title: tr(group.title, locale),
    note: tr(group.note, locale),
    items: group.items,
  }))

  return (
    <SectionShell id="skills" index="06" title={tr(ui.nav.skills, locale)}>
      <SkillsBoard
        groups={groups}
        locale={locale}
        playLabel={tr(ui.play.playGame, locale)}
        exitLabel={tr(ui.play.exitGame, locale)}
      />
    </SectionShell>
  )
}
