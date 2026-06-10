import { ExternalLink, Newspaper } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { projects, tr, type Locale, type Project } from "@/content"
import { TerminalSection } from "@/components/terminal/terminal-section"
import { ToolCallCard } from "@/components/terminal/tool-call-card"

const STATUS_STYLES: Record<Project["status"], { dot: string; text: Record<Locale, string> }> = {
  production: { dot: "text-term-green", text: { en: "in production", es: "en producción" } },
  "public-repo": { dot: "text-term-yellow", text: { en: "public repo", es: "repo público" } },
  internal: { dot: "text-term-dim", text: { en: "self-hosted", es: "self-hosted" } },
}

export function Projects({ locale }: { locale: Locale }) {
  return (
    <TerminalSection id="projects" command="ls projects/ --sort=impact">
      <div className="space-y-4">
        {projects.map((project) => {
          const status = STATUS_STYLES[project.status]
          return (
            <ToolCallCard
              key={project.slug}
              tool={project.terminal.tool}
              arg={project.terminal.arg}
              defaultOpen={!!project.featured}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-mono text-lg font-bold text-foreground">{project.name}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{tr(project.role, locale)}</span>
                  <span className="font-mono text-xs">
                    <span className={status.dot} aria-hidden="true">
                      ●{" "}
                    </span>
                    <span className="text-muted-foreground">{status.text[locale]}</span>
                  </span>
                </div>

                <p className="max-w-2xl font-sans text-base leading-relaxed text-foreground">
                  {tr(project.summary, locale)}
                </p>

                <ul className="space-y-1.5">
                  {project.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-2.5 text-sm">
                      <span className="select-none font-mono text-term-dim" aria-hidden="true">
                        ⎿
                      </span>
                      <span className="font-sans leading-relaxed text-muted-foreground">{tr(highlight, locale)}</span>
                    </li>
                  ))}
                </ul>

                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {(project.links || project.press) && (
                  <div className="space-y-2 border-t border-border pt-3">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <GitHubIcon size={14} />
                        {project.links.github.replace("https://github.com/", "github.com/")}
                      </a>
                    )}
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        {locale === "en" ? "live" : "en vivo"}
                      </a>
                    )}
                    {project.press?.map((article) => (
                      <a
                        key={article.url}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Newspaper size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>
                          <span className="text-term-yellow">{article.outlet}</span> — {tr(article.title, locale)}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </ToolCallCard>
          )
        })}
      </div>
    </TerminalSection>
  )
}
