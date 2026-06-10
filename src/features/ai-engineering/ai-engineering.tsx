import { aiEngineering, tr, type Locale } from "@/content"
import { TerminalSection } from "@/components/terminal/terminal-section"

export function AiEngineering({ locale }: { locale: Locale }) {
  return (
    <TerminalSection id="ai-engineering" command="claude config list">
      <p className="max-w-2xl font-sans text-base leading-relaxed text-foreground">
        {tr(aiEngineering.intro, locale)}
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {aiEngineering.practices.map((practice) => (
          <div key={practice.title.en} className="rounded-lg border border-border bg-card/50 px-4 py-4">
            <h3 className="font-mono text-sm font-bold text-primary">{tr(practice.title, locale)}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              {tr(practice.detail, locale)}
            </p>
          </div>
        ))}
      </div>

      <div className="scanlines mt-7 rounded-lg border border-border bg-card/70 px-4 py-4 font-mono text-sm sm:px-5">
        <p className="text-term-dim">~/.claude/</p>
        <ul className="mt-1 space-y-1">
          {aiEngineering.tools.map((tool, i) => (
            <li key={tool.name} className="flex flex-wrap gap-x-2">
              <span className="select-none text-term-dim" aria-hidden="true">
                {i === aiEngineering.tools.length - 1 ? "└──" : "├──"}
              </span>
              <span className="font-bold text-foreground">{tool.name}</span>
              <span className="text-muted-foreground">— {tr(tool.detail, locale)}</span>
            </li>
          ))}
        </ul>
      </div>
    </TerminalSection>
  )
}
