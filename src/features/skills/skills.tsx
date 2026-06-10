import { skills, tr, type Locale } from "@/content"
import { TerminalSection } from "@/components/terminal/terminal-section"

export function Skills({ locale }: { locale: Locale }) {
  return (
    <TerminalSection id="skills" command="claude skills list">
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.id}>
            <h3 className="font-mono text-sm font-bold text-foreground">
              <span className="select-none text-prompt" aria-hidden="true">
                ▸{" "}
              </span>
              {tr(group.title, locale)}
            </h3>
            {tr(group.note, locale) && (
              <p className="mt-1 font-mono text-xs text-term-dim"># {tr(group.note, locale)}</p>
            )}
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </TerminalSection>
  )
}
